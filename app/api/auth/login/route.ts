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

    console.log('🔍 Login attempt for regno:', regno)

    // Get student with password hash
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('regno', regno)
      .single()

    if (studentError || !student) {
      console.log('❌ Student not found:', regno)
      return NextResponse.json(
        { error: 'Invalid registration number or password' },
        { status: 401 }
      )
    }

    console.log('📦 Student found:', student.full_name)

    // Check if password_hash exists
    if (!student.password_hash) {
      console.log('❌ No password hash found for student')
      return NextResponse.json(
        { error: 'Invalid registration number or password' },
        { status: 401 }
      )
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, student.password_hash)
    
    console.log('🔐 Password valid:', isPasswordValid)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid registration number or password' },
        { status: 401 }
      )
    }

    // ✅ SUCCESS: Return student data including full_name
    return NextResponse.json({
      message: 'Login successful',
      user: {
        regno: student.regno,
        full_name: student.full_name,
        level: student.level,
        email: student.email,
        department: student.department
      }
    })

  } catch (error) {
    console.error('❌ Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}