import { supabase } from '@/lib/supabase'
import type { Exercise, Routine, RoutineExercise } from '@/types/database'

export type RoutineExerciseWithExercise = RoutineExercise & {
  exercises: Pick<Exercise, 'id' | 'name' | 'muscle_group' | 'gif_url'> | null
}

export async function getActiveRoutine(): Promise<Routine | null> {
  const { data, error } = await supabase.from('routines').select('*').eq('is_active', true).maybeSingle()
  if (error) throw error
  return data
}

export async function listRoutineExercises(routineId: string): Promise<RoutineExerciseWithExercise[]> {
  const { data, error } = await supabase
    .from('routine_exercises')
    .select('*, exercises(id, name, muscle_group, gif_url)')
    .eq('routine_id', routineId)
    .order('order_index', { ascending: true })

  if (error) {
    // gif_url no existe todavía (falta correr supabase/schema_session.sql): reintentamos sin esa columna.
    if (error.code === '42703') {
      const fallback = await supabase
        .from('routine_exercises')
        .select('*, exercises(id, name, muscle_group)')
        .eq('routine_id', routineId)
        .order('order_index', { ascending: true })
      if (fallback.error) throw fallback.error
      return fallback.data.map((row) => ({
        ...row,
        exercises: row.exercises ? { ...row.exercises, gif_url: null } : null,
      })) as RoutineExerciseWithExercise[]
    }
    throw error
  }

  return data
}
