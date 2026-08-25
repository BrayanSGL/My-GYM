import { addMonths, differenceInCalendarDays } from 'date-fns'

export const ROUTINE_CYCLE_MONTHS = 3

export function nextReviewDate(cycleStartedAt: string): Date {
  return addMonths(new Date(cycleStartedAt), ROUTINE_CYCLE_MONTHS)
}

export function daysUntilReview(cycleStartedAt: string): number {
  return differenceInCalendarDays(nextReviewDate(cycleStartedAt), new Date())
}

export function formatReviewCountdown(days: number): string {
  if (days > 1) return `Faltan ${days} días para revisar tu rutina`
  if (days === 1) return 'Mañana toca revisar tu rutina'
  if (days === 0) return 'Hoy toca revisar tu rutina'
  const overdue = Math.abs(days)
  return overdue === 1 ? 'Ayer tocaba revisar tu rutina' : `Hace ${overdue} días que toca revisar tu rutina`
}
