import Image from 'next/image';
import Breadcrumbs, { type Crumb } from './Breadcrumbs';

export default function PageHero({ title, subtitle, crumbs, image = '/images/images/office.jpg', compact = false, children }: {
  title: string; subtitle?: string; crumbs: Crumb[]; image?: string; compact?: boolean; children?: React.ReactNode;
}) {
  return (
    <section className={`relative isolate overflow-hidden bg-navy-900 text-white ${compact ? 'py-10 md:py-14' : 'py-14 md:py-20'}`}>
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-30 mix-blend-luminosity" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/95 to-navy-800/80" aria-hidden />
      <div className="absolute inset-0 bg-grid bg-[size:32px_32px] opacity-40" aria-hidden />
      <div className="container-x relative">
        <Breadcrumbs items={crumbs} light />
        <h1 className="mt-4 max-w-4xl font-display text-3xl font-extrabold leading-tight text-white md:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-4 max-w-3xl text-base leading-7 text-navy-100 md:text-lg">{subtitle}</p> : null}
        {children}
      </div>
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-saffron-500/20 blur-3xl" aria-hidden />
    </section>
  );
}
