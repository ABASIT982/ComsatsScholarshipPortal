import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

    // 3. Calculate scores for each application
    const criteria = scholarship.scoring_criteria;
    const scoredApplications = [];

    for (const app of applications) {
      const applicationData = app.application_data || {};
      let totalScore = 0;
      const breakdown: Record<string, number> = {};

      // Calculate weighted score for each criterion
      for (const criterion of criteria) {
        // Get field value from application_data
        let fieldValue = 0;
        
        // Handle different field types
        const rawValue = applicationData[criterion.fieldName];
        
        if (rawValue) {
          // If it's a number, parse it
          if (typeof rawValue === 'number') {
            fieldValue = rawValue;
          } else if (typeof rawValue === 'string') {
            // Try to parse as number, remove commas if any
            const cleanedValue = rawValue.replace(/,/g, '');
            fieldValue = parseFloat(cleanedValue) || 0;
          }
        }

        // Calculate weighted score
        const weightedScore = (fieldValue * criterion.weight) / 100;
        totalScore += weightedScore;
        
        // Store breakdown
        breakdown[criterion.fieldName] = weightedScore;
      }

      scoredApplications.push({
        application_id: app.id,
        student_regno: app.student_regno,
        total_score: Number(totalScore.toFixed(2)),
        score_breakdown: breakdown,
        application_data: applicationData
      });
    }

    // 4. Sort by total score (highest first)
    scoredApplications.sort((a, b) => b.total_score - a.total_score);

    // 5. Assign ranks
    const rankedApplications = scoredApplications.map((app, index) => ({
      ...app,
      rank: index + 1
    }));

    // 6. Determine status based on rank and number_of_awards
    const awardCount = scholarship.number_of_awards;
    const meritEntries = rankedApplications.map((app, index) => {
      let status = 'waitlist';
      if (index < awardCount) {
        status = 'selected';
      }
      
      return {
        scholarship_id: scholarshipId,
        student_regno: app.student_regno,
        application_id: app.application_id,
        total_score: app.total_score,
        rank: app.rank,
        status: status,
        score_breakdown: app.score_breakdown,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });

    console.log(`📈 [MERIT API] Calculated scores: Top score = ${rankedApplications[0]?.total_score}, Lowest = ${rankedApplications[rankedApplications.length - 1]?.total_score}`);

    // 7. Delete any existing merit list for this scholarship
    const { error: deleteError } = await supabase
      .from('merit_lists')
      .delete()
      .eq('scholarship_id', scholarshipId);

    if (deleteError) {
      console.error('❌ [MERIT API] Error deleting old merit list:', deleteError);
      // Continue anyway, don't fail
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
      // Don't fail, merit list is already saved
    }

    console.log('✅ [MERIT API] Merit list generated successfully');

    // ✅ ADD NOTIFICATIONS HERE - STUDENTS GET NOTIFIED ABOUT MERIT LIST
    try {
      console.log('📢 [MERIT API] Sending merit list notifications to students...');
      
      // Get scholarship title for the message
      const scholarshipTitle = scholarship.title;
      
      // Get all students who have entries in the merit list
      const { data: meritStudents, error: meritError } = await supabase
        .from('merit_lists')
        .select('student_regno, status, rank')
        .eq('scholarship_id', scholarshipId);

      if (meritError) {
        console.error('❌ [MERIT API] Error fetching merit students:', meritError);
      } else if (meritStudents && meritStudents.length > 0) {
        console.log(`📢 [MERIT API] Found ${meritStudents.length} students in merit list`);
        
        const notifications = meritStudents.map(student => ({
          user_id: student.student_regno,
          user_type: 'student',
          type: 'merit_generated',
          title: student.status === 'selected' ? '🎉 Congratulations! You are Selected' : '📋 Merit List Published',
          message: student.status === 'selected' 
            ? `You have been selected for "${scholarshipTitle}"! Check your merit list details.`
            : `Merit list for "${scholarshipTitle}" has been published. Check your status.`,
          data: {
            scholarshipId: scholarshipId,
            scholarshipTitle: scholarshipTitle,
            status: student.status,
            rank: student.rank
          },
          is_read: false,
          created_at: new Date().toISOString()
        }));

        const { error: notifError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (notifError) {
          console.error('❌ [MERIT API] Error sending notifications:', notifError);
        } else {
          console.log(`✅ [MERIT API] Sent notifications to ${meritStudents.length} students`);
        }
      }
    } catch (notifError) {
      console.error('❌ [MERIT API] Notification error:', notifError);
    }

    // 10. Return summary
    return NextResponse.json({
      success: true,
      message: 'Merit list generated successfully',
      summary: {
        total_applications: applications.length,
        selected_count: Math.min(awardCount, applications.length),
        waitlist_count: Math.max(0, applications.length - awardCount),
        top_score: rankedApplications[0]?.total_score || 0,
        cutoff_score: rankedApplications[Math.min(awardCount - 1, rankedApplications.length - 1)]?.total_score || 0
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