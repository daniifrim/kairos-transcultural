import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUsers() {
  const users = [
    {
      email: 'danifrim14@gmail.com',
      password: 'K348S953WE',
      name: 'Danifrim',
      is_main_admin: true,
      is_approved: true,
    },
    {
      email: 'ionutbalan85@gmail.com',
      password: 'kairosadmin',
      name: 'Ionut',
      is_main_admin: false,
      is_approved: true,
    },
  ]

  for (const user of users) {
    console.log(`Creating user: ${user.email}`)

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    })

    if (authError) {
      console.error(`Error creating auth user for ${user.email}:`, authError)
      continue
    }

    console.log(`Auth user created: ${authData.user.id}`)

    // Create admin record
    const { error: adminError } = await supabase
      .from('admins')
      .insert({
        id: authData.user.id,
        email: user.email,
        name: user.name,
        is_main_admin: user.is_main_admin,
        is_approved: user.is_approved,
      })

    if (adminError) {
      console.error(`Error creating admin record for ${user.email}:`, adminError)
    } else {
      console.log(`Admin record created for ${user.email}`)
    }
  }

  console.log('\nAll admin users created successfully!')
}

createAdminUsers().catch(console.error)
