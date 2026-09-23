'use client';

import { useEffect, useState } from 'react';
import { GraduationCap, X } from 'lucide-react';

const WIDGET_SRC = 'https://setsetu.vercel.app/widget/3';

/** Seat Setu admissions assistant — floating launcher that opens the chat widget. */
export default function SeatSetuWidget() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load the iframe only after the first open (keeps every page fast).
  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  return (
    <>
      {open ? (
        <div
          className="fixed inset-x-3 bottom-20 z-50 flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-lift md:inset-x-auto md:bottom-24 md:right-6 md:w-[380px]"
          style={{ height: 'min(600px, calc(100dvh - 140px))' }}
          role="dialog"
          aria-label="Seat Setu admissions assistant"
        >
          <div className="flex items-center justify-between bg-navy-900 px-4 py-2.5 text-white">
            <p className="flex items-center gap-2 text-sm font-bold">
              <GraduationCap className="h-4 w-4 text-saffron-400" /> Seat Setu · Admissions Assistant
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close Seat Setu chat"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {mounted ? (
            <iframe src={WIDGET_SRC} className="h-full w-full flex-1 border-0 bg-white" title="Admissions chat" />
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close Seat Setu admissions assistant' : 'Open Seat Setu admissions assistant'}
        className="fixed bottom-20 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-saffron-500 to-saffron-600 text-white shadow-lift transition hover:scale-105 md:bottom-6 md:right-6"
      >
        {open ? <X className="h-6 w-6" /> : <GraduationCap className="h-6 w-6" />}
        {!open ? <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" aria-hidden="true" /> : null}
      </button>
    </>
  );
}
