import Link from 'next/link';
import { ArrowRight, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-7xl font-extrabold text-saffron-500">404</p>
      <h1 className="mt-4 text-2xl font-extrabold md:text-3xl">We couldn’t find that page</h1>
      <p className="mt-3 max-w-md text-ink-muted">The page may have moved during our website redesign. Try the search, or jump to one of the popular sections below.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-secondary"><Home className="h-4 w-4" /> Home</Link>
        <Link href="/search" className="btn-outline"><Search className="h-4 w-4" /> Search the site</Link>
        <Link href="/apply" className="btn-primary">Apply Now <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <ul className="mt-10 flex flex-wrap justify-center gap-2 text-sm">
        {[['Departments', '/departments'], ['Admissions', '/admissions'], ['Placements', '/placements'], ['Facilities', '/facilities/library'], ['Contact', '/contact']].map(([l, h]) => (
          <li key={h}><Link href={h} className="rounded-full border border-navy-100 px-3 py-1.5 text-navy-800 hover:border-saffron-400">{l}</Link></li>
        ))}
      </ul>
    </section>
  );
}
