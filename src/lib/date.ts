import { format, formatDistanceToNow, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatDate(date: string | Date, pattern = "d 'de' MMMM"): string {
  return format(new Date(date), pattern, { locale: es })
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { locale: es, addSuffix: true })
}

export function startOfIsoWeek(date: Date = new Date()): Date {
  return startOfWeek(date, { locale: es, weekStartsOn: 1 })
}
