'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, Phone, ShieldCheck } from 'lucide-react';
import { programmeOptions, districtOptions } from '@/data/options';
import { isValidIndianMobile, submitForm } from '@/lib/forms';
import { site } from '@/data/site';

type Props = { compact?: boolean; source?: string; title?: string; subtitle?: string; dark?: boolean; defaultProgramme?: string };

export default function EnquiryForm({ compact = false, source = 'enquiry', title = 'Get Free Admission Counselling', subtitle = 'Our admissions team calls you back within minutes.', dark = false, defaultProgramme = '' }: Props) {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', mobile: '', email: '', programme: defaultProgramme, district: '', message: '', consent: true, website: '' });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 2) return setError('Please enter your full name.');
    if (!isValidIndianMobile(form.mobile)) return setError('Please enter a valid 10-digit mobile number.');
    if (!form.programme) return setError('Please choose a programme you are interested in.');
    setState('busy');
    const res = await submitForm('leads', { ...form, type: 'enquiry', source });
    if (res.ok) setState('done');
    else {
      setState('error');
      setError(res.error);
    }
  }

  const inputCls = dark ? 'input !border-white/15 !bg-white/10 !text-white placeholder:!text-navy-200 focus:!border-saffron-400' : 'input';
  const labelCls = dark ? 'label !text-white' : 'label';

  if (state === 'done') {
    return (
      <div className={`rounded-2xl p-8 text-center ${dark ? 'bg-white/10 text-white' : 'bg-green-50 text-green-900'}`} role="status">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-3 font-display text-xl font-extrabold">Thank you, {form.name.split(' ')[0]}!</h3>
        <p className="mt-2 text-sm">Your enquiry has been received. Our admissions counsellor will call you shortly on {form.mobile}.</p>
        <a href={site.admissionsPhoneHref} className="btn-primary mt-5"><Phone className="h-4 w-4" /> Can’t wait? Call {site.admissionsPhone}</a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4" aria-label="Admission enquiry form">
      {title ? (
        <div>
          <h3 className={`font-display text-xl font-extrabold ${dark ? 'text-white' : 'text-navy-900'}`}>{title}</h3>
          {subtitle ? <p className={`mt-1 text-sm ${dark ? 'text-navy-100' : 'text-ink-muted'}`}>{subtitle}</p> : null}
        </div>
      ) : null}
      {/* Honeypot */}
      <input type="text" name="website" value={form.website} onChange={set('website')} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <div>
          <label htmlFor={`${source}-name`} className={labelCls}>Student name *</label>
          <input id={`${source}-name`} className={inputCls} placeholder="Full name" value={form.name} onChange={set('name')} autoComplete="name" required />
        </div>
        <div>
          <label htmlFor={`${source}-mobile`} className={labelCls}>Mobile number *</label>
          <input id={`${source}-mobile`} className={inputCls} placeholder="10-digit mobile" inputMode="numeric" value={form.mobile} onChange={set('mobile')} autoComplete="tel" required />
        </div>
        {!compact ? (
          <div>
            <label htmlFor={`${source}-email`} className={labelCls}>Email</label>
            <input id={`${source}-email`} type="email" className={inputCls} placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" />
          </div>
        ) : null}
        <div>
          <label htmlFor={`${source}-programme`} className={labelCls}>Programme interested in *</label>
          <select id={`${source}-programme`} className={inputCls} value={form.programme} onChange={set('programme')} required>
            <option value="">Select programme</option>
            {programmeOptions.map((g) => (
              <optgroup key={g.group} label={g.group} className="text-ink">
                {g.options.map((o) => (
                  <option key={o} value={o} className="text-ink">{o}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        {!compact ? (
          <div>
            <label htmlFor={`${source}-district`} className={labelCls}>District</label>
            <select id={`${source}-district`} className={inputCls} value={form.district} onChange={set('district')}>
              <option value="">Select district</option>
              {districtOptions.map((o) => (
                <option key={o} value={o} className="text-ink">{o}</option>
              ))}
            </select>
          </div>
        ) : null}
        {!compact ? (
          <div className="sm:col-span-2">
            <label htmlFor={`${source}-message`} className={labelCls}>Message (optional)</label>
            <textarea id={`${source}-message`} className={`${inputCls} min-h-[84px]`} placeholder="Your rank, questions about fees, hostel, scholarships…" value={form.message} onChange={set('message')} />
          </div>
        ) : null}
      </div>
      <label className={`flex items-start gap-2 text-xs ${dark ? 'text-navy-100' : 'text-ink-muted'}`}>
        <input type="checkbox" checked={form.consent} onChange={set('consent')} className="mt-0.5 h-4 w-4 rounded border-navy-300 text-saffron-500 focus:ring-saffron-500" />
        <span>I agree to be contacted by QISCET via call, SMS, WhatsApp or email regarding admissions.</span>
      </label>
      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p> : null}
      <button type="submit" disabled={state === 'busy' || !form.consent} className="btn-primary w-full btn-lg">
        {state === 'busy' ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {state === 'busy' ? 'Submitting…' : 'Request a Call Back'}
      </button>
      <p className={`flex items-center justify-center gap-1.5 text-[11px] ${dark ? 'text-navy-200' : 'text-ink-muted'}`}>
        <ShieldCheck className="h-3.5 w-3.5" /> Your details are safe with us. No spam, ever.
      </p>
    </form>
  );
}
