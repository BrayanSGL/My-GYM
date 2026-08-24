import { Select } from '@/components/ui/Select'
import type { Exercise } from '@/types/database'

interface ExercisePickerProps {
  exercises: Exercise[]
  value: string
  onChange: (id: string) => void
}

export function ExercisePicker({ exercises, value, onChange }: ExercisePickerProps) {
  const options = exercises.map((e) => ({ value: e.id, label: e.name }))
  return (
    <Select
      label="Ejercicio"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={[{ value: '', label: 'Elegí un ejercicio' }, ...options]}
    />
  )
}
