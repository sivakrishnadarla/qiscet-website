import type { Metadata } from 'next';
import { SITE_URL, site, accreditations, faqs } from '@/data/site';

export const DEFAULT_OG = '/images/images/office.jpg';

type MetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
  keywords?: string[];
};

export function buildMetadata({ title, description, path, image = DEFAULT_OG, type = 'website', noIndex, keywords }: MetaInput): Metadata {
  const url = `${SITE_URL}${path === '/' ? '' : path}`;
  const fullTitle = title.includes('QISCET') || title.includes('QIS College') ? title : `${title} | QISCET Ongole`;
  return {
    // absolute — the root layout template would otherwise append "| QISCET Ongole" a second time
    title: { absolute: fullTitle },
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: site.name,
      locale: 'en_IN',
      images: [{ url: image.startsWith('http') ? image : `${SITE_URL}${image}`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [image.startsWith('http') ? image : `${SITE_URL}${image}`] },
  };
}

/* ------------------------------------------------------------------ JSON-LD */
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['CollegeOrUniversity', 'EducationalOrganization'],
  '@id': `${SITE_URL}/#organization`,
  name: site.name,
  alternateName: [site.shortName, site.legalName],
  url: SITE_URL,
  logo: `${SITE_URL}/images/images/logo.jpg`,
  image: `${SITE_URL}${DEFAULT_OG}`,
  description: site.description,
  foundingDate: String(site.established),
  slogan: site.tagline,
  telephone: site.phone,
  email: site.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
  hasMap: site.mapLink,
  areaServed: ['Ongole', 'Prakasam District', 'Andhra Pradesh', 'India'],
  parentOrganization: { '@type': 'Organization', name: site.sponsor },
  memberOf: { '@type': 'Organization', name: site.affiliation, url: 'https://www.jntuk.edu.in/' },
  accreditedBy: accreditations.slice(0, 3).map((a) => ({ '@type': 'Organization', name: a.label })),
  award: ['NAAC A+ Grade', 'NBA Accreditation', 'NIRF Ranked (Engineering 201–300, 2025)', 'ISO 9001:2015'],
  sameAs: Object.values(site.social).filter(Boolean),
  contactPoint: [
    { '@type': 'ContactPoint', telephone: site.admissionsPhone, contactType: 'admissions', areaServed: 'IN', availableLanguage: ['en', 'te'] },
    { '@type': 'ContactPoint', telephone: site.phone, contactType: 'customer service', email: site.email, areaServed: 'IN' },
  ],
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '17:00' },
  ],
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: site.name,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-IN',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE_URL}${it.href}` })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[] = faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function courseJsonLd(name: string, description: string, path: string, level: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url: `${SITE_URL}${path}`,
    provider: { '@id': `${SITE_URL}/#organization` },
    educationalLevel: level,
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'onsite', location: { '@type': 'Place', name: site.name, address: site.address.full } },
    offers: { '@type': 'Offer', category: 'Full-time', availability: 'https://schema.org/InStock' },
  };
}

export function webPageJsonLd(name: string, description: string, path: string, type: string = 'WebPage') {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${SITE_URL}${path}#webpage`,
    url: `${SITE_URL}${path}`,
    name,
    description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-IN',
  };
}
