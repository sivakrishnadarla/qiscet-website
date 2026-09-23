import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import JsonLd from '@/components/seo/JsonLd';
import { faqJsonLd } from '@/lib/seo';
import { faqs } from '@/data/site';

export default function Faq({ items = faqs, title = 'Frequently asked questions', showJsonLd = true }: { items?: { q: string; a: string }[]; title?: string; showJsonLd?: boolean }) {
  return (
    <section className="section">
      {showJsonLd ? <JsonLd data={faqJsonLd(items)} /> : null}
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.4fr]">
        <div>
          <SectionHeading eyebrow="FAQs" title={title} text="Quick answers about admissions, fees, hostels, placements and how to reach the campus." />
          <Link href="/contact" className="btn-outline mt-6">Still have a question? Contact us <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="divide-y divide-navy-100 rounded-3xl border border-navy-100 bg-white px-6 shadow-card">
          {items.map((f, i) => (
            <details key={f.q} className="group py-4" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[15px] font-bold text-navy-900 marker:content-none [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-navy-200 text-navy-800 transition group-open:rotate-45 group-open:border-saffron-500 group-open:bg-saffron-500 group-open:text-white" aria-hidden>+</span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
