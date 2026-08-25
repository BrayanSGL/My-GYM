import { supabase } from '@/lib/supabase'
import { localDateStamp } from '@/lib/date'
import type { WorkoutSet } from '@/types/database'

export interface NewSetInput {
  exerciseId: string
  weight: number
  reps: number
  rpe: number | null
  note: string | null
}

export async function listSetsForExercise(exerciseId: string): Promise<WorkoutSet[]> {
  const { data, error } = await supabase
    .from('workout_sets')
    .select('*')
    .eq('exercise_id', exerciseId)
    .order('set_date', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function listRecentSetsForExercise(exerciseId: string, limit = 12): Promise<WorkoutSet[]> {
  const { data, error } = await supabase
    .from('workout_sets')
    .select('*')
    .eq('exercise_id', exerciseId)
    .order('set_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function listRecentSets(limit = 5): Promise<(WorkoutSet & { exercises: { name: string } | null })[]> {
  const { data, error } = await supabase
    .from('workout_sets')
    .select('*, exercises(name)')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function countSetsSince(isoDate: string): Promise<number> {
  const { count, error } = await supabase
    .from('workout_sets')
    .select('*', { count: 'exact', head: true })
    .gte('set_date', isoDate)
  if (error) throw error
  return count ?? 0
}

export type SetWithExerciseInfo = WorkoutSet & { exercises: { name: string; muscle_group: string } | null }

export async function listSetsInRange(startDate: string, endDate: string): Promise<SetWithExerciseInfo[]> {
  const { data, error } = await supabase
    .from('workout_sets')
    .select('*, exercises(name, muscle_group)')
    .gte('set_date', startDate)
    .lte('set_date', endDate)
    .order('set_date', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function getLastWorkoutDate(): Promise<string | null> {
  const { data, error } = await supabase
    .from('workout_sets')
    .select('set_date')
    .order('set_date', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data?.set_date ?? null
}

export async function createSet(input: NewSetInput): Promise<WorkoutSet> {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  const { data, error } = await supabase
    .from('workout_sets')
    .insert({
      exercise_id: input.exerciseId,
      weight: input.weight,
      reps: input.reps,
      rpe: input.rpe,
      note: input.note,
      user_id: userData.user!.id,
      set_date: localDateStamp(),
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteSet(id: string): Promise<void> {
  const { error } = await supabase.from('workout_sets').delete().eq('id', id)
  if (error) throw error
}
