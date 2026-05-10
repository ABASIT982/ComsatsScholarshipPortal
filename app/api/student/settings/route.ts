import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, hashPassword } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword, regNo } = await request.json();

    console.log('API received regNo:', regNo);

    if (!regNo) {
      return NextResponse.json(
        { error: 'Registration number is required' },
        { status: 400 }
      );
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('students')
      .select('*')
      .eq('regno', regNo)
      .single();

    if (userError || !user) {
      console.error('User not found:', regNo);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password_hash);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password in database
    const { error: updateError } = await supabase
      .from('students')
      .update({ password_hash: hashedPassword })
      .eq('regno', regNo);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Password changed successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}