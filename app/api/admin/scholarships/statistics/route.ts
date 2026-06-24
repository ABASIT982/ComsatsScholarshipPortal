import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]

    // Fetch all scholarships
    const { data: scholarships, error: schError } = await supabase
      .from('scholarships')
      .select('*')

    if (schError) {
      console.error('Error fetching scholarships:', schError)
      return NextResponse.json({ error: schError.message }, { status: 500 })
    }

    // Fetch all applications
    const { data: applications, error: appError } = await supabase
      .from('scholarship_applications')
      .select('*')

    if (appError) {
      console.error('Error fetching applications:', appError)
      return NextResponse.json({ error: appError.message }, { status: 500 })
    }

    // Calculate statistics
    const total = scholarships?.length || 0
    
    // Active = status is active AND deadline not passed
    const active = scholarships?.filter((s: any) => 
      s.status === 'active' && new Date(s.deadline) >= new Date(today)
    ).length || 0
    
    // Expired = deadline passed (regardless of status)
    const expired = scholarships?.filter((s: any) => 
      new Date(s.deadline) < new Date(today)
    ).length || 0
    
    // Archived = status is inactive (admin hidden)
    const archived = scholarships?.filter((s: any) => 
      s.status === 'inactive'
    ).length || 0
    
    // Expiring soon (within 7 days)
    const sevenDaysLater = new Date()
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)
    
    const expiringSoon = scholarships?.filter((s: any) => {
      if (!s.deadline || s.status !== 'active') return false
      const deadline = new Date(s.deadline)
      return deadline >= new Date(today) && deadline <= sevenDaysLater
    }).length || 0

    // Applications stats
    const totalApplications = applications?.length || 0
    const uniqueStudents = new Set(applications?.map((a: any) => a.student_regno)).size || 0
    
    const approved = applications?.filter((a: any) => 
      ['approved', 'selected', 'awarded'].includes(a.status)
    ).length || 0
    
    const successRate = totalApplications > 0 ? Math.round((approved / totalApplications) * 100) : 0

    // Active deadlines count (scholarships with deadline in future)
    const activeDeadlines = scholarships?.filter((s: any) => {
      if (!s.deadline || s.status !== 'active') return false
      return new Date(s.deadline) >= new Date(today)
    }).length || 0

    // Scholarship-wise breakdown
    const scholarshipStats = scholarships?.map((sch: any) => {
      const schApps = applications?.filter((a: any) => a.scholarship_id === sch.id) || []
      const schApproved = schApps.filter((a: any) => 
        ['approved', 'selected', 'awarded'].includes(a.status)
      ).length || 0
      
      const isExpired = new Date(sch.deadline) < new Date(today)
      
      return {
        id: sch.id,
        title: sch.title,
        status: isExpired ? 'expired' : sch.status,
        deadline: sch.deadline,
        applications: schApps.length,
        approved: schApproved,
      }
    }) || []

    return NextResponse.json({
      total,
      active,
      expired,
      archived,
      expiringSoon,
      totalApplications,
      uniqueStudents,
      successRate,
      activeDeadlines,
      scholarships: scholarshipStats,
    })
  } catch (error) {
    console.error('Error in statistics API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}