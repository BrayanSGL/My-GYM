import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatDate } from '@/lib/date'
import { BODY_METRIC_FIELDS, type BodyMetric, type BodyMetricKey } from '@/types/database'

export function BodyMetricLineChart({ metrics, metricKey }: { metrics: BodyMetric[]; metricKey: BodyMetricKey }) {
  const field = BODY_METRIC_FIELDS.find((f) => f.key === metricKey)!
  const data = [...metrics]
    .filter((m) => m[metricKey] != null)
    .sort((a, b) => a.measured_at.localeCompare(b.measured_at))
    .map((m) => ({ date: m.measured_at, value: m[metricKey] as number }))

  if (data.length === 0) {
    return <p className="text-sm text-text-muted">Todavía no hay registros de {field.label.toLowerCase()}.</p>
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--ink-700)" />
          <XAxis dataKey="date" tickFormatter={(d: string) => formatDate(d, 'd/MM')} stroke="var(--slate-500)" fontSize={12} />
          <YAxis stroke="var(--slate-500)" fontSize={12} width={40} />
          <Tooltip
            contentStyle={{ background: 'var(--ink-800)', border: '1px solid var(--ink-700)', borderRadius: 8 }}
            labelFormatter={(d) => (typeof d === 'string' ? formatDate(d) : d)}
            formatter={(value) => [`${value}${field.unit ? ` ${field.unit}` : ''}`, field.label]}
          />
          <Line type="monotone" dataKey="value" stroke="var(--violet-500)" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
