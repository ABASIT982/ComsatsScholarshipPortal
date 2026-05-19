import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// Helper function to extract session and department from regno
// Example: FA22-BCS-005 -> session: FA22, department: BCS
const extractSessionAndDept = (regno: string) => {
  if (!regno) return { session: '', department: '' }
  const parts = regno.split('-')
  if (parts.length >= 2) {
    return {
      session: parts[0],      // FA22, SP21, etc.
      department: parts[1]    // BCS, BSE, MCS, etc.
    }
  }
  return { session: '', department: '' }
}

export async function GET() {
  try {
    // Fetch students from students table
    const { data: students, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    if (!students) {
      return NextResponse.json({
        success: true,
        students: []
      })
    }

    // Fetch avatars from profiles table for each student
    const studentsWithAvatars = await Promise.all(
      students.map(async (student) => {
        // Get avatar from profiles table using regno
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('regno', student.reg_number || student.regno || student.email)
          .maybeSingle()

        // Extract session and department from regno
        const regNumber = student.reg_number || student.regno || student.email
        const { session, department } = extractSessionAndDept(regNumber)

        return {
          id: student.id,
          name: student.full_name || student.name || 'Unknown',
          regno: regNumber,
          email: student.email || 'Not provided',
          department: department || student.department || 'Not assigned',
          level: student.level || student.program_type || 'undergraduate',
          session: session || student.session || 'Unknown',
          status: student.is_active === false ? 'inactive' : 'active',
          cgpa: student.cgpa,
          registrationDate: student.created_at,
          avatar: profile?.avatar_url || null  
        }
      })
    )

    return NextResponse.json({
      success: true,
      students: studentsWithAvatars
    })

  } catch (error) {
    console.error('Students API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}