export type ThemeMode = 'light' | 'dark'

const THEME_KEY = 'theme-mode'

export function getSavedThemeMode(): ThemeMode | null {
  const v = typeof window !== 'undefined' ? window.localStorage.getItem(THEME_KEY) : null
  if (v === 'light' || v === 'dark') return v
  return null
}

export function setSavedThemeMode(mode: ThemeMode) {
  window.localStorage.setItem(THEME_KEY, mode)
}

export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  if (mode === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

export function getInitialThemeMode(): ThemeMode {
  // Default to dark unless the user explicitly chose light
  return getSavedThemeMode() ?? 'dark'
}


