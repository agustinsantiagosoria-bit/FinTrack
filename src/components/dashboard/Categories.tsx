
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus, Trash2, Tags } from 'lucide-react'
import type { Category, CategoryType } from '../../types/category'
import type { Transaction } from '../../types/transaction'

interface CategoriesProps {
  categories: Category[]
  transactions: Transaction[]
  onAdd: (name: string, type: CategoryType) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function Categories({
  categories,
  transactions,
  onAdd,
  onDelete,
}: CategoriesProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<CategoryType>('expense')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const filteredCategories = categories.filter(
    (category) => category.type === type
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName || saving) return

    const alreadyExists = categories.some(
      (category) =>
        category.type === type &&
        category.name.toLowerCase() === trimmedName.toLowerCase()
    )

    if (alreadyExists) {
      setError('Esta categoría ya existe.')
      return
    }

    setSaving(true)
    setError('')

    try {
      await onAdd(trimmedName, type)
      setName('')
    } catch {
      setError('No se pudo crear la categoría. Intentá nuevamente.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(category: Category) {
    if (deletingId) return

    const confirmed = window.confirm(
      `¿Eliminar la categoría "${category.name}"?`
    )

    if (!confirmed) return

    setDeletingId(category.id)
    setError('')

    try {
      await onDelete(category.id)
    } catch {
      setError('No se pudo eliminar la categoría. Intentá nuevamente.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="space-y-8">

      {/* ENCABEZADO */}
      <div>
        <h1 className="text-3xl font-bold">Categorías</h1>
        <p className="mt-2 text-sm text-gray-400">
          Organizá tus ingresos y gastos.
        </p>
      </div>

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-white/10 bg-[#11111B] p-6"
      >
        <h2 className="text-lg font-semibold">
          Crear categoría
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Nombre
            </label>

            <input
              type="text"
              required
              maxLength={40}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej. Educación"
              disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Tipo de categoría
            </label>

            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value as CategoryType)
              }
              disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
            >
              <option value="income">Ingreso</option>
              <option value="expense">Gasto</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          {saving ? 'Guardando...' : 'Agregar categoría'}
        </button>
      </form>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* LISTADO */}
      <div className="rounded-2xl border border-white/10 bg-[#11111B]">

        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="font-semibold">Mis categorías</h2>
          <p className="mt-1 text-xs text-gray-500">
            {filteredCategories.length} categorías disponibles
          </p>
        </div>

        {/* FILTROS */}
        <div className="flex gap-3 border-b border-white/10 px-6 py-4">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`rounded-lg px-4 py-2 text-sm ${
              type === 'expense'
                ? 'bg-rose-500/10 text-rose-400'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            Gastos
          </button>

          <button
            type="button"
            onClick={() => setType('income')}
            className={`rounded-lg px-4 py-2 text-sm ${
              type === 'income'
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            Ingresos
          </button>
        </div>

        {/* CATEGORÍAS */}
        <div className="divide-y divide-white/5">
          {filteredCategories.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-500">
              No hay categorías disponibles.
            </div>
          ) : (
            filteredCategories.map((category) => {
              const usageCount = transactions.filter(
                (transaction) =>
                  transaction.category === category.name &&
                  transaction.type === category.type
              ).length

              const isUsed = usageCount > 0

              return (
                <div
                  key={category.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                      <Tags size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-white">
                        {category.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {usageCount}{' '}
                        {usageCount === 1
                          ? 'movimiento asociado'
                          : 'movimientos asociados'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isUsed || deletingId !== null}
                    onClick={() => handleDelete(category)}
                    title={
                      isUsed
                        ? 'No podés eliminar una categoría que está en uso'
                        : 'Eliminar categoría'
                    }
                    className={`rounded-lg p-2 transition ${
                      isUsed || deletingId !== null
                        ? 'cursor-not-allowed text-gray-700'
                        : 'text-gray-500 hover:bg-rose-500/10 hover:text-rose-400'
                    }`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
