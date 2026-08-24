import { motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { MUSCLE_GROUPS, type MuscleGroup } from '@/types/database'

interface ExerciseFormProps {
  onSubmit: (name: string, muscleGroup: MuscleGroup) => Promise<void>
  onCancel: () => void
}

export function ExerciseForm({ onSubmit, onCancel }: ExerciseFormProps) {
  const [name, setName] = useState('')
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('pecho')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await onSubmit(name.trim(), muscleGroup)
      setName('')
      setMuscleGroup('pecho')
    } finally {
      setSaving(false)
    }
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
      <Input label="Nombre del ejercicio" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
      <Select
        label="Grupo muscular"
        value={muscleGroup}
        onChange={(e) => setMuscleGroup(e.target.value as MuscleGroup)}
        options={MUSCLE_GROUPS}
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={saving} className="flex-1">
          {saving ? 'Guardando…' : 'Agregar ejercicio'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </motion.form>
  )
}
