'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { isValidEmail, isValidIndianMobile, submitForm } from '@/lib/forms';
import { ErrorNote, Field, SuccessCard } from './FormShell';

const topics = ['Admissions', 'Fees & Scholarships', 'Hostel & Transport', 'Examinations / Results', 'Placements & Training', 'Alumni', 'Recruitment / Careers', 'Vendor / Partnership', 'Other'];

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', topic: 'Admissions', message: '', website: '' });
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [error, setError] = useState('');
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 2) return setError('Please enter your name.');
    if (!isValidEmail(form.email)) return setError('Please enter a valid email address.');
    if (form.mobile && !isValidIndianMobile(form.mobile)) return setError('Please enter a valid 10-digit mobile number.');
    if (form.message.trim().length < 10) return setError('Please write a slightly longer message.');
    setState('busy');
    const res = await submitForm('contact', form);
    if (res.ok) setState('done');
    else {
      setState('idle');
      setError(res.error);
    }
  }

  if (state === 'done') return <SuccessCard title="Message sent" text="Thanks for reaching out. The relevant office will reply to your email within 1–2 working days." />;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4" aria-label="Contact form">
      <input type="text" name="website" value={form.website} onChange={set('website')} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="c-name" label="Your name" required><input id="c-name" className="input" value={form.name} onChange={set('name')} autoComplete="name" /></Field>
        <Field id="c-email" label="Email" required><input id="c-email" type="email" className="input" value={form.email} onChange={set('email')} autoComplete="email" /></Field>
        <Field id="c-mobile" label="Mobile"><input id="c-mobile" className="input" inputMode="numeric" value={form.mobile} onChange={set('mobile')} autoComplete="tel" /></Field>
        <Field id="c-topic" label="Topic" required>
          <select id="c-topic" className="input" value={form.topic} onChange={set('topic')}>{topics.map((t) => <option key={t}>{t}</option>)}</select>
        </Field>
        <div className="sm:col-span-2">
          <Field id="c-message" label="Message" required><textarea id="c-message" className="input min-h-[120px]" value={form.message} onChange={set('message')} /></Field>
        </div>
      </div>
      <ErrorNote error={error} />
      <button type="submit" disabled={state === 'busy'} className="btn-primary btn-lg">
        {state === 'busy' ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {state === 'busy' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
