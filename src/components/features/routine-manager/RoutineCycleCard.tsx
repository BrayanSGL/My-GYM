import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/date'
import { daysUntilReview, formatReviewCountdown, nextReviewDate } from '@/lib/routineCycle'
import type { Routine } from '@/types/database'

interface RoutineCycleCardProps {
  routine: Routine
  onReset: (id: string) => Promise<void>
}

export function RoutineCycleCard({ routine, onReset }: RoutineCycleCardProps) {
  const [resetting, setResetting] = useState(false)

  if (!routine.cycle_started_at) {
    return (
      <Card>
        <p className="text-sm text-text-muted">
          Corré <code>supabase/schema_routine_cycle.sql</code> para activar el recordatorio de revisión de rutina.
        </p>
      </Card>
    )
  }

  const days = daysUntilReview(routine.cycle_started_at)
  const overdue = days <= 0

  const handleReset = async () => {
    setResetting(true)
    try {
      await onReset(routine.id)
    } finally {
      setResetting(false)
    }
  }

  return (
    <Card className="flex flex-col gap-2">
      <p className="text-sm text-text-secondary">Ciclo de "{routine.name}"</p>
      <p className={`font-heading text-2xl ${overdue ? 'text-accent-secondary' : 'text-text-primary'}`}>
        {formatReviewCountdown(days)}
      </p>
      <p className="text-sm text-text-muted">
        Inicio: {formatDate(routine.cycle_started_at)} · Próxima revisión: {formatDate(nextReviewDate(routine.cycle_started_at))}
      </p>
      <Button type="button" variant="secondary" onClick={handleReset} disabled={resetting}>
        {resetting ? 'Reiniciando…' : 'Ya hice el análisis — reiniciar ciclo'}
      </Button>
    </Card>
  )
}
