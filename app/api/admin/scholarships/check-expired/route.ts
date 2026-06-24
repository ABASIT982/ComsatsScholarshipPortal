import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const today = new Date().toISOString().split('T')[0]

    console.log('🔍 Checking expired scholarships...')
    console.log('📅 Today:', today)

    // Find active scholarships with deadline passed
    const { data: expired, error } = await supabase
      .from('scholarships')
      .select('id, title, status, deadline')
      .eq('status', 'active')
      .lt('deadline', today)

    if (error) {
      console.error('Error finding expired:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('📊 Found expired:', expired?.length || 0)

    if (!expired || expired.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No expired scholarships found'
      })
    }

    // Update them to expired
    const { error: updateError } = await supabase
      .from('scholarships')
      .update({ 
        status: 'expired',
        updated_at: new Date().toISOString()
      })
      .in('id', expired.map((s: any) => s.id))

    if (updateError) {
      console.error('Error updating expired:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `${expired.length} scholarships expired`,
      archived: expired
    })
  } catch (error) {
    console.error('Error in check-expired:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}