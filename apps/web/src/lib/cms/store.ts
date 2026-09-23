import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { MongoClient, type Db } from 'mongodb';
import { CmsError } from './errors';
import type { CmsAlbum, CmsDocument, MediaRecord } from './types';

const CMS_DIR = () => path.join(process.cwd(), 'content', 'cms');
const DOCS_DIR = () => path.join(CMS_DIR(), 'documents');
const ALBUMS_FILE = () => path.join(CMS_DIR(), 'albums.json');
const MEDIA_FILE = () => path.join(CMS_DIR(), 'media.json');
const UPLOAD_DIR = () => path.join(process.cwd(), 'public', 'uploads', 'gallery');

export type StorageMode = {
  driver: 'file' | 'mongo';
  writable: boolean;
  detail: string;
};

export function storageMode(): StorageMode {
  const uri = Boolean(process.env.MONGODB_URI);
  const pref = (process.env.CMS_STORE || 'auto').toLowerCase();
  const onVercel = Boolean(process.env.VERCEL);
  const wantMongo = pref === 'mongo' || (pref !== 'file' && onVercel && uri);
  if (wantMongo) {
    if (!uri) {
      return {
        driver: 'mongo',
        writable: false,
        detail: 'CMS_STORE=mongo but MONGODB_URI is missing. Add a MongoDB Atlas connection string to save edits.',
      };
    }
    return {
      driver: 'mongo',
      writable: true,
      detail: 'Live edits are saved to MongoDB and appear on the site immediately. No rebuild required.',
    };
  }
  if (onVercel) {
    return {
      driver: 'file',
      writable: false,
      detail: 'This Vercel copy can show content committed to Git, but it cannot save new edits. Add MONGODB_URI on the website project so staff can publish live.',
    };
  }
  return {
    driver: 'file',
    writable: true,
    detail: 'Edits are saved into content/cms and public/uploads. Commit those folders and push to Git so the next deploy includes them. For live editing on Vercel, set MONGODB_URI.',
  };
}

function mongoEnabled() {
  return storageMode().driver === 'mongo' && Boolean(process.env.MONGODB_URI);
}

function assertWritable() {
  const mode = storageMode();
  if (!mode.writable) throw new CmsError(mode.detail, 503);
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

let fileCache: CmsDocument[] | null = null;

function readJsonFile<T>(file: string, fallback: T): T {
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
  } catch {
    return fallback;
  }
}

function writeJsonFile(file: string, data: unknown) {
  ensureDir(path.dirname(file));
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n');
  fs.renameSync(tmp, file);
}

function fileDocs(): CmsDocument[] {
  if (fileCache) return fileCache;
  const dir = DOCS_DIR();
  if (!fs.existsSync(dir)) return [];
  const docs = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as CmsDocument;
      } catch {
        return null;
      }
    })
    .filter((d): d is CmsDocument => Boolean(d && d.id && d.slug));
  fileCache = docs;
  return docs;
}

function bustFileCache() {
  fileCache = null;
}

const g = globalThis as unknown as { __qiscetMongo?: Promise<MongoClient>; __qiscetSeeded?: boolean };

async function mongoDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new CmsError('MONGODB_URI is not set.', 503);
  if (!g.__qiscetMongo) {
    const client = new MongoClient(uri, { maxPoolSize: 5 });
    g.__qiscetMongo = client.connect();
  }
  const client = await g.__qiscetMongo;
  return client.db(process.env.MONGODB_DB || 'qiscet');
}

function publicDoc(doc: CmsDocument & { _id?: unknown }): CmsDocument {
  const copy = { ...doc };
  delete (copy as { _id?: unknown })._id;
  return copy;
}

async function seedMongo(db: Db) {
  if (g.__qiscetSeeded) return;
  g.__qiscetSeeded = true;
  const docs = db.collection('cms_documents');
  const count = await docs.countDocuments();
  if (count === 0) {
    const local = fileDocs();
    if (local.length) {
      await docs.insertMany(local as unknown as Record<string, unknown>[], { ordered: false }).catch(() => undefined);
    }
  }
  const albums = db.collection('cms_albums');
  if ((await albums.countDocuments()) === 0) {
    const local = readJsonFile<CmsAlbum[]>(ALBUMS_FILE(), []);
    if (local.length) await albums.insertMany(local as unknown as Record<string, unknown>[], { ordered: false }).catch(() => undefined);
  }
  await docs.createIndex({ slug: 1 }, { unique: true }).catch(() => undefined);
  await docs.createIndex({ id: 1 }, { unique: true }).catch(() => undefined);
}

async function docsCol() {
  const db = await mongoDb();
  await seedMongo(db);
  return db.collection<CmsDocument>('cms_documents');
}

export async function listDocuments(): Promise<CmsDocument[]> {
  if (!mongoEnabled()) return [...fileDocs()].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  const col = await docsCol();
  const rows = await col.find({}, { projection: { _id: 0 } }).sort({ updatedAt: -1 }).limit(2000).toArray();
  return rows.map((r) => publicDoc(r));
}

export async function getDocument(id: string): Promise<CmsDocument | null> {
  if (!/^cms_[a-z0-9_]+$/.test(id)) return null;
  if (!mongoEnabled()) return fileDocs().find((d) => d.id === id) || null;
  const col = await docsCol();
  const row = await col.findOne({ id });
  return row ? publicDoc(row) : null;
}

export async function getBySlug(slug: string): Promise<CmsDocument | null> {
  const clean = slug.replace(/^\/+|\/+$/g, '');
  if (!clean) return null;
  if (!mongoEnabled()) return fileDocs().find((d) => d.slug === clean) || null;
  const col = await docsCol();
  const row = await col.findOne({ slug: clean });
  return row ? publicDoc(row) : null;
}

export async function findRedirect(slug: string): Promise<string | null> {
  const clean = slug.replace(/^\/+|\/+$/g, '');
  if (!mongoEnabled()) {
    const hit = fileDocs().find((d) => d.status === 'published' && d.previousSlugs?.includes(clean));
    return hit ? hit.slug : null;
  }
  const col = await docsCol();
  const row = await col.findOne({ status: 'published', previousSlugs: clean });
  return row?.slug || null;
}

export async function saveDocument(doc: CmsDocument): Promise<CmsDocument> {
  assertWritable();
  if (!/^cms_[a-z0-9_]+$/.test(doc.id)) throw new CmsError('Invalid document id.');
  const clash = await getBySlug(doc.slug);
  if (clash && clash.id !== doc.id) throw new CmsError(`Another page already uses /${doc.slug}.`);
  if (!mongoEnabled()) {
    ensureDir(DOCS_DIR());
    writeJsonFile(path.join(DOCS_DIR(), `${doc.id}.json`), doc);
    bustFileCache();
    return doc;
  }
  const col = await docsCol();
  await col.replaceOne({ id: doc.id }, doc, { upsert: true });
  return doc;
}

export async function deleteDocument(id: string) {
  assertWritable();
  if (!/^cms_[a-z0-9_]+$/.test(id)) throw new CmsError('Invalid document id.');
  if (!mongoEnabled()) {
    const file = path.join(DOCS_DIR(), `${id}.json`);
    if (fs.existsSync(file)) fs.unlinkSync(file);
    bustFileCache();
    return;
  }
  const col = await docsCol();
  await col.deleteOne({ id });
}

export async function listAlbums(): Promise<CmsAlbum[]> {
  if (!mongoEnabled()) return readJsonFile<CmsAlbum[]>(ALBUMS_FILE(), []);
  const db = await mongoDb();
  await seedMongo(db);
  const rows = await db.collection<CmsAlbum>('cms_albums').find({}, { projection: { _id: 0 } }).sort({ updatedAt: -1 }).toArray();
  return rows;
}

async function writeAlbums(albums: CmsAlbum[]) {
  if (!mongoEnabled()) {
    writeJsonFile(ALBUMS_FILE(), albums);
    return;
  }
  const db = await mongoDb();
  const col = db.collection('cms_albums');
  await col.deleteMany({});
  if (albums.length) await col.insertMany(albums);
}

export async function saveAlbum(album: CmsAlbum) {
  assertWritable();
  const albums = await listAlbums();
  const i = albums.findIndex((a) => a.id === album.id);
  if (i >= 0) albums[i] = album;
  else albums.unshift(album);
  await writeAlbums(albums);
  return album;
}

export async function deleteAlbum(id: string) {
  assertWritable();
  const albums = (await listAlbums()).filter((a) => a.id !== id);
  await writeAlbums(albums);
}

function readMediaIndex(): MediaRecord[] {
  return readJsonFile<MediaRecord[]>(MEDIA_FILE(), []);
}

export async function listMedia(limit = 60): Promise<MediaRecord[]> {
  if (!mongoEnabled()) return readMediaIndex().slice(0, limit);
  const db = await mongoDb();
  const rows = await db
    .collection('cms_media')
    .find({}, { projection: { data: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return rows.map((r) => ({
    id: String(r.id),
    filename: String(r.filename || ''),
    mime: String(r.mime || 'image/jpeg'),
    alt: String(r.alt || ''),
    src: `/media/${r.id}`,
    bytes: Number(r.bytes || 0),
    createdAt: String(r.createdAt || ''),
    createdBy: String(r.createdBy || ''),
  }));
}

function extFor(mime: string) {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/gif') return 'gif';
  return 'jpg';
}

export function sniffImage(buf: Buffer): string | null {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png';
  if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (buf.length > 6 && (buf.toString('ascii', 0, 6) === 'GIF87a' || buf.toString('ascii', 0, 6) === 'GIF89a')) return 'image/gif';
  return null;
}

export async function addMedia(input: { id: string; filename: string; mime: string; alt: string; buffer: Buffer; createdBy: string }): Promise<MediaRecord> {
  assertWritable();
  const mime = sniffImage(input.buffer);
  if (!mime) throw new CmsError('Upload a JPEG, PNG, WebP or GIF photograph.');
  if (input.buffer.length > 3_500_000) throw new CmsError('Image must be under 3.5 MB. Export a smaller JPEG and try again.');
  if (!input.alt.trim()) throw new CmsError('Alt text is required — describe what the photograph shows.');
  const now = new Date().toISOString();
  if (!mongoEnabled()) {
    ensureDir(UPLOAD_DIR());
    const filename = `${input.id}.${extFor(mime)}`;
    fs.writeFileSync(path.join(UPLOAD_DIR(), filename), input.buffer);
    const rec: MediaRecord = {
      id: input.id,
      filename: input.filename.slice(0, 120),
      mime,
      alt: input.alt.trim().slice(0, 240),
      src: `/media/${input.id}`,
      file: `/uploads/gallery/${filename}`,
      bytes: input.buffer.length,
      createdAt: now,
      createdBy: input.createdBy,
    };
    const all = readMediaIndex();
    all.unshift(rec);
    writeJsonFile(MEDIA_FILE(), all.slice(0, 500));
    return rec;
  }
  const db = await mongoDb();
  const rec: MediaRecord = {
    id: input.id,
    filename: input.filename.slice(0, 120),
    mime,
    alt: input.alt.trim().slice(0, 240),
    src: `/media/${input.id}`,
    bytes: input.buffer.length,
    createdAt: now,
    createdBy: input.createdBy,
  };
  await db.collection('cms_media').insertOne({ ...rec, data: input.buffer });
  return rec;
}

export async function readMedia(id: string): Promise<{ mime: string; buffer: Buffer } | null> {
  if (!/^cms_[a-z0-9_]+$/.test(id) && !/^med_[a-z0-9]+$/.test(id)) return null;
  if (mongoEnabled()) {
    const db = await mongoDb();
    const row = await db.collection('cms_media').findOne({ id });
    if (!row?.data) return null;
    const data = row.data as Buffer | { buffer?: Uint8Array };
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data.buffer || []);
    return { mime: String(row.mime || 'image/jpeg'), buffer };
  }
  const rec = readMediaIndex().find((m) => m.id === id);
  const rel = rec?.file || '';
  const guessed = ['jpg', 'png', 'webp', 'gif'].map((ext) => path.join(UPLOAD_DIR(), `${id}.${ext}`)).find((candidate) => fs.existsSync(candidate));
  const file = rel ? path.join(process.cwd(), 'public', rel.replace(/^\//, '')) : guessed || '';
  if (!file || !file.startsWith(path.join(process.cwd(), 'public')) || !fs.existsSync(file)) return null;
  return { mime: rec?.mime || 'image/jpeg', buffer: fs.readFileSync(file) };
}

export async function deleteMedia(id: string) {
  assertWritable();
  if (!mongoEnabled()) {
    const all = readMediaIndex();
    const rec = all.find((m) => m.id === id);
    const rel = rec?.file || '';
    const file = rel ? path.join(process.cwd(), 'public', rel.replace(/^\//, '')) : '';
    if (file.startsWith(path.join(process.cwd(), 'public', 'uploads')) && fs.existsSync(file)) fs.unlinkSync(file);
    writeJsonFile(MEDIA_FILE(), all.filter((m) => m.id !== id));
    const albums = (await listAlbums()).map((a) => ({ ...a, images: a.images.filter((img) => img.id !== id) }));
    await writeAlbums(albums);
    return;
  }
  const db = await mongoDb();
  await db.collection('cms_media').deleteOne({ id });
  const albums = (await listAlbums()).map((a) => ({ ...a, images: a.images.filter((img) => img.id !== id) }));
  await writeAlbums(albums);
}

export function readSections(): { id: string; title: string }[] {
  const file = path.join(process.cwd(), 'content', 'sections.json');
  const raw = readJsonFile<Record<string, string>>(file, {});
  return Object.entries(raw).map(([id, title]) => ({ id, title }));
}

export function sectionMap() {
  return Object.fromEntries(readSections().map((s) => [s.id, s.title]));
}
