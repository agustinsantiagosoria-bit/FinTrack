
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  Wallet,
  ChartNoAxesCombined,
  Settings,
  CircleHelp,
  LogOut,
  Plus,
  CreditCard,
  PiggyBank,
  Code2,
  X,
} from 'lucide-react'

const navigation = [
  {
    title: 'PRINCIPAL',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard },
      { name: 'Movimientos', icon: ArrowLeftRight },
      { name: 'Categorías', icon: Tags },
    ],
  },
{
  title: 'FINANZAS',
  items: [
    { name: 'Presupuestos', icon: Wallet },
    { name: 'Ahorros', icon: PiggyBank },
    { name: 'Estadísticas', icon: ChartNoAxesCombined },
  ],
},
]

interface SidebarProps {
  activeItem: string
  onNavigate: (page: string) => void
  onNewTransaction: () => void
  userName: string
  onSignOut: () => Promise<void>
  isMobileOpen: boolean
  onCloseMobile: () => void
}

export default function Sidebar({
  activeItem,
  onNavigate,
  onNewTransaction,
  userName,
  onSignOut,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] md:hidden"
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[min(82vw,18rem)] shrink-0 flex-col overflow-y-auto overflow-x-hidden border-r border-white/10 bg-[#11111B] px-5 py-6 text-white shadow-2xl transition-transform duration-300 md:static md:z-auto md:w-64 md:translate-x-0 md:shadow-none ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>

      {/* LOGO */}
      <div className="mb-8 flex items-center justify-between gap-3 px-2 md:mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/20">
            <CreditCard size={22} />
          </div>
          <div>
          <h1 className="text-xl font-bold tracking-tight">
            Fin<span className="text-violet-400">Track</span>
          </h1>
          <p className="text-xs text-gray-500">
            Personal Finance
          </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Cerrar menú"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-white/5 hover:text-white md:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* NUEVO MOVIMIENTO */}
      <button
        onClick={onNewTransaction}
        className="mb-8 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold transition hover:bg-violet-500"
      >
        <Plus size={18} />
        Nuevo movimiento
      </button>

      {/* NAVEGACIÓN */}
      <nav className="flex-1 space-y-8">
        {navigation.map((section) => (
          <div key={section.title}>
            <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.18em] text-gray-500">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = activeItem === item.name

                return (
                  <button
                    key={item.name}
                    onClick={() => {
  onNavigate(item.name)
  onCloseMobile()
}}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                      isActive
                        ? 'bg-violet-600/15 font-semibold text-violet-400'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={19} />
                    {item.name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* CONFIGURACIÓN */}
      <div className="space-y-1 border-t border-white/10 pt-5">
        <button
          onClick={() => { onNavigate('Configuración'); onCloseMobile() }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
        >
          <Settings size={19} />
          Configuración
        </button>

        <button
          onClick={() => { onNavigate('Ayuda'); onCloseMobile() }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
        >
          <CircleHelp size={19} />
          Ayuda
        </button>
      </div>
      
      <button
  onClick={() => { onNavigate('Acerca del desarrollador'); onCloseMobile() }}
  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
>
  <Code2 size={19} />
  Acerca del desarrollador
</button>
{/* PERFIL Y CERRAR SESIÓN */}
<div className="mt-auto shrink-0 border-t border-white/10 pt-5">
  <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
    {/* Avatar */}
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-400">
      {userName.charAt(0).toUpperCase()}
    </div>

    {/* Información de la cuenta */}
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold text-white">
        Mi cuenta
      </p>
      <p className="truncate text-xs text-gray-500">
        {userName}
      </p>
    </div>

    {/* Cerrar sesión */}
    <button
      type="button"
      onClick={onSignOut}
      title="Cerrar sesión"
      aria-label="Cerrar sesión"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
    >
      <LogOut size={19} />
    </button>
  </div>
</div>
      </aside>
    </>
  )
}
