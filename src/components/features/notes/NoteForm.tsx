import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { NewNoteInput } from '@/lib/api/notes'
import type { Exercise } from '@/types/database'

interface NoteFormProps {
  exercises: Exercise[]
  onSubmit: (input: NewNoteInput) => Promise<void>
}

export function NoteForm({ exercises, onSubmit }: NoteFormProps) {
  const [content, setContent] = useState('')
  const [exerciseId, setExerciseId] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setSaving(true)
    try {
      await onSubmit({ content: content.trim(), exerciseId: exerciseId || null })
      setContent('')
      setExerciseId('')
    } finally {
      setSaving(false)
    }
  }

  const options = [{ value: '', label: 'General (sin ejercicio)' }, ...exercises.map((e) => ({ value: e.id, label: e.name }))]

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="note-content" className="text-sm text-text-secondary">
          Nota
        </label>
        <textarea
          id="note-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={3}
          className="rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3.5 py-2.5 text-base text-text-primary outline-none focus:border-accent-primary"
        />
      </div>
      <Select label="Ligar a un ejercicio" value={exerciseId} onChange={(e) => setExerciseId(e.target.value)} options={options} />
      <Button type="submit" disabled={saving}>
        {saving ? 'Guardando…' : 'Agregar nota'}
      </Button>
    </form>
  )
}
