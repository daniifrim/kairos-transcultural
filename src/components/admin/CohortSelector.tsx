'use client'

import { useState } from 'react'
import { Cohort } from '@/types/database'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCohort, updateCohort, deleteCohort, setActiveCohort } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
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

interface CohortSelectorProps {
  cohorts: Cohort[]
  selectedCohortId: string
  onSelect: (id: string) => void
  onCohortsChange: (cohorts: Cohort[]) => void
  isMainAdmin: boolean
}

export function CohortSelector({ cohorts, selectedCohortId, onSelect, onCohortsChange, isMainAdmin }: CohortSelectorProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [newCohortName, setNewCohortName] = useState('')
  const [editCohortName, setEditCohortName] = useState('')
  const [editCohortCapacity, setEditCohortCapacity] = useState('30')
  const [loading, setLoading] = useState(false)
  const [cohortToEdit, setCohortToEdit] = useState<Cohort | null>(null)
  const [cohortToDelete, setCohortToDelete] = useState<Cohort | null>(null)

  const handleCreateCohort = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCohortName.trim()) return

    setLoading(true)
    const result = await createCohort(newCohortName)
    setLoading(false)

    if (!result.success) {
      toast.error('Eroare la crearea cohortei')
      return
    }

    toast.success('Cohortă creată cu succes')
    setNewCohortName('')
    setDialogOpen(false)
    if (result.data) {
      onSelect(result.data.id)
    }
    router.refresh()
  }

  const openEditDialog = (cohort: Cohort) => {
    setCohortToEdit(cohort)
    setEditCohortName(cohort.name)
    setEditCohortCapacity(cohort.capacity?.toString() || '30')
    setEditDialogOpen(true)
  }

  const handleEditCohort = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cohortToEdit || !editCohortName.trim()) return

    setLoading(true)
    const result = await updateCohort(cohortToEdit.id, editCohortName, parseInt(editCohortCapacity) || 30)
    setLoading(false)

    if (!result.success) {
      toast.error('Eroare la actualizarea cohortei')
      return
    }

    toast.success('Cohortă actualizată cu succes')
    setEditDialogOpen(false)
    setCohortToEdit(null)
    router.refresh()
  }

  const confirmDeleteCohort = (cohort: Cohort) => {
    setCohortToDelete(cohort)
    setDeleteDialogOpen(true)
  }

  const handleDeleteCohort = async () => {
    if (!cohortToDelete) return

    setLoading(true)
    const result = await deleteCohort(cohortToDelete.id)
    setLoading(false)

    if (!result.success) {
      toast.error('Eroare la ștergerea cohortei')
      return
    }

    toast.success('Cohortă ștearsă cu succes')
    setDeleteDialogOpen(false)

    // If the deleted cohort was selected, select the first available cohort
    if (selectedCohortId === cohortToDelete.id) {
      const remainingCohorts = cohorts.filter(c => c.id !== cohortToDelete.id)
      if (remainingCohorts.length > 0) {
        onSelect(remainingCohorts[0].id)
      }
    }

    setCohortToDelete(null)
    router.refresh()
  }

  const handleSetActiveCohort = async (cohortId: string) => {
    const result = await setActiveCohort(cohortId)

    if (!result.success) {
      toast.error('Eroare la schimbarea cohortei active')
      return
    }

    onSelect(cohortId)
    router.refresh()
    toast.success('Cohortă activă schimbată')
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedCohortId} onValueChange={handleSetActiveCohort}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Selectează cohorta" />
        </SelectTrigger>
        <SelectContent>
          {cohorts.map((cohort) => (
            <SelectItem key={cohort.id} value={cohort.id}>
              {cohort.name}{cohort.is_active && ' (activă)'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isMainAdmin && (
        <>
          <Button variant="outline" size="icon" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
          </Button>
          
          {selectedCohortId && (
            <>
              <Button variant="outline" size="icon" onClick={() => openEditDialog(cohorts.find(c => c.id === selectedCohortId)!)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => confirmDeleteCohort(cohorts.find(c => c.id === selectedCohortId)!)} className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader><DialogTitle>Creează cohortă nouă</DialogTitle></DialogHeader>
              <form onSubmit={handleCreateCohort} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cohortName">Nume cohortă</Label>
                  <Input id="cohortName" value={newCohortName} onChange={(e) => setNewCohortName(e.target.value)} placeholder="ex: Kairos 2026" required />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Anulează</Button>
                  <Button type="submit" disabled={loading}>{loading ? 'Se creează...' : 'Creează'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <DialogHeader><DialogTitle>Editează cohortă</DialogTitle></DialogHeader>
              <form onSubmit={handleEditCohort} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editCohortName">Nume cohortă</Label>
                  <Input id="editCohortName" value={editCohortName} onChange={(e) => setEditCohortName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCohortCapacity">Capacitate</Label>
                  <Input id="editCohortCapacity" type="number" value={editCohortCapacity} onChange={(e) => setEditCohortCapacity(e.target.value)} required />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Anulează</Button>
                  <Button type="submit" disabled={loading}>{loading ? 'Se actualizează...' : 'Actualizează'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ești sigur?</AlertDialogTitle>
                <AlertDialogDescription>
                  Această acțiune va șterge cohorta <strong>{cohortToDelete?.name}</strong> și toți participanții asociați.
                  Această acțiune nu poate fi anulată.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anulează</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteCohort} className="bg-red-600 hover:bg-red-700" disabled={loading}>
                  {loading ? 'Se șterge...' : 'Șterge'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  )
}
