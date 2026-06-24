import { supabase } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

// Function to extract department code from regno
function extractDepartmentCode(regno: string): string {
  if (!regno) return 'N/A'
  const parts = regno.split('-')
  if (parts.length >= 3) {
    return parts[1]
  }
  return 'N/A'
}

// Function to get full department name with degree level
function getFullDepartmentName(code: string): string {
  const deptMap: Record<string, string> = {
    'BCS': 'BS Computer Science',
    'BBA': 'BS Business Administration',
    'BSE': 'BS Software Engineering',
    'BDS': 'BS Data Science',
    'BAI': 'BS Artificial Intelligence',
    'BCY': 'BS Cyber Security',
    'BECE': 'BS Electrical Engineering',
    'BMCE': 'BS Mechanical Engineering',
    'BCCE': 'BS Civil Engineering',
    'BCHEM': 'BS Chemistry',
    'BPHY': 'BS Physics',
    'BMATH': 'BS Mathematics',
    'BECO': 'BS Economics',
    'BENG': 'BS English',
    'BPSY': 'BS Psychology',
    'BSOC': 'BS Sociology',
    
    'MCS': 'MS Computer Science',
    'MBA': 'MS Business Administration',
    'MSE': 'MS Software Engineering',
    'MDS': 'MS Data Science',
    'MAI': 'MS Artificial Intelligence',
    'MCY': 'MS Cyber Security',
    'MECE': 'MS Electrical Engineering',
    'MMCE': 'MS Mechanical Engineering',
    'MCCE': 'MS Civil Engineering',
    'MCHEM': 'MS Chemistry',
    'MPHY': 'MS Physics',
    'MMATH': 'MS Mathematics',
    'MECO': 'MS Economics',
    'MENG': 'MS English',
    'MPSY': 'MS Psychology',
    'MSOC': 'MS Sociology',
  }
  return deptMap[code] || code
}

function getStudentType(regno: string): string {
  if (!regno) return 'unknown'
  const code = extractDepartmentCode(regno)
  if (code.startsWith('B')) return 'undergraduate'
  if (code.startsWith('M')) return 'graduate'
  return 'unknown'
}

// Statuses that count as "Selected"
const SELECTED_STATUSES = ['approved', 'selected', 'awarded', 'granted']

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'department'
    const departmentCode = searchParams.get('department') || 'all'
    const studentRegno = searchParams.get('student')

    // Fetch all students
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*')

    if (studentsError) {
      console.error('Students error:', studentsError)
      return NextResponse.json({ error: studentsError.message }, { status: 500 })
    }

    if (!students || students.length === 0) {
      return NextResponse.json({ report: [] })
    }

    // Fetch all applications
    const { data: applications, error: appsError } = await supabase
      .from('scholarship_applications')
      .select('*')

    if (appsError) {
      console.error('Applications error:', appsError)
      return NextResponse.json({ report: [] })
    }

    // Filter students
    let filteredStudents = students

    if (type === 'undergraduate') {
      filteredStudents = filteredStudents.filter((student: any) => {
        return getStudentType(student.regno) === 'undergraduate'
      })
    } else if (type === 'graduate') {
      filteredStudents = filteredStudents.filter((student: any) => {
        return getStudentType(student.regno) === 'graduate'
      })
    } else if (departmentCode !== 'all' && type === 'department') {
      filteredStudents = filteredStudents.filter((student: any) => {
        const studentDeptCode = extractDepartmentCode(student.regno)
        return studentDeptCode === departmentCode
      })
    }

    if (studentRegno) {
      filteredStudents = filteredStudents.filter((student: any) => {
        return student.regno === studentRegno
      })
    }

    let reportData: any[] = []

    // Department-wise / Undergraduate / Graduate Report
    if (type === 'department' || type === 'undergraduate' || type === 'graduate') {
      const report: any = {}
      
      filteredStudents.forEach((student: any) => {
        const deptCode = extractDepartmentCode(student.regno)
        const deptFullName = getFullDepartmentName(deptCode)
        
        if (!report[deptFullName]) {
          report[deptFullName] = { 
            department: deptFullName, 
            total: 0, 
            active: 0, 
            applied: 0, 
            selected: 0 
          }
        }
        report[deptFullName].total++
        if (student.status === 'active' || !student.status) {
          report[deptFullName].active++
        }
        
        const studentApps = applications?.filter(
          (app: any) => app.student_regno === student.regno
        ) || []
        
        if (studentApps.length > 0) {
          report[deptFullName].applied++
        }
        
        const hasSelected = studentApps.some(
          (app: any) => SELECTED_STATUSES.includes(app.status)
        )
        if (hasSelected) {
          report[deptFullName].selected++
        }
      })

      reportData = Object.values(report)
    }

    // Individual Student Report - FIXED with Success Rate
    else if (type === 'individual' && studentRegno) {
      const student = students.find((s: any) => s.regno === studentRegno)
      
      if (student) {
        const studentApps = applications?.filter(
          (app: any) => app.student_regno === studentRegno
        ) || []

        const deptCode = extractDepartmentCode(student.regno)
        const deptFullName = getFullDepartmentName(deptCode)

        const totalApps = studentApps.length
        const approvedCount = studentApps.filter((a: any) => a.status === 'approved').length
        const rejectedCount = studentApps.filter((a: any) => a.status === 'rejected').length
        const pendingCount = studentApps.filter((a: any) => a.status === 'pending').length
        const selectedCount = studentApps.filter(
          (a: any) => SELECTED_STATUSES.includes(a.status)
        ).length

        // Calculate success rate
        const successRate = totalApps > 0 ? Math.round((selectedCount / totalApps) * 100) : 0

        reportData = [{
          'Student Name': student.name || student.full_name || 'N/A',
          'Registration No': student.regno || 'N/A',
          'Department': deptFullName,
          'Total Applications': totalApps,
          'Approved': approvedCount,
          'Rejected': rejectedCount,
          'Pending': pendingCount,
          'Selected': selectedCount,
          'Success Rate': `${successRate}%`
        }]
      } else {
        reportData = []
      }
    }

    return NextResponse.json({ report: reportData })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}