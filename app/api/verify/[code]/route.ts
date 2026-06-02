import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const params = await context.params;
    const { code } = params;

    console.log('🔍 Verifying code:', code);

    const { data: meritEntry, error } = await supabase
      .from('merit_lists')
      .select('*, scholarships(title)')
      .eq('verification_code', code)
      .single();

    if (error || !meritEntry) {
      console.log('❌ Code not found:', error);
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 404 }
      );
    }

    console.log('✅ Code found:', meritEntry.student_regno);

    return NextResponse.json({
      valid: true,
      student_regno: meritEntry.student_regno,
      scholarship_title: meritEntry.scholarships?.title,
      award_tier: meritEntry.award_tier,
      award_description: meritEntry.award_description,
      rank: meritEntry.rank,
      status: meritEntry.status
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}