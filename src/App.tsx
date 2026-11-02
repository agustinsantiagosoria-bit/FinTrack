
import { useState } from 'react'
import { Menu } from 'lucide-react'

import Auth from './components/auth/Auth'
import { useAuth } from './hooks/useAuth'

import Sidebar from './components/layout/Sidebar'
import Dashboard from './components/dashboard/Dashboard'
import TransactionForm from './components/dashboard/TransactionForm'
import Movements from './components/dashboard/Movements'
import Categories from './components/dashboard/Categories'
import Budgets from './components/dashboard/Budgets'
import Statistics from './components/dashboard/Statistics'
import Settings from './components/dashboard/Settings'
import Savings from './components/savings/Savings'
import Help from './components/help/Help'
import About from './components/about/About'

import { useTransactions } from './hooks/useTransactions'
import { useCategories } from './hooks/useCategories'
import { useBudgets } from './hooks/useBudgets'
import { useSettings } from './hooks/useSettings'
import { useSavings } from './hooks/useSavings'

// Control de autenticación
function App() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0B12] text-white">
        <p className="text-gray-400">Cargando FinTrack...</p>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return <AuthenticatedApp user={user} onSignOut={signOut} />
}

// Aplicación principal
function AuthenticatedApp({
  user,
  onSignOut,
}: {
  user: import('@supabase/supabase-js').User
  onSignOut: () => Promise<void>
}) {
  const [activePage, setActivePage] = useState('Dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function handleNavigate(page: string) {
    setActivePage(page)
    setMobileMenuOpen(false)
  }

  // Movimientos
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions(user.id)

  // Categorías
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    addCategory,
    deleteCategory,
  } = useCategories(user.id)

  // Presupuestos
const {
  budgets,
  loading: budgetsLoading,
  error: budgetsError,
  addBudget,
  updateBudget,
  deleteBudget,
} = useBudgets(user.id)

  // Configuración
// Configuración
const {
  settings,
  loading: settingsLoading,
  error: settingsError,
  updateCurrency,
} = useSettings(user.id)

// Ahorros
const {
  goals,
  loading: savingsLoading,
  error: savingsError,
  addGoal,
  addContribution,
  deleteContribution,
  deleteGoal,
} = useSavings(user.id)

  // Esperar a que se carguen los datos
  if (transactionsLoading || categoriesLoading || budgetsLoading || settingsLoading || savingsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0B12] text-white">
        <p className="text-gray-400">Cargando FinTrack...</p>
      </div>
    )
  }
  

  // Agregar movimiento
  async function handleAddTransaction(
    transaction: Parameters<typeof addTransaction>[0]
  ) {
    await addTransaction(transaction)
    setActivePage('Dashboard')
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#0B0B12]">
      <Sidebar
        activeItem={activePage}
        onNavigate={handleNavigate}
        onNewTransaction={() => handleNavigate('Nuevo movimiento')}
        userName={user.user_metadata?.full_name || 'Mi cuenta'}
        onSignOut={onSignOut}
        isMobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <main className="h-screen min-w-0 flex-1 overflow-y-auto p-4 text-white sm:p-5 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6 md:space-y-8">
          <header className="-mx-4 -mt-4 mb-5 flex items-center justify-between border-b border-white/10 bg-[#11111B] px-4 py-3 sm:-mx-5 sm:-mt-5 sm:px-5 md:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600">
                <span className="text-sm font-bold">FT</span>
              </div>
              <div>
                <p className="text-base font-bold tracking-tight">Fin<span className="text-violet-400">Track</span></p>
                <p className="text-[10px] text-gray-500">Personal Finance</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menú de navegación"
              aria-expanded={mobileMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-200 transition hover:bg-white/10"
            >
              <Menu size={21} />
            </button>
          </header>

          {transactionsError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {transactionsError}
            </div>
          )}

          {categoriesError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {categoriesError}
            </div>
          )}
          {budgetsError && (
  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
    {budgetsError}
  </div>
)}

{settingsError && (
  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
    {settingsError}
  </div>
)}

{savingsError && (
  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
    {savingsError}
  </div>
)}
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
              categories={categories}
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
              onUpdate={updateBudget}
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

          {activePage === 'Ayuda' && <Help />}

          {activePage === 'Acerca del desarrollador' && <About />}

          {activePage === 'Ahorros' && (
  <Savings
    goals={goals}
    currency={settings.currency}
    onAddGoal={addGoal}
    onAddContribution={addContribution}
    onDeleteGoal={deleteGoal}
    onDeleteContribution={deleteContribution}
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
            'Ahorros',
            'Ayuda',
            'Acerca del desarrollador',
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
