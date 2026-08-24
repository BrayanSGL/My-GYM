import { useCallback, useEffect, useState } from 'react'
import { createNote, deleteNote, listNotes, type NewNoteInput } from '@/lib/api/notes'
import type { Note } from '@/types/database'

type NoteWithExercise = Note & { exercises: { name: string } | null }

export function useNotes() {
  const [notes, setNotes] = useState<NoteWithExercise[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await listNotes()
    setNotes(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addNote = async (input: NewNoteInput) => {
    await createNote(input)
    await refresh()
  }

  const removeNote = async (id: string) => {
    await deleteNote(id)
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  return { notes, loading, addNote, removeNote, refresh }
}
