import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { COOKIE, readSession } from '@/lib/cms/auth';

export const dynamic = 'force-dynamic';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = readSession(cookies().get(COOKIE)?.value);
  if (!session) redirect('/admin/login');
  return (
    <AdminShell user={session.user} role={session.role}>
      {children}
    </AdminShell>
  );
}
