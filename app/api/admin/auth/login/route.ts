import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log('🔐 Login attempt:', { email, password })

    // TEMPORARY: Hardcoded admin for testing (REMOVE LATER)
    if (email === 'admin@comsats.edu.pk' && password === 'admin123') {
      return NextResponse.json({
        message: 'Admin login successful',
        admin: {
          id: 'admin-001',
          email: 'admin@comsats.edu.pk',
          full_name: 'System Administrator',
          role: 'super_admin',
          is_active: true,
          created_at: new Date().toISOString()
        },
        token: 'admin-temp-token-123'
      })
    }

    // If using database (comment out the above and uncomment below)
    /*
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single()

    if (error || !admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // For now, accept any password for testing
    const { password_hash, ...adminData } = admin
    return NextResponse.json({
      message: 'Admin login successful',
      admin: adminData,
      token: `admin-${admin.id}`
    })
    */

    return NextResponse.json(
      { error: 'Invalid admin credentials' },
      { status: 401 }
    )

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}