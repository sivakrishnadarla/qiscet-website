import { CheckCircle2, Phone } from 'lucide-react';
import { site } from '@/data/site';

export function SuccessCard({ title, text, refId }: { title: string; text: string; refId?: string }) {
  return (
    <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center text-green-900" role="status">
      <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
      <h3 className="mt-3 font-display text-xl font-extrabold">{title}</h3>
      <p className="mt-2 text-sm leading-6">{text}</p>
      {refId ? <p className="mt-2 text-xs">Reference ID: <span className="font-mono font-bold">{refId}</span></p> : null}
      <a href={site.admissionsPhoneHref} className="btn-primary mt-5"><Phone className="h-4 w-4" /> Call {site.admissionsPhone}</a>
    </div>
  );
}

export function Field({ id, label, required, hint, children }: { id: string; label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}{required ? <span className="text-saffron-600"> *</span> : null}</label>
      {children}
      {hint ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}

export function ErrorNote({ error }: { error: string }) {
  return error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p> : null;
}
