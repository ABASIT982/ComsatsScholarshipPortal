import { supabase } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const studentRegno = searchParams.get('student_regno')

  if (!studentRegno) {
    return NextResponse.json({ error: 'student_regno is required' }, { status: 400 })
  }

  // Get student's ALL applications (not just approved) to check if they already applied
  const { data: allApps } = await supabase
    .from('scholarship_applications')
    .select('*')
    .eq('student_regno', studentRegno)

  // Get student's approved applications for marks
  const { data: approvedApps } = await supabase
    .from('scholarship_applications')
    .select('*')
    .eq('student_regno', studentRegno)
    .eq('status', 'approved')

  if (!approvedApps || approvedApps.length === 0) {
    return NextResponse.json({ recommendations: [] })
  }

  // Extract student marks from applications (with multiple possible field names)
  const studentMarks: any = {
    // FSC related
    fsc_marks: null,
    fsc_score: null,
    // Matric related
    matric_marks: null,
    matric_score: null,
    // NTS related
    nts_marks: null,
    nts_score: null,
    // GPA related
    gpa: null,
    bachelor_cgpa: null,
    previous_semester_cgpa: null,
    cgpa: null,
    // Test marks
    entry_test_marks: null,
    test_score: null
  }

  for (const app of approvedApps) {
    const data = app.application_data
    if (data) {
      // Map all possible field names
      if (data.fsc_marks) studentMarks.fsc_marks = parseInt(data.fsc_marks)
      if (data.fsc_score) studentMarks.fsc_score = parseInt(data.fsc_score)
      if (data.matric_marks) studentMarks.matric_marks = parseInt(data.matric_marks)
      if (data.matric_score) studentMarks.matric_score = parseInt(data.matric_score)
      if (data.nts_marks) studentMarks.nts_marks = parseInt(data.nts_marks)
      if (data.nts_score) studentMarks.nts_score = parseInt(data.nts_score)
      if (data.gpa) studentMarks.gpa = parseFloat(data.gpa)
      if (data.cgpa) studentMarks.cgpa = parseFloat(data.cgpa)
      if (data.bachelor_cgpa) studentMarks.bachelor_cgpa = parseFloat(data.bachelor_cgpa)
      if (data.previous_semester_cgpa) studentMarks.previous_semester_cgpa = parseFloat(data.previous_semester_cgpa)
      if (data.entry_test_marks) studentMarks.entry_test_marks = parseInt(data.entry_test_marks)
    }
  }

  console.log('Student marks:', studentMarks)

  // Get all active scholarships
  const { data: activeScholarships } = await supabase
    .from('scholarships')
    .select('*')
    .eq('status', 'active')

  if (!activeScholarships) {
    return NextResponse.json({ recommendations: [] })
  }

  const recommendations: any[] = []

  for (const scholarship of activeScholarships) {
    // Check if student already applied (any status)
    const alreadyApplied = allApps?.some((a: any) => a.scholarship_id === scholarship.id) || false

    // DON'T skip - we want to show it with "Already Applied" button
    // if (alreadyApplied) continue;

    const criteria = scholarship.scoring_criteria || []
    let matchPercentage = 0
    let matchDetails: any = {}
    let totalWeight = 0
    let earnedWeight = 0

    if (criteria.length > 0) {
      for (const criterion of criteria) {
        const fieldName = criterion.fieldName
        const weight = criterion.weight || 0
        totalWeight += weight

        // Get student value from multiple possible field names
        let studentValue = studentMarks[fieldName]
        
        // If not found, try common variations
        if (!studentValue) {
          if (fieldName === 'fsc_marks' || fieldName === 'fsc_score') {
            studentValue = studentMarks.fsc_marks || studentMarks.fsc_score
          }
          else if (fieldName === 'matric_marks' || fieldName === 'matric_score') {
            studentValue = studentMarks.matric_marks || studentMarks.matric_score
          }
          else if (fieldName === 'nts_marks' || fieldName === 'nts_score') {
            studentValue = studentMarks.nts_marks || studentMarks.nts_score
          }
          else if (fieldName === 'gpa' || fieldName === 'cgpa' || fieldName === 'bachelor_cgpa' || fieldName === 'previous_semester_cgpa') {
            studentValue = studentMarks.gpa || studentMarks.cgpa || studentMarks.bachelor_cgpa || studentMarks.previous_semester_cgpa
          }
        }

        if (studentValue) {
          // Calculate percentage based on field type
          if (fieldName.includes('marks') || fieldName.includes('score')) {
            // For marks (FSC, Matric: max 1100, NTS: max 100)
            let maxValue = fieldName.includes('nts') ? 100 : 1100
            const percentage = Math.min(100, (studentValue / maxValue) * 100)
            earnedWeight += (percentage / 100) * weight
            matchDetails[fieldName] = { value: studentValue, percentage: Math.round(percentage) }
          }
          else if (fieldName.includes('gpa') || fieldName.includes('cgpa')) {
            // For GPA (max 4.0)
            const percentage = Math.min(100, (studentValue / 4.0) * 100)
            earnedWeight += (percentage / 100) * weight
            matchDetails[fieldName] = { value: studentValue, percentage: Math.round(percentage) }
          }
          else {
            earnedWeight += weight
            matchDetails[fieldName] = { value: studentValue, matched: true }
          }
        }
      }

      if (totalWeight > 0) {
        matchPercentage = Math.round((earnedWeight / totalWeight) * 100)
      }
    }

    // Only add if match percentage > 50%
    if (matchPercentage > 50) {
      recommendations.push({
        id: scholarship.id,
        title: scholarship.title,
        description: scholarship.description,
        deadline: scholarship.deadline,
        matchPercentage: matchPercentage,
        selectionProbability: matchPercentage,
        historicalSuccessRate: 70,
        competitionFactor: 50,
        awardsAvailable: scholarship.number_of_awards || 1,
        totalApplicants: 0,
        alreadyApplied: alreadyApplied,
        reason: `You have a ${matchPercentage}% match with this scholarship based on your academic profile.`,
        matchDetails: matchDetails
      })
    }
  }

  recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage)

  return NextResponse.json({ recommendations, count: recommendations.length, studentMarks })
}