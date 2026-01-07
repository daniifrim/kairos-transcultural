'use server'

import { createClient } from '@/lib/supabase/server'
import { Cohort, ParticipantStatus } from '@/types/database'
import { revalidatePath } from 'next/cache'

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

export async function updateParticipantStatus(participantId: string, status: ParticipantStatus) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('participants') as any)
    .update({ status })
    .eq('id', participantId)

  if (error) {
    return { success: false, error: error.message }
  }

  // Revalidate both admin and home pages to update counters
  revalidatePath('/admin')
  revalidatePath('/')

  return { success: true }
}

export async function toggleParticipantFormCompleted(participantId: string, formCompleted: boolean) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('participants') as any)
    .update({ form_completed: formCompleted })
    .eq('id', participantId)

  if (error) {
    return { success: false, error: error.message }
  }

  // Revalidate both admin and home pages
  revalidatePath('/admin')
  revalidatePath('/')

  return { success: true }
}
