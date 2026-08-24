import { Card } from '@/components/ui/Card'
import { formatRelative } from '@/lib/date'
import type { WorkoutSet } from '@/types/database'

type RecentSet = WorkoutSet & { exercises: { name: string } | null }

export function RecentActivityFeed({ sets }: { sets: RecentSet[] }) {
  if (sets.length === 0) {
    return <p className="text-sm text-text-muted">Todavía no registraste series. ¡Arrancá hoy!</p>
  }

  return (
    <Card className="flex flex-col divide-y divide-border p-0">
      {sets.map((set) => (
        <div key={set.id} className="flex items-center justify-between px-4 py-3">
          <div className="flex flex-col">
            <span className="font-medium text-text-primary">{set.exercises?.name ?? 'Ejercicio'}</span>
            <span className="text-sm text-text-muted">
              {set.weight} kg × {set.reps}
            </span>
          </div>
          <span className="text-xs text-text-muted">{formatRelative(set.created_at)}</span>
        </div>
      ))}
    </Card>
  )
}
