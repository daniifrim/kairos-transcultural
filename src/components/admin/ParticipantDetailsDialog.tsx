'use client'

import { Participant } from '@/types/database'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface ParticipantDetailsDialogProps {
  participant: Participant
  onClose: () => void
}

export function ParticipantDetailsDialog({ participant, onClose }: ParticipantDetailsDialogProps) {
  const tally = participant.tally_data

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {participant.name}
            <Badge
              variant="secondary"
              className={
                participant.status === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : participant.status === 'denied'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-orange-100 text-orange-800'
              }
            >
              {participant.status === 'confirmed' ? 'Confirmat' : participant.status === 'denied' ? 'Respins' : 'Interes exprimat'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Informații de bază</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Contact</p>
                <p>{participant.contact}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Data adăugării</p>
                <p>{new Date(participant.created_at).toLocaleDateString('ro-RO')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Formular completat</p>
                <p>{participant.form_completed ? 'Da' : 'Nu'}</p>
              </div>
            </div>
          </div>

          {tally && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Date din formular Tally</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Nume complet</p><p>{tally.name}</p></div>
                  <div><p className="text-muted-foreground">Vârstă</p><p>{tally.age}</p></div>
                  <div><p className="text-muted-foreground">Gen</p><p>{tally.gender}</p></div>
                  <div><p className="text-muted-foreground">Telefon</p><p>{tally.phone}</p></div>
                  <div><p className="text-muted-foreground">Email</p><p>{tally.email}</p></div>
                  <div><p className="text-muted-foreground">Pașaport</p><p>{tally.passport}</p></div>
                  <div><p className="text-muted-foreground">Biserica</p><p>{tally.church}</p></div>
                  <div><p className="text-muted-foreground">Țara</p><p>{tally.country}</p></div>
                  <div><p className="text-muted-foreground">Kairos anterior</p><p>{tally.previous_kairos ? 'Da' : 'Nu'}</p></div>
                  {tally.allergies && <div className="col-span-2"><p className="text-muted-foreground">Alergii</p><p>{tally.allergies}</p></div>}
                  {tally.other_info && <div className="col-span-2"><p className="text-muted-foreground">Alte informații</p><p>{tally.other_info}</p></div>}
                  {tally.plane_ticket_url && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Bilet de avion</p>
                      <a href={tally.plane_ticket_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Vezi documentul
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
