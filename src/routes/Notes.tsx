import { AnimatePresence } from 'framer-motion'
import { NoteForm } from '@/components/features/notes/NoteForm'
import { NoteListItem } from '@/components/features/notes/NoteListItem'
import { useExercises } from '@/hooks/useExercises'
import { useNotes } from '@/hooks/useNotes'

export default function Notes() {
  const { notes, loading, addNote, removeNote } = useNotes()
  const { exercises } = useExercises()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-3xl text-text-primary">Notas</h1>

      <NoteForm exercises={exercises} onSubmit={addNote} />

      <div className="flex flex-col gap-3">
        {loading ? (
          <p className="text-text-muted">Cargando…</p>
        ) : notes.length === 0 ? (
          <p className="text-text-muted">Todavía no escribiste notas.</p>
        ) : (
          <AnimatePresence initial={false}>
            {notes.map((note) => (
              <NoteListItem key={note.id} note={note} onDelete={removeNote} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
