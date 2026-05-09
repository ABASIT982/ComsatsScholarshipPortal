import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, email } = body

    if (!id) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('students')
      .update({
        full_name: name,
        email: email,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, student: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}