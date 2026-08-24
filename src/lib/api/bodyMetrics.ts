import { supabase } from '@/lib/supabase'
import type { BodyMetric } from '@/types/database'

export interface NewBodyMetricInput {
  measuredAt: string
  weightKg: number | null
  bodyFatPct: number | null
  muscleMassKg: number | null
  skeletalMuscleMassKg: number | null
  visceralFat: number | null
  waistHipRatio: number | null
  bodyWaterPct: number | null
  bodyWaterKg: number | null
  note: string | null
}

export async function listBodyMetrics(): Promise<BodyMetric[]> {
  const { data, error } = await supabase
    .from('body_metrics')
    .select('*')
    .order('measured_at', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createBodyMetric(input: NewBodyMetricInput): Promise<BodyMetric> {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  const { data, error } = await supabase
    .from('body_metrics')
    .insert({
      user_id: userData.user!.id,
      measured_at: input.measuredAt,
      weight_kg: input.weightKg,
      body_fat_pct: input.bodyFatPct,
      muscle_mass_kg: input.muscleMassKg,
      skeletal_muscle_mass_kg: input.skeletalMuscleMassKg,
      visceral_fat: input.visceralFat,
      waist_hip_ratio: input.waistHipRatio,
      body_water_pct: input.bodyWaterPct,
      body_water_kg: input.bodyWaterKg,
      note: input.note,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteBodyMetric(id: string): Promise<void> {
  const { error } = await supabase.from('body_metrics').delete().eq('id', id)
  if (error) throw error
}
