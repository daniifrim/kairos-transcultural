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

export async function addParticipant(
  cohortId: string,
  name: string,
  contact: string,
  adminId: string
) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('participants') as any)
    .insert({
      cohort_id: cohortId,
      name: name.trim(),
      contact: contact.trim(),
      status: 'expressed_interest',
      form_completed: false,
      tally_data: null,
      added_by: adminId,
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/')

  return { success: true, data }
}

export async function deleteParticipant(participantId: string) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('participants') as any)
    .delete()
    .eq('id', participantId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/')

  return { success: true }
}

// Cohort actions
export async function createCohort(name: string) {
  const supabase = await createClient()

  // Deactivate all currently active cohorts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('cohorts') as any)
    .update({ is_active: false })
    .eq('is_active', true)

  // Create new cohort as active
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('cohorts') as any)
    .insert({ name: name.trim(), is_active: true, capacity: 30 })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/')

  return { success: true, data }
}

export async function updateCohort(cohortId: string, name: string, capacity: number) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('cohorts') as any)
    .update({ name: name.trim(), capacity })
    .eq('id', cohortId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/')

  return { success: true }
}

export async function deleteCohort(cohortId: string) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('cohorts') as any)
    .delete()
    .eq('id', cohortId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/')

  return { success: true }
}

export async function setActiveCohort(cohortId: string) {
  const supabase = await createClient()

  // Deactivate all currently active cohorts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('cohorts') as any)
    .update({ is_active: false })
    .eq('is_active', true)

  // Activate the selected cohort
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('cohorts') as any)
    .update({ is_active: true })
    .eq('id', cohortId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/')

  return { success: true }
}

// Admin actions
export async function updateAdminApproval(adminId: string, isApproved: boolean) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('admins') as any)
    .update({ is_approved: isApproved })
    .eq('id', adminId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')

  return { success: true }
}
