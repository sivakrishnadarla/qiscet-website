'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { isValidEmail, isValidIndianMobile, submitForm } from '@/lib/forms';
import { ErrorNote, Field, SuccessCard } from './FormShell';

const categories = ['Academic', 'Examination / Evaluation', 'Hostel', 'Transport', 'Fee / Scholarship', 'Ragging', 'Harassment (ICC)', 'SC/ST Cell', 'Infrastructure', 'Library', 'Staff behaviour', 'Other'];
const roles = ['Student', 'Parent', 'Alumni', 'Faculty / Staff', 'Other'];

export default function GrievanceForm() {
  const [form, setForm] = useState({ name: '', role: 'Student', rollNumber: '', department: '', email: '', mobile: '', category: 'Academic', subject: '', details: '', anonymous: false, website: '' });
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [error, setError] = useState('');
  const [refId, setRefId] = useState<string | undefined>();
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.anonymous && form.name.trim().length < 2) return setError('Please enter your name (or choose anonymous).');
    if (!form.anonymous && !isValidEmail(form.email) && !isValidIndianMobile(form.mobile)) return setError('Please give an email or mobile so we can update you.');
    if (form.subject.trim().length < 5) return setError('Please add a short subject.');
    if (form.details.trim().length < 20) return setError('Please describe the grievance in a little more detail (20+ characters).');
    setState('busy');
    const res = await submitForm('grievance', form);
    if (res.ok) {
      setRefId(res.id);
      setState('done');
    } else {
      setState('idle');
      setError(res.error);
    }
  }

  if (state === 'done') return <SuccessCard title="Grievance registered" text="Your grievance has been forwarded to the Grievance Redressal Cell. You will receive an acknowledgement and a resolution update within 7 working days." refId={refId} />;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4" aria-label="Online grievance form">
      <input type="text" name="website" value={form.website} onChange={set('website')} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <label className="flex items-center gap-2 rounded-xl border border-navy-100 bg-navy-50 px-4 py-3 text-sm font-medium text-navy-900">
        <input type="checkbox" checked={form.anonymous} onChange={set('anonymous')} className="h-4 w-4 rounded border-navy-300 text-saffron-500" />
        Submit anonymously (you will not receive status updates)
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        {!form.anonymous ? (
          <>
            <Field id="g-name" label="Name" required><input id="g-name" className="input" value={form.name} onChange={set('name')} /></Field>
            <Field id="g-role" label="I am a" required><select id="g-role" className="input" value={form.role} onChange={set('role')}>{roles.map((r) => <option key={r}>{r}</option>)}</select></Field>
            <Field id="g-roll" label="Roll number / Employee ID"><input id="g-roll" className="input" value={form.rollNumber} onChange={set('rollNumber')} /></Field>
            <Field id="g-dept" label="Department"><input id="g-dept" className="input" value={form.department} onChange={set('department')} /></Field>
            <Field id="g-email" label="Email"><input id="g-email" type="email" className="input" value={form.email} onChange={set('email')} /></Field>
            <Field id="g-mobile" label="Mobile"><input id="g-mobile" className="input" inputMode="numeric" value={form.mobile} onChange={set('mobile')} /></Field>
          </>
        ) : null}
        <Field id="g-cat" label="Category" required><select id="g-cat" className="input" value={form.category} onChange={set('category')}>{categories.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field id="g-subject" label="Subject" required><input id="g-subject" className="input" value={form.subject} onChange={set('subject')} /></Field>
        <div className="sm:col-span-2">
          <Field id="g-details" label="Describe the grievance" required hint="Include dates, places and people involved where relevant."><textarea id="g-details" className="input min-h-[140px]" value={form.details} onChange={set('details')} /></Field>
        </div>
      </div>
      <ErrorNote error={error} />
      <button type="submit" disabled={state === 'busy'} className="btn-primary btn-lg">
        {state === 'busy' ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {state === 'busy' ? 'Submitting…' : 'Submit Grievance'}
      </button>
    </form>
  );
}
