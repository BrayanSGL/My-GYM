import { differenceInCalendarDays, format, formatDistanceToNow, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import type { DayOfWeek } from '@/types/database'

const JS_DAY_TO_DAY_OF_WEEK: DayOfWeek[] = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']

export function todayDayOfWeek(date: Date = new Date()): DayOfWeek {
  return JS_DAY_TO_DAY_OF_WEEK[date.getDay()]
}

/**
 * Fecha local en formato YYYY-MM-DD. A diferencia de `date.toISOString().slice(0, 10)`,
 * usa el calendario del dispositivo (no UTC) — evita que series/mediciones cerca de la
 * medianoche queden guardadas con la fecha del día anterior o siguiente.
 */
export function localDateStamp(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * `new Date("YYYY-MM-DD")` lo interpreta el motor de JS como medianoche UTC, no como
 * medianoche local — en husos horarios detrás de UTC eso muestra el día anterior. Para
 * fechas "sin hora" (set_date, measured_at si algún día vuelve a ser date) armamos el
 * Date con los componentes locales en vez de dejar que se interprete como UTC.
 */
function parseDateInput(date: string | Date): Date {
  if (date instanceof Date) return date
  const match = DATE_ONLY_PATTERN.exec(date)
  if (match) {
    const [, year, month, day] = match
    return new Date(Number(year), Number(month) - 1, Number(day))
  }
  return new Date(date)
}

export function formatDate(date: string | Date, pattern = "d 'de' MMMM"): string {
  return format(parseDateInput(date), pattern, { locale: es })
}

export function formatTime(date: Date = new Date()): string {
  return format(date, 'HH:mm', { locale: es })
}

export function daysSince(date: string | Date): number {
  return differenceInCalendarDays(new Date(), parseDateInput(date))
}

export function greetingForHour(hour: number = new Date().getHours()): string {
  if (hour < 12) return 'Buenos días'
  if (hour < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { locale: es, addSuffix: true })
}

export function startOfIsoWeek(date: Date = new Date()): Date {
  return startOfWeek(date, { locale: es, weekStartsOn: 1 })
}

export function formatRestSeconds(seconds: number | null): string | null {
  if (seconds == null) return null
  if (seconds < 60) return `Descanso ${seconds} s`
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return remainder === 0 ? `Descanso ${minutes} min` : `Descanso ${minutes}:${String(remainder).padStart(2, '0')} min`
}
