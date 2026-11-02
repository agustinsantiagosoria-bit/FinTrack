
import {
  Settings as SettingsIcon,
  Wallet,
  Info,
} from 'lucide-react'

import { useState } from 'react'

import type { Currency } from '../../hooks/useSettings'

interface SettingsProps {
  currency: Currency
  onCurrencyChange: (currency: Currency) => Promise<void>
}

const currencyOptions = [
  { value: 'ARS', label: 'Peso argentino (ARS)' },
  { value: 'USD', label: 'Dólar estadounidense (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
] as const


export default function Settings({
  currency,
  onCurrencyChange,
}: SettingsProps) {

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleCurrencyChange(currency: Currency) {
    if (saving) return

    setSaving(true)
    setError('')

    try {
      await onCurrencyChange(currency)
    } catch {
      setError('No se pudo guardar la moneda. Intentá nuevamente.')
    } finally {
      setSaving(false)
    }
  }

  const preview = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(123456.78)

  return (
    <section className="space-y-8">

      {/* ENCABEZADO */}
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="mt-2 text-sm text-gray-400">
          Personalizá las preferencias de tu aplicación.
        </p>
      </div>

      {/* PREFERENCIAS */}
      <div className="rounded-2xl border border-white/10 bg-[#11111B]">

        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <SettingsIcon className="text-violet-400" size={21} />

          <div>
            <h2 className="font-semibold">Preferencias generales</h2>
            <p className="mt-1 text-xs text-gray-500">
              Configurá cómo querés visualizar tus finanzas.
            </p>
          </div>
        </div>

        <div className="space-y-6 p-6">

          {/* MONEDA */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-white">
                Moneda principal
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Seleccioná la moneda que utilizará FinTrack.
              </p>
            </div>

            <select
              value={currency}
onChange={(event) =>
  handleCurrencyChange(event.target.value as Currency)
}
disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-violet-500 sm:w-72"
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {error && (
  <p className="mt-2 text-sm text-red-400">
    {error}
  </p>
)}
          </div>

          <div className="border-t border-white/5" />

          {/* VISTA PREVIA */}
          <div>
            <p className="font-medium text-white">
              Vista previa de importes
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Así se mostraría un importe con la moneda seleccionada.
            </p>

            <div className="mt-4 rounded-xl border border-white/5 bg-[#0B0B12] p-5">
              <p className="text-xs text-gray-500">
                Ejemplo de importe
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {preview}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* INFORMACIÓN */}
      <div className="rounded-2xl border border-white/10 bg-[#11111B]">

        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <Info className="text-violet-400" size={21} />

          <div>
            <h2 className="font-semibold">Información de FinTrack</h2>
            <p className="mt-1 text-xs text-gray-500">
              Datos generales de la aplicación.
            </p>
          </div>
        </div>

        <div className="space-y-5 p-6">

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">Nombre</p>
              <p className="mt-1 font-medium text-white">FinTrack</p>
            </div>

            <Wallet className="text-violet-400" size={24} />
          </div>

          <div className="border-t border-white/5" />

          <div>
            <p className="text-sm text-gray-400">Versión</p>
            <p className="mt-1 font-medium text-white">1.0.0</p>
          </div>

          <div className="border-t border-white/5" />

          <div>
            <p className="text-sm text-gray-400">Descripción</p>
            <p className="mt-1 text-sm text-gray-300">
              Aplicación personal para administrar ingresos,
              gastos y presupuestos.
            </p>
          </div>

        </div>
      </div>

    </section>
  )
}
