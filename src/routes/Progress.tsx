import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { ExercisePicker } from '@/components/features/progress/ExercisePicker'
import { WeightLineChart } from '@/components/features/progress/WeightLineChart'
import { useExercises } from '@/hooks/useExercises'
import { useSets } from '@/hooks/useSets'

export default function Progress() {
  const { exercises } = useExercises()
  const [exerciseId, setExerciseId] = useState('')
  const { sets, loading } = useSets(exerciseId || undefined)

  const personalRecord = useMemo(() => {
    if (sets.length === 0) return null
    return [...sets].sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight
      if (b.reps !== a.reps) return b.reps - a.reps
      return b.set_date.localeCompare(a.set_date)
    })[0]
  }, [sets])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-3xl text-text-primary">Progreso</h1>

      <ExercisePicker exercises={exercises} value={exerciseId} onChange={setExerciseId} />

      {!exerciseId && <p className="text-text-muted">Elegí un ejercicio para ver su evolución.</p>}

      {exerciseId && loading && <p className="text-text-muted">Cargando…</p>}

      {exerciseId && !loading && sets.length === 0 && (
        <p className="text-text-muted">Todavía no hay series registradas para este ejercicio.</p>
      )}

      {exerciseId && !loading && sets.length > 0 && (
        <>
          {personalRecord && (
            <Card className="bg-surface-raised">
              <p className="text-sm text-text-secondary">Récord personal</p>
              <p className="font-heading text-2xl text-accent-secondary">
                {personalRecord.weight} kg × {personalRecord.reps}
              </p>
            </Card>
          )}
          <Card>
            <WeightLineChart sets={sets} />
          </Card>
        </>
      )}
    </div>
  )
}
