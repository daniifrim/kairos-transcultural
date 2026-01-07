'use client'

import { useState } from 'react'
import { Participant, ParticipantStatus } from '@/types/database'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, Search, FileCheck, FileX, Download, Trash2 } from 'lucide-react'
import { ParticipantDetailsDialog } from './ParticipantDetailsDialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface ParticipantsListProps {
  participants: Participant[]
  onParticipantsChange?: (participants: Participant[]) => void
}

const statusLabels: Record<ParticipantStatus, string> = {
  expressed_interest: 'Interes exprimat',
  confirmed: 'Confirmat',
  denied: 'Respins',
}

const statusColors: Record<ParticipantStatus, string> = {
  expressed_interest: 'bg-orange-100 text-orange-800',
  confirmed: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
}

export function ParticipantsList({ participants, onParticipantsChange }: ParticipantsListProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [formFilter, setFormFilter] = useState<string>('all')
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [participantToDelete, setParticipantToDelete] = useState<Participant | null>(null)

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.contact.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    const matchesForm = formFilter === 'all' ||
      (formFilter === 'completed' && p.form_completed) ||
      (formFilter === 'pending' && !p.form_completed)
    return matchesSearch && matchesStatus && matchesForm
  })

  const updateStatus = async (id: string, status: ParticipantStatus) => {
    const { updateParticipantStatus } = await import('@/lib/actions')
    const result = await updateParticipantStatus(id, status)
    
    if (result.success) {
      toast.success('Status actualizat')
      // Update local state immediately for instant feedback
      const updatedParticipants = participants.map(p =>
        p.id === id ? { ...p, status } : p
      )
      onParticipantsChange?.(updatedParticipants)
      router.refresh()
    } else {
      toast.error('Eroare la actualizarea statusului')
    }
  }

  const toggleFormCompleted = async (participant: Participant) => {
    const { toggleParticipantFormCompleted } = await import('@/lib/actions')
    const newValue = !participant.form_completed
    const result = await toggleParticipantFormCompleted(participant.id, newValue)
    
    if (result.success) {
      toast.success(newValue ? 'Formular marcat completat' : 'Formular marcat incomplet')
      // Update local state immediately for instant feedback
      const updatedParticipants = participants.map(p =>
        p.id === participant.id ? { ...p, form_completed: newValue } : p
      )
      onParticipantsChange?.(updatedParticipants)
      router.refresh()
    } else {
      toast.error('Eroare la actualizarea formularului')
    }
  }

  const deleteParticipant = async () => {
    if (!participantToDelete) return

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('participants') as any).delete().eq('id', participantToDelete.id)

    if (error) {
      toast.error('Eroare la ștergerea participantului')
    } else {
      toast.success('Participant șters cu succes')
      // Update local state immediately for instant feedback
      const updatedParticipants = participants.filter(p => p.id !== participantToDelete.id)
      onParticipantsChange?.(updatedParticipants)
      router.refresh()
    }

    setDeleteDialogOpen(false)
    setParticipantToDelete(null)
  }

  const confirmDelete = (participant: Participant) => {
    setParticipantToDelete(participant)
    setDeleteDialogOpen(true)
  }

  const exportToCsv = () => {
    const headers = ['Nume', 'Contact', 'Status', 'Formular completat', 'Data adăugării']
    const rows = filteredParticipants.map(p => [
      p.name,
      p.contact,
      statusLabels[p.status],
      p.form_completed ? 'Da' : 'Nu',
      new Date(p.created_at).toLocaleDateString('ro-RO'),
    ])
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `participanti-kairos-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Caută după nume sau contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate statusurile</SelectItem>
              <SelectItem value="expressed_interest">Interes exprimat</SelectItem>
              <SelectItem value="confirmed">Confirmat</SelectItem>
              <SelectItem value="denied">Respins</SelectItem>
            </SelectContent>
          </Select>
          <Select value={formFilter} onValueChange={setFormFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Formular" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate</SelectItem>
              <SelectItem value="completed">Formular completat</SelectItem>
              <SelectItem value="pending">Formular în așteptare</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportToCsv}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nume</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Formular</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredParticipants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Nu s-au găsit participanți
              </TableCell>
            </TableRow>
          ) : (
            filteredParticipants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell className="font-medium">{participant.name}</TableCell>
                <TableCell>{participant.contact}</TableCell>
                <TableCell>
                  <Select
                    value={participant.status}
                    onValueChange={(value) => updateStatus(participant.id, value as ParticipantStatus)}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expressed_interest">Interes exprimat</SelectItem>
                      <SelectItem value="confirmed">Confirmat</SelectItem>
                      <SelectItem value="denied">Respins</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => toggleFormCompleted(participant)}
                    className="cursor-pointer hover:scale-110 transition-transform"
                  >
                    {participant.form_completed ? (
                      <FileCheck className="h-5 w-5 text-green-600" />
                    ) : (
                      <FileX className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </TableCell>
                <TableCell className="text-gray-500">
                  {new Date(participant.created_at).toLocaleDateString('ro-RO')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedParticipant(participant)}>
                        Vezi detalii
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => confirmDelete(participant)} 
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Șterge participant
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {selectedParticipant && (
        <ParticipantDetailsDialog participant={selectedParticipant} onClose={() => setSelectedParticipant(null)} />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ești sigur?</AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune va șterge participantul <strong>{participantToDelete?.name}</strong>. 
              Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={deleteParticipant} className="bg-red-600 hover:bg-red-700">
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
