'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !name) return

    setLoading(true)
    const supabase = createClient()

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (authError) {
      toast.error(authError.message)
      return
    }

    if (!authData.user) {
      toast.error('Eroare la crearea utilizatorului')
      return
    }

    // Create admin record
    const { error: adminError } = await supabase
      .from('admins')
      .insert({
        id: authData.user.id,
        email,
        name,
        is_approved: false, // Requires approval by main admin
        is_main_admin: false,
      })

    if (adminError) {
      toast.error('Eroare la crearea înregistrării de admin')
      return
    }

    toast.success('Cont creat! Așteaptă aprobarea administratorului principal.')
    router.push('/pending-approval')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Creează Cont Admin</CardTitle>
          <CardDescription>
            Înregistrează-te pentru a deveni administrator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nume</Label>
              <Input
                id="name"
                type="text"
                placeholder="Numele tău"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nume@exemplu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parolă</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Se creează...' : 'Creează Cont'}
            </Button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-4">
            Contul va necesita aprobarea administratorului principal.
          </p>
          
          <div className="text-center mt-4">
            <a href="/login" className="text-sm text-blue-600 hover:underline">
              Ai deja cont? Conectează-te
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
