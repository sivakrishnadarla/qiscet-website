import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import { buildMetadata } from '@/lib/seo';
import { feedbackKinds } from '@/data/feedback';

export const metadata: Metadata = buildMetadata({
  title: 'Feedback',
  description: 'Curriculum feedback from students, parents, teachers, alumni and employers of QIS College of Engineering & Technology. Responses are reviewed by IQAC.',
  path: '/feedback',
});

export default function FeedbackIndex() {
  return (
    <>
      <PageHero title="Feedback" subtitle="Five short forms. IQAC and the Boards of Studies read every cycle before the syllabus is revised." crumbs={[{ name: 'Feedback', href: '/feedback' }]} />
      <section className="container-x py-12">
        <ul className="grid gap-4 md:grid-cols-2">
          {feedbackKinds.map((k) => (
            <li key={k.slug}>
              <Link href={`/feedback/${k.slug}`} className="group block h-full rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-saffron-300">
                <h2 className="font-display text-xl font-extrabold text-navy-900 group-hover:text-saffron-600">{k.title}</h2>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{k.intro}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-800">Give feedback <ArrowRight className="h-4 w-4" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
