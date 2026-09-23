import type { Metadata } from 'next';
import HeroSlider from '@/components/home/HeroSlider';
import NewsTicker from '@/components/home/NewsTicker';
import QuickLinks from '@/components/home/QuickLinks';
import StatCounters from '@/components/home/StatCounters';
import AboutIntro from '@/components/home/AboutIntro';
import ProgramsGrid from '@/components/home/ProgramsGrid';
import WhyQis from '@/components/home/WhyQis';
import PlacementsStrip from '@/components/home/PlacementsStrip';
import Leadership from '@/components/home/Leadership';
import NewsEvents from '@/components/home/NewsEvents';
import LatestPosts from '@/components/home/LatestPosts';
import CampusLife from '@/components/home/CampusLife';
import Faq from '@/components/home/Faq';
import EnquiryBand from '@/components/home/EnquiryBand';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata, webPageJsonLd } from '@/lib/seo';
import { site } from '@/data/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'Top Engineering College in Andhra Pradesh | QIS College of Engineering & Technology, Ongole',
  description: site.description,
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={webPageJsonLd('QIS College of Engineering & Technology, Ongole – Autonomous Engineering College', site.description, '/')} />
      <HeroSlider />
      <NewsTicker />
      <QuickLinks />
      <StatCounters />
      <AboutIntro />
      <ProgramsGrid />
      <WhyQis />
      <PlacementsStrip />
      <Leadership />
      <LatestPosts />
      <NewsEvents />
      <CampusLife />
      <Faq />
      <EnquiryBand />
    </>
  );
}
