import { supabase } from '@/lib/supabase'
import type { Exercise, MuscleGroup } from '@/types/database'

export async function listExercises(): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createExercise(name: string, muscleGroup: MuscleGroup): Promise<Exercise> {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  const { data, error } = await supabase
    .from('exercises')
    .insert({ name, muscle_group: muscleGroup, user_id: userData.user!.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteExercise(id: string): Promise<void> {
  const { error } = await supabase.from('exercises').delete().eq('id', id)
  if (error) throw error
}

export async function getExercise(id: string): Promise<Exercise | null> {
  const { data, error } = await supabase.from('exercises').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

export async function uploadExerciseGif(userId: string, exerciseId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'gif'
  const path = `${userId}/${exerciseId}.${ext}`
  const { error: uploadError } = await supabase.storage.from('exercise-gifs').upload(path, file, { upsert: true })
  if (uploadError) throw uploadError
  const { data } = supabase.storage.from('exercise-gifs').getPublicUrl(path)
  const gifUrl = `${data.publicUrl}?t=${Date.now()}`

  const { error } = await supabase.from('exercises').update({ gif_url: gifUrl }).eq('id', exerciseId)
  if (error) throw error

  return gifUrl
}
