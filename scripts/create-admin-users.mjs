import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

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
    console.log(`\nCreating user: ${user.email}`)

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
      })

      if (authError) {
        if (authError.message.includes('already been registered')) {
          console.log(`User ${user.email} already exists, skipping auth creation`)
        } else {
          console.error(`Error creating auth user:`, authError.message)
          continue
        }
      } else {
        console.log(`✓ Auth user created: ${authData.user.id}`)
      }

      // Check if admin record exists
      const { data: existingAdmin } = await supabase
        .from('admins')
        .select('*')
        .eq('email', user.email)
        .single()

      if (existingAdmin) {
        console.log(`Admin record already exists for ${user.email}, updating...`)
        
        // Update admin record
        const { error: updateError } = await supabase
          .from('admins')
          .update({
            name: user.name,
            is_main_admin: user.is_main_admin,
            is_approved: user.is_approved,
          })
          .eq('email', user.email)

        if (updateError) {
          console.error(`Error updating admin:`, updateError.message)
        } else {
          console.log(`✓ Admin record updated`)
        }
      } else {
        // Create admin record
        const { error: adminError } = await supabase
          .from('admins')
          .insert({
            email: user.email,
            name: user.name,
            is_main_admin: user.is_main_admin,
            is_approved: user.is_approved,
          })

        if (adminError) {
          console.error(`Error creating admin record:`, adminError.message)
        } else {
          console.log(`✓ Admin record created`)
        }
      }
    } catch (error) {
      console.error(`Error processing ${user.email}:`, error)
    }
  }

  console.log('\n✓ All admin users processed successfully!')
  console.log('\nLogin credentials:')
  console.log('1. danifrim14@gmail.com / K348S953WE (Main Admin)')
  console.log('2. ionutbalan85@gmail.com / kairosadmin (Admin)')
}

createAdminUsers().catch(console.error)
