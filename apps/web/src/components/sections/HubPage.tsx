import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, CheckCircle2, Phone } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import CtaBand from '@/components/ui/CtaBand';
import EnquiryForm from '@/components/forms/EnquiryForm';
import Faq from '@/components/home/Faq';
import JsonLd from '@/components/seo/JsonLd';
import { webPageJsonLd } from '@/lib/seo';
import { sectionNav } from '@/data/navigation';
import { admissionSteps, facilityCards, hubCopy } from '@/data/hubs';
import { faqs, leadership, programmeGroups, recruiters, site } from '@/data/site';
import { getDepartments, getPagesBySection, type Department } from '@/lib/content';

const GROUPS: { id: string; label: string; slugs: string[] }[] = [
  { id: 'computing', label: 'Computing & AI', slugs: ['cse', 'cse-ai-ml', 'cse-data-science', 'cse-iot-cyber-security', 'cse-business-systems', 'artificial-intelligence', 'ai-data-science', 'quantum-computational-engineering', 'cs-information-technology', 'information-technology'] },
  { id: 'core', label: 'Core Engineering & Sciences', slugs: ['ece', 'vlsi-design-technology', 'eee', 'mechanical', 'civil', 'basic-sciences-humanities'] },
  { id: 'mgmt', label: 'Management & Applications', slugs: ['mba', 'mca', 'bca'] },
];

export function hubMeta(section: string) {
  return hubCopy[section] || { title: section, subtitle: `${site.shortName} — ${section}` };
}

export default function HubPage({ section }: { section: string }) {
  const copy = hubMeta(section);
  const body = {
    admissions: <AdmissionsHub />,
    departments: <DepartmentsHub />,
    facilities: <FacilitiesHub />,
    placements: <PlacementsHub />,
    about: <AboutHub />,
  }[section] || <GenericHub section={section} />;

  return (
    <>
      <JsonLd data={webPageJsonLd(copy.title, copy.subtitle, '/' + section)} />
      <PageHero title={copy.title} subtitle={copy.subtitle} crumbs={[]} image={copy.image} />
      {body}
      <CtaBand />
    </>
  );
}

function GenericHub({ section }: { section: string }) {
  const links = sectionNav[section] || [];
  const pages = getPagesBySection(section);
  const summary = new Map(pages.map((p) => ['/' + p.slug, p.summary]));
  return (
    <section className="container-x py-12 md:py-16">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="group flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-saffron-300 hover:shadow-lift">
              <span className="font-display text-lg font-extrabold text-navy-900 group-hover:text-saffron-600">{l.label}</span>
              {summary.get(l.href) ? <span className="mt-2 line-clamp-3 text-sm leading-6 text-ink-muted">{summary.get(l.href)}</span> : null}
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-800">Open <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:text-saffron-500" /></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AboutHub() {
  return (
    <>
      <section className="container-x py-14">
        <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="prose-qis">
            <p>QIS College of Engineering & Technology was established in 1998 by Sri Nidamanuri Educational Society to bring high-quality technical education to Prakasam district. The campus sits on Pondur Road, Vengamukkapalem — about 2 km from Ongole town, adjoining National Highway 16 — and is permanently affiliated to Jawaharlal Nehru Technological University, Kakinada.</p>
            <p>The college is autonomous, approved by AICTE, accredited by NAAC with an A+ grade and by NBA for eligible programmes. It is ISO 9001:2015 certified and features in the NIRF India Rankings. Programmes run from B.Tech and BCA through M.Tech, MBA and MCA, with equal weight on fundamentals and industry-ready practice.</p>
            <ul>
              <li>Counselling code <strong>QISE</strong> for AP EAPCET and ECET.</li>
              <li>Outcome-based autonomous curriculum, updated through Boards of Studies.</li>
              <li>AICTE IDEA Lab, Centres of Excellence and an active Entrepreneurship Development Cell.</li>
              <li>Nodal centre for Smart India Hackathon — hosted in 2022, 2023 and 2025.</li>
            </ul>
          </div>
          <aside className="rounded-3xl bg-navy-900 p-6 text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-saffron-300">Key facts</p>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ['Established', '1998'],
                ['Sponsor', site.sponsor],
                ['Affiliation', 'JNTU Kakinada'],
                ['Status', 'Autonomous · NAAC A+ · NBA'],
                ['Campus', site.address.full],
                ['Office', site.phone],
                ['Email', site.email],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-2 border-b border-white/10 pb-3">
                  <dt className="text-navy-200">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {leadership.map((p) => (
            <li key={p.name} className="card flex gap-4 p-4">
              <Image src={p.photo} alt="" width={72} height={72} className="h-[72px] w-[72px] rounded-full object-cover object-top" />
              <div>
                <p className="font-display font-extrabold text-navy-900">{p.name}</p>
                <p className="text-xs text-saffron-600">{p.role}</p>
                <Link href={p.href} className="mt-1 inline-block text-sm font-semibold text-navy-800 underline decoration-saffron-400 underline-offset-4">Profile</Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <GenericHub section="about" />
    </>
  );
}

function AdmissionsHub() {
  return (
    <>
      <section className="container-x py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Apply online', 'Free counselling call-back in minutes.', '/apply'],
            ['Courses & intake', 'Seat matrix for 2026-27 and earlier years.', '/admissions/courses-offered'],
            ['How seats are filled', 'Category A, Category B and lateral entry.', '/admissions/procedure'],
            ['B-Category seats', 'Management-quota information and application.', '/admissions/b-category'],
          ].map(([t, d, h]) => (
            <Link key={h} href={h} className="group rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-saffron-300">
              <p className="font-display text-lg font-extrabold text-navy-900 group-hover:text-saffron-600">{t}</p>
              <p className="mt-1 text-sm text-ink-muted">{d}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-navy-800">Continue <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
        <ol className="mt-12 grid gap-4 md:grid-cols-5">
          {admissionSteps.map((s) => (
            <li key={s.n} className="rounded-2xl bg-navy-50 p-4">
              <p className="font-display text-2xl font-extrabold text-saffron-500">{s.n}</p>
              <p className="mt-1 font-display font-extrabold text-navy-900">{s.title}</p>
              <p className="mt-2 text-xs leading-5 text-ink-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="bg-white pb-4">
        <div className="container-x">
          <SectionHeading eyebrow="2026-27 intake" title="Programmes you can apply for" />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {programmeGroups.map((g) => (
              <div key={g.level} className="rounded-2xl border border-navy-100 p-5">
                <p className="font-display text-lg font-extrabold text-navy-900">{g.level}</p>
                <p className="text-xs text-ink-muted">{g.duration}</p>
                <ul className="mt-3 space-y-1.5">
                  {g.items.map((it) => (
                    <li key={it.name} className="flex justify-between gap-2 text-sm">
                      <Link href={it.href} className="text-navy-800 hover:text-saffron-600">{it.name}</Link>
                      <span className="shrink-0 font-semibold text-ink-muted">{it.intake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Faq items={faqs} title="Admissions questions, answered" />
      <section className="container-x pb-16">
        <div className="grid items-start gap-8 rounded-3xl bg-navy-900 p-6 text-white md:p-10 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-saffron-300">Talk to admissions</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-white">Not sure which branch or quota fits you?</h2>
            <p className="mt-3 text-sm leading-7 text-navy-100">Share your rank and preferred branch. A counsellor calls you back with seat availability, fee and hostel options. Helpline {site.admissionsPhone}.</p>
            <a href={site.admissionsPhoneHref} className="btn-ghost-light mt-5"><Phone className="h-4 w-4" /> {site.admissionsPhone}</a>
          </div>
          <div className="rounded-2xl bg-white p-5 text-ink"><EnquiryForm source="admissions-hub" title="Request a call back" subtitle="Takes under a minute." /></div>
        </div>
      </section>
    </>
  );
}

function DepartmentsHub() {
  const depts = getDepartments();
  const bySlug = new Map(depts.map((d) => [d.slug, d]));
  return (
    <section className="container-x py-14">
      {GROUPS.map((g) => (
        <div key={g.id} className="mb-12">
          <h2 className="text-2xl font-extrabold">{g.label}</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.slugs.map((slug) => {
              const d = bySlug.get(slug);
              if (!d) return null;
              return <DeptCard key={slug} dept={d} />;
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}

function DeptCard({ dept }: { dept: Department }) {
  const seats = dept.courses.reduce((n, c) => n + (parseInt(c.intake, 10) || 0), 0);
  return (
    <li className="card flex h-full flex-col p-5 transition hover:-translate-y-1 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-lg bg-navy-900 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white">{dept.short}</span>
        {seats ? <span className="text-xs font-semibold text-ink-muted">{seats} seats</span> : null}
      </div>
      <h3 className="mt-3 font-display text-lg font-extrabold leading-snug text-navy-900">{dept.name}</h3>
      {dept.hod?.name ? <p className="mt-1 text-xs text-ink-muted">HOD: {dept.hod.name}</p> : null}
      {dept.intro ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink-soft">{dept.intro}</p> : null}
      <Link href={`/departments/${dept.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-800 hover:text-saffron-600">
        Department page <ArrowRight className="h-4 w-4" />
      </Link>
    </li>
  );
}

function FacilitiesHub() {
  return (
    <section className="container-x py-14">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {facilityCards.map((f) => (
          <li key={f.href}>
            <Link href={f.href} className="group block overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift">
              <div className="relative aspect-[16/10]">
                <Image src={f.image} alt="" fill sizes="320px" className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <p className="font-display font-extrabold text-navy-900 group-hover:text-saffron-600">{f.title}</p>
                <p className="mt-1 text-sm leading-6 text-ink-muted">{f.text}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <GenericHub section="facilities" />
      </div>
    </section>
  );
}

function PlacementsHub() {
  return (
    <section className="container-x py-14">
      <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ['₹15 LPA', 'Highest package'],
          ['₹3.6 LPA', 'Average package'],
          ['60+', 'Companies every year'],
          ['560+', 'Hours of training'],
        ].map(([v, l]) => (
          <div key={l} className="rounded-2xl bg-navy-900 px-4 py-6 text-center text-white">
            <dd className="font-display text-3xl font-extrabold text-saffron-400">{v}</dd>
            <dt className="mt-1 text-xs uppercase tracking-wider text-navy-100">{l}</dt>
          </div>
        ))}
      </dl>
      <ul className="mt-8 flex flex-wrap items-center gap-4">
        {recruiters.map((r) => (
          <li key={r.name} className="flex h-16 w-32 items-center justify-center rounded-xl border border-navy-100 bg-white p-3">
            <Image src={r.logo} alt={`${r.name} logo`} width={110} height={40} className="max-h-10 w-auto object-contain" unoptimized />
          </li>
        ))}
      </ul>
      <ul className="mt-8 space-y-2 text-sm text-ink-soft">
        {['260 hours of aptitude, reasoning, verbal and coding, plus 300 hours of practice on ByteXL and CodeTantra.', 'Company-specific drives (including Accenture) before the placement season.', 'A written placement policy so the process stays fair for every eligible student.'].map((t) => (
          <li key={t} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-saffron-500" /> {t}</li>
        ))}
      </ul>
      <div className="mt-8">
        <GenericHub section="placements" />
      </div>
    </section>
  );
}
