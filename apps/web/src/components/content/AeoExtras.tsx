import type { ContentPage } from '@/lib/content';

function fmt(d?: string) {
  if (!d) return '';
  const date = new Date(d.length === 10 ? `${d}T00:00:00` : d);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AeoExtras({ page, placement }: { page: ContentPage; placement: 'before' | 'after' }) {
  const aeo = page.aeo;
  if (!aeo) return null;
  const facts = (aeo.keyFacts || []).filter((f) => f.label && f.value);
  const faqs = (aeo.faqs || []).filter((f) => f.question && f.answer);

  if (placement === 'before') {
    if (!aeo.primaryQuestion && !aeo.llmSummary && !facts.length) return null;
    return (
      <div className="mb-8 space-y-5">
        {aeo.primaryQuestion || aeo.llmSummary ? (
          <section className="aeo-answer rounded-2xl border border-saffron-200 bg-gradient-to-br from-saffron-50 to-white p-5 shadow-card" aria-label="Direct answer">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-700">Direct answer</p>
            {aeo.primaryQuestion ? <h2 className="mt-1 text-xl font-extrabold text-navy-900">{aeo.primaryQuestion}</h2> : null}
            {aeo.llmSummary ? <p className="mt-2 text-[15.5px] leading-7 text-navy-900">{aeo.llmSummary}</p> : null}
          </section>
        ) : null}
        {facts.length ? (
          <dl className="grid gap-3 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.label} className="rounded-xl border border-navy-100 bg-white px-4 py-3">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">{f.label}</dt>
                <dd className="mt-1 font-semibold text-navy-900">{f.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-8">
      {faqs.length ? (
        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading">Frequently asked questions</h2>
          <div className="not-prose mt-4 divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white">
            {faqs.map((f) => (
              <details key={f.question} className="group px-5 py-4" open>
                <summary className="cursor-pointer font-semibold text-navy-900">{f.question}</summary>
                <p className="mt-2 text-sm leading-7 text-ink-soft">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}
      {aeo.author || aeo.datePublished || aeo.dateModified ? (
        <p className="text-xs text-ink-muted">
          {aeo.author ? <span>Published by {aeo.author}. </span> : null}
          {aeo.datePublished ? <time dateTime={aeo.datePublished}>Published {fmt(aeo.datePublished)}</time> : null}
          {aeo.dateModified ? (
            <span>
              {' '}
              · Updated <time dateTime={aeo.dateModified}>{fmt(aeo.dateModified)}</time>
            </span>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
