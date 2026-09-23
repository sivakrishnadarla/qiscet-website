import clsx from 'clsx';

export default function SectionHeading({ eyebrow, title, text, align = 'left', light = false, className }: {
  eyebrow?: string; title: string; text?: string; align?: 'left' | 'center'; light?: boolean; className?: string;
}) {
  return (
    <div className={clsx('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? <p className={clsx('eyebrow', align === 'center' && 'justify-center', light && 'text-saffron-300')}>{eyebrow}</p> : null}
      <h2 className={clsx('mt-3 text-3xl font-extrabold md:text-4xl', light ? 'text-white' : 'text-navy-900')}>{title}</h2>
      {text ? <p className={clsx('mt-4 text-base leading-7 md:text-lg', light ? 'text-navy-100' : 'text-ink-muted')}>{text}</p> : null}
    </div>
  );
}
