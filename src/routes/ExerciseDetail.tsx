import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { SetForm } from '@/components/features/sets/SetForm'
import { SetHistoryList } from '@/components/features/sets/SetHistoryList'
import { getExercise } from '@/lib/api/exercises'
import { useSets } from '@/hooks/useSets'
import type { Exercise } from '@/types/database'

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const { sets, addSet, removeSet } = useSets(id)

  useEffect(() => {
    if (id) getExercise(id).then(setExercise)
  }, [id])

  const personalRecord = useMemo(() => {
    if (sets.length === 0) return null
    return [...sets].sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight
      if (b.reps !== a.reps) return b.reps - a.reps
      return b.set_date.localeCompare(a.set_date)
    })[0]
  }, [sets])

  if (!id) return null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/ejercicios" className="text-sm text-text-secondary">
          ← Ejercicios
        </Link>
        <h1 className="font-heading text-3xl text-text-primary">{exercise?.name ?? 'Ejercicio'}</h1>
      </div>

      {personalRecord && (
        <Card className="border-accent-primary/40 bg-surface-raised">
          <p className="text-sm text-text-secondary">Récord personal</p>
          <p className="font-heading text-2xl text-accent-primary">
            {personalRecord.weight} kg × {personalRecord.reps}
          </p>
        </Card>
      )}

      <div>
        <h2 className="mb-3 text-lg text-text-primary">Registrar serie</h2>
        <SetForm exerciseId={id} onSubmit={addSet} />
      </div>

      <div>
        <h2 className="mb-3 text-lg text-text-primary">Historial</h2>
        <SetHistoryList sets={sets} onDelete={removeSet} />
      </div>
    </div>
  )
}
