// src/lib/tokens.ts
// Riyada Center — Design Tokens (single source of truth)
// Import these wherever you need colors/brand values in JS/TS context
// (e.g. Framer Motion, canvas, dynamic inline styles)

export const colors = {
  // ── Primary ─────────────────────────────────────────────────────────
  cobalt:    '#3355EE',
  cobalt50:  '#EEF1FD',
  cobalt100: '#D5DCFB',
  cobalt600: '#1A3CD4',

  // ── Accents ─────────────────────────────────────────────────────────
  magenta:    '#FF4D94',
  magentaLt:  '#FFD6E8',
  malachite:  '#33CC44',
  malachiteLt:'#C8F5B5',
  sunflower:  '#FFCC22',
  iris:       '#7766DD',
  thistle:    '#DDBAE8',
  canary:     '#EEFF99',
  pistachio:  '#C8F5B5',

  // ── Neutrals ────────────────────────────────────────────────────────
  ink:      '#0A0F2E',
  inkMuted: '#5A6380',
  inkLight: '#E8EAEF',
  surface:  '#F7F8FF',
  white:    '#FFFFFF',
} as const

export const fonts = {
  display: "'Dx Lactos', system-ui, sans-serif",
  body:    "'Poppins', system-ui, sans-serif",
  arabic:  "'Noto Kufi Arabic', system-ui, sans-serif",
} as const

export const radius = {
  card:   '20px',
  cardLg: '32px',
  pill:   '999px',
  input:  '12px',
} as const

export const shadows = {
  card:   '0 2px 12px rgba(51,85,238,0.08)',
  hover:  '0 8px 28px rgba(51,85,238,0.16)',
  button: '0 4px 14px rgba(51,85,238,0.30)',
  mascot: '0 8px 24px rgba(0,0,0,0.12)',
} as const

// ── Service → Mascot + Color Mapping ─────────────────────────────────────
export const serviceTheme = {
  ASSESSMENT: {
    colorBand: colors.sunflower,
    mascot:    null,
    icon:      'clipboard-check',
  },
  ABA: {
    colorBand: colors.canary,
    bgSoft:    colors.canary,
    mascot:    '/images/mascots/behaviour-guide.png',
    mascotName:'Behavior Guide',
    color:     colors.iris,
  },
  SPEECH: {
    colorBand: colors.thistle,
    bgSoft:    colors.thistle,
    mascot:    '/images/mascots/language-explorer.png',
    mascotName:'Language Explorer',
    color:     colors.cobalt,
  },
  OT: {
    colorBand: colors.pistachio,
    bgSoft:    colors.pistachio,
    mascot:    '/images/mascots/skill-builder.png',
    mascotName:'Skill Builder',
    color:     colors.malachite,
  },
} as const

// ── Package Pricing ────────────────────────────────────────────────────────
export const packages = [
  {
    id:           'INDIVIDUAL',
    nameAr:       'جلسة فردية',
    nameEn:       'Individual Session',
    hrsPerWeek:   null,
    monthlyPrice: null,
    hourlyRate:   350,
    discount:     0,
    popular:      false,
    color:        colors.inkLight,
  },
  {
    id:           'PKG_A',
    nameAr:       'باقة A',
    nameEn:       'Package A',
    hrsPerWeek:   5,
    monthlyPrice: 6650,
    hourlyRate:   332.5,
    discount:     5,
    popular:      false,
    color:        colors.cobalt50,
  },
  {
    id:           'PKG_B',
    nameAr:       'باقة B',
    nameEn:       'Package B',
    hrsPerWeek:   10,
    monthlyPrice: 12600,
    hourlyRate:   315,
    discount:     10,
    popular:      false,
    color:        colors.cobalt100,
  },
  {
    id:           'PKG_C',
    nameAr:       'باقة C',
    nameEn:       'Package C',
    hrsPerWeek:   15,
    monthlyPrice: 17850,
    hourlyRate:   297.5,
    discount:     15,
    popular:      true, // highlighted
    color:        colors.cobalt,
  },
  {
    id:           'INTENSIVE',
    nameAr:       'الباقة المكثفة',
    nameEn:       'Intensive Package',
    hrsPerWeek:   30,
    monthlyPrice: 29400,
    hourlyRate:   245,
    discount:     30,
    popular:      false,
    color:        colors.ink,
  },
] as const

export const VAT_RATE = 0.15 // 15% Saudi VAT
