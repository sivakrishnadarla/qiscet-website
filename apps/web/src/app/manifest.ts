import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.tagline + ' — Autonomous engineering college, Ongole',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f2145',
    theme_color: '#0f2145',
    lang: 'en-IN',
    icons: [{ src: '/images/images/logo.jpg', sizes: '192x192', type: 'image/jpeg', purpose: 'any' }],
  };
}
