import { useCallback, useEffect, useState } from 'react'
import { createSet, deleteSet, listSetsForExercise, type NewSetInput } from '@/lib/api/sets'
import type { WorkoutSet } from '@/types/database'

export function useSets(exerciseId: string | undefined) {
  const [sets, setSets] = useState<WorkoutSet[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!exerciseId) return
    setLoading(true)
    const data = await listSetsForExercise(exerciseId)
    setSets(data)
    setLoading(false)
  }, [exerciseId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addSet = async (input: NewSetInput) => {
    const created = await createSet(input)
    setSets((prev) => [created, ...prev])
  }

  const removeSet = async (id: string) => {
    await deleteSet(id)
    setSets((prev) => prev.filter((s) => s.id !== id))
  }

  return { sets, loading, addSet, removeSet, refresh }
}
