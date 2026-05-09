import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendSelectionEmailJS } from '@/lib/emailjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { scholarshipId } = await request.json();

    console.log('🎯 [MERIT API] Generating merit list for scholarship:', scholarshipId);

    if (!scholarshipId) {
      return NextResponse.json(
        { error: 'Scholarship ID is required' },
        { status: 400 }
      );
    }

    // 1. Get scholarship with scoring criteria
    const { data: scholarship, error: scholarshipError } = await supabase
      .from('scholarships')
      .select('*')
      .eq('id', scholarshipId)
      .single();

    if (scholarshipError || !scholarship) {
      console.error('❌ [MERIT API] Scholarship not found:', scholarshipError);
      return NextResponse.json(
        { error: 'Scholarship not found' },
        { status: 404 }
      );
    }

    // Check if scoring criteria exists
    if (!scholarship.scoring_criteria || scholarship.scoring_criteria.length === 0) {
      return NextResponse.json(
        { error: 'Scoring criteria not set for this scholarship' },
        { status: 400 }
      );
    }

    // Check if number of awards is set
    if (!scholarship.number_of_awards || scholarship.number_of_awards <= 0) {
      return NextResponse.json(
        { error: 'Number of awards not set for this scholarship' },
        { status: 400 }
      );
    }

    // 2. Get all APPROVED applications for this scholarship
    const { data: applications, error: applicationsError } = await supabase
      .from('scholarship_applications')
      .select('*')
      .eq('scholarship_id', scholarshipId)
      .eq('status', 'approved');

    if (applicationsError) {
      console.error('❌ [MERIT API] Error fetching applications:', applicationsError);
      return NextResponse.json(
        { error: 'Failed to fetch applications: ' + applicationsError.message },
        { status: 500 }
      );
    }

    if (!applications || applications.length === 0) {
      return NextResponse.json(
        { error: 'No approved applications found for this scholarship' },
        { status: 400 }
      );
    }

    console.log(`📊 [MERIT API] Found ${applications.length} approved applications`);

    const criteria = scholarship.scoring_criteria;
    const scoredApplications = [];

    // FIRST PASS: Calculate raw scores (convert everything to percentage first)
    for (const app of applications) {
      const applicationData = app.application_data || {};
      let totalPercentageScore = 0;
      const breakdown: Record<string, any> = {};

      for (const criterion of criteria) {
        let fieldValue = 0;
        const rawValue = applicationData[criterion.fieldName];
        
        if (rawValue) {
          if (typeof rawValue === 'number') {
            fieldValue = rawValue;
          } else if (typeof rawValue === 'string') {
            const cleanedValue = rawValue.replace(/,/g, '');
            fieldValue = parseFloat(cleanedValue) || 0;
          }
        }

        // ✅ CONVERT EACH FIELD TO PERCENTAGE BASED ON ITS TYPE
        let percentageValue = 0;
        
        // Check if this field is GPA/CGPA (value between 0-4.33 and field name suggests GPA)
        const fieldNameLower = criterion.fieldName?.toLowerCase() || '';
        const fieldLabelLower = criterion.fieldLabel?.toLowerCase() || '';
        const isGPA = fieldNameLower.includes('gpa') || 
                      fieldNameLower.includes('cgpa') ||
                      fieldLabelLower.includes('gpa') ||
                      fieldLabelLower.includes('cgpa') ||
                      (fieldValue <= 4.33 && fieldValue > 0);
        
        // Check if this is percentage based (value between 0-100)
        const isPercentage = fieldValue <= 100 && fieldValue > 0 && !isGPA;
        
        if (isGPA) {
          // GPA: 4.0 = 100%, 3.5 = 87.5%, 2.0 = 50%
          percentageValue = (fieldValue / 4.0) * 100;
        } else if (isPercentage) {
          // Already a percentage
          percentageValue = fieldValue;
        } else {
          // Raw marks (FSC, Matric, etc.) - assume max is 1100 or whatever
          // Store as-is, will be normalized later
          percentageValue = fieldValue;
        }
        
        // Apply weight to get contribution
        const weightedScore = (percentageValue * criterion.weight) / 100;
        totalPercentageScore += weightedScore;
        
breakdown[criterion.fieldName] = {
  raw: fieldValue,
  type: isGPA ? 'gpa' : (isPercentage ? 'percentage' : 'marks')
};
      }

      scoredApplications.push({
        application_id: app.id,
        student_regno: app.student_regno,
        raw_score: totalPercentageScore,
        breakdown: breakdown,
        application_data: applicationData
      });
    }

    // ✅ FIND MAX RAW SCORE (for normalization)
    const maxRawScore = Math.max(...scoredApplications.map(app => app.raw_score));
    
    // ✅ SECOND PASS: Normalize final scores to 0-100%
    const normalizedApplications = scoredApplications.map(app => {
      let finalScore = 0;
      
      if (maxRawScore > 0) {
        finalScore = (app.raw_score / maxRawScore) * 100;
      }
      
      finalScore = Math.round(finalScore * 100) / 100;
      
      return {
        ...app,
        total_score: finalScore,
        raw_score_percentage: app.raw_score
      };
    });

    // Sort by total score (highest first)
    normalizedApplications.sort((a, b) => b.total_score - a.total_score);

    const awardCount = scholarship.number_of_awards;
    const meritEntries = normalizedApplications.map((app, index) => {
      let status = 'waitlist';
      if (index < awardCount) {
        status = 'selected';
      }
      
      return {
        scholarship_id: scholarshipId,
        student_regno: app.student_regno,
        application_id: app.application_id,
        total_score: app.total_score,
        rank: index + 1,
        status: status,
        score_breakdown: app.breakdown,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });

    console.log(`📈 [MERIT API] Max raw score: ${maxRawScore}`);
    console.log(`📈 [MERIT API] Final scores normalized to 0-100: Top = ${normalizedApplications[0]?.total_score}%`);

    // 7. Delete any existing merit list for this scholarship
    const { error: deleteError } = await supabase
      .from('merit_lists')
      .delete()
      .eq('scholarship_id', scholarshipId);

    if (deleteError) {
      console.error('❌ [MERIT API] Error deleting old merit list:', deleteError);
    }

    // 8. Insert new merit list entries
    const { error: insertError } = await supabase
      .from('merit_lists')
      .insert(meritEntries);

    if (insertError) {
      console.error('❌ [MERIT API] Error inserting merit list:', insertError);
      return NextResponse.json(
        { error: 'Failed to save merit list: ' + insertError.message },
        { status: 500 }
      );
    }

    // 9. Update scholarship to mark merit list as generated
    const { error: updateError } = await supabase
      .from('scholarships')
      .update({
        merit_list_generated: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', scholarshipId);

    if (updateError) {
      console.error('❌ [MERIT API] Error updating scholarship:', updateError);
    }

    console.log('✅ [MERIT API] Merit list generated successfully');

    // Send notifications
    try {
      const scholarshipTitle = scholarship.title;
      
      const { data: meritStudents, error: meritError } = await supabase
        .from('merit_lists')
        .select('student_regno, status, rank, total_score')
        .eq('scholarship_id', scholarshipId);

      if (!meritError && meritStudents && meritStudents.length > 0) {
        const notifications = meritStudents.map((student: any) => ({
          user_id: student.student_regno,
          user_type: 'student',
          type: 'merit_generated',
          title: student.status === 'selected' ? '🎉 Congratulations! You are Selected' : '📋 Merit List Published',
          message: student.status === 'selected' 
            ? `You have been selected for "${scholarshipTitle}"! Score: ${student.total_score}/100`
            : `Merit list for "${scholarshipTitle}" has been published.`,
          data: {
            scholarshipId: scholarshipId,
            scholarshipTitle: scholarshipTitle,
            status: student.status,
            rank: student.rank
          },
          is_read: false,
          created_at: new Date().toISOString()
        }));

        await supabase.from('notifications').insert(notifications);
        console.log(`✅ Sent notifications to ${meritStudents.length} students`);
      }
    } catch (notifError) {
      console.error('❌ Notification error:', notifError);
    }

    // Send emails to selected students
    try {
      const selectedStudents = meritEntries.filter(entry => entry.status === 'selected');
      
      for (const student of selectedStudents) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('regno', student.student_regno)
          .single();
        
        const studentEmail = profile?.email;
        const studentName = profile?.full_name || student.student_regno;
        
        if (studentEmail) {
          await sendSelectionEmailJS({
            to_email: studentEmail,
            student_name: studentName,
            scholarship_title: scholarship.title,
            rank: student.rank
          });
          console.log(`✅ Email sent to ${studentEmail}`);
        }
      }
      
      console.log(`📧 Completed sending ${selectedStudents.length} emails`);
    } catch (emailError) {
      console.error('❌ Email error:', emailError);
    }

    // Return summary
    return NextResponse.json({
      success: true,
      message: 'Merit list generated successfully',
      summary: {
        total_applications: applications.length,
        selected_count: Math.min(awardCount, applications.length),
        waitlist_count: Math.max(0, applications.length - awardCount),
        top_score: normalizedApplications[0]?.total_score || 0,
        cutoff_score: normalizedApplications[Math.min(awardCount - 1, normalizedApplications.length - 1)]?.total_score || 0
      },
      merit_list: meritEntries.map(entry => ({
        rank: entry.rank,
        student_regno: entry.student_regno,
        total_score: entry.total_score,
        status: entry.status
      }))
    });

  } catch (error: unknown) {
    console.error('❌ [MERIT API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}