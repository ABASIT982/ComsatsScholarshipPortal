import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CreateNotificationParams {
  userId: string;
  userType: 'student' | 'admin';
  type: string;
  title: string;
  message: string;
  data?: any;
}

export async function createNotification({
  userId,
  userType,
  type,
  title,
  message,
  data = {}
}: CreateNotificationParams) {
  try {
    console.log('🔔 [NOTIFICATION] ===== START =====');
    console.log('🔔 [NOTIFICATION] Input:', { userId, userType, type, title });
    
    // Handle "all-admins" special case
    if (userId === 'all-admins') {
      console.log('🔔 [NOTIFICATION] Creating notification for admin: 97bca663-9121-48c4-82c7-b76a03c25ec6');
      
      // Direct insert for admin - no need to fetch
      const { data: insertedData, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: '97bca663-9121-48c4-82c7-b76a03c25ec6', // Your admin ID
          user_type: 'admin',
          type,
          title,
          message,
          data,
          is_read: false,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('❌ [NOTIFICATION] Insert error:', error);
        return { success: false, error };
      }
      
      console.log('✅ [NOTIFICATION] Admin notification created:', insertedData);
      console.log('🔔 [NOTIFICATION] ===== END =====');
      return { success: true, data: insertedData };
    }
    
    // Handle student notification
    console.log('🔔 [NOTIFICATION] Creating notification for student:', userId);
    
    const { data: insertedData, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        user_type: userType,
        type,
        title,
        message,
        data,
        is_read: false,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('❌ [NOTIFICATION] Insert error:', error);
      return { success: false, error };
    }
    
    console.log('✅ [NOTIFICATION] Notification created:', insertedData);
    console.log('🔔 [NOTIFICATION] ===== END =====');
    return { success: true, data: insertedData };
    
  } catch (error) {
    console.error('❌ [NOTIFICATION] Fatal error:', error);
    return { success: false, error };
  }
}

export async function markAsRead(notificationIds: string[]) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .in('id', notificationIds);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error marking as read:', error);
    return { success: false, error };
  }
}

export async function markAllAsRead(userId: string, userType: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('user_type', userType)
      .eq('is_read', false);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error marking all as read:', error);
    return { success: false, error };
  }
}

export async function getUnreadCount(userId: string, userType: string) {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('user_type', userType)
      .eq('is_read', false);

    if (error) throw error;
    return { count: count || 0 };
  } catch (error) {
    console.error('Error getting unread count:', error);
    return { count: 0 };
  }
}