import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { listSetsInRange } from '@/lib/api/sets'
import { listNotesInRange } from '@/lib/api/notes'
import { EXPORT_RANGE_OPTIONS, localDateStamp, localDayBoundsIso, rangeStartDate, type ExportRangeKey } from '@/lib/date'
import { exportSetsToCsv } from '@/lib/exportSets'
import { exportNotesToCsv } from '@/lib/exportNotes'

export function ExportSetsSection() {
  const [range, setRange] = useState<ExportRangeKey>('1mes')
  const [downloading, setDownloading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleDownload = async () => {
    setMessage(null)
    setDownloading(true)
    try {
      const start = rangeStartDate(range)
      const end = new Date()
      const label = EXPORT_RANGE_OPTIONS.find((r) => r.key === range)!.label

      const [sets, notes] = await Promise.all([
        listSetsInRange(localDateStamp(start), localDateStamp(end)),
        listNotesInRange(localDayBoundsIso(start).startIso, localDayBoundsIso(end).endIso),
      ])

      if (sets.length === 0 && notes.length === 0) {
        setMessage('No hay series ni notas registradas en ese período.')
        return
      }

      if (sets.length > 0) exportSetsToCsv(sets, label)
      if (notes.length > 0) exportNotesToCsv(notes, label)

      if (sets.length === 0) setMessage('No había series en ese período — solo se descargaron las notas.')
      else if (notes.length === 0) setMessage('No había notas en ese período — solo se descargaron las series.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <p className="text-lg text-text-primary">Historial de series y notas</p>
        <p className="text-sm text-text-muted">
          Descargá tus series y notas de un período para revisar tu progreso — lo ideal es ajustar la rutina cada 6 a 12 semanas.
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

      {message && <p className="text-sm text-text-muted">{message}</p>}

      <Button type="button" variant="secondary" onClick={handleDownload} disabled={downloading}>
        {downloading ? 'Generando…' : 'Descargar series + notas (CSV)'}
      </Button>
    </Card>
  )
}
