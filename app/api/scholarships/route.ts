import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const forStudent = searchParams.get('forStudent') === 'true';

    let query = supabase.from('scholarships').select('*');

    if (forStudent) {
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

export async function POST(request: NextRequest) {
  try {
    const { 
      title, 
      description, 
      deadline, 
      status = 'active',
      student_types = ['undergraduate'], 
      form_template = 'custom',
      custom_fields = [],
      number_of_awards = 0
    } = await request.json();

    if (!title || !description || !deadline) {
      return NextResponse.json(
        { error: 'Title, description, and deadline are required' },
        { status: 400 }
      );
    }

    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deadlineDate < today) {
      return NextResponse.json(
        { error: 'Deadline must be in the future' },
        { status: 400 }
      );
    }

    if (!Array.isArray(student_types) || student_types.length === 0) {
      return NextResponse.json(
        { error: 'At least one student type must be selected' },
        { status: 400 }
      );
    }

    const scholarshipData = {
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
      student_types, 
      form_template: 'custom',
      custom_fields: custom_fields,
      number_of_awards: number_of_awards,
      created_by: null
    };

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

    if (custom_fields.length > 0) {
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
      }
    }

    // ✅ ADD NOTIFICATIONS HERE - YOUR EXISTING CODE ABOVE IS UNCHANGED
    try {
      console.log('📢 Starting notification process for new scholarship...');
      
      // Get all students using 'regno' column
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('regno');

      if (studentsError) {
        console.error('❌ Error fetching students:', studentsError);
      } else {
        console.log(`📢 Found ${students?.length || 0} students`);
        
        if (students && students.length > 0) {
          const notifications = students.map(student => ({
            user_id: student.regno,
            user_type: 'student',
            type: 'new_scholarship',
            title: '🎓 New Scholarship Available',
            message: `"${data.title}" is now open for applications. Apply before ${new Date(deadline).toLocaleDateString()}!`,
            data: {
              scholarshipId: data.id,
              scholarshipTitle: data.title,
              deadline: deadline
            },
            is_read: false,
            created_at: new Date().toISOString()
          }));

          console.log(`📢 Creating ${notifications.length} notifications`);
          
          const { error: notifError } = await supabase
            .from('notifications')
            .insert(notifications);

          if (notifError) {
            console.error('❌ Error inserting notifications:', notifError);
          } else {
            console.log(`✅ Successfully sent notifications to ${students.length} students`);
          }
        }
      }
    } catch (notifError) {
      console.error('❌ Notification error:', notifError);
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

// ✅ FIXED PUT METHOD WITH SCORING CRITERIA
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
      custom_fields = [],
      scoring_criteria,
      number_of_awards
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
    // ✅ ADD THESE TWO LINES
    if (scoring_criteria !== undefined) updateData.scoring_criteria = scoring_criteria;
    if (number_of_awards !== undefined) updateData.number_of_awards = number_of_awards;

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
        console.error('Error updating custom form fields:', fieldsError);
      }
    } else if (form_template !== 'custom') {
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