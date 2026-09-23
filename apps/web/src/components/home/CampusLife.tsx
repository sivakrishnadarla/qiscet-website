import Link from 'next/link';
import { ArrowRight, PlayCircle } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Gallery from '@/components/content/Gallery';
import { campusLife, site } from '@/data/site';

export default function CampusLife() {
  return (
    <section className="section bg-navy-50/60">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Life @ QIS" title="A campus that feels like a community" text="From QIS FEST and Smart India Hackathon to NSS camps, sports laurels and hostel life — there is always something happening." />
          <div className="flex shrink-0 gap-3">
            <a href={site.videos.campusTour} target="_blank" rel="noopener noreferrer" className="btn-secondary"><PlayCircle className="h-4 w-4" /> Campus Tour</a>
            <Link href="/gallery" className="btn-outline">Gallery <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
        <Gallery images={campusLife} columns={4} className="!my-10" />
      </div>
    </section>
  );
}
