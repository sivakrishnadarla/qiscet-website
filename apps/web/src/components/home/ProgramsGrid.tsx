import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { programmeGroups } from '@/data/site';

export default function ProgramsGrid() {
  return (
    <section className="section bg-navy-50/60">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Programmes" title="Future-focused programmes across engineering, computing & management" text="AICTE-approved, JNTUK-affiliated UG and PG programmes with an outcome-based autonomous curriculum. Intake figures for 2026-27." />
          <Link href="/admissions/courses-offered" className="btn-outline shrink-0">All courses & intake <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {programmeGroups.map((g) => (
            <div key={g.level} className="card flex flex-col overflow-hidden">
              <div className="bg-navy-gradient px-6 py-5 text-white">
                <p className="font-display text-xl font-extrabold">{g.level}</p>
                <p className="mt-1 text-xs text-navy-100">{g.duration}</p>
              </div>
              <ul className="flex-1 divide-y divide-navy-50 px-2 py-2">
                {g.items.map((it) => (
                  <li key={it.name}>
                    <Link href={it.href} className="group flex items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-sm text-ink-soft transition hover:bg-saffron-50 hover:text-navy-900">
                      <span>{it.name}</span>
                      <span className="flex shrink-0 items-center gap-2">
                        {it.intake ? <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-bold text-navy-800 group-hover:bg-white">{it.intake} seats</span> : null}
                        <ArrowUpRight className="h-4 w-4 text-navy-300 transition group-hover:text-saffron-500" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
