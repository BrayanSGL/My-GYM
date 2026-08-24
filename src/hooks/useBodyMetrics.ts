import { useCallback, useEffect, useState } from 'react'
import { createBodyMetric, deleteBodyMetric, listBodyMetrics, type NewBodyMetricInput } from '@/lib/api/bodyMetrics'
import type { BodyMetric } from '@/types/database'

export function useBodyMetrics() {
  const [metrics, setMetrics] = useState<BodyMetric[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await listBodyMetrics()
    setMetrics(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addMetric = async (input: NewBodyMetricInput) => {
    const created = await createBodyMetric(input)
    setMetrics((prev) =>
      [...prev, created].sort((a, b) => b.measured_at.localeCompare(a.measured_at) || b.created_at.localeCompare(a.created_at)),
    )
  }

  const removeMetric = async (id: string) => {
    await deleteBodyMetric(id)
    setMetrics((prev) => prev.filter((m) => m.id !== id))
  }

  return { metrics, loading, addMetric, removeMetric, refresh }
}
