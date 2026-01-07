import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Database } from '@/types/database'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && user && user.email) {
      // Check if admin exists, if not create one (pending approval)
      const { data: existingAdmin } = await supabase
        .from('admins')
        .select('*')
        .eq('email', user.email)
        .single()

      if (!existingAdmin) {
        // Create new admin record (pending approval)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('admins') as any)
          .insert({
            email: user.email,
            name: user.user_metadata?.full_name || user.email,
            is_approved: false,
            is_main_admin: false,
          })
      }

      // Check if approved
      const { data: admin } = await supabase
        .from('admins')
        .select('is_approved')
        .eq('email', user.email)
        .single() as { data: { is_approved: boolean } | null }

      if (admin?.is_approved) {
        return NextResponse.redirect(`${origin}/admin`)
      } else {
        return NextResponse.redirect(`${origin}/pending-approval`)
      }
    }
  }

  // If something went wrong, redirect to login
  return NextResponse.redirect(`${origin}/login`)
}
