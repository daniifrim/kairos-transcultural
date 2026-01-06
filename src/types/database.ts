export type ParticipantStatus = 'expressed_interest' | 'confirmed' | 'denied'

export interface Cohort {
  id: string
  name: string
  is_active: boolean
  capacity: number
  created_at: string
}

export interface Participant {
  id: string
  cohort_id: string
  name: string
  contact: string
  status: ParticipantStatus
  form_completed: boolean
  tally_data: TallyFormData | null
  added_by: string
  created_at: string
  updated_at: string
}

export interface Admin {
  id: string
  email: string
  name: string
  is_approved: boolean
  is_main_admin: boolean
  created_at: string
}

export interface TallyFormData {
  name: string
  age: string
  gender: string
  phone: string
  email: string
  passport: string
  plane_ticket_url?: string
  church: string
  country: string
  previous_kairos: boolean
  allergies?: string
  other_info?: string
  submitted_at: string
}

export interface Database {
  public: {
    Tables: {
      cohorts: {
        Row: Cohort
        Insert: Omit<Cohort, 'id' | 'created_at'>
        Update: Partial<Omit<Cohort, 'id' | 'created_at'>>
      }
      participants: {
        Row: Participant
        Insert: Omit<Participant, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Participant, 'id' | 'created_at' | 'updated_at'>>
      }
      admins: {
        Row: Admin
        Insert: Omit<Admin, 'id' | 'created_at'>
        Update: Partial<Omit<Admin, 'id' | 'created_at'>>
      }
    }
    Enums: {
      participant_status: ParticipantStatus
    }
  }
}
