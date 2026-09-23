import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import GrievanceForm from '@/components/forms/GrievanceForm';
import { buildMetadata } from '@/lib/seo';
import { site } from '@/data/site';

export const metadata: Metadata = buildMetadata({
  title: 'Online Grievance Redressal',
  description: 'File a grievance with QISCET’s Grievance Redressal Cell — academic, examination, hostel, ragging, harassment or fee related. Anonymous option available. Acknowledgement within 7 working days.',
  path: '/grievance',
});

export default function GrievancePage() {
  return (
    <>
      <PageHero
        title="Online grievance redressal"
        subtitle="Every grievance is logged, given a reference number and sent to the concerned cell. Ragging and harassment complaints are escalated the same day."
        crumbs={[{ name: 'Governance', href: '/governance' }, { name: 'Grievance', href: '/grievance' }]}
      />
      <section className="container-x grid gap-8 py-12 lg:grid-cols-[1fr_300px]">
        <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-card md:p-8">
          <GrievanceForm />
        </div>
        <aside className="space-y-4 text-sm leading-6 text-ink-soft lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-red-50 p-5 text-red-950">
            <p className="font-display font-extrabold">Ragging is a crime</p>
            <p className="mt-2">If you are being ragged, call the Principal’s office immediately on <a className="font-bold underline" href={site.phoneHref}>{site.phone}</a> or the national anti-ragging helpline <a className="font-bold underline" href="tel:18001805522">1800-180-5522</a>.</p>
          </div>
          <div className="rounded-2xl border border-navy-100 bg-white p-5">
            <p className="font-semibold text-navy-900">What happens next</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>You receive a reference ID on this page.</li>
              <li>The cell acknowledges within 7 working days.</li>
              <li>A written outcome is shared with you, unless you submitted anonymously.</li>
            </ol>
            <p className="mt-3"><a href="/governance/anti-ragging" className="font-semibold text-navy-800 underline decoration-saffron-400 underline-offset-4">Read the anti-ragging policy</a></p>
          </div>
        </aside>
      </section>
    </>
  );
}
