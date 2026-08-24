import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/date'
import type { Note } from '@/types/database'

interface NoteListItemProps {
  note: Note & { exercises: { name: string } | null }
  onDelete: (id: string) => void
}

export function NoteListItem({ note, onDelete }: NoteListItemProps) {
  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Card className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <p className="flex-1 text-text-primary">{note.content}</p>
          <button
            type="button"
            aria-label="Eliminar nota"
            onClick={() => onDelete(note.id)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-danger"
          >
            ✕
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted">{formatDate(note.created_at)}</span>
          {note.exercises && <Badge>{note.exercises.name}</Badge>}
        </div>
      </Card>
    </motion.div>
  )
}
