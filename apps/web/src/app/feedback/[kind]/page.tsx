import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHero from '@/components/ui/PageHero';
import FeedbackForm from '@/components/forms/FeedbackForm';
import { buildMetadata } from '@/lib/seo';
import { feedbackKinds, getFeedbackKind } from '@/data/feedback';

export function generateStaticParams() {
  return feedbackKinds.map((k) => ({ kind: k.slug }));
}

export function generateMetadata({ params }: { params: { kind: string } }): Metadata {
  const k = getFeedbackKind(params.kind);
  if (!k) return { title: 'Feedback' };
  return buildMetadata({ title: k.title, description: k.intro, path: `/feedback/${k.slug}` });
}

export default function FeedbackKindPage({ params }: { params: { kind: string } }) {
  const k = getFeedbackKind(params.kind);
  if (!k) notFound();
  return (
    <>
      <PageHero title={k.title} subtitle={k.intro} crumbs={[{ name: 'Feedback', href: '/feedback' }, { name: k.title, href: `/feedback/${k.slug}` }]} />
      <section className="container-x grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-card md:p-8">
          <h2 className="mb-4 font-display text-lg font-extrabold text-navy-900">Campus form</h2>
          <FeedbackForm config={{ kind: k.slug, title: k.title, intro: k.intro, identity: k.identity, questions: k.questions }} />
        </div>
        <div>
          <h2 className="font-display text-lg font-extrabold text-navy-900">Official IQAC Google Form</h2>
          <p className="mt-1 text-sm text-ink-muted">The same questionnaire the IQAC has used in previous cycles. Either form is valid — you only need to submit one.</p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-navy-100">
            <iframe title={k.title} src={k.googleForm} className="h-[720px] w-full" loading="lazy" />
          </div>
        </div>
      </section>
    </>
  );
}
