
import { useState } from 'react'
import {
  PiggyBank,
  Plus,
  Target,
  TrendingUp,
  Trash2,
  X,
  CalendarDays,
} from 'lucide-react'
import type { SavingsGoal } from '../../types/savings'
import DatePicker from '../ui/DataPicker'

interface SavingsProps {
  goals: SavingsGoal[]
  currency: 'ARS' | 'USD' | 'EUR'
  onAddGoal: (
    name: string,
    targetAmount: number,
    targetDate: string | null
  ) => Promise<void>
  onAddContribution: (
    goalId: string,
    amount: number,
    date: string,
    description: string
  ) => Promise<void>
  onDeleteGoal: (goalId: string) => Promise<void>
  onDeleteContribution: (goalId: string, contributionId: string) => Promise<void>
}

function getTodayDate() {
  const today = new Date()
  const offset = today.getTimezoneOffset()

  return new Date(today.getTime() - offset * 60000)
    .toISOString()
    .split('T')[0]
}

export default function Savings({
  goals,
  currency,
  onAddGoal,
  onAddContribution,
  onDeleteGoal,
  onDeleteContribution,
}: SavingsProps) {
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [targetDate, setTargetDate] = useState('')

  const [contributionAmount, setContributionAmount] = useState('')
  const [contributionDate, setContributionDate] = useState(getTodayDate())
  const [description, setDescription] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)

  const totalSaved = goals.reduce(
    (total, goal) => total + goal.totalSaved,
    0
  )

  const totalTarget = goals.reduce(
    (total, goal) => total + goal.targetAmount,
    0
  )

  async function handleAddGoal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const amount = Number(targetAmount)

    if (!name.trim() || !Number.isFinite(amount) || amount <= 0) {
      setError('Ingresá un nombre y un objetivo válido.')
      return
    }

    setSaving(true)
    setError('')

    try {
      await onAddGoal(name, amount, targetDate || null)
      setName('')
      setTargetAmount('')
      setTargetDate('')
      setShowGoalForm(false)
    } catch {
      setError('No se pudo crear la meta. Intentá nuevamente.')
    } finally {
      setSaving(false)
    }
  }

  async function handleAddContribution(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const amount = Number(contributionAmount)

    if (!selectedGoal || !Number.isFinite(amount) || amount <= 0 || !contributionDate) {
      setError('Ingresá un aporte válido y una fecha.')
      return
    }

    setSaving(true)
    setError('')

    try {
      await onAddContribution(
        selectedGoal,
        amount,
        contributionDate,
        description
      )

      setContributionAmount('')
      setDescription('')
      setContributionDate(getTodayDate())
      setSelectedGoal(null)
    } catch {
      setError('No se pudo registrar el aporte.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteContribution(goalId: string, contributionId: string) {
    if (!window.confirm('¿Querés eliminar este aporte? El total ahorrado se actualizará.')) return

    setError('')
    try {
      await onDeleteContribution(goalId, contributionId)
    } catch {
      setError('No se pudo eliminar el aporte. Intentá nuevamente.')
    }
  }

  async function handleDeleteGoal(goalId: string) {
    if (!window.confirm('¿Querés eliminar esta meta y todos sus aportes?')) {
      return
    }

    setError('')
    try {
      await onDeleteGoal(goalId)
    } catch {
      setError('No se pudo eliminar la meta.')
    }
  }

  return (
    <section className="space-y-8">
      {/* ENCABEZADO */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-violet-400">
            <PiggyBank size={22} />
            <span className="text-sm font-semibold">PLANIFICACIÓN FINANCIERA</span>
          </div>

          <h1 className="text-3xl font-bold">Mis ahorros</h1>
          <p className="mt-2 text-sm text-gray-400">
            Organizá tus objetivos y seguí tu progreso.
          </p>
        </div>

        <button
          onClick={() => {
            setError('')
            setShowGoalForm(true)
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
        >
          <Plus size={18} />
          Nueva meta
        </button>
      </div>

      {/* RESUMEN */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#151520] p-5">
          <div className="mb-3 flex items-center gap-2 text-gray-400">
            <TrendingUp size={19} />
            <span className="text-sm">Total ahorrado</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">
            {formatMoney(totalSaved)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#151520] p-5">
          <div className="mb-3 flex items-center gap-2 text-gray-400">
            <Target size={19} />
            <span className="text-sm">Objetivo total</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatMoney(totalTarget)}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* FORMULARIO NUEVA META */}
      {showGoalForm && (
        <form
          onSubmit={handleAddGoal}
          className="space-y-4 rounded-2xl border border-violet-500/30 bg-[#151520] p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Crear objetivo</h2>
            <button
              type="button"
              onClick={() => setShowGoalForm(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Nombre de la meta
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Comprar una PC"
              required
              disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              ¿Cuánto querés ahorrar?
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="Ej: 1500000"
              required
              disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Fecha objetivo (opcional)
            </label>
            <DatePicker
              value={targetDate}
              onChange={setTargetDate}
              disabled={saving}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold hover:bg-violet-500 disabled:opacity-50"
          >
            {saving ? 'Creando...' : 'Crear meta'}
          </button>
        </form>
      )}

      {/* FORMULARIO DE APORTE */}
      {selectedGoal && (
        <form
          onSubmit={handleAddContribution}
          className="space-y-4 rounded-2xl border border-emerald-500/30 bg-[#151520] p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Registrar aporte</h2>
            <button
              type="button"
              onClick={() => setSelectedGoal(null)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Importe del aporte
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              placeholder="Ej: 20000"
              required
              disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Fecha del aporte
            </label>
            <DatePicker
              value={contributionDate}
              onChange={setContributionDate}
              disabled={saving}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Descripción (opcional)
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Ahorro de esta semana"
              disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar aporte'}
          </button>
        </form>
      )}

      {/* METAS */}
      {goals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#151520]/50 px-6 py-16 text-center">
          <PiggyBank size={42} className="mx-auto mb-4 text-violet-400" />
          <h2 className="text-lg font-semibold">Todavía no tenés metas</h2>
          <p className="mt-2 text-sm text-gray-400">
            Creá tu primer objetivo y empezá a ahorrar.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {goals.map((goal) => {
            const progress = Math.min(
              (goal.totalSaved / goal.targetAmount) * 100,
              100
            )

            const remaining = Math.max(
              goal.targetAmount - goal.totalSaved,
              0
            )

            const completed = goal.totalSaved >= goal.targetAmount

            return (
              <article
                key={goal.id}
                className="rounded-2xl border border-white/10 bg-[#151520] p-6"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-violet-400">
                      <Target size={19} />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Objetivo de ahorro
                      </span>
                    </div>
                    <h2 className="text-xl font-bold">{goal.name}</h2>
                  </div>

                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    title="Eliminar meta"
                    className="rounded-lg p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mb-2 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-400">Ahorrado</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      {formatMoney(goal.totalSaved)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-violet-400">
                    {progress.toFixed(1)}%
                  </span>
                </div>

                <div className="mb-4 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mb-5 flex justify-between gap-2 text-sm">
                  <span className="text-gray-400">
                    Objetivo: {formatMoney(goal.targetAmount)}
                  </span>
                  <span className="text-gray-400">
                    Falta: {formatMoney(remaining)}
                  </span>
                </div>

                {goal.targetDate && (
                  <p className="mb-4 flex items-center gap-2 text-xs text-gray-400">
                    <CalendarDays size={15} />
                    Fecha objetivo: {new Date(
                      `${goal.targetDate}T12:00:00`
                    ).toLocaleDateString('es-AR')}
                  </p>
                )}

                {completed && (
                  <p className="mb-4 text-sm font-semibold text-emerald-400">
                    ¡Objetivo alcanzado!
                  </p>
                )}

                <div className="mb-5 border-t border-white/10 pt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Últimos aportes
                  </p>

                  {goal.contributions.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Todavía no registraste aportes.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {goal.contributions.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <span className="min-w-0 truncate text-gray-400">
                            {item.description || new Date(
                              `${item.date}T12:00:00`
                            ).toLocaleDateString('es-AR')}
                          </span>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="font-medium text-emerald-400">+{formatMoney(item.amount)}</span>
                            <button type="button" onClick={() => handleDeleteContribution(goal.id, item.id)} title="Eliminar aporte" className="rounded p-1 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setError('')
                    setSelectedGoal(goal.id)
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600/15 px-4 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-600/25"
                >
                  <Plus size={18} />
                  Agregar aporte
                </button>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
