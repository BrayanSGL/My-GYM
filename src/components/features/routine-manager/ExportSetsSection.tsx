import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { listSetsInRange } from '@/lib/api/sets'
import { EXPORT_RANGE_OPTIONS, localDateStamp, rangeStartDate, type ExportRangeKey } from '@/lib/date'
import { exportSetsToCsv } from '@/lib/exportSets'

export function ExportSetsSection() {
  const [range, setRange] = useState<ExportRangeKey>('1mes')
  const [downloading, setDownloading] = useState(false)
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null)

  const handleDownload = async () => {
    setEmptyMessage(null)
    setDownloading(true)
    try {
      const start = localDateStamp(rangeStartDate(range))
      const end = localDateStamp()
      const sets = await listSetsInRange(start, end)
      if (sets.length === 0) {
        setEmptyMessage('No hay series registradas en ese período.')
        return
      }
      const label = EXPORT_RANGE_OPTIONS.find((r) => r.key === range)!.label
      exportSetsToCsv(sets, label)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <p className="text-lg text-text-primary">Historial de series</p>
        <p className="text-sm text-text-muted">
          Descargá tus series de un período para revisar tu progreso — lo ideal es ajustar la rutina cada 6 a 12 semanas.
        </p>
      </div>

      <div className="flex gap-2">
        {EXPORT_RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setRange(opt.key)}
            className={`min-h-11 flex-1 rounded-lg text-sm font-medium ${
              range === opt.key ? 'bg-accent-primary text-white' : 'bg-surface-raised text-text-secondary'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {emptyMessage && <p className="text-sm text-text-muted">{emptyMessage}</p>}

      <Button type="button" variant="secondary" onClick={handleDownload} disabled={downloading}>
        {downloading ? 'Generando…' : 'Descargar series (CSV)'}
      </Button>
    </Card>
  )
}
