import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { fullName, email, regno, password, level } = await request.json()

    // Validate all required fields
    if (!fullName?.trim() || !regno || !password || !level) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Extract program from regno (FA22-BCS-001 → BCS)
    const program = regno.split('-')[1];

    // Validate level and program combination
    const undergraduatePrograms = ['BCS', 'BSE', 'BBA', 'BEC', 'BDS'];
    const graduatePrograms = ['MCS', 'MSE', 'MBA', 'MEC', 'MDS'];

    if (level === 'Undergraduate' && !undergraduatePrograms.includes(program)) {
      return NextResponse.json(
        { error: `Invalid program for undergraduate student. Undergraduate programs are: ${undergraduatePrograms.join(', ')}` },
        { status: 400 }
      );
    }

    if (level === 'Graduate' && !graduatePrograms.includes(program)) {
      return NextResponse.json(
        { error: `Invalid program for graduate student. Graduate programs are: ${graduatePrograms.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if regno exists in allowed_students with correct level
    const { data: allowedStudent, error: checkError } = await supabase
      .from('allowed_students')
      .select('regno, level')
      .eq('regno', regno)
      .eq('level', level)
      .single()

    if (checkError || !allowedStudent) {
      return NextResponse.json(
        { error: 'Registration number not found in allowed list for the selected level' },
        { status: 401 }
      )
    }

    // Check if already registered
    const { data: existingUser, error: existingError } = await supabase
      .from('students')
      .select('regno, is_active')
      .eq('regno', regno)
      .single()

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // If user exists but is inactive (deleted), update both tables
    if (existingUser && existingUser.is_active === false) {
      // Update students table
      const { data: updatedStudent, error: updateError } = await supabase
        .from('students')
        .update({
          full_name: fullName.trim(),
          email: email?.trim() || null,
          level,
          password_hash: hashedPassword,
          is_verified: true,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('regno', regno)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating students table:', updateError)
        return NextResponse.json(
          { error: 'Failed to update student profile' },
          { status: 500 }
        )
      }

      // ✅ CRITICAL FIX: Also update the profiles table
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          email: email?.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('regno', regno)

      if (profileUpdateError) {
        console.warn('Could not update profiles table:', profileUpdateError)
        // Continue anyway - don't fail the signup
      }

      return NextResponse.json(
        { 
          message: 'Account reactivated successfully! You can now login.',
          user: {
            regno: updatedStudent.regno,
            full_name: updatedStudent.full_name
          }
        },
        { status: 200 }
      )
    }

    // If user exists AND is active, prevent registration
    if (existingUser && existingUser.is_active !== false) {
      return NextResponse.json(
        { error: 'Registration number already registered' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with uppercase, lowercase, number and special character (@$!%*?&)' },
        { status: 400 }
      )
    }

    // Insert new student
    const { data: student, error: profileError } = await supabase
      .from('students')
      .insert([
        {
          regno,
          full_name: fullName.trim(),
          email: email?.trim() || null,
          level,
          password_hash: hashedPassword,
          is_verified: true,
          is_active: true
        }
      ])
      .select()
      .single()

    if (profileError) {
      console.error('Error inserting into students table:', profileError)
      return NextResponse.json(
        { error: 'Failed to create student profile' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Signup successful! You can now login.',
        user: {
          regno: student.regno,
          full_name: student.full_name
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}