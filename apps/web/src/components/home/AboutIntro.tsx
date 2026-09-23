import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, CheckCircle2, PlayCircle } from 'lucide-react';
import { accreditations, site } from '@/data/site';

const points = [
  'Autonomous since 2015 · NAAC A+ · NBA accredited programmes',
  'Approved by AICTE, permanently affiliated to JNTU Kakinada',
  'AICTE IDEA Lab, Centres of Excellence & Institution’s Innovation Council',
  'Nodal centre for Smart India Hackathon (2022, 2023 & 2025)',
];

export default function AboutIntro() {
  return (
    <section className="section">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
            <Image src="/images/images/office.jpg" alt="Aerial view of the QIS College of Engineering & Technology campus, Ongole" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            <a href={site.videos.campusTour} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-navy-950/20 transition hover:bg-navy-950/40" aria-label="Watch the campus tour video on YouTube">
              <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-saffron-600 shadow-glow transition hover:scale-110">
                <PlayCircle className="h-10 w-10" />
              </span>
            </a>
          </div>
          <div className="absolute -bottom-6 -right-4 hidden rounded-2xl bg-navy-900 px-6 py-5 text-white shadow-lift md:block">
            <p className="font-display text-4xl font-extrabold text-saffron-400">Est. 1998</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-navy-100">27+ years of quality education</p>
          </div>
          <div className="absolute -left-4 -top-4 hidden rounded-2xl bg-white p-4 shadow-lift md:flex md:items-center md:gap-3">
            <Award className="h-8 w-8 text-saffron-500" />
            <div>
              <p className="font-display text-sm font-extrabold text-navy-900">NAAC A+ · NBA</p>
              <p className="text-[11px] text-ink-muted">Accredited institution</p>
            </div>
          </div>
        </div>
        <div>
          <p className="eyebrow">About QISCET</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">An Autonomous Engineering College in Ongole with a 27-year legacy</h2>
          <p className="mt-5 text-base leading-7 text-ink-soft">
            QIS College of Engineering & Technology was established in 1998 by <Link href="/about/snes" className="font-semibold text-navy-800 underline decoration-saffron-400 decoration-2 underline-offset-4">Sri Nidamanuri Educational Society</Link> to bring
            world-class technical education to the Prakasam region. Spread across a green campus on Pondur Road, 2 km from Ongole town, QISCET offers 15 B.Tech, 7 M.Tech, MBA, MCA and BCA
            programmes with a strong focus on outcome-based learning, research and placements.
          </p>
          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-ink-soft">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-saffron-500" /> {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/about/about-qiscet" className="btn-secondary">About the College <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/about/vision-mission" className="btn-outline">Vision & Mission</Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Accreditations and approvals">
            {accreditations.map((a) => (
              <li key={a.code} className="rounded-full border border-navy-100 bg-navy-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy-800">{a.code}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
