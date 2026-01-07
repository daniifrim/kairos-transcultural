'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Clock } from 'lucide-react'

export default function PendingApprovalPage() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">În așteptare</CardTitle>
          <CardDescription>
            Contul tău așteaptă aprobarea administratorului principal.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Vei primi acces după ce un administrator îți aprobă contul. 
            Te rugăm să revii mai târziu sau să contactezi administratorul.
          </p>
          <Button variant="outline" onClick={handleLogout}>
            Deconectare
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
