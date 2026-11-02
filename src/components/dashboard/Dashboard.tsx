
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import type { Transaction } from '../../types/transaction'
import type { Currency } from '../../hooks/useSettings'
import { formatCurrency } from '../../utils/formatCurrency'

interface DashboardProps {
  transactions: Transaction[]
  currency: Currency
}

export default function Dashboard({
  transactions,
  currency,
}: DashboardProps) {
  const now = new Date()

  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, '0')}`

  const currentMonthTransactions = transactions.filter(
    (transaction) => transaction.date.startsWith(currentMonth)
  )

  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const monthlyIncome = currentMonthTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const monthlyExpenses = currentMonthTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const balance = totalIncome - totalExpenses

  const chartData = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(
      now.getFullYear(),
      now.getMonth() - 5 + index,
      1
    )

    const monthKey = `${monthDate.getFullYear()}-${String(
      monthDate.getMonth() + 1
    ).padStart(2, '0')}`

    const monthTransactions = transactions.filter(
      (transaction) => transaction.date.startsWith(monthKey)
    )

    return {
      month: new Intl.DateTimeFormat('es-AR', {
        month: 'short',
      }).format(monthDate).replace('.', ''),

      income: monthTransactions
        .filter((transaction) => transaction.type === 'income')
        .reduce((total, transaction) => total + transaction.amount, 0),

      expenses: monthTransactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount, 0),
    }
  })

  const recentTransactions = [...transactions]
    .sort((a, b) => {
      return b.date.localeCompare(a.date) ||
        b.createdAt.localeCompare(a.createdAt)
    })
    .slice(0, 4)

  return (
    <div className="space-y-8">

      {/* ENCABEZADO */}
      <header>
        <p className="text-sm text-gray-400">
          Bienvenido de nuevo
        </p>
        <h1 className="mt-1 text-3xl font-bold text-white">
          Resumen financiero
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Aquí tenés un resumen de tus finanzas.
        </p>
      </header>

      {/* TARJETAS FINANCIERAS */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/20 to-[#151520] p-6">
          <Wallet className="text-violet-400" size={24} />
          <p className="mt-5 text-sm text-gray-400">Balance total</p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            {formatCurrency(balance, currency)}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#151520] p-6">
          <TrendingUp className="text-emerald-400" size={24} />
          <p className="mt-5 text-sm text-gray-400">Ingresos del mes</p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            {formatCurrency(monthlyIncome, currency)}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#151520] p-6">
          <TrendingDown className="text-rose-400" size={24} />
          <p className="mt-5 text-sm text-gray-400">Gastos del mes</p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            {formatCurrency(monthlyExpenses, currency)}
          </h2>
        </div>

      </section>

      {/* GRÁFICO Y MOVIMIENTOS */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        <div className="rounded-2xl border border-white/10 bg-[#151520] p-6 xl:col-span-2">
          <h3 className="mb-6 text-lg font-semibold text-white">
            Ingresos y gastos
          </h3>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292938" />
                <XAxis dataKey="month" stroke="#77778A" />
                <YAxis
                  stroke="#77778A"
                  tickFormatter={(value) =>
                    formatCurrency(Number(value), currency)
                  }
                />

                <Tooltip
                  formatter={(value) =>
                    formatCurrency(Number(value), currency)
                  }
                  contentStyle={{
                    backgroundColor: '#1C1C2A',
                    border: '1px solid #353548',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="income"
                  name="Ingresos"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.15}
                />

                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Gastos"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#151520] p-6">
          <h3 className="mb-6 text-lg font-semibold text-white">
            Últimos movimientos
          </h3>

          <div className="space-y-5">
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-gray-500">
                Todavía no tenés movimientos registrados.
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-3">

                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    transaction.type === 'income'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {transaction.type === 'income'
                      ? <ArrowDownLeft size={19} />
                      : <ArrowUpRight size={19} />
                    }
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.category} · {transaction.date}
                    </p>
                  </div>

                  <p className={`whitespace-nowrap text-sm font-semibold ${
                    transaction.type === 'income'
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount, currency)}
                  </p>

                </div>
              ))
            )}
          </div>
        </div>

      </section>
    </div>
  )
}
