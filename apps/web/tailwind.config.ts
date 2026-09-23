import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' }, screens: { '2xl': '1320px' } },
    extend: {
      colors: {
        navy: { 50: '#eef3fb', 100: '#d9e4f5', 200: '#b3c8eb', 300: '#82a3db', 400: '#4f79c4', 500: '#2f5aa8', 600: '#214689', 700: '#1a376c', 800: '#142b55', 900: '#0f2145', 950: '#0a1730' },
        saffron: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea6a0a', 700: '#c2540a', 800: '#9a4210', 900: '#7c3810' },
        gold: { 400: '#f5c451', 500: '#e9b03a', 600: '#d19a25' },
        ink: { DEFAULT: '#0b1526', soft: '#334155', muted: '#64748b' },
        cream: '#f8f6f1',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,33,69,.06), 0 8px 24px -12px rgba(15,33,69,.18)',
        lift: '0 12px 40px -12px rgba(15,33,69,.35)',
        glow: '0 0 0 4px rgba(249,115,22,.18)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(120deg, rgba(10,23,48,.92) 0%, rgba(15,33,69,.75) 45%, rgba(15,33,69,.25) 100%)',
        'navy-gradient': 'linear-gradient(135deg, #0f2145 0%, #1a376c 60%, #214689 100%)',
        'saffron-gradient': 'linear-gradient(135deg, #f97316 0%, #ea6a0a 100%)',
        grid: 'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        ticker: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(-100%)' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(249,115,22,.55)' }, '70%': { boxShadow: '0 0 0 12px rgba(249,115,22,0)' } },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        ticker: 'ticker 28s linear infinite',
        fadeUp: 'fadeUp .6s ease-out both',
        pulseSoft: 'pulseSoft 2.2s infinite',
      },
    },
  },
  plugins: [],
};
export default config;
