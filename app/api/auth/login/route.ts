import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { regno, password } = await request.json()

    if (!regno || !password) {
      return NextResponse.json(
        { error: 'Registration number and password are required' },
        { status: 400 }
      )
    }

    // Get student with password hash
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('regno', regno)
      .single()

    if (studentError || !student) {
      return NextResponse.json(
        { error: 'Invalid registration number or password' },
        { status: 401 }
      )
    }

    // Check password - bcrypt handles ALL symbols correctly
    const isPasswordValid = await bcrypt.compare(password, student.password_hash)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid registration number or password' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        regno: student.regno,
        full_name: student.full_name,
        level: student.level
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}