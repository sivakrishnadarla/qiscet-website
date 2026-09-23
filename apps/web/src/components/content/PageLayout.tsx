import PageHero from '@/components/ui/PageHero';
import type { Crumb } from '@/components/ui/Breadcrumbs';
import SectionSidebar, { type SideLink } from '@/components/content/SectionSidebar';
import CtaBand from '@/components/ui/CtaBand';

export default function PageLayout({ title, subtitle, crumbs, sidebarTitle, sidebarLinks, image, children, aside, cta = true }: {
  title: string; subtitle?: string; crumbs: Crumb[]; sidebarTitle: string; sidebarLinks: SideLink[]; image?: string; children: React.ReactNode; aside?: React.ReactNode; cta?: boolean;
}) {
  return (
    <>
      <PageHero title={title} subtitle={subtitle} crumbs={crumbs} image={image} compact />
      <div className="container-x py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="order-2 lg:order-1">
            <SectionSidebar title={sidebarTitle} links={sidebarLinks} />
            {aside}
          </div>
          <article className="order-1 min-w-0 lg:order-2">{children}</article>
        </div>
      </div>
      {cta ? <CtaBand /> : null}
    </>
  );
}
