import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, is_active } = body

    if (!id) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('students')
      .update({
        is_active: is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Status update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      student: data,
      message: is_active ? 'Student activated' : 'Student deactivated'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}