'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { branchOptions, districtOptions, entryTypeOptions, interGroupOptions, programmeOptions } from '@/data/options';
import { isValidEmail, isValidIndianMobile, submitForm } from '@/lib/forms';
import { ErrorNote, Field, SuccessCard } from './FormShell';

const initial = {
  studentName: '', mobileNumber: '', email: '', level: 'UG', entryType: 'EAPCET (Regular)', rank: '', interGroup: '', branch: '', programme: '',
  district: '', city: '', parentName: '', parentMobile: '', message: '', consent: true, website: '',
};

export default function ApplyForm() {
  const [form, setForm] = useState(initial);
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [error, setError] = useState('');
  const [refId, setRefId] = useState<string | undefined>();

  const set = (k: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.studentName.trim().length < 3) return setError('Please enter the student’s full name.');
    if (!isValidIndianMobile(form.mobileNumber)) return setError('Please enter a valid 10-digit mobile number.');
    if (form.email && !isValidEmail(form.email)) return setError('Please enter a valid email address.');
    if (form.level === 'UG' && !form.branch) return setError('Please choose the B.Tech branch you wish to apply for.');
    if (form.level !== 'UG' && !form.programme) return setError('Please choose the programme you wish to apply for.');
    if (!form.district) return setError('Please choose your district.');
    setState('busy');
    const res = await submitForm('applications', { ...form, programme: form.level === 'UG' ? `B.Tech – ${form.branch}` : form.programme, source: 'apply-now' });
    if (res.ok) {
      setRefId(res.id);
      setState('done');
    } else {
      setState('idle');
      setError(res.error);
    }
  }

  if (state === 'done') {
    return <SuccessCard title="Application received!" text={`Thank you ${form.studentName}. Your online application for ${form.level === 'UG' ? `B.Tech – ${form.branch}` : form.programme} has been registered. Our admissions office will contact you on ${form.mobileNumber} with the next steps and document checklist.`} refId={refId} />;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6" aria-label="Online application form">
      <input type="text" name="website" value={form.website} onChange={set('website')} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

      <fieldset className="space-y-4">
        <legend className="font-display text-base font-extrabold text-navy-900">1. Student details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="studentName" label="Student name" required>
            <input id="studentName" className="input" value={form.studentName} onChange={set('studentName')} autoComplete="name" placeholder="As per SSC certificate" />
          </Field>
          <Field id="mobileNumber" label="Mobile number" required hint="We will WhatsApp / call this number.">
            <input id="mobileNumber" className="input" inputMode="numeric" value={form.mobileNumber} onChange={set('mobileNumber')} autoComplete="tel" placeholder="10-digit mobile" />
          </Field>
          <Field id="email" label="Email">
            <input id="email" type="email" className="input" value={form.email} onChange={set('email')} autoComplete="email" placeholder="you@example.com" />
          </Field>
          <Field id="district" label="District" required>
            <select id="district" className="input" value={form.district} onChange={set('district')}>
              <option value="">Select district</option>
              {districtOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field id="city" label="Town / Village">
            <input id="city" className="input" value={form.city} onChange={set('city')} placeholder="e.g. Ongole" />
          </Field>
          <Field id="parentName" label="Parent / Guardian name">
            <input id="parentName" className="input" value={form.parentName} onChange={set('parentName')} />
          </Field>
          <Field id="parentMobile" label="Parent mobile">
            <input id="parentMobile" className="input" inputMode="numeric" value={form.parentMobile} onChange={set('parentMobile')} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-base font-extrabold text-navy-900">2. Programme</legend>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Level">
          {[
            ['UG', 'B.Tech'],
            ['PG', 'M.Tech'],
            ['MGMT', 'MBA / MCA / BCA'],
          ].map(([v, l]) => (
            <label key={v} className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition ${form.level === v ? 'border-saffron-500 bg-saffron-500 text-white' : 'border-navy-200 text-navy-800 hover:border-navy-800'}`}>
              <input type="radio" name="level" value={v} checked={form.level === v} onChange={set('level')} className="sr-only" />
              {l}
            </label>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {form.level === 'UG' ? (
            <>
              <Field id="branch" label="B.Tech branch" required>
                <select id="branch" className="input" value={form.branch} onChange={set('branch')}>
                  <option value="">Select branch</option>
                  {branchOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field id="entryType" label="Entry type" required>
                <select id="entryType" className="input" value={form.entryType} onChange={set('entryType')}>
                  {entryTypeOptions.filter((o) => !o.startsWith('ICET') && !o.startsWith('PGECET')).map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field id="rank" label="EAPCET / ECET rank" hint="Leave blank if results are awaited.">
                <input id="rank" className="input" inputMode="numeric" value={form.rank} onChange={set('rank')} placeholder="e.g. 45210" />
              </Field>
              <Field id="interGroup" label="Intermediate / Diploma group">
                <select id="interGroup" className="input" value={form.interGroup} onChange={set('interGroup')}>
                  <option value="">Select group</option>
                  {interGroupOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
            </>
          ) : (
            <>
              <Field id="programme" label="Programme" required>
                <select id="programme" className="input" value={form.programme} onChange={set('programme')}>
                  <option value="">Select programme</option>
                  {programmeOptions.filter((g) => (form.level === 'PG' ? g.group.startsWith('M.Tech') : g.group.startsWith('Management'))).flatMap((g) => g.options).map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field id="entryType" label="Entry type" required>
                <select id="entryType" className="input" value={form.entryType} onChange={set('entryType')}>
                  {(form.level === 'PG' ? ['PGECET / GATE (M.Tech)', 'Management Quota (B-Category)', 'Other'] : ['ICET (MBA/MCA)', 'Management Quota (B-Category)', 'Other']).map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field id="rank" label="Entrance rank / score">
                <input id="rank" className="input" value={form.rank} onChange={set('rank')} />
              </Field>
            </>
          )}
          <div className="sm:col-span-2">
            <Field id="message" label="Anything else we should know?">
              <textarea id="message" className="input min-h-[90px]" value={form.message} onChange={set('message')} placeholder="Hostel required, scholarship queries, preferred call time…" />
            </Field>
          </div>
        </div>
      </fieldset>

      <label className="flex items-start gap-2 text-xs text-ink-muted">
        <input type="checkbox" checked={form.consent} onChange={set('consent')} className="mt-0.5 h-4 w-4 rounded border-navy-300 text-saffron-500 focus:ring-saffron-500" />
        <span>I confirm the above details are correct and agree to be contacted by QISCET regarding my application.</span>
      </label>
      <ErrorNote error={error} />
      <button type="submit" disabled={state === 'busy' || !form.consent} className="btn-primary btn-lg w-full sm:w-auto">
        {state === 'busy' ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {state === 'busy' ? 'Submitting application…' : 'Submit Application'}
      </button>
    </form>
  );
}
