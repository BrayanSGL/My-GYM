import { supabase } from '@/lib/supabase'
import type { Note } from '@/types/database'

export interface NewNoteInput {
  content: string
  exerciseId: string | null
}

export async function listNotes(): Promise<(Note & { exercises: { name: string } | null })[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*, exercises(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createNote(input: NewNoteInput): Promise<Note> {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  const { data, error } = await supabase
    .from('notes')
    .insert({ content: input.content, exercise_id: input.exerciseId, user_id: userData.user!.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (error) throw error
}
