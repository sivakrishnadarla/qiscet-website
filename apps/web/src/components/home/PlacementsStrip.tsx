import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { recruiterNames, recruiters } from '@/data/site';

export default function PlacementsStrip() {
  const loop = [...recruiters, ...recruiters];
  return (
    <section className="section">
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeading eyebrow="Training & Placements" title="Placement-ready graduates, trusted by top recruiters" text="A dedicated Training & Placement Cell runs aptitude, coding, communication and mock-interview programmes from the first year. Every year 60+ companies recruit from campus." />
            <dl className="mt-8 grid grid-cols-3 gap-4">
              {[
                ['₹15 LPA', 'Highest package'],
                ['₹3.6 LPA', 'Average package'],
                ['60+', 'Recruiters / year'],
              ].map(([v, l]) => (
                <div key={l} className="rounded-2xl border border-navy-100 bg-white p-4 text-center shadow-card">
                  <dd className="font-display text-2xl font-extrabold text-saffron-600">{v}</dd>
                  <dt className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{l}</dt>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/placements/placement-details" className="btn-secondary">Placement Statistics <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/placements/recruiters" className="btn-outline">Our Recruiters</Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-navy-100 bg-navy-50/50 p-6">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-navy-50 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-navy-50 to-transparent" />
            <div className="overflow-hidden">
              <ul className="flex w-max animate-marquee items-center gap-6 hover:[animation-play-state:paused]" aria-label="Recruiter logos">
                {loop.map((r, i) => (
                  <li key={r.name + i} className="flex h-20 w-40 items-center justify-center rounded-2xl bg-white p-4 shadow-card" aria-hidden={i >= recruiters.length}>
                    <Image src={r.logo} alt={`${r.name} logo`} width={140} height={56} className="max-h-12 w-auto object-contain" unoptimized />
                  </li>
                ))}
              </ul>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {recruiterNames.map((n) => (
                <li key={n} className="rounded-full border border-navy-100 bg-white px-3 py-1 text-xs font-semibold text-navy-800">{n}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
