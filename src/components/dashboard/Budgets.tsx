
import { useState } from 'react'
import { Plus, Trash2, Wallet } from 'lucide-react'
import type { Budget } from '../../types/budgets'
import type { Category } from '../../types/category'
import type { Transaction } from '../../types/transaction'
import type { Currency } from '../../hooks/useSettings'
import { formatCurrency } from '../../utils/formatCurrency'

interface BudgetsProps {
  budgets: Budget[]
  categories: Category[]
  transactions: Transaction[]
  currency: Currency
  onAdd: (budget: Budget) => void
  onDelete: (id: string) => void
}

function getCurrentMonth() {
  const today = new Date()
  const offset = today.getTimezoneOffset()

  return new Date(today.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 7)
}

export default function Budgets({
  budgets,
  categories,
  transactions,
  currency,
  onAdd,
  onDelete,
}: BudgetsProps) {
  const [category, setCategory] = useState('')
  const [month, setMonth] = useState(getCurrentMonth())
  const [limit, setLimit] = useState('')

  const expenseCategories = categories.filter(
    (item) => item.type === 'expense'
  )

  const monthlyBudgets = budgets.filter(
    (budget) => budget.month === month
  )

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const numericLimit = Number(limit)

    if (
      !category ||
      !month ||
      !Number.isFinite(numericLimit) ||
      numericLimit <= 0
    ) {
      return
    }

    const alreadyExists = budgets.some(
      (budget) =>
        budget.category === category &&
        budget.month === month
    )

    if (alreadyExists) {
      alert('Ya existe un presupuesto para esta categoría y mes.')
      return
    }

    const newBudget: Budget = {
      id: crypto.randomUUID(),
      category,
      month,
      limit: numericLimit,
      createdAt: new Date().toISOString(),
    }

    onAdd(newBudget)
    setLimit('')
  }

  function getSpent(categoryName: string) {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === 'expense' &&
          transaction.category === categoryName &&
          transaction.date.startsWith(month)
      )
      .reduce(
        (total, transaction) => total + transaction.amount,
        0
      )
  }

  return (
    <section className="space-y-8">

      {/* ENCABEZADO */}
      <div>
        <h1 className="text-3xl font-bold">Presupuestos</h1>
        <p className="mt-2 text-sm text-gray-400">
          Organizá tus gastos y controlá tus límites mensuales.
        </p>
      </div>

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-white/10 bg-[#11111B] p-6"
      >
        <h2 className="text-lg font-semibold">
          Crear presupuesto
        </h2>

        <div className="grid gap-4 md:grid-cols-3">

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Categoría
            </label>

            <select
              required
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              disabled={expenseCategories.length === 0}
              className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-violet-500 disabled:opacity-50"
            >
              <option value="">Seleccionar categoría</option>

              {expenseCategories.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Mes
            </label>

            <input
              required
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Límite de gasto ({currency})
            </label>

            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={limit}
              onChange={(event) => setLimit(event.target.value)}
              placeholder="Ej. 100000"
              className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
            />
          </div>

        </div>

        <button
          type="submit"
          disabled={expenseCategories.length === 0}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          Crear presupuesto
        </button>
      </form>

      {/* LISTADO */}
      <div className="rounded-2xl border border-white/10 bg-[#11111B]">

        <div className="flex flex-col gap-3 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Mis presupuestos</h2>
            <p className="mt-1 text-xs text-gray-500">
              Control de gastos por categoría
            </p>
          </div>

          <p className="text-sm text-gray-400">
            {monthlyBudgets.length} presupuestos
          </p>
        </div>

        <div className="divide-y divide-white/5">

          {monthlyBudgets.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Wallet
                size={32}
                className="mx-auto mb-3 text-gray-600"
              />
              <p className="font-medium text-gray-300">
                No hay presupuestos para este mes
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Creá tu primer presupuesto para comenzar a controlar tus gastos.
              </p>
            </div>
          ) : (
            monthlyBudgets.map((budget) => {
              const spent = getSpent(budget.category)
              const remaining = budget.limit - spent
              const percentage = (spent / budget.limit) * 100
              const progress = Math.min(percentage, 100)

              const exceeded = spent > budget.limit
              const warning = percentage >= 80

              return (
                <div
                  key={budget.id}
                  className="space-y-4 px-6 py-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">
                        {budget.category}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Presupuesto mensual
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `¿Eliminar el presupuesto de ${budget.category}?`
                          )
                        ) {
                          onDelete(budget.id)
                        }
                      }}
                      title="Eliminar presupuesto"
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(spent, currency)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Gastados de {formatCurrency(budget.limit, currency)}
                      </p>
                    </div>

                    <p
                      className={`text-sm font-semibold ${
                        exceeded
                          ? 'text-rose-400'
                          : warning
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                      }`}
                    >
                      {exceeded
                        ? `Excedido por ${formatCurrency(Math.abs(remaining), currency)}`
                        : `${formatCurrency(remaining, currency)} disponibles`}
                    </p>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full transition-all ${
                        exceeded
                          ? 'bg-rose-500'
                          : warning
                            ? 'bg-amber-400'
                            : 'bg-emerald-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    {percentage.toFixed(1)}% del presupuesto utilizado
                  </p>
                </div>
              )
            })
          )}

        </div>
      </div>

    </section>
  )
}
