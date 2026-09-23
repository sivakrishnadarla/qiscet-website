import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

export default function Logo({ variant = 'dark', className }: { variant?: 'dark' | 'light'; className?: string }) {
  return (
    <Link href="/" className={clsx('flex items-center gap-3', className)} aria-label="QIS College of Engineering & Technology – Home">
      <Image src="/images/images/logo.jpg" alt="QIS Educational Institutions emblem" width={56} height={56} priority className="h-12 w-12 rounded-full ring-2 ring-white/70 shadow md:h-14 md:w-14" />
      <span className="leading-tight">
        <span className={clsx('block font-display text-[15px] font-extrabold tracking-tight md:text-[17px]', variant === 'dark' ? 'text-navy-900' : 'text-white')}>
          QIS College of Engineering <span className="whitespace-nowrap">& Technology</span>
        </span>
        <span className={clsx('block text-[11px] font-semibold uppercase tracking-[0.14em] md:text-xs', variant === 'dark' ? 'text-saffron-600' : 'text-saffron-300')}>
          Autonomous · Ongole, Andhra Pradesh
        </span>
      </span>
    </Link>
  );
}
