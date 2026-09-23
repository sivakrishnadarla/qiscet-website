import Link from 'next/link';
import Image from 'next/image';
import { Clock, ExternalLink, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import { site, accreditations, importantLinks } from '@/data/site';
import NewsletterForm from '@/components/forms/NewsletterForm';

const cols = [
  {
    heading: 'Quick Links',
    links: [
      { label: 'About QISCET', href: '/about/about-qiscet' },
      { label: 'Admissions 2026-27', href: '/admissions' },
      { label: 'Courses & Intake', href: '/admissions/courses-offered' },
      { label: 'Departments', href: '/departments' },
      { label: 'Placements', href: '/placements' },
      { label: 'Research & Development', href: '/research' },
      { label: 'Examinations', href: '/examinations' },
      { label: 'IQAC', href: '/iqac' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    heading: 'Campus & Facilities',
    links: [
      { label: 'Central Library', href: '/facilities/library' },
      { label: 'Hostel', href: '/facilities/hostel' },
      { label: 'Transport & Bus Routes', href: '/facilities/transport' },
      { label: 'Cafeteria & Food Court', href: '/facilities/food-court' },
      { label: 'Medical Facility', href: '/facilities/medical' },
      { label: 'Sports & Physical Education', href: '/facilities/physical-education' },
      { label: 'Mineral Water (RO Plant)', href: '/facilities/mineral-water' },
      { label: 'Bank ATM', href: '/facilities/bank-atm' },
      { label: 'E-Learning', href: '/facilities/e-resources' },
      { label: 'Photo Gallery', href: '/gallery' },
    ],
  },
  {
    heading: 'Students & Compliance',
    links: [
      { label: 'Student Login', href: site.portals.studentLogin, external: true },
      { label: 'Results', href: site.portals.results, external: true },
      { label: 'Exam Notifications', href: '/examinations/notifications' },
      { label: 'Academic Toppers', href: '/examinations/toppers' },
      { label: 'Anti-Ragging', href: '/governance/anti-ragging' },
      { label: 'Online Grievance', href: '/grievance' },
      { label: 'Feedback Forms', href: '/feedback' },
      { label: 'Mandatory Disclosure', href: '/about/mandatory-disclosure' },
      { label: 'Committees', href: '/governance/committees' },
      { label: 'Alumni', href: '/alumni' },
    ],
  },
];

export default function Footer() {
  const socials = [
    { href: site.social.facebook, Icon: Facebook, label: 'Facebook' },
    { href: site.social.instagram, Icon: Instagram, label: 'Instagram' },
    { href: site.social.youtube, Icon: Youtube, label: 'YouTube' },
    { href: site.social.linkedin, Icon: Linkedin, label: 'LinkedIn' },
    { href: site.social.twitter, Icon: Twitter, label: 'X (Twitter)' },
  ].filter((s) => !!s.href);

  return (
    <footer className="relative mt-16 bg-navy-950 text-navy-100" itemScope itemType="https://schema.org/CollegeOrUniversity">
      {/* Accreditation strip */}
      <div className="border-b border-white/10 bg-navy-900">
        <div className="container-x flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5 text-center">
          {accreditations.map((a) => (
            <Link key={a.code} href={a.href} className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-100 hover:text-white" title={a.label}>
              <span className="rounded border border-saffron-400/60 px-2 py-0.5 text-[11px] text-saffron-300 group-hover:bg-saffron-500 group-hover:text-white">{a.code}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="container-x grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        {/* NAP */}
        <div>
          <div className="flex items-center gap-3">
            <Image src="/images/images/logo.jpg" alt="QIS Educational Institutions emblem" width={64} height={64} className="h-16 w-16 rounded-full ring-2 ring-white/20" />
            <div>
              <p className="font-display text-lg font-extrabold text-white" itemProp="name">{site.name}</p>
              <p className="text-xs uppercase tracking-widest text-saffron-300">Autonomous · Est. {site.established} · {site.tagline}</p>
            </div>
          </div>
          <address className="mt-6 space-y-3 not-italic text-sm leading-6" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <p className="flex gap-3">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-saffron-400" />
              <span>
                <span itemProp="streetAddress">{site.address.street}</span>, <span itemProp="addressLocality">{site.address.locality}</span>,{' '}
                {site.address.district}, <span itemProp="addressRegion">{site.address.region}</span> – <span itemProp="postalCode">{site.address.postalCode}</span>, India
              </span>
            </p>
            <p className="flex gap-3">
              <Phone className="mt-1 h-4 w-4 shrink-0 text-saffron-400" />
              <span>
                <a href={site.phoneHref} className="hover:text-white" itemProp="telephone">{site.phone}</a> (Office) ·{' '}
                <a href={site.admissionsPhoneHref} className="hover:text-white">{site.admissionsPhone}</a> (Admissions)
              </span>
            </p>
            <p className="flex gap-3">
              <Mail className="mt-1 h-4 w-4 shrink-0 text-saffron-400" />
              <a href={`mailto:${site.email}`} className="hover:text-white" itemProp="email">{site.email}</a>
            </p>
            <p className="flex gap-3">
              <Clock className="mt-1 h-4 w-4 shrink-0 text-saffron-400" />
              <span>{site.hours}</span>
            </p>
          </address>
          <div className="mt-6 flex items-center gap-2">
            {socials.map(({ href, Icon, label }) => (
              <a key={label} href={href!} target="_blank" rel="noopener noreferrer" aria-label={label} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-navy-100 transition hover:border-saffron-400 hover:bg-saffron-500 hover:text-white">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <div className="mt-8">
            <p className="mb-2 text-sm font-bold text-white">Newsletter</p>
            <p className="mb-3 text-xs text-navy-200">Get admissions updates, events and campus news in your inbox.</p>
            <NewsletterForm />
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.heading}>
            <p className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-white">{c.heading}</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.label}>
                  {'external' in l && l.external ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-navy-100 transition hover:translate-x-0.5 hover:text-saffron-300">
                      {l.label} <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  ) : (
                    <Link href={l.href} className="inline-block text-navy-100 transition hover:translate-x-0.5 hover:text-saffron-300">{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Map + important links */}
      <div className="border-t border-white/10">
        <div className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-white">Important Links</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {importantLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-navy-100 hover:border-saffron-400 hover:text-white">
                    {l.label} <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                </li>
              ))}
              <li>
                <a href="https://qiscet.edu.in/qiscet/Mandatory%20Disclosure.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-navy-100 hover:border-saffron-400 hover:text-white">
                  Mandatory Disclosure (PDF) <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </li>
            </ul>
            <p className="mt-6 text-xs leading-6 text-navy-300">
              QIS College of Engineering & Technology is an Autonomous institution approved by AICTE, New Delhi and permanently affiliated to JNTU Kakinada. Accredited by NAAC (A+) and NBA · ISO 9001:2015 · NIRF ranked · Sponsored by {site.sponsor}.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <iframe
              title="QIS College of Engineering & Technology on Google Maps"
              src={site.mapEmbed}
              className="h-56 w-full grayscale-[30%] lg:h-full lg:min-h-[220px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/30">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-navy-300 md:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
            <Link href="/governance/anti-ragging" className="hover:text-white">Anti-Ragging</Link>
            <Link href="/grievance" className="hover:text-white">Grievance Redressal</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/admin" className="hover:text-white">Staff login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
