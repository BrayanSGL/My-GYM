import { motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { NewBodyMetricInput } from '@/lib/api/bodyMetrics'

interface BodyMetricFormProps {
  onSubmit: (input: NewBodyMetricInput) => Promise<void>
  onCancel: () => void
}

function toNumberOrNull(value: string): number | null {
  return value.trim() === '' ? null : Number(value)
}

function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function BodyMetricForm({ onSubmit, onCancel }: BodyMetricFormProps) {
  const [measuredAt, setMeasuredAt] = useState(() => toDatetimeLocalValue(new Date()))
  const [weightKg, setWeightKg] = useState('')
  const [bodyFatPct, setBodyFatPct] = useState('')
  const [muscleMassKg, setMuscleMassKg] = useState('')
  const [skeletalMuscleMassKg, setSkeletalMuscleMassKg] = useState('')
  const [visceralFat, setVisceralFat] = useState('')
  const [waistHipRatio, setWaistHipRatio] = useState('')
  const [bodyWaterPct, setBodyWaterPct] = useState('')
  const [bodyWaterKg, setBodyWaterKg] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSubmit({
        measuredAt: new Date(measuredAt).toISOString(),
        weightKg: toNumberOrNull(weightKg),
        bodyFatPct: toNumberOrNull(bodyFatPct),
        muscleMassKg: toNumberOrNull(muscleMassKg),
        skeletalMuscleMassKg: toNumberOrNull(skeletalMuscleMassKg),
        visceralFat: toNumberOrNull(visceralFat),
        waistHipRatio: toNumberOrNull(waistHipRatio),
        bodyWaterPct: toNumberOrNull(bodyWaterPct),
        bodyWaterKg: toNumberOrNull(bodyWaterKg),
        note: note.trim() || null,
      })
      setWeightKg('')
      setBodyFatPct('')
      setMuscleMassKg('')
      setSkeletalMuscleMassKg('')
      setVisceralFat('')
      setWaistHipRatio('')
      setBodyWaterPct('')
      setBodyWaterKg('')
      setNote('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.form
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 overflow-hidden"
    >
      <Input label="Fecha y hora" type="datetime-local" value={measuredAt} onChange={(e) => setMeasuredAt(e.target.value)} required />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Peso (kg)" type="number" inputMode="decimal" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
        <Input label="Grasa corporal (%)" type="number" inputMode="decimal" step="0.1" value={bodyFatPct} onChange={(e) => setBodyFatPct(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Masa muscular (kg)" type="number" inputMode="decimal" step="0.1" value={muscleMassKg} onChange={(e) => setMuscleMassKg(e.target.value)} />
        <Input
          label="Masa muscular esquelética (kg)"
          type="number"
          inputMode="decimal"
          step="0.1"
          value={skeletalMuscleMassKg}
          onChange={(e) => setSkeletalMuscleMassKg(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Grasa visceral" type="number" inputMode="decimal" step="0.1" value={visceralFat} onChange={(e) => setVisceralFat(e.target.value)} />
        <Input label="Cintura-cadera" type="number" inputMode="decimal" step="0.01" value={waistHipRatio} onChange={(e) => setWaistHipRatio(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Agua corporal (%)" type="number" inputMode="decimal" step="0.1" value={bodyWaterPct} onChange={(e) => setBodyWaterPct(e.target.value)} />
        <Input label="Agua corporal (kg)" type="number" inputMode="decimal" step="0.1" value={bodyWaterKg} onChange={(e) => setBodyWaterKg(e.target.value)} />
      </div>
      <Input label="Nota (opcional)" value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="flex gap-2">
        <Button type="submit" disabled={saving} className="flex-1">
          {saving ? 'Guardando…' : 'Registrar medición'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </motion.form>
  )
}
