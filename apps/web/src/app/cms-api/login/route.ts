import { NextResponse } from 'next/server';
import { authenticate, cookieOptions, hitLoginLimit, signSession } from '@/lib/cms/auth';
import { assertOrigin, fail } from '@/lib/cms/http';
import { CmsError } from '@/lib/cms/errors';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    assertOrigin(req);
    const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
    if (hitLoginLimit(ip)) throw new CmsError('Too many attempts. Wait a few minutes and try again.', 429);
    const body = (await req.json().catch(() => ({}))) as { username?: string; password?: string };
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
    const session = authenticate(String(body.username || ''), String(body.password || ''), host);
    if (!session) {
      const hosted = Boolean(process.env.VERCEL) || (!host.includes('localhost') && !host.includes('127.0.0.1') && !host.includes('.e2b.app'));
      throw new CmsError(
        hosted && !process.env.CMS_ADMIN_PASSWORD
          ? 'Set CMS_ADMIN_PASSWORD (and CMS_STAFF_PASSWORD) on the server before signing in.'
          : 'Incorrect username or password.',
        401,
      );
    }
    const res = NextResponse.json({ ok: true, user: session.user, role: session.role });
    res.cookies.set('qiscet_cms', signSession(session), cookieOptions(req));
    return res;
  } catch (e) {
    return fail(e);
  }
}
