import Image from 'next/image';
import Link from 'next/link';
import { Quote } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { leadership } from '@/data/site';

export default function Leadership() {
  return (
    <section className="section bg-cream">
      <div className="container-x">
        <SectionHeading align="center" eyebrow="Leadership" title="Guided by visionaries, driven by values" />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {leadership.map((p) => (
            <li key={p.name} className="card group relative overflow-hidden p-6 text-center transition hover:-translate-y-1 hover:shadow-lift">
              <div className="mx-auto h-36 w-36 overflow-hidden rounded-full ring-4 ring-saffron-100 transition group-hover:ring-saffron-400">
                <Image src={p.photo} alt={`Portrait of ${p.name}`} width={144} height={144} className="h-full w-full object-cover object-top" />
              </div>
              <h3 className="mt-5 font-display text-lg font-extrabold text-navy-900">{p.name}</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-saffron-600">{p.qualification}</p>
              <p className="mt-1 text-sm font-medium text-ink-muted">{p.role}</p>
              <Quote className="mx-auto mt-4 h-5 w-5 text-saffron-300" />
              <p className="mt-2 text-sm leading-6 text-ink-soft">{p.message}</p>
              <Link href={p.href} className="mt-4 inline-block text-sm font-semibold text-navy-800 underline decoration-saffron-400 decoration-2 underline-offset-4 hover:text-saffron-600">Read profile</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
