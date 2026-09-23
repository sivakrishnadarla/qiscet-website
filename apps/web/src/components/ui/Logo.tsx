import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

export default function Logo({ variant = 'dark', className }: { variant?: 'dark' | 'light'; className?: string }) {
  const dark = variant === 'dark';
  return (
    <Link href="/" className={clsx('flex min-w-0 items-center gap-2.5 md:shrink-0', className)} aria-label="QIS College of Engineering and Technology (Autonomous), Ongole – Home">
      <Image src="/images/images/logo.jpg" alt="" width={48} height={48} priority className="h-11 w-11 shrink-0 rounded-full shadow ring-2 ring-white/80 md:h-12 md:w-12" />
      <span className="min-w-0 leading-tight">
        <span className={clsx('block font-display text-[13px] font-extrabold leading-snug tracking-tight md:whitespace-nowrap md:text-[15px] lg:text-base', dark ? 'text-navy-900' : 'text-white')}>
          QIS College of Engineering & Technology{' '}
          <span className={dark ? 'text-saffron-600' : 'text-saffron-300'}>(Autonomous)</span>
        </span>
      </span>
    </Link>
  );
}
