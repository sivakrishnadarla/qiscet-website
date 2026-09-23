import { NextResponse, type NextRequest } from 'next/server';

/**
 * Gate the staff desk before any page data is rendered.
 * Signature must match lib/cms/auth.ts (HMAC-SHA256, base64url).
 * Set CMS_SECRET before building/deploying; change it only with a rebuild.
 */
function secret() {
  return process.env.CMS_SECRET || process.env.ADMIN_TOKEN || 'qiscet-local-cms-secret-change-me';
}

function b64url(bytes: Uint8Array) {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sessionOk(token?: string) {
  if (!token || !token.includes('.')) return false;
  const [body, sig] = token.split('.');
  if (!body || !sig) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body)));
  if (b64url(mac) !== sig) return false;
  try {
    const pad = body.replace(/-/g, '+').replace(/_/g, '/');
    const data = JSON.parse(atob(pad)) as { exp?: number; r?: string };
    return Boolean(data.exp && data.exp > Date.now() && (data.r === 'admin' || data.r === 'staff'));
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const open = pathname === '/admin/login' || pathname === '/cms-api/login' || pathname === '/cms-api/logout';
  if (open) return NextResponse.next();
  if (!(await sessionOk(req.cookies.get('qiscet_cms')?.value))) {
    if (pathname.startsWith('/cms-api')) {
      return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/cms-api/:path*'],
};
