'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export type PageRow = {
  title: string;
  slug: string;
  section: string;
  origin: 'institutional' | 'override' | 'cms';
  status: 'live' | 'draft' | 'published';
  id?: string;
  updatedAt?: string;
  kind: 'page' | 'blog';
};

export default function PagesTable({ rows, kind }: { rows: PageRow[]; kind: 'page' | 'blog' }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | 'draft' | 'cms'>('all');
  const shown = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === 'draft' && r.status !== 'draft') return false;
      if (filter === 'cms' && r.origin === 'institutional') return false;
      if (!query) return true;
      return `${r.title} ${r.slug} ${r.section}`.toLowerCase().includes(query);
    });
  }, [rows, q, filter]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input className="input sm:max-w-sm" placeholder="Search title or address" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          {(['all', 'cms', 'draft'] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${filter === f ? 'bg-navy-900 text-white' : 'bg-white text-navy-800 ring-1 ring-navy-100'}`}>
              {f === 'all' ? 'All' : f === 'cms' ? 'CMS only' : 'Drafts'}
            </button>
          ))}
          <Link href={kind === 'blog' ? '/admin/edit?kind=blog' : '/admin/edit?kind=page'} className="btn-primary !py-1.5 text-xs">New {kind === 'blog' ? 'post' : 'page'}</Link>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-muted">{shown.length} shown</p>
      <ul className="mt-3 divide-y divide-navy-100 overflow-hidden rounded-2xl border border-navy-100 bg-white">
        {shown.slice(0, 200).map((r) => (
          <li key={r.id || r.slug} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate font-semibold text-navy-900">{r.title}</p>
              <p className="truncate font-mono text-[11px] text-ink-muted">/{r.slug}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy-700">{r.origin === 'institutional' ? 'Original' : r.origin === 'override' ? 'Edited' : 'CMS'}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${r.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-800'}`}>{r.status}</span>
              <Link href={r.id ? `/admin/edit?id=${r.id}` : `/admin/edit?slug=${encodeURIComponent(r.slug)}`} className="text-sm font-bold text-navy-800 underline decoration-saffron-400 underline-offset-4">Edit</Link>
            </div>
          </li>
        ))}
      </ul>
      {shown.length > 200 ? <p className="mt-2 text-xs text-ink-muted">Showing the first 200 matches. Search to narrow the list.</p> : null}
    </div>
  );
}
