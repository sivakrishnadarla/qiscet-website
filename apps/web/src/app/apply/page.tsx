import type { Metadata } from 'next';
import { CheckCircle2, FileText, Phone } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import ApplyForm from '@/components/forms/ApplyForm';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata, webPageJsonLd } from '@/lib/seo';
import { site } from '@/data/site';
import Link from 'next/link';

const description = 'Apply online to QIS College of Engineering & Technology, Ongole for B.Tech, M.Tech, MBA, MCA and BCA admissions 2026-27. Counselling code QISE. Free counsellor call-back.';

export const metadata: Metadata = buildMetadata({
  title: 'Apply Online — Admissions 2026-27',
  description,
  path: '/apply',
  keywords: ['QISCET apply online', 'B.Tech admission Ongole 2026', 'EAPCET code QISE', 'management quota application'],
});

export default function ApplyPage() {
  return (
    <>
      <JsonLd data={webPageJsonLd('Apply online to QISCET', description, '/apply')} />
      <PageHero
        title="Apply online — Admissions 2026-27"
        subtitle="Tell us the programme you want. The admissions office confirms eligibility, quota (convener or B-category) and the documents to bring. Counselling code QISE."
        crumbs={[{ name: 'Admissions', href: '/admissions' }, { name: 'Apply', href: '/apply' }]}
        image="/images/images/qiscetgal_1.jpg"
      />
      <section className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-card md:p-8">
          <ApplyForm />
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-navy-900 p-5 text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-300">Prefer to talk?</p>
            <a href={site.admissionsPhoneHref} className="mt-2 flex items-center gap-2 font-display text-xl font-extrabold"><Phone className="h-5 w-5 text-saffron-400" /> {site.admissionsPhone}</a>
            <p className="mt-1 text-xs text-navy-200">Also {site.phone} · {site.email}</p>
            <p className="mt-3 text-xs leading-5 text-navy-100">{site.hours}</p>
          </div>
          <div className="rounded-2xl border border-navy-100 bg-white p-5">
            <p className="font-display font-extrabold text-navy-900">Before you apply</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              {['Keep your EAPCET / ECET / ICET hall ticket and rank handy.', 'Category A (70%) is filled by the Government of AP. This form also covers Category B enquiries.', 'Hostel and bus seats are first-come after fee payment.'].map((t) => (
                <li key={t} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-saffron-500" /> {t}</li>
              ))}
            </ul>
            <Link href="/admissions/brochure" className="btn-outline mt-4 w-full !py-2 text-xs"><FileText className="h-4 w-4" /> Admission brochure</Link>
          </div>
        </aside>
      </section>
    </>
  );
}
