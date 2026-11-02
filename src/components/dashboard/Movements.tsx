
import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  Pencil,
} from 'lucide-react'

import type { Transaction } from '../../types/transaction'
import type { Category } from '../../types/category'
import type { Currency } from '../../hooks/useSettings'
import { formatCurrency } from '../../utils/formatCurrency'

interface MovementsProps {
  transactions: Transaction[]
  currency: Currency
  onDelete: (id: string) => Promise<void>
  onUpdate: (transaction: Transaction) => Promise<void>
  categories: Category[]
}

export default function Movements({
  transactions,
  currency,
  onDelete,
  onUpdate,
  categories,
}: MovementsProps) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [editError, setEditError] = useState('')
  const [actionError, setActionError] = useState('')

  const editingCategories = categories.filter(
    (category) => category.type === editingTransaction?.type
  )

  async function handleDelete(id: string) {
    setActionError('')
    try {
      await onDelete(id)
    } catch {
      setActionError('No se pudo eliminar el movimiento. Intentá nuevamente.')
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editingTransaction) return
    if (!editingCategories.some((category) => category.name === editingTransaction.category)) {
      setEditError('Elegí una categoría válida para este tipo de movimiento.')
      return
    }
    if (!Number.isFinite(editingTransaction.amount) || editingTransaction.amount <= 0) {
      setEditError('El importe debe ser mayor que cero.')
      return
    }
    setSavingEdit(true)
    setEditError('')
    try {
      await onUpdate(editingTransaction)
      setEditingTransaction(null)
    } catch {
      setEditError('No se pudo actualizar el movimiento. Tus cambios siguen disponibles para reintentar.')
    } finally {
      setSavingEdit(false)
    }
  }

  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        transaction.category
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesFilter =
        filter === 'all' || transaction.type === filter

      return matchesSearch && matchesFilter
    })
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )

  function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
      'es-AR',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    )
  }

  return (
    <div className="space-y-8">

      {/* ENCABEZADO */}
      <div>
        <h1 className="text-3xl font-bold">Movimientos</h1>
        <p className="mt-2 text-sm text-gray-400">
          Consultá y administrá todos tus ingresos y gastos.
        </p>
      </div>

      {/* BUSCADOR Y FILTROS */}
      <div className="flex flex-col gap-4 md:flex-row">

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por descripción o categoría..."
            className="w-full rounded-xl border border-white/10 bg-[#11111B] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#11111B] px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
        >
          <option value="all">Todos</option>
          <option value="income">Ingresos</option>
          <option value="expense">Gastos</option>
        </select>

      </div>

      {/* FORMULARIO DE EDICIÓN */}
      {editingTransaction && (
        <form
          onSubmit={handleUpdate}
          className="space-y-4 rounded-2xl border border-violet-500/30 bg-[#11111B] p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Editar movimiento</h2>
            <button type="button" onClick={() => setEditingTransaction(null)} disabled={savingEdit} className="text-sm text-gray-400 hover:text-white">Cancelar</button>
          </div>
          {editError && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{editError}</p>}

          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Descripción
              </label>
              <input
                required
                disabled={savingEdit}
                value={editingTransaction.description}
                onChange={(e) =>
                  setEditingTransaction({
                    ...editingTransaction,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Categoría
              </label>
              <select
                required
                value={editingTransaction.category}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, category: e.target.value })}
                disabled={savingEdit || editingCategories.length === 0}
                className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
              >
                {editingCategories.length === 0 ? <option value="">No hay categorías disponibles</option> : editingCategories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Importe
              </label>
              <input
                required
                disabled={savingEdit}
                type="number"
                min="0.01"
                step="0.01"
                value={editingTransaction.amount}
                onChange={(e) =>
                  setEditingTransaction({
                    ...editingTransaction,
                    amount: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Fecha
              </label>
              <input
                required
                disabled={savingEdit}
                type="date"
                value={editingTransaction.date}
                onChange={(e) =>
                  setEditingTransaction({
                    ...editingTransaction,
                    date: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Tipo de movimiento
              </label>
              <select
                value={editingTransaction.type}
                onChange={(e) =>
                  setEditingTransaction({
                    ...editingTransaction,
                    type: e.target.value as Transaction['type'],
                    category: categories.find((category) => category.type === e.target.value)?.name ?? '',
                  })
                }
                disabled={savingEdit}
                className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
              >
                <option value="income">Ingreso</option>
                <option value="expense">Gasto</option>
              </select>
            </div>

          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={savingEdit || editingCategories.length === 0}
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:opacity-50"
            >
              {savingEdit ? 'Guardando...' : 'Guardar cambios'}
            </button>

          </div>
        </form>
      )}

      {actionError && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{actionError}</p>}

      {/* HISTORIAL DE MOVIMIENTOS */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#11111B]">

        <div className="border-b border-white/10 px-5 py-5 md:px-6">
          <h2 className="font-semibold">Historial de movimientos</h2>
          <p className="mt-1 text-xs text-gray-500">
            {filteredTransactions.length} movimientos encontrados
          </p>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-medium text-gray-300">
              No se encontraron movimientos
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Probá cambiar los filtros o agregar un movimiento nuevo.
            </p>
          </div>
        ) : (
          <>
            {/* VISTA PARA CELULARES */}
            <div className="divide-y divide-white/5 md:hidden">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="space-y-4 p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        transaction.type === 'income'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <ArrowDownLeft size={20} />
                      ) : (
                        <ArrowUpRight size={20} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-white">
                        {transaction.description}
                      </p>
                      <p className="mt-1 truncate text-xs text-gray-500">
                        {transaction.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === 'income'
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount, currency)}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(transaction.date)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingTransaction(transaction)}
                        title="Editar movimiento"
                        aria-label="Editar movimiento"
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition hover:bg-violet-500/10 hover:text-violet-400"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              '¿Estás seguro de eliminar este movimiento?'
                            )
                          ) {
                            void handleDelete(transaction.id)
                          }
                        }}
                        title="Eliminar movimiento"
                        aria-label="Eliminar movimiento"
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition hover:bg-rose-500/10 hover:text-rose-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* VISTA PARA COMPUTADORAS */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">

                <thead className="border-b border-white/10 text-xs text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Movimiento</th>
                    <th className="px-6 py-4 font-medium">Categoría</th>
                    <th className="px-6 py-4 font-medium">Fecha</th>
                    <th className="px-6 py-4 text-right font-medium">Importe</th>
                    <th className="px-6 py-4 text-right font-medium">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="transition hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              transaction.type === 'income'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {transaction.type === 'income' ? (
                              <ArrowDownLeft size={19} />
                            ) : (
                              <ArrowUpRight size={19} />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-medium text-white">
                              {transaction.description}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-400">
                        {transaction.category}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-gray-400">
                        {formatDate(transaction.date)}
                      </td>

                      <td
                        className={`whitespace-nowrap px-6 py-4 text-right font-semibold ${
                          transaction.type === 'income'
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount, currency)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingTransaction(transaction)}
                            title="Editar movimiento"
                            aria-label="Editar movimiento"
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-violet-500/10 hover:text-violet-400"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  '¿Estás seguro de eliminar este movimiento?'
                                )
                              ) {
                                void handleDelete(transaction.id)
                              }
                            }}
                            title="Eliminar movimiento"
                            aria-label="Eliminar movimiento"
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
