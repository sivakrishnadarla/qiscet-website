import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, ExternalLink } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { newsItems, announcements } from '@/data/site';

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function NewsEvents() {
  const [lead, ...rest] = newsItems;
  return (
    <section className="section">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="News & Events" title="What’s happening at QISCET" />
          <Link href="/news" className="btn-outline shrink-0">All news & notices <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr_0.9fr]">
          <a href={lead.href} target={/^https?:/.test(lead.href) ? '_blank' : undefined} rel="noopener noreferrer" className="group relative block overflow-hidden rounded-3xl shadow-card">
            <div className="relative aspect-[16/11]">
              <Image src={lead.image} alt={lead.title} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <span className="rounded-full bg-saffron-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">{lead.tag}</span>
              <p className="mt-2 flex items-center gap-2 text-xs text-navy-100"><CalendarDays className="h-3.5 w-3.5" /> {fmt(lead.date)}</p>
              <h3 className="mt-1 font-display text-xl font-extrabold text-white md:text-2xl">{lead.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-navy-100">{lead.text}</p>
            </div>
          </a>
          <ul className="space-y-4">
            {rest.slice(0, 4).map((n) => (
              <li key={n.title}>
                <a href={n.href} target={/^https?:/.test(n.href) ? '_blank' : undefined} rel="noopener noreferrer" className="group flex gap-4 rounded-2xl border border-navy-100 bg-white p-3 transition hover:border-saffron-300 hover:shadow-card">
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                    <Image src={n.image} alt="" fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-saffron-600">{n.tag} · {fmt(n.date)}</p>
                    <h3 className="mt-1 line-clamp-2 font-display text-sm font-bold text-navy-900 group-hover:text-saffron-600">{n.title}</h3>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          <div className="rounded-3xl bg-navy-900 p-6 text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-saffron-300">Notice Board</p>
            <ul className="mt-4 divide-y divide-white/10">
              {announcements.map((a) => (
                <li key={a.text} className="py-3">
                  <a href={a.href} target={/^https?:/.test(a.href) ? '_blank' : undefined} rel="noopener noreferrer" className="group flex items-start gap-2 text-sm text-navy-50 hover:text-white">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-400" />
                    <span className="flex-1 leading-snug">{a.text}</span>
                    {/^https?:/.test(a.href) ? <ExternalLink className="mt-1 h-3 w-3 shrink-0 opacity-50" /> : null}
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/examinations/notifications" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-saffron-300 hover:text-white">Exam notifications <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
