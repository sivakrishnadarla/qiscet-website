import Link from 'next/link';
import { Megaphone } from 'lucide-react';
import { announcements } from '@/data/site';

export default function NewsTicker() {
  const items = [...announcements, ...announcements];
  return (
    <div className="relative z-10 border-y border-saffron-600/30 bg-navy-900 text-white">
      <div className="container-x flex items-stretch">
        <div className="flex shrink-0 items-center gap-2 bg-saffron-500 px-3 py-2.5 text-xs font-extrabold uppercase tracking-[0.18em] text-white sm:px-4">
          <Megaphone className="h-4 w-4" /> <span className="hidden sm:inline">Latest</span>
        </div>
        <div className="group relative flex-1 overflow-hidden">
          <ul className="flex w-max animate-ticker items-center gap-10 py-2.5 pl-6 text-sm group-hover:[animation-play-state:paused]" aria-label="Announcements">
            {items.map((a, i) => (
              <li key={i} className="flex items-center gap-3 whitespace-nowrap" aria-hidden={i >= announcements.length}>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-saffron-300">{a.tag}</span>
                {/^https?:/.test(a.href) ? (
                  <a href={a.href} target="_blank" rel="noopener noreferrer" className="hover:text-saffron-300">{a.text}</a>
                ) : (
                  <Link href={a.href} className="hover:text-saffron-300">{a.text}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
