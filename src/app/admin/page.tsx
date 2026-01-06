import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { Admin, Cohort, Participant } from '@/types/database'

export default async function AdminPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) redirect('/login')

  // Get admin info
  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('email', user.email)
    .single() as { data: Admin | null }

  if (!admin?.is_approved) {
    redirect('/pending-approval')
  }

  // Get active cohort
  const { data: activeCohort } = await supabase
    .from('cohorts')
    .select('*')
    .eq('is_active', true)
    .single() as { data: Cohort | null }

  // Get all cohorts
  const { data: cohorts } = await supabase
    .from('cohorts')
    .select('*')
    .order('created_at', { ascending: false }) as { data: Cohort[] | null }

  // Get participants for active cohort
  const { data: participants } = await supabase
    .from('participants')
    .select('*')
    .eq('cohort_id', activeCohort?.id || '')
    .order('created_at', { ascending: false }) as { data: Participant[] | null }

  // Get all admins (for main admin)
  let allAdmins: Admin[] = []
  if (admin.is_main_admin) {
    const result = await supabase.from('admins').select('*').order('created_at', { ascending: false }) as { data: Admin[] | null }
    allAdmins = result.data || []
  }

  return (
    <AdminDashboard
      admin={admin}
      activeCohort={activeCohort}
      cohorts={cohorts || []}
      participants={participants || []}
      allAdmins={allAdmins}
    />
  )
}
