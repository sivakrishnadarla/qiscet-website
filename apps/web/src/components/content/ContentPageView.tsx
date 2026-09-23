import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Mail, Phone } from 'lucide-react';
import PageLayout from '@/components/content/PageLayout';
import ContentRenderer from '@/components/content/ContentRenderer';
import AeoExtras from '@/components/content/AeoExtras';
import JsonLd from '@/components/seo/JsonLd';
import { courseJsonLd, webPageJsonLd } from '@/lib/seo';
import { publicAeoJsonLd } from '@/lib/cms/aeo';
import { publishedDocuments, sectionExtras } from '@/lib/cms/public';
import { sectionNav } from '@/data/navigation';
import { SITE_URL, site } from '@/data/site';
import { getDepartment, getPagesBySection, type ContentPage } from '@/lib/content';

const EMPTY_COPY: Record<string, string> = {
  'examinations/notifications':
    'Examination notifications are issued by the Controller of Examinations before every mid and end-semester spell. Please check back during the examination season, or sign in to the results portal for the latest circulars.',
  'examinations/time-tables':
    'End-semester and internal time tables are published here before each examination spell. For the schedule currently in force, contact the Examination Cell or open the results portal.',
  'facilities/physical-education/gallery':
    'The sports photo gallery is being refreshed. Explore the Physical Education page and the campus gallery in the meantime.',
  'about/qis-fest-gallery':
    'QIS FEST highlights, schedules and registrations live on the official fest website. Campus event photographs are also in the photo gallery.',
};

function usefulBlocks(page: ContentPage) {
  return page.blocks.filter((b) => {
    if (b.type === 'paragraph' && b.text.replace(/[^a-z0-9]/gi, '').length < 2) return false;
    return true;
  });
}

export default async function ContentPageView({ page, preview = false }: { page: ContentPage; preview?: boolean }) {
  const dept = page.department ? getDepartment(page.department) : undefined;
  const baseLinks = dept
    ? [{ label: 'About the Department', href: `/departments/${dept.slug}` }, ...dept.subpages.map((s) => ({ label: s.label, href: `/departments/${dept.slug}/${s.slug}` }))]
    : sectionNav[page.section] || getPagesBySection(page.section).map((p) => ({ label: p.title, href: '/' + p.slug }));
  const extras = await sectionExtras(page.section, baseLinks).catch(() => []);
  const blogLinks = page.section === 'blog'
    ? [{ label: 'All posts', href: '/blog' }, ...(await publishedDocuments('blog').catch(() => [])).map((p) => ({ label: p.title, href: '/' + p.slug }))]
    : [];
  const sectionLinks = page.section === 'blog' ? blogLinks : [...baseLinks, ...extras];

  const crumbs = [
    { name: page.sectionTitle, href: '/' + page.section },
    ...(dept && !page.isDepartmentHome ? [{ name: dept.short, href: `/departments/${dept.slug}` }] : []),
    { name: page.pageTitle || page.title, href: '/' + page.slug },
  ];
  // drop duplicate last crumb name if it repeats the section (root pages)
  if (crumbs.length > 1 && crumbs[crumbs.length - 1].href === crumbs[crumbs.length - 2].href) crumbs.pop();

  const blocks = usefulBlocks(page);
  const description = page.summary || `${page.title} at ${site.shortName}, Ongole.`;

  return (
    <>
      {preview ? <p className="bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-950">Draft preview — visitors cannot see this until you publish.</p> : null}
      {page.aeo ? (
        <JsonLd data={publicAeoJsonLd({ slug: page.slug, title: page.title, description, coverImage: page.coverImage || page.aeo.ogImage, kind: page.section === 'blog' ? 'blog' : 'page', aeo: page.aeo }, SITE_URL)} />
      ) : (
        <JsonLd data={webPageJsonLd(page.title, description, '/' + page.slug)} />
      )}
      {page.isDepartmentHome && dept ? (
        <JsonLd data={courseJsonLd(dept.name, dept.intro || description, `/departments/${dept.slug}`, dept.courses.some((c) => /m\.tech|mba|mca/i.test(c.course)) ? 'Undergraduate and Postgraduate' : 'Undergraduate')} />
      ) : null}
      <PageLayout
        title={page.isDepartmentHome && dept ? dept.name : page.title}
        subtitle={page.isDepartmentHome && dept ? dept.intro || undefined : page.summary || undefined}
        crumbs={crumbs.slice(0, -1)}
        sidebarTitle={dept ? dept.short : page.sectionTitle}
        sidebarLinks={sectionLinks}
        image={page.section === 'facilities' ? '/images/images/hostel1.jpg' : page.section === 'placements' ? '/images/images/qiscetgal_3.jpg' : '/images/images/office.jpg'}
      >
        {dept && page.isDepartmentHome ? <DepartmentFacts slug={dept.slug} /> : null}
        {dept?.news && page.isDepartmentHome ? (
          <p className="mb-6 rounded-xl border border-saffron-200 bg-saffron-50 px-4 py-3 text-sm font-medium text-navy-900">
            <span className="mr-2 rounded bg-saffron-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Dept. news</span>
            {dept.news}
          </p>
        ) : null}
        <AeoExtras page={page} placement="before" />
        {page.coverImage ? (
          <Image src={page.coverImage} alt={page.coverAlt || page.title} width={1200} height={680} className="mb-6 max-h-[420px] w-full rounded-2xl object-cover" unoptimized />
        ) : null}
        {blocks.length ? (
          <ContentRenderer blocks={blocks} />
        ) : page.aeo?.llmSummary ? null : (
          <EmptyNotice slug={page.slug} />
        )}
        <AeoExtras page={page} placement="after" />
        {page.legacy ? (
          <p className="mt-10 text-xs text-ink-muted">
            Source document on the previous website:{' '}
            <a href={page.legacy} className="inline-flex items-center gap-1 underline decoration-saffron-400 underline-offset-2" target="_blank" rel="noopener noreferrer">
              {page.legacy.replace('https://', '')} <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        ) : null}
      </PageLayout>
    </>
  );
}

function DepartmentFacts({ slug }: { slug: string }) {
  const dept = getDepartment(slug);
  if (!dept) return null;
  const hod = dept.hod;
  const phone = hod?.phone?.replace(/\s/g, '');
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2">
      {hod?.name ? (
        <div className="rounded-2xl border border-navy-100 bg-navy-50/60 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-600">Head of Department</p>
          <p className="mt-1 font-display text-lg font-extrabold text-navy-900">{hod.name}</p>
          <p className="text-sm text-ink-muted">{[hod.designation, hod.qualification].filter(Boolean).join(' · ')}</p>
          <ul className="mt-3 space-y-1 text-sm">
            {hod.email ? (
              <li><a className="inline-flex items-center gap-1.5 text-navy-800 hover:text-saffron-600" href={`mailto:${hod.email}`}><Mail className="h-3.5 w-3.5" /> {hod.email}</a></li>
            ) : null}
            {phone ? (
              <li><a className="inline-flex items-center gap-1.5 text-navy-800 hover:text-saffron-600" href={`tel:${phone}`}><Phone className="h-3.5 w-3.5" /> {hod.phone}</a></li>
            ) : null}
            {hod.experience ? <li className="text-ink-soft">Experience: {hod.experience}</li> : null}
          </ul>
          <Link href={`/departments/${dept.slug}/head-of-the-department`} className="mt-3 inline-block text-sm font-semibold text-navy-800 underline decoration-saffron-400 underline-offset-4">Full profile</Link>
        </div>
      ) : null}
      {dept.courses.length ? (
        <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-600">Programmes & intake</p>
          <ul className="mt-3 divide-y divide-navy-50">
            {dept.courses.map((c) => (
              <li key={c.course} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="text-navy-900">{c.course}</span>
                <span className="shrink-0 rounded-full bg-navy-900 px-2 py-0.5 text-[11px] font-bold text-white">{c.intake} seats</span>
              </li>
            ))}
          </ul>
          <Link href="/admissions/courses-offered" className="mt-3 inline-block text-sm font-semibold text-navy-800 underline decoration-saffron-400 underline-offset-4">All courses & intake</Link>
        </div>
      ) : null}
    </div>
  );
}

function EmptyNotice({ slug }: { slug: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-navy-200 bg-navy-50 p-6">
      <p className="text-sm leading-7 text-ink-soft">{EMPTY_COPY[slug] || 'This page is updated by the concerned office. Please use the links in this section, or contact the college if you need a document that used to live here.'}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a href={site.portals.results} className="btn-outline !py-2 text-xs" target="_blank" rel="noopener noreferrer">Results portal</a>
        <Link href="/contact" className="btn-secondary !py-2 text-xs">Contact the office</Link>
      </div>
    </div>
  );
}
