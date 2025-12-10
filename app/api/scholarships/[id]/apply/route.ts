// app/api/scholarships/[id]/apply/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    //------------------------------This is for FIX: Await the params------------------------------
    const params = await context.params;
    const { id } = params;
    
    const body = await request.json();
    const { student_regno, application_data = {} } = body;

    console.log('📨 [APPLY API] Received application for scholarship:', id);
    console.log('📨 [APPLY API] Student:', student_regno);

    //------------------------------This is for Validate ID-------------------------------
    if (!id || id === 'undefined') {
      return NextResponse.json(
        { error: 'Invalid scholarship ID' },
        { status: 400 }
      );
    }

    //------------------------------This is for Validate required fields--------------------------------
    if (!student_regno) {
      return NextResponse.json(
        { error: 'Student registration number is required' },
        { status: 400 }
      );
    }

    //-----------------------------This is for Check if scholarship exists-------------------------------
    const { data: scholarship, error: scholarshipError } = await supabase
      .from('scholarships')
      .select('*')
      .eq('id', id)
      .single();

    console.log('🔍 [APPLY API] Scholarship check:', { scholarship, scholarshipError });

    if (scholarshipError) {
      console.error('❌ [APPLY API] Database error:', scholarshipError);
      return NextResponse.json(
        { error: 'Database error: ' + scholarshipError.message },
        { status: 500 }
      );
    }

    if (!scholarship) {
      console.log('❌ [APPLY API] Scholarship not found with ID:', id);
      return NextResponse.json(
        { error: 'Scholarship not found' },
        { status: 404 }
      );
    }

    console.log('✅ [APPLY API] Scholarship found:', scholarship.title);

    //------------------------------This is for Create application-----------------------------------
    const { data: application, error: applicationError } = await supabase
      .from('scholarship_applications')
      .insert([
        {
          scholarship_id: id,
          student_regno,
          application_data,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (applicationError) {
      console.error('❌ [APPLY API] Application creation error:', applicationError);
      return NextResponse.json(
        { error: 'Failed to create application: ' + applicationError.message }, 
        { status: 500 }
      );
    }

    console.log('✅ [APPLY API] Application created successfully:', application.id);

    return NextResponse.json({ 
      success: true,
      application, 
      message: 'Application submitted successfully' 
    });

  } catch (error: unknown) {
    console.error('❌ [APPLY API] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error: ' + errorMessage }, 
      { status: 500 }
    );
  }
}