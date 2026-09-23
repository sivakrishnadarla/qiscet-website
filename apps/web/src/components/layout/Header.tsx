'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ChevronDown, ChevronRight, ExternalLink, Mail, Menu, Phone, Search, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { mainNav, utilityNav, type NavItem } from '@/data/navigation';
import { site } from '@/data/site';

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

function SmartLink({ href, className, children, onClick, ...rest }: React.ComponentProps<typeof Link> & { href: string }) {
  if (isExternal(href)) {
    return (
      <a href={href} className={className as string} onClick={onClick as never} target="_blank" rel="noopener noreferrer" {...(rest as object)}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null);
        setMobile(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, []);

  const enter = (i: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(i);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 280);
  };

  return (
    <header className={clsx('sticky top-0 z-50 transition-shadow', scrolled && 'shadow-lift')}>
      {/* Utility bar */}
      <div className="hidden bg-navy-950 text-[13px] text-navy-100 lg:block">
        <div className="container-x flex h-9 items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-5">
            <a href={site.phoneHref} className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap hover:text-white">
              <Phone className="h-3.5 w-3.5 text-saffron-400" /> {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap hover:text-white">
              <Mail className="h-3.5 w-3.5 text-saffron-400" /> {site.email}
            </a>
            <span className="shrink-0 whitespace-nowrap rounded bg-white/10 px-2 py-0.5 font-semibold text-white">
              Counselling Code: <span className="text-saffron-300">{site.counsellingCode}</span>
            </span>
          </div>
          <ul className="flex items-center gap-4">
            {utilityNav.map((l) => (
              <li key={l.label}>
                <SmartLink href={l.href} className="inline-flex items-center gap-1 whitespace-nowrap hover:text-white">
                  {l.label}
                  {l.external ? <ExternalLink className="h-3 w-3 opacity-60" /> : null}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main bar — full college name beside the emblem; menu sits on its own row so it cannot cover the name */}
      <div ref={navRef} className="relative border-b border-navy-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="container-x flex min-h-[72px] items-center gap-3 py-2">
          <Logo className="flex-1 md:flex-none" />

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Link href="/search" className="hidden h-10 w-10 items-center justify-center rounded-full text-navy-800 hover:bg-navy-50 lg:inline-flex" aria-label="Search">
              <Search className="h-5 w-5" />
            </Link>
            <Link href="/apply" className="btn-primary hidden !px-4 sm:inline-flex">
              Apply Now
            </Link>
            <button type="button" onClick={() => setMobile(true)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy-100 text-navy-900 lg:hidden" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        <nav aria-label="Primary" className="hidden overflow-x-auto border-t border-navy-100 lg:block [scrollbar-width:none]">
          <ul className="container-x flex w-max min-w-full items-center justify-center gap-0.5">
            {mainNav.map((item, i) => (
              <li key={item.label} onMouseEnter={() => item.columns && enter(i)} onMouseLeave={() => item.columns && leave()}>
                {item.columns ? (
                  <button
                    type="button"
                    aria-expanded={open === i}
                    aria-haspopup="true"
                    onClick={() => setOpen(open === i ? null : i)}
                    className={clsx(
                      'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2.5 text-[13px] font-semibold text-navy-900 transition hover:bg-navy-50 hover:text-navy-700 xl:px-3.5 xl:text-sm',
                      open === i && 'bg-navy-50 text-navy-700',
                    )}
                  >
                    {item.label}
                    <ChevronDown className={clsx('h-3.5 w-3.5 shrink-0 transition', open === i && 'rotate-180')} />
                  </button>
                ) : (
                  <Link href={item.href!} className="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-2.5 text-[13px] font-semibold text-navy-900 hover:bg-navy-50 hover:text-navy-700 xl:px-3.5 xl:text-sm">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {open !== null && mainNav[open]?.columns ? (
          <MegaPanel item={mainNav[open]} onEnter={() => enter(open)} onLeave={leave} />
        ) : null}
      </div>

      {/* Mobile drawer */}
      <div className={clsx('fixed inset-0 z-[60] lg:hidden', mobile ? 'pointer-events-auto' : 'pointer-events-none')} aria-hidden={!mobile}>
        <div className={clsx('absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity', mobile ? 'opacity-100' : 'opacity-0')} onClick={() => setMobile(false)} />
        <div className={clsx('absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300', mobile ? 'translate-x-0' : 'translate-x-full')} role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex items-center justify-between border-b border-navy-100 p-4">
            <Logo className="[&_span]:hidden" />
            <span className="font-display text-base font-extrabold text-navy-900">Menu</span>
            <button type="button" onClick={() => setMobile(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-100" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <ul className="divide-y divide-navy-100">
              {mainNav.map((item, i) => (
                <li key={item.label}>
                  {item.columns ? (
                    <>
                      <button type="button" onClick={() => setMobileOpen(mobileOpen === i ? null : i)} className="flex w-full items-center justify-between px-2 py-3.5 text-left text-[15px] font-semibold text-navy-900" aria-expanded={mobileOpen === i}>
                        {item.label}
                        <ChevronDown className={clsx('h-5 w-5 transition', mobileOpen === i && 'rotate-180')} />
                      </button>
                      {mobileOpen === i ? (
                        <div className="space-y-4 pb-4 pl-2">
                          {item.columns.map((col) => (
                            <div key={col.heading}>
                              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-saffron-600">{col.heading}</p>
                              <ul className="space-y-0.5">
                                {col.links.map((l) => (
                                  <li key={l.href + l.label}>
                                    <SmartLink href={l.href} onClick={() => setMobile(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-ink-soft hover:bg-navy-50 hover:text-navy-900">
                                      <ChevronRight className="h-3.5 w-3.5 text-navy-300" /> {l.label}
                                      {l.badge ? <span className="ml-auto rounded bg-saffron-100 px-1.5 py-0.5 text-[10px] font-bold text-saffron-700">{l.badge}</span> : null}
                                    </SmartLink>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <Link href={item.href!} onClick={() => setMobile(false)} className="block px-2 py-3.5 text-[15px] font-semibold text-navy-900">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {utilityNav.map((l) => (
                <SmartLink key={l.label} href={l.href} onClick={() => setMobile(false)} className="rounded-lg border border-navy-100 px-3 py-2 text-center text-xs font-semibold text-navy-800">
                  {l.label}
                </SmartLink>
              ))}
            </div>
          </div>
          <div className="space-y-2 border-t border-navy-100 p-4">
            <Link href="/apply" className="btn-primary w-full" onClick={() => setMobile(false)}>Apply Now – Admissions 2026-27</Link>
            <a href={site.admissionsPhoneHref} className="btn-outline w-full"><Phone className="h-4 w-4" /> {site.admissionsPhone}</a>
          </div>
        </div>
      </div>
    </header>
  );
}

function MegaPanel({ item, onEnter, onLeave }: { item: NavItem; onEnter: () => void; onLeave: () => void }) {
  const cols = item.columns || [];
  const wide = cols.length >= 3;
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="absolute inset-x-0 top-full z-50 px-4 pt-2 animate-fadeUp"
    >
      <div className={clsx('mx-auto overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-lift', wide ? 'max-w-[1100px]' : 'max-w-[820px]')}>
        <div className={clsx('grid', item.featured ? (wide ? 'grid-cols-[1fr_1fr_1fr_260px]' : 'grid-cols-[1fr_1fr_260px]') : wide ? 'grid-cols-3' : 'grid-cols-2')}>
          {cols.map((col) => (
            <div key={col.heading} className="min-w-0 border-r border-navy-50 p-5 last:border-r-0 xl:p-6">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-600">{col.heading}</p>
              <ul className="space-y-1">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <SmartLink href={l.href} className="group flex items-start gap-2 rounded-lg px-2 py-1.5 text-[13.5px] text-ink-soft transition hover:bg-navy-50 hover:text-navy-900">
                      <ChevronRight className="mt-[3px] h-3.5 w-3.5 shrink-0 text-navy-300 transition group-hover:translate-x-0.5 group-hover:text-saffron-500" />
                      <span className="min-w-0">{l.label}</span>
                      {l.badge ? <span className="ml-auto rounded bg-saffron-100 px-1.5 py-0.5 text-[10px] font-bold text-saffron-700">{l.badge}</span> : null}
                      {l.external ? <ExternalLink className="ml-auto mt-1 h-3 w-3 opacity-50" /> : null}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {item.featured ? (
            <div className="bg-navy-gradient p-6 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-300">Highlight</p>
              <p className="mt-2 font-display text-lg font-extrabold leading-snug">{item.featured.title}</p>
              <p className="mt-2 text-sm leading-6 text-navy-100">{item.featured.text}</p>
              <SmartLink href={item.featured.href} className="btn-primary mt-4 !px-4 !py-2 text-xs">
                {item.featured.cta} <ChevronRight className="h-4 w-4" />
              </SmartLink>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
