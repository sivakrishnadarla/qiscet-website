'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

type Item = { title: string; href: string; section: string; summary: string };

export default function SearchBox({ index, initialQuery }: { index: Item[]; initialQuery: string }) {
  const [q, setQ] = useState(initialQuery);
  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2) return [];
    const words = query.split(/\s+/);
    return index
      .map((item) => {
        const hay = `${item.title} ${item.summary} ${item.section}`.toLowerCase();
        const score = words.reduce((n, w) => n + (hay.includes(w) ? (item.title.toLowerCase().includes(w) ? 3 : 1) : 0), 0);
        return { item, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);
  }, [q, index]);

  return (
    <div className="mt-6">
      <label className="relative block">
        <span className="sr-only">Search query</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “hostel”, “NAAC”, “CSE syllabus”, “placements”…" className="input pl-12 text-base" autoFocus />
      </label>
      <p className="mt-3 text-sm text-ink-muted" aria-live="polite">
        {q.trim().length < 2 ? 'Type at least 2 characters.' : `${results.length} result${results.length === 1 ? '' : 's'}`}
      </p>
      <ul className="mt-4 divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white">
        {results.map(({ item }) => (
          <li key={item.href}>
            <Link href={item.href} className="block px-5 py-4 hover:bg-saffron-50">
              <p className="text-[11px] font-bold uppercase tracking-wider text-saffron-600">{item.section.replace('-', ' ')}</p>
              <p className="font-display font-extrabold text-navy-900">{item.title}</p>
              {item.summary ? <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{item.summary}</p> : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
