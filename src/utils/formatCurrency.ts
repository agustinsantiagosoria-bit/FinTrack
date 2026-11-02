
import type { Currency } from '../hooks/useSettings'

export function formatCurrency(
  amount: number,
  currency: Currency
) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}
