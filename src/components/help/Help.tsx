
import { useState } from 'react'
import {
  BookOpen,
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  Wallet,
  PiggyBank,
  ChartNoAxesCombined,
  Settings,
  ShieldCheck,
  ChevronDown,
  CircleHelp,
} from 'lucide-react'

const helpSections = [
  {
    title: 'Primeros pasos',
    icon: BookOpen,
    description: 'Conocé cómo comenzar a utilizar FinTrack.',
    content: [
      {
        question: '¿Qué es FinTrack?',
        answer:
          'FinTrack es una aplicación de finanzas personales que te permite registrar tus ingresos y gastos, organizar tus movimientos, establecer presupuestos y controlar tus ahorros.',
      },
      {
        question: '¿Cómo comienzo a utilizarlo?',
        answer:
          'Comenzá registrando tus ingresos y gastos desde la opción Nuevo movimiento. Luego podrás consultar toda tu información desde el Dashboard.',
      },
    ],
  },
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Entendé el resumen de tus finanzas.',
    content: [
      {
        question: '¿Qué información muestra?',
        answer:
          'El Dashboard presenta un resumen de tus ingresos, gastos y balance. También permite visualizar información general sobre tus movimientos.',
      },
      {
        question: '¿Qué significa el balance?',
        answer:
          'Es la diferencia entre tus ingresos y tus gastos. Si es positivo, tus ingresos superan tus gastos. Si es negativo, gastaste más de lo que ingresaste.',
      },
    ],
  },
  {
    title: 'Movimientos',
    icon: ArrowLeftRight,
    description: 'Administrá tus ingresos y gastos.',
    content: [
      {
        question: '¿Cómo registro un movimiento?',
        answer:
          'Seleccioná Nuevo movimiento, elegí si es un ingreso o un gasto, completá la descripción, categoría, importe y fecha, y guardá el registro.',
      },
      {
        question: '¿Puedo editar o eliminar movimientos?',
        answer:
          'Sí. Desde Movimientos podés consultar tus registros y utilizar las opciones disponibles para editar o eliminar cada uno.',
      },
    ],
  },
  {
    title: 'Categorías',
    icon: Tags,
    description: 'Organizá tus movimientos.',
    content: [
      {
        question: '¿Para qué sirven las categorías?',
        answer:
          'Permiten clasificar tus ingresos y gastos para mantener organizada tu información financiera.',
      },
      {
        question: '¿Puedo crear categorías propias?',
        answer:
          'Sí. Desde Categorías podés agregar nuevas categorías y eliminar las que ya no necesites.',
      },
    ],
  },
  {
    title: 'Presupuestos',
    icon: Wallet,
    description: 'Establecé límites para tus gastos.',
    content: [
      {
        question: '¿Cómo funciona un presupuesto?',
        answer:
          'Podés establecer un importe máximo para una categoría durante un mes determinado. FinTrack utiliza tus movimientos para mostrar cuánto llevás gastado.',
      },
      {
        question: '¿Puedo modificar un presupuesto?',
        answer:
          'Sí. Desde Presupuestos podés agregar, editar o eliminar tus límites de gasto.',
      },
    ],
  },
  {
    title: 'Ahorros',
    icon: PiggyBank,
    description: 'Organizá tus objetivos de ahorro.',
    content: [
      {
        question: '¿Cómo creo una meta?',
        answer:
          'Ingresá en Ahorros, seleccioná la opción para crear una meta y completá su nombre, importe objetivo y fecha estimada si corresponde.',
      },
      {
        question: '¿Cómo agrego dinero a una meta?',
        answer:
          'Podés registrar aportes manualmente. FinTrack suma esos aportes y actualiza el progreso de tu objetivo.',
      },
      {
        question: '¿Los ingresos se agregan automáticamente?',
        answer:
          'No. Los ahorros se administran mediante aportes manuales. Registrar un ingreso no modifica automáticamente tus metas.',
      },
    ],
  },
  {
    title: 'Estadísticas',
    icon: ChartNoAxesCombined,
    description: 'Analizá el comportamiento de tus finanzas.',
    content: [
      {
        question: '¿Qué muestran las estadísticas?',
        answer:
          'Podés consultar gráficos de ingresos y gastos de los últimos seis meses, distribución de gastos por categoría y balances.',
      },
      {
        question: '¿Qué es el balance mensual pasado?',
        answer:
          'Muestra la diferencia entre los ingresos y los gastos del mes anterior. Se presenta en verde cuando es positivo y en rojo cuando es negativo.',
      },
    ],
  },
  {
    title: 'Configuración',
    icon: Settings,
    description: 'Personalizá las opciones de tu cuenta.',
    content: [
      {
        question: '¿Puedo cambiar la moneda?',
        answer:
          'Sí. Desde Configuración podés seleccionar ARS, USD o EUR. El cambio modifica el formato en el que se muestran los importes, pero no realiza una conversión cambiaria.',
      },
    ],
  },
  {
    title: 'Cuenta y seguridad',
    icon: ShieldCheck,
    description: 'Conocé cómo se protege tu información.',
    content: [
      {
        question: '¿Mis datos están separados de los de otros usuarios?',
        answer:
          'Sí. FinTrack utiliza autenticación y políticas de seguridad en la base de datos para que cada usuario pueda acceder únicamente a sus propios registros.',
      },
      {
        question: '¿Cómo cierro sesión?',
        answer:
          'Podés cerrar tu sesión utilizando el botón con el ícono de salida ubicado junto a la información de tu cuenta, en el menú lateral.',
      },
    ],
  },
]

export default function Help() {
  const [openSection, setOpenSection] = useState<string | null>(
    'Primeros pasos'
  )
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      {/* ENCABEZADO */}
      <div>
        <div className="mb-3 flex items-center gap-2 text-violet-400">
          <CircleHelp size={20} />
          <span className="text-sm font-medium">Soporte y documentación</span>
        </div>

        <h1 className="text-3xl font-bold">Centro de ayuda</h1>

        <p className="mt-2 max-w-2xl text-sm text-gray-400">
          Encontrá información sobre las herramientas de FinTrack y aprendé
          a aprovechar mejor sus funciones.
        </p>
      </div>

      {/* SECCIONES */}
      <div className="space-y-4">
        {helpSections.map((section) => {
          const Icon = section.icon
          const isOpen = openSection === section.title

          return (
            <div
              key={section.title}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#11111B]"
            >
              <button
                onClick={() => {
                  setOpenSection(isOpen ? null : section.title)
                  setOpenQuestion(null)
                }}
                className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-white/[0.03]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Icon size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-white">
                    {section.title}
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    {section.description}
                  </p>
                </div>

                <ChevronDown
                  size={19}
                  className={`shrink-0 text-gray-500 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="space-y-2 border-t border-white/10 p-4">
                  {section.content.map((item) => {
                    const questionId = `${section.title}-${item.question}`
                    const questionIsOpen = openQuestion === questionId

                    return (
                      <div
                        key={questionId}
                        className="rounded-xl bg-white/[0.03]"
                      >
                        <button
                          onClick={() =>
                            setOpenQuestion(
                              questionIsOpen ? null : questionId
                            )
                          }
                          className="flex w-full items-center justify-between gap-3 p-4 text-left text-sm font-medium text-gray-200 transition hover:text-violet-400"
                        >
                          {item.question}

                          <ChevronDown
                            size={16}
                            className={`shrink-0 text-gray-500 transition-transform ${
                              questionIsOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {questionIsOpen && (
                          <p className="px-4 pb-4 text-sm leading-6 text-gray-400">
                            {item.answer}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* PIE */}
      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
        <div className="flex items-start gap-3">
          <CircleHelp
            size={22}
            className="mt-0.5 shrink-0 text-violet-400"
          />

          <div>
            <h3 className="font-semibold text-white">
              ¿Necesitás más información?
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Esta sección reúne las principales funciones de FinTrack.
              Si tenés dudas sobre alguna herramienta, consultá el apartado
              correspondiente para conocer cómo utilizarla.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
