'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

export type GalleryImage = { src: string; alt: string; caption?: string };

export default function Gallery({ images, columns = 3, className = '' }: { images: GalleryImage[]; columns?: 2 | 3 | 4; className?: string }) {
  const [idx, setIdx] = useState<number | null>(null);
  const close = useCallback(() => setIdx(null), []);
  const prev = useCallback(() => setIdx((i) => (i === null ? null : (i - 1 + images.length) % images.length)), [images.length]);
  const next = useCallback(() => setIdx((i) => (i === null ? null : (i + 1) % images.length)), [images.length]);

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [idx, close, prev, next]);

  if (!images.length) return null;
  const colCls = columns === 4 ? 'sm:grid-cols-3 lg:grid-cols-4' : columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <>
      <div className={`not-prose my-6 grid grid-cols-2 gap-3 ${colCls} ${className}`}>
        {images.map((img, i) => (
          <button key={img.src + i} type="button" onClick={() => setIdx(i)} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-navy-50 shadow-sm focus-visible:ring-2 focus-visible:ring-saffron-500" aria-label={`Open image ${i + 1}${img.alt ? `: ${img.alt}` : ''}`}>
            <Image src={img.src} alt={img.alt || ''} fill sizes="(min-width:1024px) 320px, 50vw" className="object-cover transition duration-500 group-hover:scale-105" unoptimized />
            <span className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-navy-950/60 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
              <span className="truncate text-left text-[11px] font-medium text-white">{img.caption || img.alt}</span>
              <ZoomIn className="h-4 w-4 text-white" />
            </span>
          </button>
        ))}
      </div>

      {idx !== null ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/95 p-4" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={close}>
          <button type="button" onClick={close} className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
          {images.length > 1 ? (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:left-6" aria-label="Previous">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:right-6" aria-label="Next">
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          ) : null}
          <figure className="max-h-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[idx].src} alt={images[idx].alt || ''} className="max-h-[82vh] w-auto max-w-full rounded-xl object-contain shadow-2xl" />
            <figcaption className="mt-3 text-center text-sm text-navy-100">
              {images[idx].caption || images[idx].alt} <span className="ml-2 text-navy-300">{idx + 1} / {images.length}</span>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
