import { supabase } from '@/lib/supabase'
import { formatRestSeconds } from '@/lib/date'
import type { DayOfWeek, Exercise, Routine, RoutineExercise } from '@/types/database'

export type RoutineExerciseWithExercise = RoutineExercise & {
  exercises: Pick<Exercise, 'id' | 'name' | 'muscle_group' | 'gif_url'> | null
}

export async function listRoutines(): Promise<Routine[]> {
  const { data, error } = await supabase.from('routines').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function getActiveRoutine(): Promise<Routine | null> {
  const { data, error } = await supabase.from('routines').select('*').eq('is_active', true).maybeSingle()
  if (error) throw error
  return data
}

export async function createRoutine(name: string): Promise<Routine> {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  const { data, error } = await supabase
    .from('routines')
    .insert({ user_id: userData.user!.id, name, is_active: false })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function renameRoutine(id: string, name: string): Promise<Routine> {
  const { data, error } = await supabase.from('routines').update({ name }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function setActiveRoutine(id: string): Promise<void> {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  const { error: deactivateError } = await supabase
    .from('routines')
    .update({ is_active: false })
    .eq('user_id', userData.user!.id)
    .neq('id', id)
  if (deactivateError) throw deactivateError
  const { error } = await supabase.from('routines').update({ is_active: true }).eq('id', id)
  if (error) throw error
}

export async function deleteRoutine(id: string): Promise<void> {
  const { error } = await supabase.from('routines').delete().eq('id', id)
  if (error) throw error
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

export interface NewRoutineExerciseInput {
  routineId: string
  exerciseId: string
  dayOfWeek: DayOfWeek
  orderIndex: number
  schemeText: string
  restSeconds: number | null
  techniqueNotes: string | null
}

export async function addRoutineExercise(input: NewRoutineExerciseInput): Promise<RoutineExerciseWithExercise> {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  const { data, error } = await supabase
    .from('routine_exercises')
    .insert({
      user_id: userData.user!.id,
      routine_id: input.routineId,
      exercise_id: input.exerciseId,
      day_of_week: input.dayOfWeek,
      order_index: input.orderIndex,
      scheme_text: input.schemeText,
      rest_seconds: input.restSeconds,
      rest_text: formatRestSeconds(input.restSeconds),
      technique_notes: input.techniqueNotes,
      active: true,
    })
    .select('*, exercises(id, name, muscle_group, gif_url)')
    .single()
  if (error) throw error
  return data
}

export async function deleteRoutineExercise(id: string): Promise<void> {
  const { error } = await supabase.from('routine_exercises').delete().eq('id', id)
  if (error) throw error
}

export async function setRoutineExerciseActive(id: string, active: boolean): Promise<void> {
  const { error } = await supabase.from('routine_exercises').update({ active }).eq('id', id)
  if (error) throw error
}
