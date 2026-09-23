import 'server-only';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { COOKIE, readSession, type Session } from './auth';
import { CmsError } from './errors';

export function requireUser(): Session {
  const session = readSession(cookies().get(COOKIE)?.value);
  if (!session) throw new CmsError('Please sign in again.', 401);
  return session;
}

export function assertOrigin(req: Request) {
  const origin = req.headers.get('origin');
  if (!origin) return;
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  let originHost = '';
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new CmsError('Request blocked.', 403);
  }
  if (host && originHost !== host) throw new CmsError('Request blocked.', 403);
}

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(e: unknown) {
  if (e instanceof CmsError) return NextResponse.json({ error: e.message }, { status: e.status });
  console.error(e);
  return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
}

export function revalidateContent(slug?: string) {
  try {
    if (slug) revalidatePath('/' + slug.replace(/^\/+/, ''));
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/news');
    revalidatePath('/gallery');
    revalidatePath('/search');
    revalidatePath('/sitemap.xml');
    revalidatePath('/llms.txt');
  } catch {
    /* static export / edge — ignore */
  }
}
