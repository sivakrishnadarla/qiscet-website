'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUp, MessageCircle, Phone, Send } from 'lucide-react';
import { site } from '@/data/site';
import EnquiryDrawer from '@/components/forms/EnquiryDrawer';

export default function FloatingActions() {
  const [top, setTop] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setDrawer(false), [pathname]);
  const hideEnquire = pathname === '/apply' || pathname === '/enquiry';

  return (
    <>
      {/* Side "Enquire Now" tab (desktop) */}
      {!hideEnquire ? (
        <button
          type="button"
          onClick={() => setDrawer(true)}
          className="fixed right-0 top-1/2 z-40 hidden h-36 w-10 -translate-y-1/2 items-center justify-center rounded-l-xl rounded-r-none bg-saffron-500 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-lift hover:bg-saffron-600 lg:flex"
        >
          <span className="-rotate-90 whitespace-nowrap">Enquire Now</span>
        </button>
      ) : null}

      {/* Mobile bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-navy-100 bg-white/95 backdrop-blur md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <a href={site.admissionsPhoneHref} className="flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-navy-900">
          <Phone className="h-5 w-5 text-saffron-500" /> Call
        </a>
        <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-navy-900">
          <MessageCircle className="h-5 w-5 text-green-600" /> WhatsApp
        </a>
        <Link href="/apply" className="flex flex-col items-center gap-0.5 bg-saffron-500 py-2 text-[11px] font-semibold text-white">
          <Send className="h-5 w-5" /> Apply Now
        </Link>
      </div>

      {/* WhatsApp bubble (desktop) */}
      <a
        href={site.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 left-6 z-40 hidden h-13 items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lift transition hover:scale-105 md:inline-flex"
      >
        <MessageCircle className="h-5 w-5" /> WhatsApp
      </a>

      {/* Back to top */}
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-36 right-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-navy-900 text-white shadow-lift transition md:bottom-24 md:right-6 ${top ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <EnquiryDrawer open={drawer} onClose={() => setDrawer(false)} />
    </>
  );
}
