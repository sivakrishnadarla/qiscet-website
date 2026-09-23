'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Phone } from 'lucide-react';
import { heroSlides, site } from '@/data/site';

const AUTOPLAY_MS = 6000;

function CtaLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  if (href.startsWith('http://') || href.startsWith('https://')) return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{children}</a>;
  return <Link href={href} className={className}>{children}</Link>;
}

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = heroSlides.length;

  const go = useCallback((d: number) => setI((c) => (c + d + n) % n), [n]);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => go(1), AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, go]);

  // touch swipe
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    startX.current = null;
  };

  return (
    <section className="relative isolate h-[560px] overflow-hidden bg-navy-950 text-white sm:h-[600px] lg:h-[680px]" aria-roledescription="carousel" aria-label="Highlights" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {heroSlides.map((s, idx) => (
        <div key={s.title} className={clsx('absolute inset-0 transition-opacity duration-1000', idx === i ? 'opacity-100' : 'pointer-events-none opacity-0')} aria-hidden={idx !== i} role="group" aria-roledescription="slide" aria-label={`${idx + 1} of ${n}`}>
          <Image src={s.image} alt={s.title} fill priority={idx === 0} sizes="100vw" className={clsx('object-cover transition-transform duration-[7000ms] ease-out', idx === i ? 'scale-105' : 'scale-100')} />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-900/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
        </div>
      ))}

      <div className="container-x relative flex h-full flex-col justify-center pb-20 pt-10">
        <div className="max-w-2xl">
          <p key={`e-${i}`} className="animate-fadeUp inline-flex items-center gap-2 rounded-full border border-saffron-400/50 bg-saffron-500/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-saffron-300 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-saffron-400" /> {heroSlides[i].eyebrow}
          </p>
          <h1 key={`t-${i}`} className="mt-5 animate-fadeUp font-display text-4xl font-extrabold leading-[1.08] text-white [animation-delay:80ms] sm:text-5xl lg:text-6xl">{heroSlides[i].title}</h1>
          <p key={`p-${i}`} className="mt-5 max-w-xl animate-fadeUp text-base leading-7 text-navy-100 [animation-delay:160ms] sm:text-lg">{heroSlides[i].text}</p>
          <div key={`c-${i}`} className="mt-8 flex flex-wrap gap-3 animate-fadeUp [animation-delay:240ms]">
            <CtaLink href={heroSlides[i].cta.href} className="btn-primary btn-lg">
              {heroSlides[i].cta.label} <ArrowRight className="h-4 w-4" />
            </CtaLink>
            <CtaLink href={heroSlides[i].cta2.href} className="btn-ghost-light btn-lg">{heroSlides[i].cta2.label}</CtaLink>
            <a href={site.admissionsPhoneHref} className="btn-ghost-light btn-lg hidden sm:inline-flex"><Phone className="h-4 w-4" /> {site.admissionsPhone}</a>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="container-x absolute inset-x-0 bottom-6 flex items-center justify-between">
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
          {heroSlides.map((s, idx) => (
            <button key={s.title} role="tab" aria-selected={idx === i} aria-label={`Slide ${idx + 1}: ${s.title}`} onClick={() => setI(idx)} className={clsx('h-1.5 rounded-full transition-all', idx === i ? 'w-10 bg-saffron-500' : 'w-4 bg-white/40 hover:bg-white/70')} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPaused((p) => !p)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur hover:bg-white/20" aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}>
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
          <button type="button" onClick={() => go(-1)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur hover:bg-white/20" aria-label="Previous slide">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => go(1)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur hover:bg-white/20" aria-label="Next slide">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
