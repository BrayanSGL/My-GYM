import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { MUSCLE_GROUPS, type Exercise } from '@/types/database'

interface ExerciseListItemProps {
  exercise: Exercise
  onDelete: (id: string) => void
}

export function ExerciseListItem({ exercise, onDelete }: ExerciseListItemProps) {
  const groupLabel = MUSCLE_GROUPS.find((g) => g.value === exercise.muscle_group)?.label ?? exercise.muscle_group

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Card className="flex items-center justify-between gap-3">
        <Link to={`/ejercicios/${exercise.id}`} className="flex flex-1 flex-col gap-1">
          <span className="text-lg font-medium text-text-primary">{exercise.name}</span>
          <Badge>{groupLabel}</Badge>
        </Link>
        <button
          type="button"
          aria-label={`Eliminar ${exercise.name}`}
          onClick={() => onDelete(exercise.id)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-danger"
        >
          ✕
        </button>
      </Card>
    </motion.div>
  )
}
