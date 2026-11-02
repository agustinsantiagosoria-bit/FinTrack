
import { useEffect, useState } from 'react'

export type Currency = 'ARS' | 'USD' | 'EUR'

export interface AppSettings {
  currency: Currency
}

const STORAGE_KEY = 'fintrack_settings'

const DEFAULT_SETTINGS: AppSettings = {
  currency: 'ARS',
}

function isCurrency(value: unknown): value is Currency {
  return value === 'ARS' || value === 'USD' || value === 'EUR'
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY)

      if (!savedSettings) {
        return DEFAULT_SETTINGS
      }

      const parsed = JSON.parse(savedSettings)

      return {
        currency: isCurrency(parsed.currency)
          ? parsed.currency
          : DEFAULT_SETTINGS.currency,
      }
    } catch {
      return DEFAULT_SETTINGS
    }
  })

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    )
  }, [settings])

  function updateCurrency(currency: Currency) {
    setSettings((current) => ({
      ...current,
      currency,
    }))
  }

  return {
    settings,
    updateCurrency,
  }
}
