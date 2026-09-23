import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { site } from '@/data/site';

export default function CtaBand({ title = 'Admissions Open 2026-27', text = 'B.Tech · M.Tech · MBA · MCA · BCA — Counselling code QISE. Talk to our admissions team or apply online in two minutes.' }: { title?: string; text?: string }) {
  return (
    <section className="container-x my-6">
      <div className="relative overflow-hidden rounded-3xl bg-saffron-gradient px-6 py-10 text-white shadow-glow md:px-12">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl" aria-hidden />
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Counselling Code: {site.counsellingCode}</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-white md:text-3xl">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/90 md:text-base">{text}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/apply" className="btn bg-white text-saffron-700 hover:bg-navy-900 hover:text-white">Apply Online <ArrowRight className="h-4 w-4" /></Link>
            <a href={site.admissionsPhoneHref} className="btn-ghost-light"><Phone className="h-4 w-4" /> {site.admissionsPhone}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
