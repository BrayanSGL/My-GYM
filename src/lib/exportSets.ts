import { downloadCsv, toCsv } from '@/lib/csv'
import { formatDate, localDateStamp } from '@/lib/date'
import type { SetWithExerciseInfo } from '@/lib/api/sets'
import { MUSCLE_GROUPS } from '@/types/database'

export function exportSetsToCsv(sets: SetWithExerciseInfo[], rangeLabel: string): void {
  const header = ['Fecha', 'Ejercicio', 'Grupo muscular', 'Peso (kg)', 'Repeticiones', 'RPE', 'Nota']

  const rows = sets.map((s) => {
    const groupLabel = s.exercises
      ? (MUSCLE_GROUPS.find((g) => g.value === s.exercises!.muscle_group)?.label ?? s.exercises.muscle_group)
      : ''
    return [formatDate(s.set_date, 'yyyy-MM-dd'), s.exercises?.name ?? '', groupLabel, s.weight, s.reps, s.rpe ?? '', s.note ?? '']
  })

  const csv = toCsv([header, ...rows])
  const safeRange = rangeLabel.replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  downloadCsv(`series-${safeRange}-${localDateStamp()}.csv`, csv)
}
