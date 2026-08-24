import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { MUSCLE_GROUPS } from '@/types/database'
import type { RoutineExerciseWithExercise } from '@/lib/api/routines'

export function RoutineExerciseItem({ item }: { item: RoutineExerciseWithExercise }) {
  const exercise = item.exercises
  const groupLabel = exercise
    ? (MUSCLE_GROUPS.find((g) => g.value === exercise.muscle_group)?.label ?? exercise.muscle_group)
    : null

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Card className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-text-muted">{item.order_index}.</span>
            {exercise ? (
              <Link to={`/ejercicios/${exercise.id}`} className="text-lg font-medium text-text-primary underline-offset-2 hover:underline">
                {exercise.name}
              </Link>
            ) : (
              <span className="text-lg font-medium text-text-primary">Ejercicio eliminado</span>
            )}
          </div>
          {groupLabel && <Badge>{groupLabel}</Badge>}
        </div>

        <p className="text-sm text-accent-secondary">{item.scheme_text}</p>
        {item.rest_text && <p className="text-sm text-text-muted">{item.rest_text}</p>}
        {item.technique_notes && <p className="text-sm text-text-secondary">{item.technique_notes}</p>}
      </Card>
    </motion.div>
  )
}
