
import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  disabled?: boolean
}

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function getToday() {
  return formatDate(new Date())
}

function addDays(date: Date, amount: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

export default function DatePicker({
  value,
  onChange,
  disabled = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(() =>
    value ? parseDate(value) : new Date()
  )

  const selectedDate = value ? parseDate(value) : null
  const today = getToday()

  useEffect(() => {
    if (value) {
      setVisibleMonth(parseDate(value))
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

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear()
    const month = visibleMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const mondayOffset = (firstDay.getDay() + 6) % 7

    const startDate = new Date(year, month, 1 - mondayOffset)

    return Array.from({ length: 42 }, (_, index) =>
      addDays(startDate, index)
    )
  }, [visibleMonth])

  const monthLabel = visibleMonth.toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric',
  })

  const formattedValue = selectedDate
    ? selectedDate.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'Seleccionar fecha'

  function selectDate(date: Date) {
    onChange(formatDate(date))
    setIsOpen(false)
  }

  function changeMonth(amount: number) {
    setVisibleMonth((current) =>
      new Date(
        current.getFullYear(),
        current.getMonth() + amount,
        1
      )
    )
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
        <span className={value ? 'text-white' : 'text-gray-500'}>
          {formattedValue}
        </span>

        <CalendarDays size={18} className="shrink-0 text-violet-400" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Seleccionar fecha"
          className="absolute left-0 top-full z-50 mt-2 w-full min-w-[290px] rounded-2xl border border-white/10 bg-[#151520] p-4 shadow-2xl sm:w-[320px]"
        >
          {/* ENCABEZADO DEL CALENDARIO */}
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label="Mes anterior"
              className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <ChevronLeft size={19} />
            </button>

            <h3 className="text-sm font-semibold capitalize text-white">
              {monthLabel}
            </h3>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label="Mes siguiente"
              className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <ChevronRight size={19} />
            </button>
          </div>

          {/* ACCESOS RÁPIDOS */}
          <div className="mb-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => selectDate(new Date())}
              className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-medium text-violet-300 transition hover:bg-violet-500/20 focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              Hoy
            </button>

            <button
              type="button"
              onClick={() => selectDate(addDays(new Date(), -1))}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              Ayer
            </button>
          </div>

          {/* DÍAS DE LA SEMANA */}
          <div className="mb-2 grid grid-cols-7 text-center">
            {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map((day) => (
              <span
                key={day}
                className="py-2 text-xs font-medium text-gray-500"
              >
                {day}
              </span>
            ))}
          </div>

          {/* DÍAS DEL MES */}
          <div className="grid grid-cols-7 gap-y-1">
            {calendarDays.map((day) => {
              const dayValue = formatDate(day)
              const isCurrentMonth =
                day.getMonth() === visibleMonth.getMonth()
              const isSelected = dayValue === value
              const isToday = dayValue === today

              return (
                <button
                  key={dayValue}
                  type="button"
                  onClick={() => selectDate(day)}
                  aria-label={day.toLocaleDateString('es-AR', {
                    dateStyle: 'full',
                  })}
                  aria-pressed={isSelected}
                  className={`mx-auto flex size-9 items-center justify-center rounded-lg text-xs transition focus-visible:ring-2 focus-visible:ring-violet-500 ${
                    isSelected
                      ? 'bg-violet-600 font-bold text-white'
                      : isToday
                        ? 'border border-violet-500/60 text-violet-300'
                        : isCurrentMonth
                          ? 'text-gray-300 hover:bg-white/10'
                          : 'text-gray-600 hover:bg-white/5'
                  }`}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>

          {/* PIE */}
          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
            <button
              type="button"
              onClick={() => {
                onChange('')
                setIsOpen(false)
              }}
              className="text-xs text-gray-500 transition hover:text-white focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              Limpiar fecha
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
