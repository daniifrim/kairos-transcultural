'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

interface AddParticipantDialogProps {
  cohortId: string
  adminId: string
}

export function AddParticipantDialog({ cohortId, adminId }: AddParticipantDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !contact.trim()) return

    setLoading(true)
    const supabase = createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('participants') as any).insert({
      cohort_id: cohortId,
      name: name.trim(),
      contact: contact.trim(),
      status: 'expressed_interest',
      form_completed: false,
      tally_data: null,
      added_by: adminId,
    })

    setLoading(false)

    if (error) {
      toast.error('Eroare la adăugarea participantului')
      return
    }

    toast.success('Participant adăugat cu succes')
    setName('')
    setContact('')
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" />Adaugă participant</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Adaugă participant nou</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nume și prenume</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ion Popescu" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact (telefon sau email)</Label>
            <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+40 7XX XXX XXX sau email@example.com" required />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Anulează</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Se adaugă...' : 'Adaugă'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
