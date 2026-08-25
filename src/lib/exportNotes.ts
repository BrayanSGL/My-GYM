import { downloadCsv, toCsv } from '@/lib/csv'
import { formatDate, localDateStamp } from '@/lib/date'
import type { Note } from '@/types/database'

type NoteWithExercise = Note & { exercises: { name: string } | null }

export function exportNotesToCsv(notes: NoteWithExercise[], rangeLabel: string): void {
  const header = ['Fecha', 'Ejercicio', 'Nota']

  const rows = notes.map((n) => [formatDate(n.created_at, 'yyyy-MM-dd HH:mm'), n.exercises?.name ?? 'General', n.content])

  const csv = toCsv([header, ...rows])
  const safeRange = rangeLabel.replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  downloadCsv(`notas-${safeRange}-${localDateStamp()}.csv`, csv)
}
