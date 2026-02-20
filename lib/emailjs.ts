import emailjs from '@emailjs/nodejs';
// REMOVE THIS LINE: emailjs.init('cV-5tWllQGEd6pdOK');

interface EmailParams {
  to_email: string;
  student_name: string;
  scholarship_title: string;
  rank: number;
}

export async function sendSelectionEmailJS({
  to_email,
  student_name,
  scholarship_title,
  rank
}: EmailParams) {
  try {
    const templateParams = {
      to_email: to_email,
      student_name: student_name,
      scholarship_title: scholarship_title,
      rank: rank
    };

    console.log('📧 Sending email via EmailJS:', templateParams);

    const response = await emailjs.send(
      'service_m6if064',
      'template_cwnb4p4',
      templateParams,
      {
        publicKey: 'cV-5tWllQGEd6pdOK' ,// ← PASTE YOUR PRIVATE KEY HERE
        privateKey: 'vohikJlYV0jFrGx8DghVZ'  // ✅ Move publicKey here
      }
    );

    console.log('✅ EmailJS success:', response);
    return { success: true };
    
  } catch (error) {
    console.error('❌ EmailJS error:', error);
    return { success: false, error };
  }
}