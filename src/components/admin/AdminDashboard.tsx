'use client'

import { useState } from 'react'
import { Admin, Cohort, Participant } from '@/types/database'
import { AdminHeader } from './AdminHeader'
import { ParticipantsList } from './ParticipantsList'
import { AddParticipantDialog } from './AddParticipantDialog'
import { CohortSelector } from './CohortSelector'
import { AdminManagement } from './AdminManagement'
import { StatsCards } from './StatsCards'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AdminDashboardProps {
  admin: Admin
  activeCohort: Cohort | null
  cohorts: Cohort[]
  setCohorts: (cohorts: Cohort[]) => void
  participants: Participant[]
  setParticipants: (participants: Participant[]) => void
  allAdmins: Admin[]
}

export function AdminDashboard({
  admin,
  activeCohort,
  cohorts,
  setCohorts,
  participants,
  setParticipants,
  allAdmins,
}: AdminDashboardProps) {
  const [selectedCohortId, setSelectedCohortId] = useState(activeCohort?.id || '')

  // Filter participants by selected cohort
  const cohortParticipants = participants.filter(p => p.cohort_id === selectedCohortId)

  const confirmedCount = cohortParticipants.filter(p => p.status === 'confirmed').length
  const expressedInterestCount = cohortParticipants.filter(p => p.status === 'expressed_interest').length
  const formCompletedCount = cohortParticipants.filter(p => p.form_completed).length

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader admin={admin} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panou de Administrare</h1>
            <p className="text-gray-600">Gestionează participanții și cohortele</p>
          </div>
          
          <div className="flex items-center gap-4">
            <CohortSelector
              cohorts={cohorts}
              selectedCohortId={selectedCohortId}
              onSelect={setSelectedCohortId}
              onCohortsChange={setCohorts}
              isMainAdmin={admin.is_main_admin}
            />
            <AddParticipantDialog
              cohortId={selectedCohortId}
              adminId={admin.id}
            />
          </div>
        </div>

        <StatsCards
          confirmedCount={confirmedCount}
          expressedInterestCount={expressedInterestCount}
          formCompletedCount={formCompletedCount}
          capacity={cohorts.find(c => c.id === selectedCohortId)?.capacity || 30}
        />

        <Tabs defaultValue="participants" className="mt-8">
          <TabsList>
            <TabsTrigger value="participants">Participanți</TabsTrigger>
            {admin.is_main_admin && (
              <TabsTrigger value="admins">Administratori</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="participants" className="mt-6">
            <ParticipantsList 
              participants={cohortParticipants}
              onParticipantsChange={(updatedParticipants) => {
                // Update the full participants list with the modified participant
                setParticipants(
                  participants.map(p => {
                    const updated = updatedParticipants.find(up => up.id === p.id)
                    return updated || p
                  })
                )
              }}
            />
          </TabsContent>
          
          {admin.is_main_admin && (
            <TabsContent value="admins" className="mt-6">
              <AdminManagement admins={allAdmins} currentAdminId={admin.id} />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}
