import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/site';
import { getPageIndexResolved, publishedDocuments } from '@/lib/cms/public';
import { hubCopy } from '@/data/hubs';
import { feedbackKinds } from '@/data/feedback';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPaths = ['', '/apply', '/enquiry', '/contact', '/grievance', '/gallery', '/news', '/blog', '/feedback', '/privacy-policy', ...Object.keys(hubCopy).map((s) => '/' + s), ...feedbackKinds.map((k) => '/feedback/' + k.slug), '/admissions/b-category-application'];
  const index = await getPageIndexResolved();
  const cms = await publishedDocuments();
  const updated = new Map(cms.filter((d) => !d.seo.noIndex).map((d) => ['/' + d.slug, d.seo.dateModified || d.updatedAt]));
  const content = index.filter((p) => !cms.find((d) => d.slug === p.slug && d.seo.noIndex)).map((p) => '/' + p.slug);
  const urls = Array.from(new Set([...staticPaths, ...content]));
  return urls.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: updated.get(path) ? new Date(updated.get(path) as string) : now,
    changeFrequency: path === '' || path === '/news' || path === '/blog' || path === '/admissions' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path.split('/').length === 2 ? 0.8 : 0.6,
  }));
}
