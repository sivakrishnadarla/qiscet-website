import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

export default function Logo({ variant = 'dark', className }: { variant?: 'dark' | 'light'; className?: string }) {
  const dark = variant === 'dark';
  return (
    <Link href="/" className={clsx('flex shrink-0 items-center gap-2.5', className)} aria-label="QIS College of Engineering and Technology, Ongole – Home">
      <Image src="/images/images/logo.jpg" alt="" width={48} height={48} priority className="h-11 w-11 shrink-0 rounded-full shadow ring-2 ring-white/80 md:h-12 md:w-12" />
      <span className="min-w-0 leading-tight">
        <span className={clsx('block whitespace-nowrap font-display text-[17px] font-extrabold tracking-tight', dark ? 'text-navy-900' : 'text-white')}>
          QIS College
        </span>
        <span className={clsx('block whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.08em] sm:text-[11px]', dark ? 'text-saffron-600' : 'text-saffron-300')}>
          <span className="2xl:hidden">Ongole</span>
          <span className="hidden 2xl:inline">Engineering & Technology</span>
        </span>
      </span>
    </Link>
  );
}
