'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';
import { ChevronDown, ChevronRight, Phone } from 'lucide-react';
import { site } from '@/data/site';

export type SideLink = { label: string; href: string };

export default function SectionSidebar({ title, links, cta = true }: { title: string; links: SideLink[]; cta?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = links.find((l) => l.href === pathname);

  return (
    <aside className="lg:sticky lg:top-24">
      {/* Mobile: collapsible */}
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between rounded-xl border border-navy-100 bg-white px-4 py-3 text-left text-sm font-semibold text-navy-900 shadow-sm lg:hidden" aria-expanded={open}>
        <span>{active ? active.label : `In this section: ${title}`}</span>
        <ChevronDown className={clsx('h-4 w-4 transition', open && 'rotate-180')} />
      </button>
      <nav aria-label={`${title} navigation`} className={clsx('mt-2 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card lg:mt-0 lg:block', open ? 'block' : 'hidden')}>
        <p className="border-b border-navy-100 bg-navy-900 px-5 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-white">{title}</p>
        <ul className="max-h-[70vh] overflow-y-auto py-2">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <li key={l.href + l.label}>
                <Link href={l.href} onClick={() => setOpen(false)} className={clsx('flex items-center gap-2 border-l-[3px] px-4 py-2.5 text-[13.5px] transition', isActive ? 'border-saffron-500 bg-saffron-50 font-semibold text-navy-900' : 'border-transparent text-ink-soft hover:border-navy-200 hover:bg-navy-50 hover:text-navy-900')} aria-current={isActive ? 'page' : undefined}>
                  <ChevronRight className={clsx('h-3.5 w-3.5 shrink-0', isActive ? 'text-saffron-500' : 'text-navy-300')} />
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {cta ? (
        <div className="mt-5 hidden rounded-2xl bg-navy-gradient p-5 text-white lg:block">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-saffron-300">Admissions 2026-27</p>
          <p className="mt-1 font-display text-lg font-extrabold">Have questions? Talk to a counsellor.</p>
          <a href={site.admissionsPhoneHref} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-saffron-300"><Phone className="h-4 w-4 text-saffron-400" /> {site.admissionsPhone}</a>
          <Link href="/apply" className="btn-primary mt-4 w-full !py-2 text-xs">Apply Online</Link>
        </div>
      ) : null}
    </aside>
  );
}
