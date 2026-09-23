import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import BCategoryForm from '@/components/forms/BCategoryForm';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'B-Category Online Application',
  description: 'Online application for first-year B.Tech admission under B-Category (management quota) seats at QIS College of Engineering & Technology, Ongole. Counselling code QISE.',
  path: '/admissions/b-category-application',
});

export default function BCategoryApplicationPage() {
  return (
    <>
      <PageHero
        title="B-Category online application"
        subtitle="First-year B.Tech seats under the management quota (Category B), filled by the college as per Government of Andhra Pradesh norms. Keep your EAPCET rank and intermediate marks ready."
        crumbs={[{ name: 'Admissions', href: '/admissions' }, { name: 'B-Category', href: '/admissions/b-category' }, { name: 'Apply', href: '/admissions/b-category-application' }]}
      />
      <section className="container-x max-w-3xl py-12">
        <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-card md:p-8">
          <BCategoryForm />
        </div>
        <p className="mt-4 text-sm text-ink-muted">
          Prefer paper? Download the{' '}
          <a className="font-semibold text-navy-800 underline decoration-saffron-400 underline-offset-4" href="https://qiscet.edu.in/qiscet/bcat/bcat_cet_24.pdf" target="_blank" rel="noopener noreferrer">offline application (PDF)</a>{' '}
          and read the{' '}
          <a className="font-semibold text-navy-800 underline decoration-saffron-400 underline-offset-4" href="/admissions/b-category">B-Category information</a>.
        </p>
      </section>
    </>
  );
}
