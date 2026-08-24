import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { BodyMetricForm } from '@/components/features/body/BodyMetricForm'
import { BodyMetricHistoryList } from '@/components/features/body/BodyMetricHistoryList'
import { BodyMetricLineChart } from '@/components/features/body/BodyMetricLineChart'
import { BodyMetricPicker } from '@/components/features/body/BodyMetricPicker'
import { ExercisePicker } from '@/components/features/progress/ExercisePicker'
import { WeightLineChart } from '@/components/features/progress/WeightLineChart'
import { useBodyMetrics } from '@/hooks/useBodyMetrics'
import { useExercises } from '@/hooks/useExercises'
import { useSets } from '@/hooks/useSets'
import { BODY_METRIC_FIELDS, type BodyMetricKey } from '@/types/database'

type Mode = 'ejercicio' | 'cuerpo'

export default function Progress() {
  const [mode, setMode] = useState<Mode>('ejercicio')

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-3xl text-text-primary">Progreso</h1>

      <div className="flex gap-2 rounded-xl bg-surface-raised p-1">
        {(['ejercicio', 'cuerpo'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`min-h-11 flex-1 rounded-lg text-sm font-medium capitalize ${
              mode === m ? 'bg-accent-primary text-white' : 'text-text-secondary'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === 'ejercicio' ? <ExerciseProgress /> : <BodyProgress />}
    </div>
  )
}

function ExerciseProgress() {
  const { exercises } = useExercises()
  const [exerciseId, setExerciseId] = useState('')
  const { sets, loading } = useSets(exerciseId || undefined)

  const personalRecord = useMemo(() => {
    if (sets.length === 0) return null
    return [...sets].sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight
      if (b.reps !== a.reps) return b.reps - a.reps
      return b.set_date.localeCompare(a.set_date)
    })[0]
  }, [sets])

  return (
    <div className="flex flex-col gap-6">
      <ExercisePicker exercises={exercises} value={exerciseId} onChange={setExerciseId} />

      {!exerciseId && <p className="text-text-muted">Elegí un ejercicio para ver su evolución.</p>}

      {exerciseId && loading && <p className="text-text-muted">Cargando…</p>}

      {exerciseId && !loading && sets.length === 0 && (
        <p className="text-text-muted">Todavía no hay series registradas para este ejercicio.</p>
      )}

      {exerciseId && !loading && sets.length > 0 && (
        <>
          {personalRecord && (
            <Card className="bg-surface-raised">
              <p className="text-sm text-text-secondary">Récord personal</p>
              <p className="font-heading text-2xl text-accent-secondary">
                {personalRecord.weight} kg × {personalRecord.reps}
              </p>
            </Card>
          )}
          <Card>
            <WeightLineChart sets={sets} />
          </Card>
        </>
      )}
    </div>
  )
}

function BodyProgress() {
  const { metrics, loading, addMetric, removeMetric } = useBodyMetrics()
  const [metricKey, setMetricKey] = useState<BodyMetricKey>('weight_kg')
  const [showForm, setShowForm] = useState(false)

  const latest = metrics[0]
  const latestField = BODY_METRIC_FIELDS.find((f) => f.key === metricKey)!
  const latestValue = latest?.[metricKey]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-text-secondary">Mediciones de báscula</p>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Cerrar' : '+ Nueva'}</Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <BodyMetricForm
            onSubmit={async (input) => {
              await addMetric(input)
              setShowForm(false)
            }}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-text-muted">Cargando…</p>
      ) : (
        <>
          <BodyMetricPicker value={metricKey} onChange={setMetricKey} />

          {latestValue != null && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-surface-raised">
                <p className="text-sm text-text-secondary">Última medición · {latestField.label}</p>
                <p className="font-heading text-2xl text-accent-secondary">
                  {latestValue}
                  {latestField.unit ? ` ${latestField.unit}` : ''}
                </p>
              </Card>
            </motion.div>
          )}

          <Card>
            <BodyMetricLineChart metrics={metrics} metricKey={metricKey} />
          </Card>

          <div>
            <h2 className="mb-3 text-lg text-text-primary">Historial</h2>
            <BodyMetricHistoryList metrics={metrics} onDelete={removeMetric} />
          </div>
        </>
      )}
    </div>
  )
}
