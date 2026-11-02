
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

import type { Transaction } from '../../types/transaction'
import type { Currency } from '../../hooks/useSettings'
import { formatCurrency } from '../../utils/formatCurrency'

interface StatisticsProps {
  transactions: Transaction[]
  currency: Currency
}

const COLORS = [
  '#8B5CF6',
  '#10B981',
  '#F59E0B',
  '#3B82F6',
  '#EC4899',
  '#06B6D4',
  '#F43F5E',
]

function getLastSixMonths() {
  const months = []
  const today = new Date()

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - i,
      1
    )

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')

    months.push({
      key: `${year}-${month}`,
      name: date.toLocaleDateString('es-AR', {
        month: 'short',
      }),
      income: 0,
      expense: 0,
    })
  }

  return months
}

export default function Statistics({
  transactions,
  currency,
}: StatisticsProps) {
  const months = getLastSixMonths()

  transactions.forEach((transaction) => {
    const month = months.find((item) =>
      transaction.date.startsWith(item.key)
    )

    if (!month) return

    if (transaction.type === 'income') {
      month.income += transaction.amount
    } else {
      month.expense += transaction.amount
    }
  })

  const totalIncome = transactions
    .filter((item) => item.type === 'income')
    .reduce((total, item) => total + item.amount, 0)

  const totalExpenses = transactions
    .filter((item) => item.type === 'expense')
    .reduce((total, item) => total + item.amount, 0)

  const balance = totalIncome - totalExpenses

  const expensesByCategory = transactions
    .filter((item) => item.type === 'expense')
    .reduce((result, item) => {
      result[item.category] =
        (result[item.category] || 0) + item.amount

      return result
    }, {} as Record<string, number>)

  const categoryData = Object.entries(expensesByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const highestCategory = categoryData[0]

  return (
    <section className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">Estadísticas</h1>
        <p className="mt-2 text-sm text-gray-400">
          Analizá tus ingresos y gastos para entender tus finanzas.
        </p>
      </div>

      {/* RESUMEN GENERAL */}
      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-white/10 bg-[#11111B] p-6">
          <p className="text-sm text-gray-400">Ingresos totales</p>
          <p className="mt-3 text-2xl font-bold text-emerald-400">
            {formatCurrency(totalIncome, currency)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#11111B] p-6">
          <p className="text-sm text-gray-400">Gastos totales</p>
          <p className="mt-3 text-2xl font-bold text-rose-400">
            {formatCurrency(totalExpenses, currency)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#11111B] p-6">
          <p className="text-sm text-gray-400">Balance general</p>
          <p className={`mt-3 text-2xl font-bold ${
            balance >= 0 ? 'text-white' : 'text-rose-400'
          }`}>
            {formatCurrency(balance, currency)}
          </p>
        </div>

      </div>

      {/* INGRESOS Y GASTOS POR MES */}
      <div className="rounded-2xl border border-white/10 bg-[#11111B] p-6">
        <h2 className="font-semibold">Ingresos y gastos</h2>
        <p className="mt-1 text-xs text-gray-500">
          Comparación de los últimos 6 meses
        </p>

        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={months}>
              <CartesianGrid
                stroke="#ffffff10"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                stroke="#9CA3AF"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#9CA3AF"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  formatCurrency(Number(value), currency)
                }
              />

              <Tooltip
                cursor={false}
                formatter={(value) =>
                  formatCurrency(Number(value), currency)
                }
                contentStyle={{
                  backgroundColor: '#11111B',
                  border: '1px solid #ffffff20',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />

              <Legend />

              <Bar
                dataKey="income"
                name="Ingresos"
                fill="#10B981"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="expense"
                name="Gastos"
                fill="#F43F5E"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DISTRIBUCIÓN DE GASTOS */}
      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border border-white/10 bg-[#11111B] p-6">
          <h2 className="font-semibold">Gastos por categoría</h2>
          <p className="mt-1 text-xs text-gray-500">
            Distribución de todos tus gastos registrados
          </p>

          {categoryData.length === 0 ? (
            <p className="py-16 text-center text-sm text-gray-500">
              Todavía no hay gastos registrados.
            </p>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={55}
                    paddingAngle={3}
                  >
                    {categoryData.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    cursor={false}
                    formatter={(value) =>
                      formatCurrency(Number(value), currency)
                    }
                    contentStyle={{
                      backgroundColor: '#11111B',
                      border: '1px solid #ffffff20',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* MAYOR GASTO */}
        <div className="rounded-2xl border border-white/10 bg-[#11111B] p-6">
          <h2 className="font-semibold">Mayor gasto</h2>
          <p className="mt-1 text-xs text-gray-500">
            Categoría en la que más dinero gastaste
          </p>

          {highestCategory ? (
            <div className="mt-8">
              <p className="text-sm text-gray-400">
                Categoría principal
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {highestCategory.name}
              </p>

              <p className="mt-3 text-3xl font-bold text-rose-400">
                {formatCurrency(highestCategory.value, currency)}
              </p>
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-gray-500">
              Todavía no hay gastos registrados.
            </p>
          )}
        </div>

      </div>

    </section>
  )
}
