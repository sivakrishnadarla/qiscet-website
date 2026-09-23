'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FileText, ImageIcon, LayoutDashboard, LogOut, Menu, Newspaper, X } from 'lucide-react';
import type { CmsRole } from '@/lib/cms/types';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/blog', label: 'Blog', icon: Newspaper },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
];

export default function AdminShell({ user, role, children }: { user: string; role: CmsRole; children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch('/cms-api/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  const nav = (
    <nav className="flex flex-col gap-1">
      {links.map((l) => {
        const active = l.href === '/admin' ? path === '/admin' : path.startsWith(l.href);
        const Icon = l.icon;
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ${active ? 'bg-white/10 text-white' : 'text-navy-100 hover:bg-white/5 hover:text-white'}`}
          >
            <Icon className="h-4 w-4 text-saffron-300" /> {l.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="admin-root min-h-screen bg-cream text-ink">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-navy-950 p-4 text-white md:flex">
          <Link href="/admin" className="px-2 py-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-saffron-300">QISCET</p>
            <p className="font-display text-lg font-extrabold">Staff CMS</p>
          </Link>
          <div className="mt-6 flex-1">{nav}</div>
          <div className="border-t border-white/10 pt-3">
            <p className="px-2 text-xs text-navy-200">
              {user} · {role}
            </p>
            <button type="button" onClick={logout} className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-navy-100 hover:bg-white/5">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
            <Link href="/" className="mt-1 block px-3 py-2 text-xs text-navy-300 hover:text-white">
              View website
            </Link>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-navy-100 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
            <button type="button" className="rounded-lg p-2" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <p className="font-display font-extrabold text-navy-900">Staff CMS</p>
            <button type="button" onClick={logout} aria-label="Sign out">
              <LogOut className="h-5 w-5" />
            </button>
          </header>
          {open ? (
            <div className="fixed inset-0 z-40 md:hidden">
              <button className="absolute inset-0 bg-navy-950/60" aria-label="Close menu" onClick={() => setOpen(false)} />
              <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-navy-950 p-4 text-white">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-display font-extrabold">Staff CMS</p>
                  <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {nav}
              </div>
            </div>
          ) : null}
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
