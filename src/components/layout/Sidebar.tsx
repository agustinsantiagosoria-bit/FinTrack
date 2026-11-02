
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
      { name: 'Estadísticas', icon: ChartNoAxesCombined },
    ],
  },
]

interface SidebarProps {
  activeItem: string
  onNavigate: (page: string) => void
  onNewTransaction: () => void
}

export default function Sidebar({
  activeItem,
  onNavigate,
  onNewTransaction,
}: SidebarProps) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-[#11111B] px-5 py-6 text-white">

      {/* LOGO */}
      <div className="mb-10 flex items-center gap-3 px-2">
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

      {/* NUEVO MOVIMIENTO */}
      <button
        onClick={onNewTransaction}
        className="mb-8 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold transition hover:bg-violet-500"
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
  console.log('Sidebar envía:', item.name)
  onNavigate(item.name)
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
          onClick={() => onNavigate('Configuración')}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
        >
          <Settings size={19} />
          Configuración
        </button>

        <button
          onClick={() => onNavigate('Ayuda')}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
        >
          <CircleHelp size={19} />
          Ayuda
        </button>
      </div>

      {/* PERFIL */}
      <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-400">
          AS
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            Mi cuenta
          </p>
          <p className="text-xs text-gray-500">
            Usuario FinTrack
          </p>
        </div>

        <LogOut size={17} className="text-gray-500" />
      </div>

    </aside>
  )
}
