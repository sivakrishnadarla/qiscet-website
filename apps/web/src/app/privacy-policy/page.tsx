import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import { buildMetadata } from '@/lib/seo';
import { site } from '@/data/site';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: `How ${site.shortName} collects and uses information submitted through this website’s enquiry, application, feedback and grievance forms.`,
  path: '/privacy-policy',
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy policy" subtitle="What we collect when you use this website, and why." crumbs={[{ name: 'Privacy policy', href: '/privacy-policy' }]} compact />
      <article className="container-x prose-qis max-w-3xl py-12">
        <p>This website is operated by {site.name}, {site.address.full}. Questions about your data can be sent to <a href={`mailto:${site.email}`}>{site.email}</a> or by calling <a href={site.phoneHref}>{site.phone}</a>.</p>
        <h2>What we collect</h2>
        <ul>
          <li>Details you type into a form: name, mobile, email, programme interest, rank, address, and the message itself.</li>
          <li>Technical data sent with the form: the page you submitted from, and campaign parameters (UTM tags, gclid, fbclid) if you arrived from an advertisement.</li>
          <li>A honeypot field that humans never see, used only to drop automated spam.</li>
        </ul>
        <h2>Why we collect it</h2>
        <ul>
          <li>To call or write back about admissions, hostel, transport or a grievance you raised.</li>
          <li>To send the newsletter, if you subscribed.</li>
          <li>To let IQAC and the Boards of Studies review curriculum feedback in aggregate.</li>
          <li>To measure which campaigns bring genuine enquiries. We do not sell this data.</li>
        </ul>
        <h2>Who sees it</h2>
        <p>Submissions are emailed to the relevant office and, when configured, stored in the college’s database or a private spreadsheet. They are not published. Grievances marked anonymous are stored without your contact details.</p>
        <h2>How long we keep it</h2>
        <p>Admission enquiries are kept for the admission cycle plus one year. Grievances are kept for as long as the redressal file is open, and then as required by the college’s record-retention rules. You can ask us to delete an enquiry by emailing {site.email} with the reference ID.</p>
        <h2>Cookies</h2>
        <p>The site itself does not set tracking cookies. If Google Tag Manager is enabled by the college, analytics tags may set cookies — you can refuse non-essential cookies in your browser. Campaign parameters are stored in your browser’s session storage so a later form still attributes the visit correctly. Clearing site data removes them.</p>
        <h2>Third-party pages</h2>
        <p>Results, student login, Google Forms and YouTube open on their own sites and follow those providers’ policies. Maps on the contact page are embedded from Google.</p>
      </article>
    </>
  );
}
