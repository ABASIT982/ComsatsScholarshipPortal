import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

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

        return {
          id: student.id,
          name: student.full_name || student.name || 'Unknown',
          regno: student.reg_number || student.regno || student.email,
          department: student.department || 'Not assigned',
          level: student.level || student.program_type || 'undergraduate',
          session: student.session || student.academic_session || 'fa23',
          status: student.account_status || student.status || 'active',
          cgpa: student.cgpa,
          registrationDate: student.created_at,
          avatar: profile?.avatar_url || null  // ✅ Avatar from profiles table
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