import { Select } from '@/components/ui/Select'
import { BODY_METRIC_FIELDS, type BodyMetricKey } from '@/types/database'

interface BodyMetricPickerProps {
  value: BodyMetricKey
  onChange: (key: BodyMetricKey) => void
}

export function BodyMetricPicker({ value, onChange }: BodyMetricPickerProps) {
  const options = BODY_METRIC_FIELDS.map((f) => ({ value: f.key, label: f.label }))
  return <Select label="Métrica" value={value} onChange={(e) => onChange(e.target.value as BodyMetricKey)} options={options} />
}
