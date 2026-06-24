import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    // Show scholarships where deadline has passed OR status is inactive
    const { data: scholarships, error } = await supabase
      .from('scholarships')
      .select('*')
      .or(`status.eq.inactive,deadline.lt.${today}`)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching archived:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get application counts
    const { data: applications } = await supabase
      .from('scholarship_applications')
      .select('scholarship_id, status')

    const scholarshipsWithCounts = scholarships?.map((sch: any) => {
      const schApps = applications?.filter((a: any) => a.scholarship_id === sch.id) || []
      return {
        ...sch,
        applications: schApps.length
      }
    }) || []

    return NextResponse.json({ scholarships: scholarshipsWithCounts })
  } catch (error) {
    console.error('Error in archive GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}