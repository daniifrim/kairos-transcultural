'use server'

import { createClient } from '@/lib/supabase/server'
import { Cohort } from '@/types/database'

export async function getActiveCohortStats() {
  const supabase = await createClient()

  // Get active cohort
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: cohort } = await (supabase.from('cohorts') as any)
    .select('*')
    .eq('is_active', true)
    .single() as { data: Cohort | null }

  if (!cohort) {
    return {
      cohort: null,
      confirmedCount: 0,
      capacity: 30,
      isFull: false,
    }
  }

  // Get confirmed participants count
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count } = await (supabase.from('participants') as any)
    .select('*', { count: 'exact', head: true })
    .eq('cohort_id', cohort.id)
    .eq('status', 'confirmed') as { count: number | null }

  const confirmedCount = count || 0
  const isFull = confirmedCount >= cohort.capacity

  return {
    cohort,
    confirmedCount,
    capacity: cohort.capacity,
    isFull,
  }
}
