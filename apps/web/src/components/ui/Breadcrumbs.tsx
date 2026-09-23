import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo';

export type Crumb = { name: string; href: string };

export default function Breadcrumbs({ items, light = false }: { items: Crumb[]; light?: boolean }) {
  const all = [{ name: 'Home', href: '/' }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={light ? 'text-navy-100' : 'text-ink-muted'}>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium sm:text-sm">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={c.href + i} className="flex items-center gap-1.5">
              {i > 0 ? <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden /> : null}
              {last ? (
                <span aria-current="page" className={light ? 'text-white' : 'text-navy-900'}>{c.name}</span>
              ) : (
                <Link href={c.href} className="inline-flex items-center gap-1 hover:text-saffron-500">
                  {i === 0 ? <Home className="h-3.5 w-3.5" aria-hidden /> : null}
                  {c.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
