'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, ExternalLink, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { aeoScore, wordCount } from '@/lib/cms/aeo';
import { SCHEMA_TYPES, type CmsBlock, type CmsDocument, type CmsKind, SchemaType } from '@/lib/cms/types';

type Section = { id: string; title: string };

const ADD: { type: string; label: string }[] = [
  { type: 'heading', label: 'Heading' },
  { type: 'paragraph', label: 'Text' },
  { type: 'list', label: 'List' },
  { type: 'table', label: 'Table' },
  { type: 'image', label: 'Image' },
  { type: 'video', label: 'Video' },
  { type: 'document', label: 'PDF' },
  { type: 'callout', label: 'Note' },
  { type: 'link', label: 'Link' },
];

function freshBlock(type: string): CmsBlock {
  if (type === 'heading') return { type, level: 2, text: '' };
  if (type === 'list') return { type, ordered: false, items: [{ text: '' }] };
  if (type === 'table') return { type, rows: [[{ text: 'Heading' }, { text: 'Heading' }], [{ text: '' }, { text: '' }]] };
  if (type === 'image') return { type, src: '', alt: '' };
  if (type === 'video') return { type, src: '' };
  if (type === 'document' || type === 'link') return { type, label: '', href: '' };
  if (type === 'callout') return { type, text: '' };
  return { type: 'paragraph', text: '' };
}

export default function PageEditor({
  initial,
  sections,
  hasStaticOriginal,
}: {
  initial: CmsDocument;
  sections: Section[];
  hasStaticOriginal: boolean;
}) {
  const router = useRouter();
  const [doc, setDoc] = useState<CmsDocument>(initial);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const score = useMemo(() => aeoScore(doc), [doc]);

  function patch(partial: Partial<CmsDocument>) {
    setDoc((d) => ({ ...d, ...partial }));
  }
  function patchSeo(partial: Partial<CmsDocument['seo']>) {
    setDoc((d) => ({ ...d, seo: { ...d.seo, ...partial } }));
  }
  function setBlock(i: number, block: CmsBlock) {
    setDoc((d) => ({ ...d, blocks: d.blocks.map((b, idx) => (idx === i ? block : b)) }));
  }

  async function upload(file: File, alt: string) {
    const fd = new FormData();
    fd.set('file', file);
    fd.set('alt', alt || file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '));
    const res = await fetch('/cms-api/media', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data.media as { src: string; alt: string };
  }

  async function save(status: 'draft' | 'published') {
    if (status === 'published' && score.score < 7) {
      const go = window.confirm(`AEO readiness is ${score.score}/${score.total}. Answer engines cite pages that clear the checklist. Publish anyway?`);
      if (!go) return;
    }
    setBusy(status);
    setError('');
    setMessage('');
    const payload = { ...doc, status };
    try {
      const res = await fetch(doc.id ? `/cms-api/documents/${doc.id}` : '/cms-api/documents', {
        method: doc.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save.');
      setDoc(data.document);
      setMessage(status === 'published' ? 'Published. The public page is updated.' : 'Draft saved. It is not on the public site yet.');
      if (!doc.id && data.document?.id) router.replace(`/admin/edit?id=${data.document.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setBusy('');
    }
  }

  async function remove() {
    if (!doc.id) {
      router.push(doc.kind === 'blog' ? '/admin/blog' : '/admin/pages');
      return;
    }
    const note = doc.source === 'override'
      ? 'Remove your edits and restore the original college page?'
      : 'Delete this page? This cannot be undone.';
    if (!window.confirm(note)) return;
    setBusy('delete');
    const res = await fetch(`/cms-api/documents/${doc.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Could not delete.');
      setBusy('');
      return;
    }
    router.push(doc.kind === 'blog' ? '/admin/blog' : '/admin/pages');
    router.refresh();
  }

  const viewHref = doc.slug && doc.slug !== 'blog/' ? `/${doc.slug}${doc.status === 'draft' ? '?preview=1' : ''}` : '';
  const titleLen = (doc.seo.metaTitle || doc.title).length;
  const descLen = doc.seo.metaDescription.length;
  const words = wordCount(doc.seo.llmSummary);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-600">{doc.kind === 'blog' ? 'Blog post' : hasStaticOriginal || doc.source === 'override' ? 'Official page' : 'New page'}</p>
          <h1 className="font-display text-2xl font-extrabold text-navy-900">{doc.title || 'Untitled'}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {viewHref && doc.id ? (
            <a href={viewHref} target="_blank" rel="noopener noreferrer" className="btn-outline !py-2 text-xs">
              {doc.status === 'draft' ? 'Preview' : 'View'} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
          <button type="button" className="btn-outline !py-2 text-xs" disabled={!!busy} onClick={() => save('draft')}>
            {busy === 'draft' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Save draft
          </button>
          <button type="button" className="btn-primary !py-2 text-xs" disabled={!!busy} onClick={() => save('published')}>
            {busy === 'published' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Publish
          </button>
        </div>
      </div>

      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p> : null}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <section className="card p-5">
            <label className="block">
              <span className="label">Page title</span>
              <input className="input" value={doc.title} onChange={(e) => patch({ title: e.target.value })} placeholder="Hostel facilities at QISCET" />
            </label>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="label">Address (slug)</span>
                <input className="input font-mono text-xs" value={doc.slug} onChange={(e) => patch({ slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder={doc.kind === 'blog' ? 'blog/hostel-facilities' : 'facilities/hostel'} />
              </label>
              {doc.kind === 'page' ? (
                <label className="block">
                  <span className="label">Section</span>
                  <select
                    className="input"
                    value={doc.section}
                    onChange={(e) => {
                      const section = e.target.value;
                      const title = sections.find((s) => s.id === section)?.title || section;
                      patch({ section, sectionTitle: title });
                    }}
                  >
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </label>
              ) : (
                <label className="block">
                  <span className="label">Schema</span>
                  <select className="input" value={doc.seo.schemaType} onChange={(e) => patchSeo({ schemaType: e.target.value as SchemaType })}>
                    {SCHEMA_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </label>
              )}
            </div>
            <label className="mt-4 block">
              <span className="label">Short summary</span>
              <textarea className="input min-h-[72px]" value={doc.summary} onChange={(e) => patch({ summary: e.target.value })} placeholder="One or two sentences used in search results on this website." />
            </label>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={doc.showInNav} onChange={(e) => patch({ showInNav: e.target.checked })} /> Show in section menu
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={doc.featured} onChange={(e) => patch({ featured: e.target.checked })} /> Feature on news
              </label>
            </div>
          </section>

          <CoverField doc={doc} patch={patch} upload={upload} />

          <section className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-lg font-extrabold text-navy-900">Body</h2>
              <p className="text-xs text-ink-muted">Headings, facts and FAQs on the right matter more to answer engines than long prose.</p>
            </div>
            <div className="mt-4 space-y-3">
              {doc.blocks.map((block, i) => (
                <BlockCard
                  key={i}
                  block={block}
                  onChange={(b) => setBlock(i, b)}
                  onRemove={() => setDoc((d) => ({ ...d, blocks: d.blocks.filter((_, idx) => idx !== i) }))}
                  onUp={() => setDoc((d) => ({ ...d, ...move(d.blocks, i, -1) }))}
                  onDown={() => setDoc((d) => ({ ...d, ...move(d.blocks, i, 1) }))}
                  upload={upload}
                />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {ADD.map((a) => (
                <button key={a.type} type="button" className="btn-outline !px-3 !py-1.5 text-xs" onClick={() => setDoc((d) => ({ ...d, blocks: [...d.blocks, freshBlock(a.type)] }))}>
                  <Plus className="h-3.5 w-3.5" /> {a.label}
                </button>
              ))}
            </div>
          </section>

          {doc.id ? (
            <button type="button" className="text-sm font-semibold text-red-700" onClick={remove} disabled={!!busy}>
              {doc.source === 'override' ? 'Restore original page' : 'Delete'}
            </button>
          ) : null}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-4">
          <section className="card p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-600">AEO / GEO</p>
                <p className="font-display text-lg font-extrabold text-navy-900">Readiness {score.score}/{score.total}</p>
              </div>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-navy-100">
                <div className="h-full bg-saffron-500" style={{ width: `${(score.score / score.total) * 100}%` }} />
              </div>
            </div>
            <ul className="mt-3 space-y-1.5">
              {score.checks.map((c) => (
                <li key={c.id} className="text-xs leading-5" title={c.hint}>
                  <span className={c.ok ? 'text-emerald-700' : 'text-ink-muted'}>{c.ok ? '●' : '○'} {c.label}</span>
                </li>
              ))}
            </ul>
            <details className="mt-3 text-xs leading-5 text-ink-soft">
              <summary className="cursor-pointer font-semibold text-navy-800">How to write this page</summary>
              <ol className="mt-2 list-decimal space-y-1 pl-4">
                <li>One page answers one question a parent or student would actually ask.</li>
                <li>Put the facts in the direct answer, 40–80 words. Name QISCET and Ongole. Do not start with “This page explains”.</li>
                <li>Meta title 45–65 characters. Meta description 140–165 characters, same facts.</li>
                <li>Key facts are label / value pairs (code, phone, intake, date). They become structured data.</li>
                <li>FAQ answers must stand alone if an AI quotes only that answer.</li>
                <li>Every photo needs a real alt text. Name the people, place or event.</li>
                <li>Update the date when a fact changes. Stale dates get ignored.</li>
              </ol>
            </details>
          </section>

          <section className="card space-y-3 p-5">
            <Field label="Primary question" hint="End with a question mark.">
              <input className="input" value={doc.seo.primaryQuestion} onChange={(e) => patchSeo({ primaryQuestion: e.target.value })} placeholder="What is the EAPCET counselling code of QISCET?" />
            </Field>
            <Field label={`Direct answer · ${words} words`} hint="Aim for 40–90 words. This is the citeable paragraph.">
              <textarea className="input min-h-[140px]" value={doc.seo.llmSummary} onChange={(e) => patchSeo({ llmSummary: e.target.value })} placeholder="QIS College of Engineering & Technology (QISCET), Ongole, uses the AP EAPCET counselling code QISE…" />
            </Field>
            <Field label={`Meta title · ${titleLen}`} hint="45–65 characters.">
              <input className="input" value={doc.seo.metaTitle} onChange={(e) => patchSeo({ metaTitle: e.target.value })} placeholder="EAPCET code QISE | QISCET Ongole" />
            </Field>
            <Field label={`Meta description · ${descLen}`} hint="140–165 characters.">
              <textarea className="input min-h-[88px]" value={doc.seo.metaDescription} onChange={(e) => patchSeo({ metaDescription: e.target.value })} />
            </Field>
            <Field label="Keywords" hint="Comma separated. Real phrases, not a dump.">
              <input className="input" value={doc.seo.keywords.join(', ')} onChange={(e) => patchSeo({ keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean) })} />
            </Field>
            <Field label="Entities to mention" hint="Comma separated names an AI should associate with this page.">
              <input className="input" value={doc.seo.mentions.join(', ')} onChange={(e) => patchSeo({ mentions: e.target.value.split(',').map((k) => k.trim()).filter(Boolean) })} />
            </Field>
            {doc.kind === 'page' ? (
              <Field label="Schema type">
                <select className="input" value={doc.seo.schemaType} onChange={(e) => patchSeo({ schemaType: e.target.value as SchemaType })}>
                  {SCHEMA_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
            ) : null}
            <Field label="Author">
              <input className="input" value={doc.seo.author} onChange={(e) => patchSeo({ author: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Published">
                <input className="input" type="date" value={doc.seo.datePublished} onChange={(e) => patchSeo({ datePublished: e.target.value })} />
              </Field>
              <Field label="Updated">
                <input className="input" type="date" value={doc.seo.dateModified} onChange={(e) => patchSeo({ dateModified: e.target.value })} />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={doc.seo.speakable} onChange={(e) => patchSeo({ speakable: e.target.checked })} />
              Speakable direct answer (voice / AI assistants)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={doc.seo.noIndex} onChange={(e) => patchSeo({ noIndex: e.target.checked })} />
              Hide from Google (noindex)
            </label>
          </section>

          <Repeater
            title="Key facts"
            addLabel="Add fact"
            onAdd={() => patchSeo({ keyFacts: [...doc.seo.keyFacts, { label: '', value: '' }] })}
          >
            {doc.seo.keyFacts.map((f, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input className="input !py-2" placeholder="Label" value={f.label} onChange={(e) => patchSeo({ keyFacts: doc.seo.keyFacts.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x) })} />
                <input className="input !py-2" placeholder="Value" value={f.value} onChange={(e) => patchSeo({ keyFacts: doc.seo.keyFacts.map((x, idx) => idx === i ? { ...x, value: e.target.value } : x) })} />
                <button type="button" className="text-ink-muted" aria-label="Remove fact" onClick={() => patchSeo({ keyFacts: doc.seo.keyFacts.filter((_, idx) => idx !== i) })}><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </Repeater>

          <Repeater
            title="FAQs"
            addLabel="Add FAQ"
            onAdd={() => patchSeo({ faqs: [...doc.seo.faqs, { question: '', answer: '' }] })}
          >
            {doc.seo.faqs.map((f, i) => (
              <div key={i} className="space-y-2 rounded-xl border border-navy-100 p-3">
                <input className="input !py-2" placeholder="Question" value={f.question} onChange={(e) => patchSeo({ faqs: doc.seo.faqs.map((x, idx) => idx === i ? { ...x, question: e.target.value } : x) })} />
                <textarea className="input min-h-[72px]" placeholder="Answer that stands alone" value={f.answer} onChange={(e) => patchSeo({ faqs: doc.seo.faqs.map((x, idx) => idx === i ? { ...x, answer: e.target.value } : x) })} />
                <button type="button" className="text-xs font-semibold text-red-700" onClick={() => patchSeo({ faqs: doc.seo.faqs.filter((_, idx) => idx !== i) })}>Remove</button>
              </div>
            ))}
          </Repeater>
        </aside>
      </div>
    </div>
  );
}

function move(blocks: CmsBlock[], i: number, dir: number): Partial<CmsDocument> {
  const next = [...blocks];
  const j = i + dir;
  if (j < 0 || j >= next.length) return { blocks };
  const [item] = next.splice(i, 1);
  next.splice(j, 0, item);
  return { blocks: next };
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[11px] text-ink-muted">{hint}</span> : null}
    </label>
  );
}

function Repeater({ title, addLabel, onAdd, children }: { title: string; addLabel: string; onAdd: () => void; children: React.ReactNode }) {
  return (
    <section className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display font-extrabold text-navy-900">{title}</h2>
        <button type="button" className="text-xs font-bold text-navy-800" onClick={onAdd}><Plus className="mr-1 inline h-3.5 w-3.5" />{addLabel}</button>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function CoverField({ doc, patch, upload }: { doc: CmsDocument; patch: (p: Partial<CmsDocument>) => void; upload: (file: File, alt: string) => Promise<{ src: string; alt: string }> }) {
  const [err, setErr] = useState('');
  return (
    <section className="card p-5">
      <h2 className="font-display text-lg font-extrabold text-navy-900">Cover image</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-[160px_1fr]">
        <div className="flex h-28 items-center justify-center overflow-hidden rounded-xl bg-navy-50">
          {doc.coverImage ? <img src={doc.coverImage} alt={doc.coverAlt || ''} className="h-full w-full object-cover" /> : <span className="text-xs text-ink-muted">No cover</span>}
        </div>
        <div className="space-y-2">
          <input className="input !py-2" placeholder="Alt text — what the photo shows" value={doc.coverAlt} onChange={(e) => patch({ coverAlt: e.target.value })} />
          <label className="btn-outline !py-2 text-xs">
            <Upload className="h-3.5 w-3.5" /> Upload
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (!file) return;
              setErr('');
              try {
                const media = await upload(file, doc.coverAlt);
                patch({ coverImage: media.src, coverAlt: doc.coverAlt || media.alt });
              } catch (ex) {
                setErr(ex instanceof Error ? ex.message : 'Upload failed');
              }
            }} />
          </label>
          {err ? <p className="text-xs text-red-700">{err}</p> : null}
        </div>
      </div>
    </section>
  );
}

function BlockCard({
  block,
  onChange,
  onRemove,
  onUp,
  onDown,
  upload,
}: {
  block: CmsBlock;
  onChange: (b: CmsBlock) => void;
  onRemove: () => void;
  onUp: () => void;
  onDown: () => void;
  upload: (file: File, alt: string) => Promise<{ src: string; alt: string }>;
}) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-cream p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="rounded-full bg-navy-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">{block.type}</span>
        <div className="flex gap-1">
          <button type="button" className="rounded-lg p-1 hover:bg-white" onClick={onUp} aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
          <button type="button" className="rounded-lg p-1 hover:bg-white" onClick={onDown} aria-label="Move down"><ArrowDown className="h-4 w-4" /></button>
          <button type="button" className="rounded-lg p-1 text-red-700 hover:bg-white" onClick={onRemove} aria-label="Remove block"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
      <BlockFields block={block} onChange={onChange} upload={upload} />
    </div>
  );
}

function BlockFields({ block, onChange, upload }: { block: CmsBlock; onChange: (b: CmsBlock) => void; upload: (file: File, alt: string) => Promise<{ src: string; alt: string }> }) {
  const [err, setErr] = useState('');
  if (block.type === 'heading') {
    return (
      <div className="flex gap-2">
        <select className="input w-24 !py-2" value={block.level || 2} onChange={(e) => onChange({ ...block, level: Number(e.target.value) })}>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
          <option value={4}>H4</option>
        </select>
        <input className="input !py-2" value={block.text || ''} onChange={(e) => onChange({ ...block, text: e.target.value })} placeholder="Heading" />
      </div>
    );
  }
  if (block.type === 'paragraph' || block.type === 'callout') {
    return <textarea className="input min-h-[88px]" value={block.text || ''} onChange={(e) => onChange({ ...block, text: e.target.value })} />;
  }
  if (block.type === 'list') {
    const items = block.items || [];
    return (
      <div className="space-y-2">
        <label className="inline-flex items-center gap-2 text-xs font-semibold">
          <input type="checkbox" checked={Boolean(block.ordered)} onChange={(e) => onChange({ ...block, ordered: e.target.checked })} /> Numbered
        </label>
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input className="input !py-2" value={item.text} onChange={(e) => onChange({ ...block, items: items.map((it, idx) => idx === i ? { ...it, text: e.target.value } : it) })} />
            <button type="button" aria-label="Remove item" onClick={() => onChange({ ...block, items: items.filter((_, idx) => idx !== i) })}><Trash2 className="h-4 w-4 text-ink-muted" /></button>
          </div>
        ))}
        <button type="button" className="text-xs font-bold text-navy-800" onClick={() => onChange({ ...block, items: [...items, { text: '' }] })}>Add item</button>
      </div>
    );
  }
  if (block.type === 'table') {
    const rows = block.rows || [];
    return (
      <div className="space-y-2 overflow-x-auto">
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map((cell, ci) => (
              <input key={ci} className="input min-w-[120px] !py-2 text-xs" value={cell.text} onChange={(e) => {
                const next = rows.map((r, ridx) => ridx === ri ? r.map((c, cidx) => cidx === ci ? { ...c, text: e.target.value } : c) : r);
                onChange({ ...block, rows: next });
              }} />
            ))}
          </div>
        ))}
        <button type="button" className="text-xs font-bold text-navy-800" onClick={() => {
          const cols = rows[0]?.length || 2;
          onChange({ ...block, rows: [...rows, Array.from({ length: cols }, () => ({ text: '' }))] });
        }}>Add row</button>
      </div>
    );
  }
  if (block.type === 'image') {
    return (
      <div className="space-y-2">
        {block.src ? <img src={block.src} alt={block.alt || ''} className="max-h-40 rounded-xl object-contain" /> : null}
        <input className="input !py-2" placeholder="Alt text (required)" value={block.alt || ''} onChange={(e) => onChange({ ...block, alt: e.target.value })} />
        <label className="btn-outline !py-2 text-xs">
          <Upload className="h-3.5 w-3.5" /> Upload image
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (!file) return;
            try {
              const media = await upload(file, block.alt || '');
              onChange({ ...block, src: media.src, alt: block.alt || media.alt });
              setErr('');
            } catch (ex) {
              setErr(ex instanceof Error ? ex.message : 'Upload failed');
            }
          }} />
        </label>
        {err ? <p className="text-xs text-red-700">{err}</p> : null}
      </div>
    );
  }
  if (block.type === 'gallery') {
    const images = block.images || [];
    return (
      <div className="space-y-2">
        {images.map((img, i) => (
          <div key={i} className="flex items-center gap-2">
            <img src={img.src} alt="" className="h-12 w-12 rounded-lg object-cover" />
            <input className="input !py-2 text-xs" value={img.alt} onChange={(e) => onChange({ ...block, images: images.map((im, idx) => idx === i ? { ...im, alt: e.target.value } : im) })} />
          </div>
        ))}
        <p className="text-[11px] text-ink-muted">Add photographs from the Gallery section, or upload one image block at a time.</p>
      </div>
    );
  }
  if (block.type === 'video') {
    return <input className="input !py-2" placeholder="YouTube link" value={block.src || ''} onChange={(e) => onChange({ ...block, src: e.target.value })} />;
  }
  if (block.type === 'document' || block.type === 'link') {
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        <input className="input !py-2" placeholder="Label" value={block.label || ''} onChange={(e) => onChange({ ...block, label: e.target.value })} />
        <input className="input !py-2" placeholder="https://… or /page" value={block.href || ''} onChange={(e) => onChange({ ...block, href: e.target.value })} />
      </div>
    );
  }
  if (block.type === 'map' || block.type === 'embed') {
    return <input className="input !py-2 text-xs" value={block.src || ''} onChange={(e) => onChange({ ...block, src: e.target.value })} />;
  }
  if (block.type === 'legacy-form') {
    return <p className="text-xs text-ink-muted">Library login note. Left as-is so passwords are never published.</p>;
  }
  return <p className="text-xs text-ink-muted">This block is kept as originally imported.</p>;
}

