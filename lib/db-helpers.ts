import { supabase } from './supabaseClient';

export async function updateStudentDocument(
  regno: string, 
  fieldName: string, 
  fileUrl: string
) {
  try {
    console.log('💾 Updating database:', { regno, fieldName, fileUrl });
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        [fieldName]: fileUrl,
        updated_at: new Date().toISOString()
      })
      .eq('regno', regno)
      .select();

    if (error) {
      console.error('❌ Database update error:', error);
      throw error;
    }

    console.log('✅ Database updated successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed to update database:', error);
    throw error;
  }
}