
import type { FormEvent } from 'react'
import { PlusCircle } from 'lucide-react'
import type { Transaction, TransactionType } from '../../types/transaction'
import { useEffect, useState } from 'react'
import type { Category } from '../../types/category'

interface TransactionFormProps {
  onAdd: (transaction: Transaction) => void
  categories: Category[]
}

function getTodayDate() {
  const today = new Date()
  const offset = today.getTimezoneOffset()
  return new Date(today.getTime() - offset * 60000)
    .toISOString()
    .split('T')[0]
}

export default function TransactionForm({
  onAdd,
  categories,
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense')
  const [description, setDescription] = useState('')
const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(getTodayDate())

  const availableCategories = categories.filter(
  (item) => item.type === type
)

useEffect(() => {
  const categoryExists = availableCategories.some(
    (item) => item.name === category
  )

  if (!categoryExists) {
    setCategory(availableCategories[0]?.name ?? '')
  }
}, [categories, type, category])

function handleTypeChange(newType: TransactionType) {
  setType(newType)
}

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const numericAmount = Number(amount)

    if (!description.trim() || !category || !date || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      return
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type,
      description: description.trim(),
      category,
      amount: numericAmount,
      date,
      createdAt: new Date().toISOString(),
    }

    onAdd(newTransaction)

    setDescription('')
    setAmount('')
    setDate(getTodayDate())
  }

  const isIncome = type === 'income'

  return (
    <section className="rounded-2xl border border-white/10 bg-[#151520] p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          Nuevo movimiento
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Registrá un ingreso o un gasto.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* TIPO */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Tipo de movimiento
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                isIncome
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/10 text-gray-400 hover:bg-white/5'
              }`}
            >
              Ingreso
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                !isIncome
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                  : 'border-white/10 text-gray-400 hover:bg-white/5'
              }`}
            >
              Gasto
            </button>
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-300">
            Descripción
          </label>

          <input
            id="description"
            type="text"
            required
            maxLength={80}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Ej. Compra de supermercado"
            className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500"
          />
        </div>

        {/* CATEGORÍA */}
        <div>
          <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-300">
            Categoría
          </label>

          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
          >

            {availableCategories.length === 0 && (
  <option value="">
    No hay categorías disponibles
  </option>
)}
{availableCategories.map((item) => (
  <option key={item.id} value={item.name}>
    {item.name}
  </option>
))}
required
disabled={availableCategories.length === 0}
          </select>
        </div>

        {/* IMPORTE Y FECHA */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="amount" className="mb-2 block text-sm font-medium text-gray-300">
              Importe (ARS)
            </label>

            <input
              id="amount"
              type="number"
              required
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0,00"
              className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label htmlFor="date" className="mb-2 block text-sm font-medium text-gray-300">
              Fecha
            </label>

            <input
              id="date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* GUARDAR */}
        <button
          type="submit"
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
            isIncome
              ? 'bg-emerald-600 hover:bg-emerald-500'
              : 'bg-violet-600 hover:bg-violet-500'
          }`}
        >
          <PlusCircle size={18} />
          Registrar {isIncome ? 'ingreso' : 'gasto'}
        </button>

      </form>
    </section>
  )
}
