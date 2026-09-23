'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { isValidIndianMobile, submitForm } from '@/lib/forms';
import { ErrorNote, Field, SuccessCard } from './FormShell';

const branches = ['CE', 'CSE', 'CSE (AI & ML)', 'AI & DS', 'AI', 'CSE (IoT & CSBT)', 'CSE (DS)', 'CSE (BS)', 'CSIT', 'ECE', 'EEE', 'ME', 'IT', 'QCE'];

const initial = {
  candidateName: '', guardianName: '', permanentAddress: '', correspondenceAddress: '', landline: '', mobile: '',
  overallPercentage: '', groupPercentage: '', jeeRank: '', eapcetRank: '',
  option1: '', option2: '', option3: '', bankName: '', bankBranch: '', ddNumber: '', ddDate: '', consent: true, website: '',
};

export default function BCategoryForm() {
  const [form, setForm] = useState(initial);
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [error, setError] = useState('');
  const [refId, setRefId] = useState<string | undefined>();
  const set = (k: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.candidateName.trim().length < 3) return setError('Please enter the candidate’s name.');
    if (!isValidIndianMobile(form.mobile)) return setError('Please enter a valid 10-digit mobile number.');
    if (!form.option1) return setError('Please choose at least the first branch preference.');
    setState('busy');
    const res = await submitForm('applications', {
      ...form,
      level: 'UG',
      entryType: 'Management Quota (B-Category)',
      studentName: form.candidateName,
      mobileNumber: form.mobile,
      programme: `B.Tech – ${form.option1}`,
      rank: form.eapcetRank,
      source: 'b-category',
      type: 'b-category-application',
    });
    if (res.ok) {
      setRefId(res.id);
      setState('done');
    } else {
      setState('idle');
      setError(res.error);
    }
  }

  if (state === 'done') {
    return <SuccessCard title="B-Category application received" text={`Thank you. The admissions office will verify ${form.candidateName}’s details and call ${form.mobile} about seat availability, the fee and the documents to submit.`} refId={refId} />;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6" aria-label="B-Category application">
      <input type="text" name="website" value={form.website} onChange={set('website')} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="col-span-full font-display font-extrabold text-navy-900">Candidate</legend>
        <Field id="bc-name" label="Name of the candidate" required><input id="bc-name" className="input" value={form.candidateName} onChange={set('candidateName')} /></Field>
        <Field id="bc-guardian" label="Father / Mother / Guardian"><input id="bc-guardian" className="input" value={form.guardianName} onChange={set('guardianName')} /></Field>
        <Field id="bc-perm" label="Permanent address"><textarea id="bc-perm" className="input min-h-[80px]" value={form.permanentAddress} onChange={set('permanentAddress')} /></Field>
        <Field id="bc-corr" label="Address for correspondence"><textarea id="bc-corr" className="input min-h-[80px]" value={form.correspondenceAddress} onChange={set('correspondenceAddress')} /></Field>
        <Field id="bc-mobile" label="Mobile number" required><input id="bc-mobile" className="input" inputMode="numeric" value={form.mobile} onChange={set('mobile')} /></Field>
        <Field id="bc-land" label="Landline"><input id="bc-land" className="input" value={form.landline} onChange={set('landline')} /></Field>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="col-span-full font-display font-extrabold text-navy-900">Qualifying exam</legend>
        <Field id="bc-overall" label="Overall percentage"><input id="bc-overall" className="input" value={form.overallPercentage} onChange={set('overallPercentage')} /></Field>
        <Field id="bc-group" label="Group percentage"><input id="bc-group" className="input" value={form.groupPercentage} onChange={set('groupPercentage')} /></Field>
        <Field id="bc-jee" label="JEE (All India) rank"><input id="bc-jee" className="input" value={form.jeeRank} onChange={set('jeeRank')} /></Field>
        <Field id="bc-eapcet" label="EAPCET rank"><input id="bc-eapcet" className="input" value={form.eapcetRank} onChange={set('eapcetRank')} /></Field>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-3">
        <legend className="col-span-full font-display font-extrabold text-navy-900">Branch preference</legend>
        {(['option1', 'option2', 'option3'] as const).map((k, i) => (
          <Field key={k} id={k} label={`Option ${i + 1}`} required={i === 0}>
            <select id={k} className="input" value={form[k]} onChange={set(k)}>
              <option value="">Select branch</option>
              {branches.map((b) => <option key={b}>{b}</option>)}
            </select>
          </Field>
        ))}
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="col-span-full font-display font-extrabold text-navy-900">Application fee (if paid by DD)</legend>
        <Field id="bc-bank" label="Bank name"><input id="bc-bank" className="input" value={form.bankName} onChange={set('bankName')} /></Field>
        <Field id="bc-branch" label="Bank branch"><input id="bc-branch" className="input" value={form.bankBranch} onChange={set('bankBranch')} /></Field>
        <Field id="bc-dd" label="DD number"><input id="bc-dd" className="input" value={form.ddNumber} onChange={set('ddNumber')} /></Field>
        <Field id="bc-date" label="DD date"><input id="bc-date" type="date" className="input" value={form.ddDate} onChange={set('ddDate')} /></Field>
      </fieldset>
      <label className="flex items-start gap-2 text-xs text-ink-muted">
        <input type="checkbox" checked={form.consent} onChange={set('consent')} className="mt-0.5 h-4 w-4 rounded border-navy-300 text-saffron-500" />
        <span>I confirm these details are true and agree to be contacted about B-Category admission.</span>
      </label>
      <ErrorNote error={error} />
      <button type="submit" disabled={state === 'busy' || !form.consent} className="btn-primary btn-lg">
        {state === 'busy' ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {state === 'busy' ? 'Submitting…' : 'Submit B-Category application'}
      </button>
    </form>
  );
}
