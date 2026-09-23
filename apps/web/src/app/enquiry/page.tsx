import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import EnquiryForm from '@/components/forms/EnquiryForm';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Admission Enquiry',
  description: 'Ask the QISCET admissions office about branches, fees, scholarships, hostel and transport. We call you back.',
  path: '/enquiry',
});

export default function EnquiryPage() {
  return (
    <>
      <PageHero title="Admission enquiry" subtitle="A short form. A real counsellor calls you back — usually the same day during office hours." crumbs={[{ name: 'Admissions', href: '/admissions' }, { name: 'Enquiry', href: '/enquiry' }]} />
      <section className="container-x max-w-2xl py-12">
        <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card md:p-8">
          <EnquiryForm source="enquiry-page" title="" subtitle="" />
        </div>
      </section>
    </>
  );
}
