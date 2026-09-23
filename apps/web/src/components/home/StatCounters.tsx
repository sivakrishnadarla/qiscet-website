'use client';

import { useEffect, useRef, useState } from 'react';
import { stats } from '@/data/site';

function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1400;
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return <span ref={ref}>{prefix}{n}{suffix}</span>;
}

export default function StatCounters() {
  return (
    <section className="container-x mt-14" aria-label="QISCET at a glance">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-navy-100 shadow-card md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white px-4 py-6 text-center">
            <dd className="font-display text-3xl font-extrabold text-navy-900 md:text-4xl">
              <Counter value={s.value} prefix={'prefix' in s ? (s as { prefix?: string }).prefix : ''} suffix={s.suffix} />
            </dd>
            <dt className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink-muted">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
