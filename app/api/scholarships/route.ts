import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: List all scholarships (for admin) or active scholarships (for students)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const forStudent = searchParams.get('forStudent') === 'true';

    let query = supabase.from('scholarships').select('*');

    if (forStudent) {
      // Students only see active scholarships
      query = query.eq('status', 'active');
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scholarships:', error);
      return NextResponse.json({ error: 'Failed to fetch scholarships' }, { status: 500 });
    }

    return NextResponse.json({ scholarships: data });
  } catch (error) {
    console.error('Error in scholarships API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create new scholarship (admin only)
// POST: Create new scholarship (admin only)
export async function POST(request: NextRequest) {
  try {
    const { title, description, deadline, status = 'active' } = await request.json();

    // Validate required fields
    if (!title || !description || !deadline) {
      return NextResponse.json(
        { error: 'Title, description, and deadline are required' },
        { status: 400 }
      );
    }

    // Validate deadline is in future
    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deadlineDate < today) {
      return NextResponse.json(
        { error: 'Deadline must be in the future' },
        { status: 400 }
      );
    }

    // Create scholarship without created_by or with a default value
    const { data, error } = await supabase
      .from('scholarships')
      .insert([
        {
          title: title.trim(),
          description: description.trim(),
          deadline,
          status,
          created_by: null // Set to null instead of invalid UUID
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error creating scholarship:', error);
      return NextResponse.json({ 
        error: `Failed to create scholarship: ${error.message}` 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      scholarship: data, 
      message: 'Scholarship created successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in scholarships POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
