import { useCallback, useEffect, useState } from 'react'
import {
  createRoutine,
  deleteRoutine,
  listRoutines,
  renameRoutine,
  setActiveRoutine,
} from '@/lib/api/routines'
import type { Routine } from '@/types/database'

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await listRoutines()
    setRoutines(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addRoutine = async (name: string) => {
    const created = await createRoutine(name)
    setRoutines((prev) => [...prev, created])
    return created
  }

  const rename = async (id: string, name: string) => {
    const updated = await renameRoutine(id, name)
    setRoutines((prev) => prev.map((r) => (r.id === id ? updated : r)))
  }

  const activate = async (id: string) => {
    await setActiveRoutine(id)
    setRoutines((prev) => prev.map((r) => ({ ...r, is_active: r.id === id })))
  }

  const remove = async (id: string) => {
    await deleteRoutine(id)
    setRoutines((prev) => prev.filter((r) => r.id !== id))
  }

  return { routines, loading, addRoutine, rename, activate, remove, refresh }
}
