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

// POST: Create new scholarship (admin only) - UPDATED
export async function POST(request: NextRequest) {
  try {
    const { 
      title, 
      description, 
      deadline, 
      status = 'active',
      student_types = ['undergraduate'], // NEW: Student types
      form_template = 'basic', // NEW: Form template
      custom_fields = [] // NEW: Custom fields
    } = await request.json();

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

    // NEW: Validate student types
    if (!Array.isArray(student_types) || student_types.length === 0) {
      return NextResponse.json(
        { error: 'At least one student type must be selected' },
        { status: 400 }
      );
    }

    // NEW: Validate form template
    const validTemplates = ['basic', 'academic', 'research', 'financial', 'detailed', 'custom'];
    if (!validTemplates.includes(form_template)) {
      return NextResponse.json(
        { error: 'Invalid form template selected' },
        { status: 400 }
      );
    }

    // NEW: Prepare scholarship data with form configuration
    const scholarshipData = {
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
      student_types, // NEW: Store student types
      form_template, // NEW: Store form template
      custom_fields: form_template === 'custom' ? custom_fields : [], // NEW: Store custom fields only if custom template
      created_by: null
    };

    // Create scholarship with form configuration
    const { data, error } = await supabase
      .from('scholarships')
      .insert([scholarshipData])
      .select()
      .single();

    if (error) {
      console.error('Database error creating scholarship:', error);
      return NextResponse.json({ 
        error: `Failed to create scholarship: ${error.message}` 
      }, { status: 500 });
    }

    // NEW: If custom template, also save fields to scholarship_form_fields table
    if (form_template === 'custom' && custom_fields.length > 0) {
      const formFieldsData = custom_fields.map((field: any, index: number) => ({
        scholarship_id: data.id,
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
        console.error('Error saving custom form fields:', fieldsError);
        // Don't fail the entire request if fields saving fails
        console.warn('Scholarship created but custom fields failed to save');
      }
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

// NEW: PUT - Update scholarship (for editing form configuration)
export async function PUT(request: NextRequest) {
  try {
    const { 
      id,
      title, 
      description, 
      deadline, 
      status,
      student_types,
      form_template,
      custom_fields = []
    } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Scholarship ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (deadline) updateData.deadline = deadline;
    if (status) updateData.status = status;
    if (student_types) updateData.student_types = student_types;
    if (form_template) updateData.form_template = form_template;
    if (form_template === 'custom') {
      updateData.custom_fields = custom_fields;
    } else {
      updateData.custom_fields = [];
    }

    const { data, error } = await supabase
      .from('scholarships')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error updating scholarship:', error);
      return NextResponse.json({ 
        error: `Failed to update scholarship: ${error.message}` 
      }, { status: 500 });
    }

    // Update form fields if custom template
    if (form_template === 'custom' && custom_fields.length > 0) {
      // First delete existing fields
      await supabase
        .from('scholarship_form_fields')
        .delete()
        .eq('scholarship_id', id);

      // Then insert new fields
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
        console.error('Error updating custom form fields:', fieldsError);
      }
    } else if (form_template !== 'custom') {
      // Delete custom fields if switching from custom to template
      await supabase
        .from('scholarship_form_fields')
        .delete()
        .eq('scholarship_id', id);
    }

    return NextResponse.json({ 
      scholarship: data, 
      message: 'Scholarship updated successfully' 
    });

  } catch (error) {
    console.error('Unexpected error in scholarships PUT API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}