import { downloadCsv, toCsv } from '@/lib/csv'
import type { RoutineExerciseWithExercise } from '@/lib/api/routines'
import { DAYS_OF_WEEK, MUSCLE_GROUPS, type Routine } from '@/types/database'

export function exportRoutineToCsv(routine: Routine, items: RoutineExerciseWithExercise[]): void {
  const header = ['Día', 'Orden', 'Ejercicio', 'Grupo muscular', 'Esquema', 'Descanso', 'Notas de técnica', 'Activo']
  const dayRank = new Map(DAYS_OF_WEEK.map((d, i) => [d.value, i]))

  const sorted = [...items].sort((a, b) => {
    const dayDiff = (dayRank.get(a.day_of_week) ?? 0) - (dayRank.get(b.day_of_week) ?? 0)
    return dayDiff !== 0 ? dayDiff : a.order_index - b.order_index
  })

  const rows = sorted.map((item) => {
    const dayLabel = DAYS_OF_WEEK.find((d) => d.value === item.day_of_week)?.label ?? item.day_of_week
    const groupLabel = item.exercises
      ? (MUSCLE_GROUPS.find((g) => g.value === item.exercises!.muscle_group)?.label ?? item.exercises.muscle_group)
      : ''
    return [
      dayLabel,
      item.order_index,
      item.exercises?.name ?? '',
      groupLabel,
      item.scheme_text,
      item.rest_text ?? '',
      item.technique_notes ?? '',
      item.active ? 'Sí' : 'No',
    ]
  })

  const csv = toCsv([header, ...rows])
  const safeName = routine.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase().replace(/^-+|-+$/g, '')
  downloadCsv(`rutina-${safeName || 'mi-gym'}.csv`, csv)
}
