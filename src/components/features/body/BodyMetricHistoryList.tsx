import { AnimatePresence, motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/date'
import { BODY_METRIC_FIELDS, type BodyMetric } from '@/types/database'

function summarize(metric: BodyMetric): string {
  const parts = BODY_METRIC_FIELDS.map((f) => {
    const v = metric[f.key]
    return v == null ? null : `${f.label} ${v}${f.unit ? ` ${f.unit}` : ''}`
  }).filter((p): p is string => p != null)
  return parts.join(' · ') || 'Sin valores'
}

interface BodyMetricHistoryListProps {
  metrics: BodyMetric[]
  onDelete: (id: string) => void
}

export function BodyMetricHistoryList({ metrics, onDelete }: BodyMetricHistoryListProps) {
  if (metrics.length === 0) {
    return <p className="text-sm text-text-muted">Todavía no registraste mediciones.</p>
  }

  return (
    <Card className="flex flex-col divide-y divide-border p-0">
      <AnimatePresence initial={false}>
        {metrics.map((metric) => (
          <motion.div
            key={metric.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm text-text-muted">{formatDate(metric.measured_at)}</span>
              <span className="text-sm text-text-secondary">{summarize(metric)}</span>
              {metric.note && <span className="text-sm text-text-secondary italic">{metric.note}</span>}
            </div>
            <button
              type="button"
              aria-label="Eliminar medición"
              onClick={() => onDelete(metric.id)}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-danger"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </Card>
  )
}
