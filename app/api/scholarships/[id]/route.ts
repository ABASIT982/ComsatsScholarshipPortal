// app/api/scholarships/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // FIX: Use Promise for params
) {
  try {
    // FIX: Await the params
    const params = await context.params;
    const { id } = params;

    console.log('🔍 [API] Fetching scholarship ID:', id);
    console.log('🔍 [API] ID type:', typeof id);

    if (!id || id === 'undefined') {
      return NextResponse.json(
        { error: 'Invalid scholarship ID' },
        { status: 400 }
      );
    }

    const { data: scholarship, error } = await supabase
      .from('scholarships')
      .select('*')
      .eq('id', id)
      .single();

    console.log('🔍 [API] Database response:', { scholarship, error });

    if (error) {
      console.error('❌ [API] Database error:', error);
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 500 }
      );
    }

    if (!scholarship) {
      console.log('❌ [API] Scholarship not found with ID:', id);
      return NextResponse.json(
        { error: 'Scholarship not found' },
        { status: 404 }
      );
    }

    console.log('✅ [API] Scholarship found:', scholarship.id, scholarship.title);
    
    return NextResponse.json({ 
      success: true,
      scholarship 
    });

  } catch (error: unknown) {
    console.error('❌ [API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}