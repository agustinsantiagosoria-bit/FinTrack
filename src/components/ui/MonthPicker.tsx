
import { useEffect, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

interface MonthPickerProps {
  value: string
  onChange: (month: string) => void
  disabled?: boolean
}

const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

function getCurrentMonth() {
  const today = new Date()

  return `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, '0')}`
}

function parseMonth(value: string) {
  const [year, month] = value.split('-').map(Number)

  return { year, month }
}

export default function MonthPicker({
  value,
  onChange,
  disabled = false,
}: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const [visibleYear, setVisibleYear] = useState(() =>
    value ? parseMonth(value).year : new Date().getFullYear()
  )

  const selectedMonth = value ? parseMonth(value) : null

  useEffect(() => {
    if (value) {
      setVisibleYear(parseMonth(value).year)
    }
  }, [value])

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const formattedValue = selectedMonth
    ? `${months[selectedMonth.month - 1]} ${selectedMonth.year}`
    : 'Seleccionar mes'

  function selectMonth(monthIndex: number) {
    const monthValue = `${visibleYear}-${String(
      monthIndex + 1
    ).padStart(2, '0')}`

    onChange(monthValue)
    setIsOpen(false)
  }

  function changeYear(amount: number) {
    setVisibleYear((current) => current + amount)
  }

  function selectCurrentMonth() {
    const current = getCurrentMonth()
    onChange(current)
    setIsOpen(false)
  }

  return (
    <div className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0B0B12] px-4 py-3 text-left text-sm text-white outline-none transition hover:border-violet-500/60 focus-visible:ring-2 focus-visible:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={value ? 'capitalize text-white' : 'text-gray-500'}>
          {formattedValue}
        </span>

        <CalendarDays size={18} className="shrink-0 text-violet-400" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Seleccionar mes"
          className="absolute left-0 top-full z-50 mt-2 w-full min-w-[290px] rounded-2xl border border-white/10 bg-[#151520] p-4 shadow-2xl sm:w-[320px]"
        >
          {/* ENCABEZADO */}
          <div className="mb-5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => changeYear(-1)}
              aria-label="Año anterior"
              className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <ChevronLeft size={19} />
            </button>

            <h3 className="text-base font-semibold text-white">
              {visibleYear}
            </h3>

            <button
              type="button"
              onClick={() => changeYear(1)}
              aria-label="Año siguiente"
              className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <ChevronRight size={19} />
            </button>
          </div>

          {/* MESES */}
          <div className="grid grid-cols-3 gap-2">
            {months.map((monthName, index) => {
              const isSelected =
                selectedMonth?.year === visibleYear &&
                selectedMonth?.month === index + 1

              const current = parseMonth(getCurrentMonth())

              const isCurrentMonth =
                current.year === visibleYear &&
                current.month === index + 1

              return (
                <button
                  key={monthName}
                  type="button"
                  onClick={() => selectMonth(index)}
                  aria-pressed={isSelected}
                  className={`rounded-xl px-2 py-3 text-xs font-medium transition focus-visible:ring-2 focus-visible:ring-violet-500 ${
                    isSelected
                      ? 'bg-violet-600 font-bold text-white'
                      : isCurrentMonth
                        ? 'border border-violet-500/50 text-violet-300 hover:bg-violet-500/10'
                        : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {monthName}
                </button>
              )
            })}
          </div>

          {/* PIE */}
          <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3">
            <button
              type="button"
              onClick={selectCurrentMonth}
              className="text-xs font-medium text-violet-400 transition hover:text-violet-300 focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              Mes actual
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
