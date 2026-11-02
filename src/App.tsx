
import { useState } from 'react'

import Sidebar from './components/layout/Sidebar'
import Dashboard from './components/dashboard/Dashboard'
import TransactionForm from './components/dashboard/TransactionForm'
import { useTransactions } from './hooks/useTransactions'
import Movements from './components/dashboard/Movements'
import Categories from './components/dashboard/Categories'
import { useCategories } from './hooks/useCategories'
import Budgets from './components/dashboard/Budgets'
import { useBudgets } from './hooks/useBudgets'
import Statistics from './components/dashboard/Statistics'
import Settings from './components/dashboard/Settings'
import { useSettings } from './hooks/useSettings'


function App() {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions()

  const {
  categories,
  addCategory,
  deleteCategory,
} = useCategories()

const {
  budgets,
  addBudget,
  deleteBudget,
} = useBudgets()

const {
  settings,
  updateCurrency,
} = useSettings()

  const [activePage, setActivePage] = useState('Dashboard')

  function handleAddTransaction(transaction: Parameters<typeof addTransaction>[0]) {
    addTransaction(transaction)
    setActivePage('Dashboard')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0B12]">

      <Sidebar
        activeItem={activePage}
        onNavigate={setActivePage}
        onNewTransaction={() => setActivePage('Nuevo movimiento')}
      />

      <main className="min-w-0 flex-1 overflow-y-auto p-5 text-white md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">

          {activePage === 'Dashboard' && (
            <Dashboard
  transactions={transactions}
  currency={settings.currency}
/>
          )}

{activePage === 'Nuevo movimiento' && (
  <TransactionForm
    onAdd={handleAddTransaction}
    categories={categories}
  />
)}

{activePage === 'Movimientos' && (
<Movements
  transactions={transactions}
  currency={settings.currency}
  onDelete={deleteTransaction}
  onUpdate={updateTransaction}
/>
)}
{activePage === 'Categorías' && (
  <Categories
    categories={categories}
    transactions={transactions}
    onAdd={addCategory}
    onDelete={deleteCategory}
  />
)}
{activePage === 'Presupuestos' && (
<Budgets
  budgets={budgets}
  categories={categories}
  transactions={transactions}
  currency={settings.currency}
  onAdd={addBudget}
  onDelete={deleteBudget}
/>
)}
{activePage === 'Estadísticas' && (
<Statistics
  transactions={transactions}
  currency={settings.currency}
/>
)}

{activePage === 'Configuración' && (
  <Settings
  currency={settings.currency}
  onCurrencyChange={updateCurrency}
/>
)}

{![
  'Dashboard',
  'Nuevo movimiento',
  'Movimientos',
  'Categorías',
  'Presupuestos',
  'Estadísticas',
  'Configuración',
].includes(activePage) && (
            <div>
              <h1 className="text-3xl font-bold">{activePage}</h1>
              <p className="mt-2 text-sm text-gray-400">
                Esta sección estará disponible próximamente.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default App
