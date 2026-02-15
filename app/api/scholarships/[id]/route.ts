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
      .select(`
        *,
        scholarship_form_fields (*)
      `)
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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id || id === 'undefined') {
      return NextResponse.json(
        { error: 'Invalid scholarship ID' },
        { status: 400 }
      );
    }

    // ✅ STEP 1: Delete all form fields for this scholarship FIRST
    const { error: fieldsError } = await supabase
      .from('scholarship_form_fields')
      .delete()
      .eq('scholarship_id', id);

    if (fieldsError) {
      console.error('❌ [API] Error deleting form fields:', fieldsError);
      // Continue anyway, try to delete scholarship
    }

    // ✅ STEP 2: Then delete the scholarship
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

    return NextResponse.json({
      success: true,
      message: 'Scholarship and related form fields deleted successfully'
    });

  } catch (error: unknown) {
    console.error('❌ [API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// ✅ FIXED PUT METHOD WITH SCORING CRITERIA
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const { 
      title, 
      description, 
      deadline, 
      status,
      student_types,
      form_template,
      custom_fields = [],
      scoring_criteria,
      number_of_awards
    } = await request.json();

    console.log('✏️ [API] Updating scholarship:', id);
    console.log('📊 [API] Scoring criteria received:', scoring_criteria);

    if (!id || id === 'undefined') {
      return NextResponse.json(
        { error: 'Invalid scholarship ID' },
        { status: 400 }
      );
    }

    if (!title?.trim() || !description?.trim() || !deadline) {
      return NextResponse.json(
        { error: 'Title, description, and deadline are required' },
        { status: 400 }
      );
    }

    // ✅ PREPARE UPDATE DATA WITH ALL FIELDS
    const updateData: any = {
      title,
      description,
      deadline,
      status,
      student_types,
      form_template,
      custom_fields: form_template === 'custom' ? custom_fields : [],
      scoring_criteria: scoring_criteria || [],
      number_of_awards: number_of_awards || 0,
      updated_at: new Date().toISOString()
    };

    const { data: scholarship, error } = await supabase
      .from('scholarships')
      .update(updateData)
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

    // Handle custom form fields
    if (form_template === 'custom' && custom_fields.length > 0) {
      await supabase
        .from('scholarship_form_fields')
        .delete()
        .eq('scholarship_id', id);

      const formFieldsData = custom_fields.map((field: any, index: number) => ({
        scholarship_id: id,
        field_type: field.type,
        field_label: field.label,
        field_name: field.name,
        placeholder: field.placeholder || '',
        is_required: field.required || false,
        field_order: index,
        validation_rules: field.validation || {},
        options: field.options || null
      }));

      const { error: fieldsError } = await supabase
        .from('scholarship_form_fields')
        .insert(formFieldsData);

      if (fieldsError) {
        console.error('❌ [API] Error saving custom fields:', fieldsError);
      }
    } else if (form_template !== 'custom') {
      await supabase
        .from('scholarship_form_fields')
        .delete()
        .eq('scholarship_id', id);
    }

    console.log('✅ [API] Scholarship updated with criteria:', scholarship.scoring_criteria);

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