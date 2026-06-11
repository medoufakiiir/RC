import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import { getInitialThemeMode, setSavedThemeMode, applyTheme, type ThemeMode } from './theme'


export function ThemeInitializer({ children }: PropsWithChildren) {
  const [, setMode] = useState<ThemeMode>('dark')

  useEffect(() => {
    const initial = getInitialThemeMode()
    setMode(initial)
    applyTheme(initial)
  }, [])



  // Expose a minimal API for future toggles without requiring a navbar toggle now.
  // (If you add a toggle later, just call window.__setTheme('dark'|'light').)
  useEffect(() => {
    ;(window as any).__setTheme = (next: ThemeMode) => {
      setMode(next)
      applyTheme(next)
      setSavedThemeMode(next)
    }
  }, [])

  return children
}

