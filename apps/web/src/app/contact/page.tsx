import type { Metadata } from 'next';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import ContactForm from '@/components/forms/ContactForm';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata, webPageJsonLd } from '@/lib/seo';
import { site } from '@/data/site';

const description = `Contact ${site.name}: ${site.address.full}. Phone ${site.phone}, admissions ${site.admissionsPhone}, email ${site.email}. Office hours Monday to Saturday, 9 AM to 5 PM.`;

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us',
  description,
  path: '/contact',
  keywords: ['QISCET contact', 'QIS College Ongole address', 'QISCET phone number', site.phone],
});

const desks = [
  { role: 'Principal’s office', phone: site.phone, email: site.email },
  { role: 'Admissions', phone: site.admissionsPhone, email: site.email },
  { role: 'Transport', phone: '+91 92464 19527', email: site.email },
  { role: 'HR / Careers', phone: '+91 92464 19574', email: site.hrEmail },
  { role: 'Student verification', phone: '+91 92464 19522', email: site.email },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={webPageJsonLd('Contact QISCET Ongole', description, '/contact', 'ContactPage')} />
      <PageHero title="Contact us" subtitle={`${site.address.full}. We are about 2 km from Ongole town, on the Ongole–Pondur road adjoining NH-16.`} crumbs={[{ name: 'Contact', href: '/contact' }]} />
      <section className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="text-2xl font-extrabold">Write to us</h2>
          <p className="mt-2 text-sm text-ink-muted">Messages are routed to the office you choose. Expect a reply within 1–2 working days.</p>
          <div className="mt-6 rounded-3xl border border-navy-100 bg-white p-5 shadow-card md:p-7">
            <ContactForm />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold">Campus & desks</h2>
          <address className="mt-4 space-y-3 not-italic text-sm leading-6 text-ink-soft">
            <p className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-saffron-500" /> {site.address.full}</p>
            <p className="flex gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-saffron-500" /> <a href={site.phoneHref} className="font-semibold text-navy-900">{site.phone}</a></p>
            <p className="flex gap-3"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-saffron-500" /> <a href={`mailto:${site.email}`} className="font-semibold text-navy-900">{site.email}</a></p>
            <p className="flex gap-3"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-saffron-500" /> {site.hours}</p>
          </address>
          <ul className="mt-6 divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white">
            {desks.map((d) => (
              <li key={d.role} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <span className="font-semibold text-navy-900">{d.role}</span>
                <span className="text-ink-muted">
                  <a href={`tel:${d.phone.replace(/\s/g, '')}`} className="hover:text-saffron-600">{d.phone}</a>
                  {' · '}
                  <a href={`mailto:${d.email}`} className="hover:text-saffron-600">{d.email}</a>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 overflow-hidden rounded-2xl border border-navy-100 shadow-card">
            <iframe title="QISCET on Google Maps" src={site.mapEmbed} className="h-72 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
          <p className="mt-3 text-sm"><a href={site.mapLink} className="font-semibold text-navy-800 underline decoration-saffron-400 underline-offset-4" target="_blank" rel="noopener noreferrer">Open in Google Maps</a> · <a href="/about/route-maps" className="font-semibold text-navy-800 underline decoration-saffron-400 underline-offset-4">Route maps from the railway station, bus stand and post office</a></p>
        </div>
      </section>
    </>
  );
}
