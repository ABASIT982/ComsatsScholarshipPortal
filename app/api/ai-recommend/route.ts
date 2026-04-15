import { supabase } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const studentRegno = searchParams.get('student_regno')

  if (!studentRegno) {
    return NextResponse.json({ error: 'student_regno is required' }, { status: 400 })
  }

  // Get all approved applications for this student from the correct table
  const { data: approvedApps, error: appsError } = await supabase
    .from('scholarship_applications')  // ← FIXED: Correct table name
    .select('scholarship_id')
    .eq('student_regno', studentRegno)
    .eq('status', 'approved')

  if (appsError) {
    console.error('Error fetching applications:', appsError)
    return NextResponse.json({ recommendations: {} })
  }

  if (!approvedApps || approvedApps.length === 0) {
    return NextResponse.json({ recommendations: {} })
  }

  // Get approved scholarship IDs
  const approvedIds = approvedApps.map((a: any) => a.scholarship_id)

  // Get approved scholarship details
  const { data: approvedScholarships, error: schError } = await supabase
    .from('scholarships')
    .select('id, title, description')
    .in('id', approvedIds)

  if (schError || !approvedScholarships || approvedScholarships.length === 0) {
    return NextResponse.json({ recommendations: {} })
  }

  // Build student profile text from approved scholarships
  const studentProfile = approvedScholarships
    .map((s: any) => `${s.title} ${s.description || ''}`)
    .join(' ')
    .toLowerCase()

  // Get all active scholarships
  const { data: activeScholarships, error: activeError } = await supabase
    .from('scholarships')
    .select('id, title, description')
    .eq('status', 'active')

  if (activeError || !activeScholarships) {
    return NextResponse.json({ recommendations: {} })
  }

  // Calculate match percentage for each scholarship
  const recommendations: Record<string, number> = {}

  for (const scholarship of activeScholarships) {
    const scholarshipText = `${scholarship.title} ${scholarship.description || ''}`.toLowerCase()
    
    // Split into words
    const studentWords = studentProfile.split(/\s+/)
    const scholarshipWords = scholarshipText.split(/\s+/)
    
    // Find matching words
    let matches = 0
    const uniqueStudentWords = new Set(studentWords)
    
    uniqueStudentWords.forEach(word => {
      if (word.length > 2 && scholarshipWords.includes(word)) {
        matches++
      }
    })
    
    // Calculate percentage
    let percentage = 0
    if (uniqueStudentWords.size > 0) {
      percentage = Math.floor((matches / uniqueStudentWords.size) * 100)
    }
    
    recommendations[scholarship.id] = percentage
  }

  return NextResponse.json({ recommendations })
}