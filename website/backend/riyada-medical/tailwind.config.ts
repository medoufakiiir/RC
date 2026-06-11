// tailwind.config.ts
// Riyada Center — Real brand tokens from finalized identity
// Updated: June 2026

import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {

      // ─── BRAND COLORS ──────────────────────────────────────────────────
      colors: {
        // Primary
        cobalt: {
          DEFAULT: '#3355EE',
          50:  '#EEF1FD',
          100: '#D5DCFB',
          200: '#ABBAF7',
          300: '#8097F3',
          400: '#5675EF',
          500: '#3355EE', // brand primary
          600: '#1A3CD4',
          700: '#132EA3',
          800: '#0D2072',
          900: '#071241',
        },

        // Accent colors
        magenta: {
          DEFAULT: '#FF4D94',
          light:   '#FFD6E8',
          dark:    '#CC1A66',
        },
        malachite: {
          DEFAULT: '#33CC44',
          light:   '#C8F5B5',  // Pistachio Mist (also used as bg)
          dark:    '#1A7A2A',
        },
        sunflower: {
          DEFAULT: '#FFCC22',
          light:   '#FFF5B8',
          dark:    '#CC9900',
        },
        iris: {
          DEFAULT: '#7766DD',
          light:   '#DDBAE8',  // Thistle Blush (also used as bg)
          dark:    '#4A1A7A',
        },

        // Soft palette — section backgrounds
        thistle:    '#DDBAE8',
        canary:     '#EEFF99',
        pistachio:  '#C8F5B5',

        // Neutrals
        ink: {
          DEFAULT: '#0A0F2E',
          muted:   '#5A6380',
          light:   '#E8EAEF',
        },

        // Page background
        surface: {
          DEFAULT: '#F7F8FF', // off-white with blue tint
          card:    '#FFFFFF',
        },
      },

      // ─── TYPOGRAPHY ────────────────────────────────────────────────────
      fontFamily: {
        // Dx Lactos loaded via @font-face in globals.css
        display: ['Dx Lactos', 'system-ui', 'sans-serif'],
        // Poppins via next/font/google
        body:    ['Poppins', 'system-ui', 'sans-serif'],
        // Arabic — Noto Kufi Arabic via next/font/google
        arabic:  ['Noto Kufi Arabic', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        // Display scale (Dx Lactos)
        'display-xl': ['64px', { lineHeight: '1.05', fontWeight: '700' }],
        'display-lg': ['56px', { lineHeight: '1.1',  fontWeight: '700' }],
        'display':    ['40px', { lineHeight: '1.2',  fontWeight: '700' }],
        'display-sm': ['28px', { lineHeight: '1.3',  fontWeight: '700' }],

        // Body scale (Poppins)
        'body-xl':  ['20px', { lineHeight: '1.7', fontWeight: '400' }],
        'body-lg':  ['18px', { lineHeight: '1.7', fontWeight: '400' }],
        'body':     ['16px', { lineHeight: '1.65', fontWeight: '400' }],
        'body-sm':  ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption':  ['13px', { lineHeight: '1.5', fontWeight: '400' }],

        // Arabic body — needs more line height
        'arabic-lg':  ['18px', { lineHeight: '2.0', fontWeight: '400' }],
        'arabic':     ['17px', { lineHeight: '2.0', fontWeight: '400' }],
        'arabic-sm':  ['15px', { lineHeight: '1.9', fontWeight: '400' }],
      },

      // ─── SPACING ──────────────────────────────────────────────────────
      spacing: {
        'section-desktop': '100px',
        'section-mobile':  '64px',
        'container-px':    '80px',
        'container-px-sm': '24px',
        'navbar-h':        '72px',
        'navbar-h-mobile': '60px',
      },

      // ─── BORDER RADIUS ────────────────────────────────────────────────
      borderRadius: {
        'card':    '20px',
        'card-lg': '32px',
        'pill':    '999px',
        'input':   '12px',
        'badge':   '999px',
      },

      // ─── BOX SHADOW ───────────────────────────────────────────────────
      boxShadow: {
        // Cobalt-tinted shadows — unique to this brand
        'card':       '0 2px 12px rgba(51,85,238,0.08)',
        'card-hover': '0 8px 28px rgba(51,85,238,0.16)',
        'button':     '0 4px 14px rgba(51,85,238,0.30)',
        'mascot':     '0 8px 24px rgba(0,0,0,0.12)',
        'navbar':     '0 2px 20px rgba(51,85,238,0.10)',
      },

      // ─── MAX WIDTH ────────────────────────────────────────────────────
      maxWidth: {
        'page':    '1280px',
        'content': '960px',
        'prose':   '680px',
        'wizard':  '700px',
      },

      // ─── ANIMATION ───────────────────────────────────────────────────
      keyframes: {
        'float-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'mascot-pop': {
          '0%':   { opacity: '0', transform: 'scale(0.5)' },
          '70%':  { transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'mascot-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'float-up':       'float-up 400ms ease-out forwards',
        'mascot-pop':     'mascot-pop 500ms cubic-bezier(0.34,1.56,0.64,1) forwards',
        'mascot-float':   'mascot-float 3s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 300ms ease-in-out forwards',
        'slide-in-left':  'slide-in-left 300ms ease-in-out forwards',
      },

      // ─── TRANSITIONS ─────────────────────────────────────────────────
      transitionDuration: {
        'fast':   '150ms',
        'normal': '200ms',
        'slow':   '300ms',
      },

    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),

    // ─── RTL plugin ─────────────────────────────────────────────────────
    // Use logical properties throughout: ms-* me-* ps-* pe-* instead of ml-* mr-* pl-* pr-*
    // Tailwind 3 supports: ms-4 → margin-inline-start: 1rem (auto RTL-aware)
  ],
}

export default config
