import React, { createContext, useContext, useState } from 'react'

const translations: any = {
  'en-US': {
    quick_run: 'Quick Run', latitude: 'Latitude', longitude: 'Longitude', run: 'Run',
    upload_shapefile: 'Upload Shapefile (.zip)', upload: 'Upload',
    results: 'Results', status: 'Status', download: 'Download', logs: 'Logs',
  },
  'pt-BR': {
    quick_run: 'Execução Rápida', latitude: 'Latitude', longitude: 'Longitude', run: 'Rodar',
    upload_shapefile: 'Enviar Shapefile (.zip)', upload: 'Enviar',
    results: 'Resultados', status: 'Status', download: 'Baixar', logs: 'Logs',
  }
}

const I18nContext = createContext<any>({ locale: 'en-US', t: (k: string) => k, setLocale: (l: string) => {} })

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<'en-US' | 'pt-BR'>('en-US')
  const t = (key: string) => translations[locale][key] ?? key
  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() { return useContext(I18nContext) }
