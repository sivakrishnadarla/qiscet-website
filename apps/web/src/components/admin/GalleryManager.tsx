'use client';

import { useState } from 'react';
import { Loader2, Trash2, Upload } from 'lucide-react';
import type { CmsAlbum } from '@/lib/cms/types';

export default function GalleryManager({ initial }: { initial: CmsAlbum[] }) {
  const [albums, setAlbums] = useState(initial);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  async function createAlbum(e: React.FormEvent) {
    e.preventDefault();
    setBusy('create');
    setError('');
    const res = await fetch('/cms-api/albums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    const data = await res.json();
    setBusy('');
    if (!res.ok) {
      setError(data.error || 'Could not create album.');
      return;
    }
    setAlbums((a) => [data.album, ...a]);
    setTitle('');
    setDescription('');
  }

  async function saveAlbum(album: CmsAlbum) {
    setBusy(album.id);
    const res = await fetch(`/cms-api/albums/${album.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(album),
    });
    const data = await res.json();
    setBusy('');
    if (!res.ok) {
      setError(data.error || 'Could not save album.');
      return;
    }
    setAlbums((all) => all.map((a) => (a.id === album.id ? data.album : a)));
  }

  async function removeAlbum(id: string) {
    if (!window.confirm('Delete this album? Photographs already used on pages stay where they are.')) return;
    const res = await fetch(`/cms-api/albums/${id}`, { method: 'DELETE' });
    if (res.ok) setAlbums((all) => all.filter((a) => a.id !== id));
  }

  async function upload(albumId: string, file: File, alt: string, caption: string) {
    const fd = new FormData();
    fd.set('file', file);
    fd.set('alt', alt);
    fd.set('caption', caption);
    fd.set('albumId', albumId);
    const res = await fetch('/cms-api/media', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    const media = data.media as { id: string; src: string; alt: string };
    setAlbums((all) => all.map((a) => a.id === albumId ? { ...a, images: [...a.images, { id: media.id, src: media.src, alt: media.alt, caption }] } : a));
  }

  async function removeImage(album: CmsAlbum, imageId: string) {
    const res = await fetch(`/cms-api/media/${imageId}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Could not delete photo.');
      return;
    }
    setAlbums((all) => all.map((a) => a.id === album.id ? { ...a, images: a.images.filter((img) => img.id !== imageId) } : a));
  }

  return (
    <div className="space-y-6">
      <form onSubmit={createAlbum} className="card grid gap-3 p-5 md:grid-cols-[1fr_1.4fr_auto]">
        <label>
          <span className="label">New album</span>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="QIS FEST 2026" required />
        </label>
        <label>
          <span className="label">What these photos show</span>
          <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Cultural night and technical events at QISCET, Ongole, February 2026." />
        </label>
        <button className="btn-primary self-end" disabled={busy === 'create'}>{busy === 'create' ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Create</button>
      </form>
      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <p className="text-sm text-ink-soft">Every photograph needs alt text before it is uploaded. That caption is what search and answer engines use when they cannot see the image. JPEG, PNG, WebP or GIF, under 3.5 MB.</p>
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} busy={busy === album.id} onSave={saveAlbum} onDelete={() => removeAlbum(album.id)} onUpload={upload} onRemoveImage={removeImage} />
      ))}
      {!albums.length ? <p className="text-sm text-ink-muted">No staff albums yet. Campus photographs already on the public gallery stay as they are.</p> : null}
    </div>
  );
}

function AlbumCard({
  album,
  busy,
  onSave,
  onDelete,
  onUpload,
  onRemoveImage,
}: {
  album: CmsAlbum;
  busy: boolean;
  onSave: (a: CmsAlbum) => void;
  onDelete: () => void;
  onUpload: (albumId: string, file: File, alt: string, caption: string) => Promise<void>;
  onRemoveImage: (album: CmsAlbum, imageId: string) => void;
}) {
  const [title, setTitle] = useState(album.title);
  const [description, setDescription] = useState(album.description);
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  const [queue, setQueue] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!alt.trim()) {
      setErr('Write alt text before uploading.');
      return;
    }
    if (!queue.length) {
      setErr('Choose one or more photographs.');
      return;
    }
    setUploading(true);
    setErr('');
    try {
      for (const file of queue) {
        const specific = queue.length === 1 ? alt.trim() : `${alt.trim()} — ${file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')}`;
        await onUpload(album.id, file, specific, caption);
      }
      setQueue([]);
      setCaption('');
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <input className="input font-display font-extrabold" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="input min-h-[64px]" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-outline !py-2 text-xs" disabled={busy} onClick={() => onSave({ ...album, title, description })}>Save text</button>
          <button type="button" className="text-xs font-semibold text-red-700" onClick={onDelete}>Delete album</button>
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {album.images.map((img) => (
          <li key={img.id} className="overflow-hidden rounded-xl border border-navy-100">
            <img src={img.src} alt={img.alt} className="aspect-[4/3] w-full object-cover" />
            <div className="space-y-1 p-2">
              <p className="line-clamp-2 text-[11px] leading-4 text-ink-soft">{img.alt}</p>
              <button type="button" className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700" onClick={() => onRemoveImage(album, img.id)}>
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={send} className="mt-4 grid gap-2 rounded-2xl bg-navy-50 p-3 md:grid-cols-[1fr_1fr_auto]">
        <input className="input !py-2" placeholder="Alt text for these photos (required)" value={alt} onChange={(e) => setAlt(e.target.value)} />
        <input className="input !py-2" placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <div className="flex gap-2">
          <label className="btn-outline !py-2 text-xs">
            Choose
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="sr-only" onChange={(e) => setQueue([...(e.target.files || [])])} />
          </label>
          <button className="btn-primary !py-2 text-xs" disabled={uploading}>
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Upload {queue.length ? `(${queue.length})` : ''}
          </button>
        </div>
      </form>
      {err ? <p className="mt-2 text-xs text-red-700">{err}</p> : null}
    </section>
  );
}
