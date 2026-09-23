'use client';

import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { isValidEmail, submitForm } from '@/lib/forms';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setState('error');
      setMsg('Please enter a valid email address.');
      return;
    }
    setState('busy');
    const res = await submitForm('newsletter', { email });
    if (res.ok) {
      setState('done');
      setMsg('Subscribed! Watch your inbox for campus updates.');
    } else {
      setState('error');
      setMsg(res.error);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2" aria-label="Newsletter subscription">
      <div className="flex overflow-hidden rounded-full border border-white/15 bg-white/5 focus-within:border-saffron-400">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-navy-300 focus:outline-none" aria-label="Email address" required />
        <button type="submit" disabled={state === 'busy' || state === 'done'} className="inline-flex items-center gap-1 bg-saffron-500 px-4 text-sm font-bold text-white hover:bg-saffron-600 disabled:opacity-60" aria-label="Subscribe">
          {state === 'busy' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
      {msg ? <p className={`text-xs ${state === 'done' ? 'text-green-300' : 'text-red-300'}`} role="status">{msg}</p> : null}
    </form>
  );
}
