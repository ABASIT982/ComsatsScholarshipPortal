import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received payload:', body);

    const required = ['student_id', 'student_name', 'student_email', 'roll_no', 'category', 'subject', 'description'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from('disputes')
      .insert([{
        student_id: body.student_id,
        student_name: body.student_name,
        student_email: body.student_email,
        roll_no: body.roll_no,
        category: body.category,
        subject: body.subject,
        description: body.description,
        scholarship_id: body.scholarship_id || null,
        scholarship_name: body.scholarship_name || null,
        application_id: body.application_id || null,
        merit_list_id: body.merit_list_id || null,
        attachments: body.attachments || [],
        status: 'pending',
        priority: 'medium',
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Dispute submitted successfully',
      dispute: data,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase select error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ disputes: data || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}