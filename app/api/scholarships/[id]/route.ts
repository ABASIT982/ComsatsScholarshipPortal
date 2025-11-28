// app/api/scholarships/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    console.log('🔍 [API] Fetching scholarship ID:', id);

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

    if (error) {
      console.error('❌ [API] Database error:', error);
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 500 }
      );
    }

    if (!scholarship) {
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

// ADD THIS DELETE METHOD
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    console.log('🗑️ [API] Deleting scholarship:', id);

    if (!id || id === 'undefined') {
      return NextResponse.json(
        { error: 'Invalid scholarship ID' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('scholarships')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ [API] Database error:', error);
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 500 }
      );
    }

    console.log('✅ [API] Scholarship deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Scholarship deleted successfully'
    });

  } catch (error: unknown) {
    console.error('❌ [API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// edit 
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const { title, description, deadline, status } = await request.json();

    console.log('✏️ [API] Updating scholarship:', id);

    if (!id || id === 'undefined') {
      return NextResponse.json(
        { error: 'Invalid scholarship ID' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!title?.trim() || !description?.trim() || !deadline) {
      return NextResponse.json(
        { error: 'Title, description, and deadline are required' },
        { status: 400 }
      );
    }

    // Update the scholarship
    const { data: scholarship, error } = await supabase
      .from('scholarships')
      .update({
        title,
        description,
        deadline,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ [API] Database error:', error);
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 500 }
      );
    }

    if (!scholarship) {
      return NextResponse.json(
        { error: 'Scholarship not found' },
        { status: 404 }
      );
    }

    console.log('✅ [API] Scholarship updated:', scholarship.id);

    return NextResponse.json({
      success: true,
      scholarship,
      message: 'Scholarship updated successfully'
    });

  } catch (error: unknown) {
    console.error('❌ [API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}