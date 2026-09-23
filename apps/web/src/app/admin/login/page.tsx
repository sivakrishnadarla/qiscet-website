import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/admin/LoginForm';
import { COOKIE, defaultsAllowed, readSession } from '@/lib/cms/auth';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  if (readSession(cookies().get(COOKIE)?.value)) redirect('/admin');
  const host = headers().get('host') || '';
  return <LoginForm showDefaults={defaultsAllowed(host)} />;
}
