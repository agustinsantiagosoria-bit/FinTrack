
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export type Currency = 'ARS' | 'USD' | 'EUR'

export interface AppSettings {
  currency: Currency
}

const DEFAULT_SETTINGS: AppSettings = {
  currency: 'ARS',
}

function isCurrency(value: unknown): value is Currency {
  return value === 'ARS' || value === 'USD' || value === 'EUR'
}

export function useSettings(userId: string) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadSettings() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('user_settings')
        .select('currency')
        .eq('user_id', userId)
        .maybeSingle()

      if (!mounted) return

      if (error) {
        console.error('Error al cargar configuración:', error.message)
        setError('No se pudo cargar la configuración.')
        setLoading(false)
        return
      }

      if (!data) {
        const { data: newSettings, error: insertError } = await supabase
          .from('user_settings')
          .upsert(
            {
              user_id: userId,
              currency: DEFAULT_SETTINGS.currency,
            },
            { onConflict: 'user_id' }
          )
          .select('currency')
          .single()

        if (!mounted) return

        if (insertError) {
          console.error('Error al crear configuración:', insertError.message)
          setError('No se pudo crear la configuración.')
          setLoading(false)
          return
        }

        setSettings({
          currency: isCurrency(newSettings.currency)
            ? newSettings.currency
            : DEFAULT_SETTINGS.currency,
        })

        setLoading(false)
        return
      }

      setSettings({
        currency: isCurrency(data.currency)
          ? data.currency
          : DEFAULT_SETTINGS.currency,
      })

      setLoading(false)
    }

    loadSettings()

    return () => {
      mounted = false
    }
  }, [userId])

  async function updateCurrency(currency: Currency) {
    const { error } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: userId,
          currency,
        },
        { onConflict: 'user_id' }
      )

    if (error) {
      console.error('Error al actualizar moneda:', error.message)
      throw error
    }

    setSettings((current) => ({
      ...current,
      currency,
    }))
  }

  return {
    settings,
    loading,
    error,
    updateCurrency,
  }
}
