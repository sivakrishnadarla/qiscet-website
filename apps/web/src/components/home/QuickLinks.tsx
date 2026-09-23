import Link from 'next/link';
import { BookOpen, Building2, Briefcase, GraduationCap, Handshake, Images, PlayCircle, Trophy } from 'lucide-react';

const tiles = [
  { label: 'Courses & Intake', href: '/admissions/courses-offered', Icon: GraduationCap, text: '15 B.Tech · 7 M.Tech · MBA · MCA · BCA' },
  { label: 'Admission Procedure', href: '/admissions/procedure', Icon: BookOpen, text: 'EAPCET, ECET, ICET & B-Category' },
  { label: 'Placements', href: '/placements', Icon: Briefcase, text: '60+ recruiters · ₹15 LPA highest' },
  { label: 'Academic Toppers', href: '/examinations/toppers', Icon: Trophy, text: 'Branch-wise merit lists' },
  { label: 'Campus Tour', href: 'https://www.youtube.com/watch?v=dCgEyZbhCog', Icon: PlayCircle, text: 'Watch the 60-acre campus', external: true },
  { label: 'Photo Gallery', href: '/gallery', Icon: Images, text: 'Events, fest, labs & life @ QIS' },
  { label: 'MoUs & Industry', href: '/placements/mous', Icon: Handshake, text: '80+ industry & academic MoUs' },
  { label: 'Facilities', href: '/facilities/library', Icon: Building2, text: 'Library, hostels, transport & more' },
];

export default function QuickLinks() {
  return (
    <section className="container-x relative z-10 -mt-10 md:-mt-14" aria-label="Quick links">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map(({ label, href, Icon, text, external }) => {
          const inner = (
            <>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-800 transition group-hover:bg-saffron-500 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <span className="mt-3 block font-display text-sm font-extrabold text-navy-900 md:text-[15px]">{label}</span>
              <span className="mt-1 hidden text-xs text-ink-muted sm:block">{text}</span>
            </>
          );
          const cls = 'group block h-full rounded-2xl border border-navy-100 bg-white p-4 shadow-card transition hover:-translate-y-1 hover:border-saffron-300 hover:shadow-lift md:p-5';
          return (
            <li key={label}>
              {external ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
              ) : (
                <Link href={href} className={cls}>{inner}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
