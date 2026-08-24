import { differenceInCalendarDays, format, formatDistanceToNow, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import type { DayOfWeek } from '@/types/database'

const JS_DAY_TO_DAY_OF_WEEK: DayOfWeek[] = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']

export function todayDayOfWeek(date: Date = new Date()): DayOfWeek {
  return JS_DAY_TO_DAY_OF_WEEK[date.getDay()]
}

export function formatDate(date: string | Date, pattern = "d 'de' MMMM"): string {
  return format(new Date(date), pattern, { locale: es })
}

export function formatTime(date: Date = new Date()): string {
  return format(date, 'HH:mm', { locale: es })
}

export function daysSince(date: string | Date): number {
  return differenceInCalendarDays(new Date(), new Date(date))
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
