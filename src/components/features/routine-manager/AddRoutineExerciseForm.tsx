import { motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { NewRoutineExerciseInput } from '@/lib/api/routines'
import type { DayOfWeek, Exercise } from '@/types/database'

interface AddRoutineExerciseFormProps {
  exercises: Exercise[]
  routineId: string
  day: DayOfWeek
  nextOrderIndex: number
  onSubmit: (input: NewRoutineExerciseInput) => Promise<void>
  onCancel: () => void
}

export function AddRoutineExerciseForm({
  exercises,
  routineId,
  day,
  nextOrderIndex,
  onSubmit,
  onCancel,
}: AddRoutineExerciseFormProps) {
  const [exerciseId, setExerciseId] = useState(exercises[0]?.id ?? '')
  const [orderIndex, setOrderIndex] = useState(String(nextOrderIndex))
  const [schemeText, setSchemeText] = useState('')
  const [restSeconds, setRestSeconds] = useState('')
  const [techniqueNotes, setTechniqueNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!exerciseId || !schemeText.trim()) return
    setSaving(true)
    try {
      await onSubmit({
        routineId,
        exerciseId,
        dayOfWeek: day,
        orderIndex: Number(orderIndex) || nextOrderIndex,
        schemeText: schemeText.trim(),
        restSeconds: restSeconds.trim() === '' ? null : Number(restSeconds),
        techniqueNotes: techniqueNotes.trim() || null,
      })
      setSchemeText('')
      setRestSeconds('')
      setTechniqueNotes('')
    } finally {
      setSaving(false)
    }
  }

  if (exercises.length === 0) {
    return <p className="text-sm text-text-muted">Primero creá al menos un ejercicio en la pestaña "Ejercicios".</p>
  }

  return (
    <motion.form
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 overflow-hidden"
    >
      <Select
        label="Ejercicio"
        value={exerciseId}
        onChange={(e) => setExerciseId(e.target.value)}
        options={exercises.map((ex) => ({ value: ex.id, label: ex.name }))}
      />
      <Input label="Esquema (ej. 3 series × 10–12 reps)" value={schemeText} onChange={(e) => setSchemeText(e.target.value)} required />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Orden en el día" type="number" inputMode="numeric" min="1" value={orderIndex} onChange={(e) => setOrderIndex(e.target.value)} />
        <Input label="Descanso (segundos)" type="number" inputMode="numeric" min="0" value={restSeconds} onChange={(e) => setRestSeconds(e.target.value)} />
      </div>
      <Input label="Notas de técnica (opcional)" value={techniqueNotes} onChange={(e) => setTechniqueNotes(e.target.value)} />
      <div className="flex gap-2">
        <Button type="submit" disabled={saving} className="flex-1">
          {saving ? 'Guardando…' : 'Agregar al día'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </motion.form>
  )
}
