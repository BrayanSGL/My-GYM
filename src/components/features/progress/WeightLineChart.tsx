import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatDate } from '@/lib/date'
import type { WorkoutSet } from '@/types/database'

export function WeightLineChart({ sets }: { sets: WorkoutSet[] }) {
  const data = [...sets]
    .sort((a, b) => a.set_date.localeCompare(b.set_date))
    .map((s) => ({ date: s.set_date, weight: s.weight }))

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--ink-700)" />
          <XAxis
            dataKey="date"
            tickFormatter={(d: string) => formatDate(d, 'd/MM')}
            stroke="var(--slate-500)"
            fontSize={12}
          />
          <YAxis stroke="var(--slate-500)" fontSize={12} width={40} />
          <Tooltip
            contentStyle={{ background: 'var(--ink-800)', border: '1px solid var(--ink-700)', borderRadius: 8 }}
            labelFormatter={(d) => (typeof d === 'string' ? formatDate(d) : d)}
            formatter={(value) => [`${value} kg`, 'Peso']}
          />
          <Line type="monotone" dataKey="weight" stroke="var(--violet-500)" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
