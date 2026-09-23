import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { CmsRole } from './types';

export const COOKIE = 'qiscet_cms';
const MAX_AGE = 60 * 60 * 12;

export type Session = { user: string; role: CmsRole };

function secret() {
  return process.env.CMS_SECRET || process.env.ADMIN_TOKEN || 'qiscet-local-cms-secret-change-me';
}

function safeEqual(a: string, b: string) {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** Known defaults only on localhost / this sandbox — never on a public host. */
export function defaultsAllowed(host = '') {
  if (process.env.CMS_ADMIN_PASSWORD || process.env.CMS_STAFF_PASSWORD) return false;
  if (process.env.VERCEL) return false;
  const h = host.toLowerCase().split(':')[0];
  return h === 'localhost' || h === '127.0.0.1' || h.endsWith('.e2b.app') || h === '';
}

export function credentials(host = '') {
  const allow = defaultsAllowed(host);
  const adminPass = process.env.CMS_ADMIN_PASSWORD || (allow ? 'qiscet-admin' : '');
  const staffPass = process.env.CMS_STAFF_PASSWORD || (allow ? 'qiscet-staff' : '');
  const users: { username: string; password: string; role: CmsRole }[] = [];
  if (adminPass) users.push({ username: process.env.CMS_ADMIN_USER || 'admin', password: adminPass, role: 'admin' });
  if (staffPass) users.push({ username: process.env.CMS_STAFF_USER || 'staff', password: staffPass, role: 'staff' });
  return users;
}

export function authenticate(username: string, password: string, host = ''): Session | null {
  const name = username.trim();
  const pass = password;
  if (!name || !pass || pass.length > 200) return null;
  const found = credentials(host).find((u) => u.username === name && safeEqual(u.password, pass));
  if (!found) return null;
  return { user: found.username, role: found.role };
}

export function signSession(session: Session) {
  const body = Buffer.from(JSON.stringify({ u: session.user, r: session.role, exp: Date.now() + MAX_AGE * 1000 })).toString('base64url');
  const sig = createHmac('sha256', secret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function readSession(token?: string | null): Session | null {
  if (!token || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = createHmac('sha256', secret()).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as { u?: string; r?: string; exp?: number };
    if (!data.exp || data.exp < Date.now()) return null;
    if (data.r !== 'admin' && data.r !== 'staff') return null;
    if (!data.u) return null;
    return { user: data.u, role: data.r };
  } catch {
    return null;
  }
}

export function cookieOptions(req: Request) {
  const proto = (req.headers.get('x-forwarded-proto') || '').split(',')[0].trim();
  const secure = proto === 'https' || Boolean(process.env.VERCEL);
  return { httpOnly: true, sameSite: 'lax' as const, secure, path: '/', maxAge: MAX_AGE };
}

const attempts = new Map<string, { n: number; t: number }>();

export function hitLoginLimit(ip: string) {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.t > 15 * 60 * 1000) {
    attempts.set(ip, { n: 1, t: now });
    return false;
  }
  rec.n += 1;
  return rec.n > 25;
}
