import { AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import type { WorkoutSet } from '@/types/database'
import { SetRow } from './SetRow'

interface SetHistoryListProps {
  sets: WorkoutSet[]
  onDelete: (id: string) => void
}

export function SetHistoryList({ sets, onDelete }: SetHistoryListProps) {
  if (sets.length === 0) {
    return <p className="text-sm text-text-muted">Todavía no registraste series para este ejercicio.</p>
  }

  return (
    <Card>
      <AnimatePresence initial={false}>
        {sets.map((set) => (
          <SetRow key={set.id} set={set} onDelete={onDelete} />
        ))}
      </AnimatePresence>
    </Card>
  )
}
