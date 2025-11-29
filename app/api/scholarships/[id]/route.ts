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

    // UPDATED: Fetch scholarship with ALL fields including form configuration
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

    console.log('✅ [API] Scholarship found:', scholarship.id, scholarship.title);
    console.log('📋 [API] Form configuration:', {
      student_types: scholarship.student_types,
      form_template: scholarship.form_template,
      custom_fields: scholarship.custom_fields,
      form_fields_count: scholarship.scholarship_form_fields?.length || 0
    });
    
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

// UPDATED: Edit method to handle form configuration
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
      custom_fields = []
    } = await request.json();

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

    // UPDATED: Prepare update data with form configuration
    const updateData: any = {
      title,
      description,
      deadline,
      status,
      updated_at: new Date().toISOString()
    };

    // Add form configuration if provided
    if (student_types !== undefined) updateData.student_types = student_types;
    if (form_template !== undefined) updateData.form_template = form_template;
    if (custom_fields !== undefined) updateData.custom_fields = form_template === 'custom' ? custom_fields : [];

    // Update the scholarship
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

    // UPDATED: Handle custom form fields if template is custom
    if (form_template === 'custom' && custom_fields.length > 0) {
      // Delete existing custom fields
      await supabase
        .from('scholarship_form_fields')
        .delete()
        .eq('scholarship_id', id);

      // Insert new custom fields
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
      // Delete custom fields if switching from custom to template
      await supabase
        .from('scholarship_form_fields')
        .delete()
        .eq('scholarship_id', id);
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