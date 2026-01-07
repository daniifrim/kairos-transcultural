'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { Admin, Cohort, Participant, Database } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [activeCohort, setActiveCohort] = useState<Cohort | null>(null)
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [allAdmins, setAllAdmins] = useState<Admin[]>([])

  useEffect(() => {
    async function loadAdminData() {
      try {
        const supabase = createClient()

        // Check auth
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !user.email) {
          router.push('/login')
          return
        }

        // Get admin info
        const { data: adminData } = await supabase
          .from('admins')
          .select('*')
          .eq('email', user.email)
          .single<Admin>()

        if (!adminData || !adminData.is_approved) {
          router.push('/pending-approval')
          return
        }

        setAdmin(adminData)

        // Get active cohort
        const { data: activeCohortData } = await supabase
          .from('cohorts')
          .select('*')
          .eq('is_active', true)
          .single<Cohort>()

        setActiveCohort(activeCohortData)

        // Get all cohorts
        const { data: cohortsData } = await supabase
          .from('cohorts')
          .select('*')
          .order('created_at', { ascending: false })

        setCohorts(cohortsData || [])

        // Get ALL participants (dashboard will filter by selected cohort)
        const { data: participantsData } = await supabase
          .from('participants')
          .select('*')
          .order('created_at', { ascending: false })

        setParticipants(participantsData || [])

        // Get all admins (for main admin)
        if (adminData.is_main_admin) {
          const { data: adminsData } = await supabase
            .from('admins')
            .select('*')
            .order('created_at', { ascending: false })

          setAllAdmins(adminsData || [])
        }
      } catch (error) {
        console.error('Error loading admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!admin) {
    return null
  }

  return (
    <AdminDashboard
      admin={admin}
      activeCohort={activeCohort}
      cohorts={cohorts}
      setCohorts={setCohorts}
      participants={participants}
      setParticipants={setParticipants}
      allAdmins={allAdmins}
    />
  )
}
