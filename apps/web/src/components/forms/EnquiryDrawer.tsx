'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import EnquiryForm from './EnquiryForm';

export default function EnquiryDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={clsx('fixed inset-0 z-[70]', open ? 'pointer-events-auto' : 'pointer-events-none')} aria-hidden={!open}>
      <div className={clsx('absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity', open ? 'opacity-100' : 'opacity-0')} onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Enquire now"
        className={clsx('absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-300', open ? 'translate-x-0' : 'translate-x-full')}
      >
        <div className="flex items-center justify-between border-b border-navy-100 bg-navy-900 px-6 py-4 text-white">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-saffron-300">Admissions 2026-27</p>
            <p className="font-display text-lg font-extrabold">Enquire Now</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{open ? <EnquiryForm source="side-tab" title="" subtitle="" /> : null}</div>
      </aside>
    </div>
  );
}
