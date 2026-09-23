import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const legacyRedirects = require('./content/legacy-redirects.json');

/** Base URL of the NestJS API. On Vercel set API_URL to your deployed API project URL. */
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'qiscet.edu.in' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  async rewrites() {
    // Browser calls relative /api/* → proxied to the NestJS API (no CORS headaches on Vercel).
    return [{ source: '/api/:path*', destination: `${API_URL.replace(/\/$/, '')}/api/:path*` }];
  },
  async redirects() {
    // 301 legacy PHP URLs (old site) → new clean routes, preserving SEO equity.
    const seen = new Set();
    const out = [];
    for (const r of legacyRedirects) {
      const src = r.source.replace(/\s/g, '%20');
      if (seen.has(src) || !/^[\w\-./%&()]+$/.test(src)) continue;
      seen.add(src);
      out.push({ source: src, destination: r.destination, permanent: true });
    }
    out.push({ source: '/qiscet', destination: '/', permanent: true });
    out.push({ source: '/index.php', destination: '/', permanent: true });
    return out;
  },
  async headers() {
    const security = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];
    // SAMEORIGIN blocks the hosted preview iframe. Keep it on production deploys only.
    if (process.env.NODE_ENV === 'production') security.unshift({ key: 'X-Frame-Options', value: 'SAMEORIGIN' });
    return [
      {
        source: '/(.*)',
        headers: security,
      },
      { source: '/images/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ];
  },
};

export default nextConfig;
