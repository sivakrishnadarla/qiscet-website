import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, FileText, Link2 } from 'lucide-react';
import type { Block, Cell, Link as CLink } from '@/lib/content';
import Gallery from '@/components/content/Gallery';

const isExternal = (href: string) => /^https?:\/\//i.test(href);
function youtubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return m?.[1] || null;
}
const isPdf = (href: string) => /\.(pdf|docx?|xlsx?|pptx?)(\?|$)/i.test(href);

export function SmartAnchor({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  if (!href || href === '#') return <>{children}</>;
  if (isExternal(href) || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return (
      <a href={href} className={className} target={isExternal(href) ? '_blank' : undefined} rel={isExternal(href) ? 'noopener noreferrer' : undefined}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/** Render text where certain substrings are links (link labels appear inside text). */
function RichText({ text, links }: { text: string; links?: CLink[] }) {
  if (!links || links.length === 0) return <>{text}</>;
  const parts: React.ReactNode[] = [];
  let rest = text;
  let key = 0;
  const sorted = [...links].filter((l) => l.label && l.href);
  for (const l of sorted) {
    const i = rest.indexOf(l.label);
    if (i === -1) continue;
    if (i > 0) parts.push(<span key={key++}>{rest.slice(0, i)}</span>);
    parts.push(
      <SmartAnchor key={key++} href={l.href}>
        {l.label}
      </SmartAnchor>,
    );
    rest = rest.slice(i + l.label.length);
  }
  if (rest) parts.push(<span key={key++}>{rest}</span>);
  // If no label matched, append links after text
  if (parts.length === 1 && sorted.length) {
    return (
      <>
        {text}{' '}
        {sorted.map((l, i) => (
          <SmartAnchor key={i} href={l.href} className="ml-1">
            {l.label}
          </SmartAnchor>
        ))}
      </>
    );
  }
  return <>{parts}</>;
}

function TableBlock({ rows }: { rows: Cell[][] }) {
  if (!rows.length) return null;
  const headerIdx = rows.findIndex((r) => r.length > 1);
  const bodyStart = headerIdx === -1 ? 0 : headerIdx + 1;
  const captionRows = headerIdx > 0 ? rows.slice(0, headerIdx) : [];
  const header = headerIdx >= 0 ? rows[headerIdx] : null;
  const body = rows.slice(bodyStart);
  return (
    <div className="table-wrap">
      <table className="table-qis">
        {captionRows.length ? (
          <caption className="bg-navy-900 px-4 py-3 text-left font-display text-sm font-bold text-white">{captionRows.map((r) => r.map((c) => c.text).join(' ')).join(' · ')}</caption>
        ) : null}
        {header ? (
          <thead>
            <tr>
              {header.map((c, i) => (
                <th key={i} colSpan={c.colspan} scope="col">
                  <CellContent cell={c} />
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {body.map((r, ri) => (
            <tr key={ri}>
              {r.map((c, ci) => (
                <td key={ci} colSpan={c.colspan}>
                  <CellContent cell={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CellContent({ cell }: { cell: Cell }) {
  return (
    <>
      {cell.images?.map((src) => (
        <Image key={src} src={src} alt="" width={96} height={96} className="mb-2 h-20 w-20 rounded-lg object-cover" unoptimized />
      ))}
      <RichText text={cell.text} links={cell.links} />
    </>
  );
}

function LinkCard({ href, label, doc }: { href: string; label: string; doc?: boolean }) {
  const pdf = doc || isPdf(href);
  return (
    <SmartAnchor href={href} className="group flex items-center gap-3 rounded-xl border border-navy-100 bg-white px-4 py-3 text-sm font-medium text-navy-900 no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-saffron-400 hover:shadow-card">
      <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${pdf ? 'bg-saffron-50 text-saffron-600' : 'bg-navy-50 text-navy-700'}`}>
        {pdf ? <FileText className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </span>
      <span className="flex-1 leading-snug">{label}</span>
      {isExternal(href) ? <ExternalLink className="h-3.5 w-3.5 text-navy-300 group-hover:text-saffron-500" /> : null}
    </SmartAnchor>
  );
}

export default function ContentRenderer({ blocks, hideFirstHeading = false }: { blocks: Block[]; hideFirstHeading?: boolean }) {
  const out: React.ReactNode[] = [];
  let i = 0;
  let firstHeadingSkipped = !hideFirstHeading;
  while (i < blocks.length) {
    const b = blocks[i];
    // Group consecutive link/document blocks into a grid
    if (b.type === 'link' || b.type === 'document') {
      const group: { href: string; label: string; doc: boolean }[] = [];
      while (i < blocks.length && (blocks[i].type === 'link' || blocks[i].type === 'document')) {
        const lb = blocks[i] as Extract<Block, { type: 'link' | 'document' }>;
        group.push({ href: lb.href, label: lb.label, doc: lb.type === 'document' });
        i++;
      }
      out.push(
        <div key={`links-${i}`} className="not-prose my-5 grid gap-3 sm:grid-cols-2">
          {group.map((g, gi) => (
            <LinkCard key={gi} {...g} />
          ))}
        </div>,
      );
      continue;
    }
    // Group consecutive images into a gallery
    if (b.type === 'image' && i + 1 < blocks.length && blocks[i + 1].type === 'image') {
      const imgs: { src: string; alt: string }[] = [];
      while (i < blocks.length && blocks[i].type === 'image') {
        const ib = blocks[i] as Extract<Block, { type: 'image' }>;
        imgs.push({ src: ib.src, alt: ib.alt });
        i++;
      }
      out.push(<Gallery key={`gal-${i}`} images={imgs} />);
      continue;
    }
    switch (b.type) {
      case 'heading': {
        if (!firstHeadingSkipped && b.level <= 2) {
          firstHeadingSkipped = true;
          break;
        }
        const level = Math.min(Math.max(b.level, 2), 4);
        const Tag = `h${level}` as 'h2' | 'h3' | 'h4';
        out.push(
          <Tag key={i} id={slugify(b.text)}>
            <RichText text={b.text} links={b.links} />
          </Tag>,
        );
        break;
      }
      case 'paragraph':
        out.push(
          <p key={i}>
            <RichText text={b.text} links={b.links} />
          </p>,
        );
        break;
      case 'callout':
        out.push(
          <aside key={i} className="not-prose my-5 rounded-2xl border border-navy-100 bg-navy-50 px-5 py-4 text-[15px] leading-7 text-navy-900">
            {b.text}
          </aside>,
        );
        break;
      case 'list': {
        const Tag = b.ordered ? 'ol' : 'ul';
        out.push(
          <Tag key={i}>
            {b.items.map((it, ii) => (
              <li key={ii}>
                {it.images?.map((src) => (
                  <Image key={src} src={src} alt="" width={64} height={64} className="mr-2 inline-block h-10 w-10 rounded object-cover" unoptimized />
                ))}
                <RichText text={it.text} links={it.links} />
              </li>
            ))}
          </Tag>,
        );
        break;
      }
      case 'table':
        out.push(<TableBlock key={i} rows={b.rows} />);
        break;
      case 'image': {
        const img = (
          <figure key={i} className="not-prose my-6">
            <Image src={b.src} alt={b.alt || ''} width={1200} height={800} sizes="(min-width:1024px) 800px, 100vw" className="mx-auto h-auto max-h-[640px] w-auto max-w-full rounded-2xl object-contain shadow-card" unoptimized />
            {b.alt ? <figcaption className="mt-2 text-center text-xs text-ink-muted">{b.alt}</figcaption> : null}
          </figure>
        );
        out.push(b.href ? (
          <SmartAnchor key={i} href={b.href}>
            {img}
          </SmartAnchor>
        ) : img);
        break;
      }
      case 'gallery':
        out.push(<Gallery key={i} images={b.images} />);
        break;
      case 'video':
        out.push(
          <div key={i} className="not-prose my-6 aspect-video overflow-hidden rounded-2xl shadow-card">
            <iframe src={b.src} title="Video" className="h-full w-full" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>,
        );
        break;
      case 'map':
        out.push(
          <div key={i} className="not-prose my-6 overflow-hidden rounded-2xl border border-navy-100 shadow-card">
            <iframe src={b.src} title="Map" className="h-[420px] w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>,
        );
        break;
      case 'embed':
        out.push(
          <div key={i} className="not-prose my-6 overflow-hidden rounded-2xl border border-navy-100">
            <iframe src={b.src} title="Embedded content" className="h-[600px] w-full" loading="lazy" />
          </div>,
        );
        break;
      case 'legacy-form':
        out.push(
          <div key={i} className="not-prose my-6 rounded-2xl border border-dashed border-navy-200 bg-navy-50 p-5 text-sm text-ink-soft">
            Access to this resource requires institutional login credentials. Students and faculty can obtain them from the Central Library help desk or by writing to{' '}
            <a href="mailto:principal@qiscet.edu.in" className="font-semibold text-navy-800 underline">principal@qiscet.edu.in</a>.
          </div>,
        );
        break;
      default:
        break;
    }
    i++;
  }
  return <div className="prose-qis">{out}</div>;
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}
