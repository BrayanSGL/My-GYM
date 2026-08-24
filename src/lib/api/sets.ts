import { supabase } from '@/lib/supabase'
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
