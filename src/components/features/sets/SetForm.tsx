import { motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { NewSetInput } from '@/lib/api/sets'

interface SetFormInitialValues {
  weight?: string
  reps?: string
  rpe?: string
  note?: string
}

interface SetFormPlaceholders {
  weight?: string
  reps?: string
}

interface SetFormProps {
  exerciseId: string
  onSubmit: (input: NewSetInput) => Promise<void>
  initialValues?: SetFormInitialValues
  placeholders?: SetFormPlaceholders
}

export function SetForm({ exerciseId, onSubmit, initialValues, placeholders }: SetFormProps) {
  const [weight, setWeight] = useState(initialValues?.weight ?? '')
  const [reps, setReps] = useState(initialValues?.reps ?? '')
  const [rpe, setRpe] = useState(initialValues?.rpe ?? '')
  const [note, setNote] = useState(initialValues?.note ?? '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!weight || !reps) return
    setSaving(true)
    try {
      await onSubmit({
        exerciseId,
        weight: Number(weight),
        reps: Number(reps),
        rpe: rpe ? Number(rpe) : null,
        note: note.trim() || null,
      })
      setWeight('')
      setReps('')
      setRpe('')
      setNote('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Peso (kg)"
          type="number"
          inputMode="decimal"
          step="0.5"
          min="0"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder={placeholders?.weight}
          required
        />
        <Input
          label="Repeticiones"
          type="number"
          inputMode="numeric"
          min="1"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder={placeholders?.reps}
          required
        />
      </div>
      <Input
        label="RPE (opcional)"
        type="number"
        inputMode="decimal"
        step="0.5"
        min="0"
        max="10"
        value={rpe}
        onChange={(e) => setRpe(e.target.value)}
      />
      <Input label="Nota (opcional)" value={note} onChange={(e) => setNote(e.target.value)} />
      <Button type="submit" disabled={saving}>
        {saving ? 'Guardando…' : 'Registrar serie'}
      </Button>
    </motion.form>
  )
}
