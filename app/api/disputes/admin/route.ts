import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log('Received update request:', body);

    const { dispute_id, status, admin_response, resolved_by } = body;

    if (!dispute_id) {
      return NextResponse.json(
        { error: 'Dispute ID required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status: status || 'pending',
      updated_at: new Date().toISOString(),
    };

    if (admin_response) {
      updateData.admin_response = admin_response;
    }

    if ((status === 'resolved' || status === 'rejected') && resolved_by) {
      updateData.resolved_by = resolved_by;
      updateData.resolved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('disputes')
      .update(updateData)
      .eq('id', dispute_id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Dispute updated successfully',
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
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    let query = supabase.from('disputes').select('*');

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

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