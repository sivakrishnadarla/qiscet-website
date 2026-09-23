'use client';

import { useState } from 'react';
import { Loader2, Star } from 'lucide-react';
import { submitForm } from '@/lib/forms';
import { ErrorNote, Field, SuccessCard } from './FormShell';

export type FeedbackConfig = {
  kind: string;
  title: string;
  intro: string;
  identity: { id: string; label: string; required?: boolean; type?: string }[];
  questions: string[];
};

export default function FeedbackForm({ config }: { config: FeedbackConfig }) {
  const [identity, setIdentity] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [comments, setComments] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [error, setError] = useState('');
  const [hp, setHp] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    for (const f of config.identity) if (f.required && !identity[f.id]?.trim()) return setError(`Please fill in “${f.label}”.`);
    if (Object.keys(ratings).length < config.questions.length) return setError('Please rate every statement before submitting.');
    setState('busy');
    const res = await submitForm('feedback', {
      kind: config.kind,
      identity,
      responses: config.questions.map((q, i) => ({ question: q, rating: ratings[i] })),
      comments,
      website: hp,
    });
    if (res.ok) setState('done');
    else {
      setState('idle');
      setError(res.error);
    }
  }

  if (state === 'done') return <SuccessCard title="Thank you for your feedback" text="Your responses have been recorded and will be reviewed by the IQAC as part of our continuous quality-improvement process." />;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8" aria-label={config.title}>
      <input type="text" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-2">
        {config.identity.map((f) => (
          <Field key={f.id} id={`fb-${f.id}`} label={f.label} required={f.required}>
            <input id={`fb-${f.id}`} type={f.type || 'text'} className="input" value={identity[f.id] || ''} onChange={(e) => setIdentity((s) => ({ ...s, [f.id]: e.target.value }))} />
          </Field>
        ))}
      </div>
      <div className="space-y-3">
        <p className="text-sm text-ink-muted">Rate each statement: 1 = Poor · 5 = Excellent</p>
        {config.questions.map((q, i) => (
          <div key={q} className="flex flex-col gap-2 rounded-xl border border-navy-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-navy-900"><span className="mr-2 text-saffron-600">{i + 1}.</span>{q}</p>
            <div className="flex gap-1" role="radiogroup" aria-label={q}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={ratings[i] === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => setRatings((r) => ({ ...r, [i]: n }))} className="p-0.5">
                  <Star className={`h-6 w-6 transition ${ratings[i] && ratings[i] >= n ? 'fill-saffron-500 text-saffron-500' : 'text-navy-200 hover:text-saffron-400'}`} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Field id="fb-comments" label="Suggestions / comments"><textarea id="fb-comments" className="input min-h-[110px]" value={comments} onChange={(e) => setComments(e.target.value)} /></Field>
      <ErrorNote error={error} />
      <button type="submit" disabled={state === 'busy'} className="btn-primary btn-lg">
        {state === 'busy' ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {state === 'busy' ? 'Submitting…' : 'Submit Feedback'}
      </button>
    </form>
  );
}
