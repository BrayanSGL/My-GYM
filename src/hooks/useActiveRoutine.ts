import { useEffect, useState } from 'react'
import { getActiveRoutine, listRoutineExercises, type RoutineExerciseWithExercise } from '@/lib/api/routines'
import type { Routine } from '@/types/database'

export function useActiveRoutine() {
  const [routine, setRoutine] = useState<Routine | null>(null)
  const [items, setItems] = useState<RoutineExerciseWithExercise[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const activeRoutine = await getActiveRoutine()
      setRoutine(activeRoutine)
      if (activeRoutine) {
        setItems(await listRoutineExercises(activeRoutine.id))
      }
      setLoading(false)
    }
    load()
  }, [])

  return { routine, items, loading }
}
