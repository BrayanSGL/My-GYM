import { useCallback, useEffect, useState } from 'react'
import {
  addRoutineExercise,
  deleteRoutineExercise,
  listRoutineExercises,
  setRoutineExerciseActive,
  type NewRoutineExerciseInput,
  type RoutineExerciseWithExercise,
} from '@/lib/api/routines'

export function useRoutineExercises(routineId: string | null) {
  const [items, setItems] = useState<RoutineExerciseWithExercise[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!routineId) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const data = await listRoutineExercises(routineId)
    setItems(data)
    setLoading(false)
  }, [routineId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addItem = async (input: NewRoutineExerciseInput) => {
    const created = await addRoutineExercise(input)
    setItems((prev) => [...prev, created].sort((a, b) => a.order_index - b.order_index))
  }

  const removeItem = async (id: string) => {
    await deleteRoutineExercise(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const setActive = async (id: string, active: boolean) => {
    await setRoutineExerciseActive(id, active)
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, active } : i)))
  }

  return { items, loading, addItem, removeItem, setActive, refresh }
}
