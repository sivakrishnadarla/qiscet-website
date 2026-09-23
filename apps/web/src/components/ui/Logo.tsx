import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

const SERIF = { fontFamily: "Georgia, 'Book Antiqua', 'Times New Roman', serif" } as const;

export default function Logo({ variant = 'dark', className }: { variant?: 'dark' | 'light'; className?: string }) {
  const dark = variant === 'dark';
  return (
    <Link
      href="/"
      className={clsx('flex min-w-0 items-center gap-2.5 md:gap-3', className)}
      aria-label="QIS College of Engineering and Technology (Autonomous), Ongole – Home"
    >
      <Image
        src="/images/images/logo.jpg"
        alt=""
        width={48}
        height={48}
        priority
        className="h-12 w-12 shrink-0 rounded-full shadow ring-2 ring-white/80 md:h-14 md:w-14"
      />
      <span className="min-w-0 flex-1 text-center leading-tight">
        <span
          className={clsx(
            'block text-[13px] font-extrabold leading-snug tracking-tight md:whitespace-nowrap md:text-[15px] lg:text-[17px]',
            dark ? 'text-navy-900' : 'text-white'
          )}
          style={SERIF}
        >
          QIS College of Engineering &amp; Technology
        </span>
        <span
          className={clsx(
            'block text-[9px] font-bold tracking-[0.28em] md:text-[10px]',
            dark ? 'text-saffron-600' : 'text-saffron-300'
          )}
          style={SERIF}
        >
          (AUTONOMOUS)
        </span>
        <span
          className={clsx(
            'mt-0.5 block text-[7px] font-semibold leading-snug sm:text-[8px] lg:text-[9px]',
            dark ? 'text-navy-600' : 'text-saffron-200'
          )}
        >
          (Approved by AICTE, Permanent Affiliated to JNTUK, Accredited by NBA, Accredited by NAAC with
          &lsquo;A++&rsquo; grade, UGC Recognized, ISO 9001:2015 Certified &amp; Career360 &lsquo;AAA+&rsquo; Ranked
          Institution)
        </span>
      </span>
    </Link>
  );
}
