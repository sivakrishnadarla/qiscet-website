import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import nodemailer from 'nodemailer';
import { MongoClient } from 'mongodb';

export type Submission = Record<string, unknown>;

const MOBILE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

@Injectable()
export class LeadsService {
  private readonly logger = new Logger('Leads');
  private readonly memory: Submission[] = [];
  private mongo: MongoClient | null = null;

  configuredSinks() {
    return {
      email: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
      mongodb: Boolean(process.env.MONGODB_URI),
      sheets: Boolean(process.env.SHEETS_WEBHOOK_URL),
      file: process.env.VERCEL ? false : true,
    };
  }

  async accept(kind: string, raw: Submission, required: string[]) {
    const body = this.clean(raw);
    // Honeypot — pretend success so bots learn nothing.
    if (typeof body.website === 'string' && body.website.trim()) {
      return { ok: true, id: 'received' };
    }
    for (const key of required) {
      const v = body[key];
      if (v === undefined || v === null || String(v).trim() === '') {
        throw new BadRequestException(`“${key}” is required.`);
      }
    }
    this.checkContact(kind, body);
    const id = `${kind.slice(0, 3)}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const record: Submission = { id, kind, receivedAt: new Date().toISOString(), ...body };
    delete record.website;

    const delivered = await this.dispatch(record);
    this.memory.unshift(record);
    this.memory.splice(200);
    this.logger.log(`${kind} ${id} via ${delivered.join('+') || 'log'}`);
    return { ok: true, id, message: 'Received. Our team will get back to you.', delivered };
  }

  recent() {
    return this.memory.slice(0, 100);
  }

  private checkContact(kind: string, body: Submission) {
    const mobile = String(body.mobile || body.mobileNumber || '').replace(/\D/g, '').slice(-10);
    if ((kind === 'enquiry' || kind === 'application') && !MOBILE.test(mobile)) {
      throw new BadRequestException('Please enter a valid 10-digit Indian mobile number.');
    }
    if (body.email && !EMAIL.test(String(body.email))) throw new BadRequestException('Please enter a valid email address.');
    if (kind === 'newsletter' && !EMAIL.test(String(body.email))) throw new BadRequestException('Please enter a valid email address.');
    if (kind === 'contact' && !EMAIL.test(String(body.email))) throw new BadRequestException('Please enter a valid email address.');
    if (kind === 'grievance' && !body.anonymous) {
      const hasChannel = EMAIL.test(String(body.email || '')) || MOBILE.test(String(body.mobile || '').replace(/\D/g, '').slice(-10));
      if (!hasChannel) throw new BadRequestException('Add an email or mobile so we can update you, or submit anonymously.');
    }
  }

  private clean(raw: Submission): Submission {
    const out: Submission = {};
    for (const [k, v] of Object.entries(raw || {})) {
      if (k.length > 40) continue;
      if (typeof v === 'string') out[k] = v.trim().slice(0, 4000);
      else if (typeof v === 'number' || typeof v === 'boolean') out[k] = v;
      else if (v && typeof v === 'object') out[k] = JSON.parse(JSON.stringify(v).slice(0, 8000));
    }
    return out;
  }

  private async dispatch(record: Submission): Promise<string[]> {
    const delivered: string[] = [];
    const jobs: Promise<string | null>[] = [this.toEmail(record), this.toMongo(record), this.toSheets(record), this.toFile(record)];
    const results = await Promise.allSettled(jobs);
    results.forEach((r) => {
      if (r.status === 'fulfilled' && r.value) delivered.push(r.value);
      if (r.status === 'rejected') this.logger.error(String(r.reason));
    });
    if (!delivered.length) this.logger.warn(`No sink configured — logged only: ${record.id}`);
    return delivered;
  }

  private async toEmail(record: Submission): Promise<string | null> {
    const host = process.env.SMTP_HOST;
    if (!host || !process.env.SMTP_USER) return null;
    const to = this.inboxFor(String(record.kind));
    const transport = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const lines = Object.entries(record)
      .filter(([k]) => k !== 'userAgent')
      .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
      .join('\n');
    await transport.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      replyTo: typeof record.email === 'string' ? record.email : undefined,
      subject: `[QISCET ${record.kind}] ${record.studentName || record.name || record.candidateName || record.email || record.id}`,
      text: lines,
    });
    return 'email';
  }

  private inboxFor(kind: string) {
    const map: Record<string, string | undefined> = {
      enquiry: process.env.MAIL_TO_ADMISSIONS,
      application: process.env.MAIL_TO_ADMISSIONS,
      newsletter: process.env.MAIL_TO_ADMISSIONS,
      contact: process.env.MAIL_TO_CONTACT,
      grievance: process.env.MAIL_TO_GRIEVANCE,
      feedback: process.env.MAIL_TO_FEEDBACK,
    };
    return map[kind] || process.env.MAIL_TO || 'principal@qiscet.edu.in';
  }

  private async toMongo(record: Submission): Promise<string | null> {
    const uri = process.env.MONGODB_URI;
    if (!uri) return null;
    if (!this.mongo) {
      this.mongo = new MongoClient(uri);
      await this.mongo.connect();
    }
    await this.mongo.db(process.env.MONGODB_DB || 'qiscet').collection('submissions').insertOne({ ...record });
    return 'mongodb';
  }

  private async toSheets(record: Submission): Promise<string | null> {
    const url = process.env.SHEETS_WEBHOOK_URL;
    if (!url) return null;
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(record) });
    if (!res.ok) throw new Error(`Sheets webhook ${res.status}`);
    return 'sheets';
  }

  /** Dev / single-server fallback. Skipped on Vercel (read-only FS). */
  private async toFile(record: Submission): Promise<string | null> {
    if (process.env.VERCEL) return null;
    try {
      const dir = join(process.cwd(), 'data');
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      appendFileSync(join(dir, 'submissions.jsonl'), JSON.stringify(record) + '\n');
      return 'file';
    } catch (err) {
      this.logger.warn('Could not write submissions.jsonl: ' + String(err));
      return null;
    }
  }

  /** Used by nothing at runtime; keeps a cold-start file readable for local debugging. */
  readFileTail() {
    const file = join(process.cwd(), 'data', 'submissions.jsonl');
    if (!existsSync(file)) return [];
    return readFileSync(file, 'utf8').trim().split('\n').slice(-50).map((l) => JSON.parse(l));
  }
}
