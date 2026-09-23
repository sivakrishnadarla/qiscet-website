'use client';

import { usePathname } from 'next/navigation';

/** Public chrome is hidden on the staff CMS so editors get a full workspace. */
export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const path = usePathname() || '';
  if (path.startsWith('/admin')) return null;
  return <>{children}</>;
}
