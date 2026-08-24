import { motion } from 'framer-motion'
import { formatDate } from '@/lib/date'
import type { WorkoutSet } from '@/types/database'

interface SetRowProps {
  set: WorkoutSet
  onDelete: (id: string) => void
}

export function SetRow({ set, onDelete }: SetRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-between border-b border-border py-3 last:border-b-0"
    >
      <div className="flex flex-col">
        <span className="text-lg font-medium text-text-primary">
          {set.weight} kg × {set.reps}
          {set.rpe != null && <span className="text-text-muted"> · RPE {set.rpe}</span>}
        </span>
        <span className="text-sm text-text-muted">{formatDate(set.set_date)}</span>
        {set.note && <span className="mt-1 text-sm text-text-secondary">{set.note}</span>}
      </div>
      <button
        type="button"
        aria-label="Eliminar serie"
        onClick={() => onDelete(set.id)}
        className="flex h-11 w-11 items-center justify-center rounded-lg text-danger"
      >
        ✕
      </button>
    </motion.div>
  )
}
