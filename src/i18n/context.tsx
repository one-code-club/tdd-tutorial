'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Locale, Translations } from './types'
import { ja } from './translations/ja'
import { en } from './translations/en'

const LOCALE_STORAGE_KEY = 'tdd-tutorial-locale'
const DEFAULT_LOCALE: Locale = 'ja'

const translations: Record<Locale, Translations> = { ja, en }

interface I18nContextValue {
  locale: Locale
  t: Translations
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
    if (saved && (saved === 'ja' || saved === 'en')) {
      setLocaleState(saved)
      document.documentElement.lang = saved
    }
    setIsHydrated(true)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
    document.documentElement.lang = newLocale
  }, [])

  const toggleLocale = useCallback(() => {
    const newLocale = locale === 'ja' ? 'en' : 'ja'
    setLocale(newLocale)
  }, [locale, setLocale])

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-gray-400">{translations[DEFAULT_LOCALE].common.loading}</div>
      </div>
    )
  }

  return (
    <I18nContext.Provider value={{ locale, t: translations[locale], setLocale, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
