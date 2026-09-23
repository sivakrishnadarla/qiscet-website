import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { SITE_URL, site } from '@/data/site';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/layout/FloatingActions';
import SeatSetuWidget from '@/components/layout/SeatSetuWidget';
import HideOnAdmin from '@/components/layout/HideOnAdmin';
import JsonLd from '@/components/seo/JsonLd';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['500', '600', '700', '800'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${site.name} (Autonomous) | Ongole, Andhra Pradesh`, template: '%s | QISCET Ongole' },
  description: site.description,
  applicationName: site.shortName,
  keywords: [
    'QIS College of Engineering and Technology', 'QISCET', 'engineering colleges in Ongole', 'engineering colleges in Prakasam district',
    'best engineering colleges in Andhra Pradesh', 'autonomous engineering college AP', 'NAAC A+ engineering college', 'B.Tech admissions 2026 Ongole',
    'EAPCET counselling code QISE', 'MBA college Ongole', 'MCA college Ongole', 'JNTUK affiliated college',
  ],
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  publisher: site.sponsor,
  formatDetection: { telephone: true, email: true, address: true },
  icons: { icon: '/images/images/logo.jpg', apple: '/images/images/logo.jpg' },
  openGraph: { type: 'website', locale: 'en_IN', siteName: site.name, url: SITE_URL, images: [{ url: '/images/images/office.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  category: 'education',
  other: { 'geo.region': 'IN-AP', 'geo.placename': 'Ongole', 'geo.position': `${site.geo.lat};${site.geo.lng}`, ICBM: `${site.geo.lat}, ${site.geo.lng}` },
};

export const viewport: Viewport = { themeColor: '#0f2145', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col">
        <HideOnAdmin>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white">
            Skip to content
          </a>
        </HideOnAdmin>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <HideOnAdmin>
          <Header />
        </HideOnAdmin>
        <main id="main" className="flex-1">{children}</main>
        <HideOnAdmin>
          <Footer />
          <FloatingActions />
          <SeatSetuWidget />
        </HideOnAdmin>
        {site.gtmId ? (
          <>
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${site.gtmId}');`}
            </Script>
            <noscript>
              <iframe src={`https://www.googletagmanager.com/ns.html?id=${site.gtmId}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} title="gtm" />
            </noscript>
          </>
        ) : null}
      </body>
    </html>
  );
}
