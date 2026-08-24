import { useCallback, useEffect, useState } from 'react'
import { createExercise, deleteExercise, listExercises } from '@/lib/api/exercises'
import type { Exercise, MuscleGroup } from '@/types/database'

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await listExercises()
    setExercises(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addExercise = async (name: string, muscleGroup: MuscleGroup) => {
    const created = await createExercise(name, muscleGroup)
    setExercises((prev) => [created, ...prev])
  }

  const removeExercise = async (id: string) => {
    await deleteExercise(id)
    setExercises((prev) => prev.filter((e) => e.id !== id))
  }

  return { exercises, loading, addExercise, removeExercise, refresh }
}
