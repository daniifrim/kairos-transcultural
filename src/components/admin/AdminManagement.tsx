'use client'

import { Admin } from '@/types/database'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { updateAdminApproval } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'

interface AdminManagementProps {
  admins: Admin[]
  currentAdminId: string
}

export function AdminManagement({ admins, currentAdminId }: AdminManagementProps) {
  const router = useRouter()

  const updateApproval = async (adminId: string, isApproved: boolean) => {
    const result = await updateAdminApproval(adminId, isApproved)

    if (!result.success) {
      toast.error('Eroare la actualizarea permisiunilor')
      return
    }

    toast.success(isApproved ? 'Administrator aprobat' : 'Acces revocat')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Gestionare Administratori</h3>
        <p className="text-sm text-muted-foreground">Aprobă sau revocă accesul administratorilor</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nume</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="w-[100px]">Acțiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell className="font-medium">{admin.name}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={admin.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {admin.is_approved ? 'Aprobat' : 'În așteptare'}
                </Badge>
              </TableCell>
              <TableCell>
                {admin.is_main_admin ? (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">Admin Principal</Badge>
                ) : (
                  <span className="text-muted-foreground">Administrator</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(admin.created_at).toLocaleDateString('ro-RO')}
              </TableCell>
              <TableCell>
                {admin.id !== currentAdminId && !admin.is_main_admin && (
                  <div className="flex gap-1">
                    {!admin.is_approved ? (
                      <Button size="icon" variant="ghost" className="text-green-600" onClick={() => updateApproval(admin.id, true)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button size="icon" variant="ghost" className="text-red-600" onClick={() => updateApproval(admin.id, false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
