'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, CheckCircle, FileText } from 'lucide-react';

interface Scholarship {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export default function ScholarshipDetailsPage() {
  const params = useParams();
  const scholarshipId = params?.id as string;

  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  console.log('🔍 Page received ID:', scholarshipId);

  useEffect(() => {
    if (scholarshipId && scholarshipId !== 'undefined') {
      fetchScholarship();
      checkApplicationStatus();
    } else {
      console.error('❌ No scholarship ID found in URL');
      setError('Invalid scholarship URL');
      setLoading(false);
    }
  }, [scholarshipId]);

const fetchScholarship = async () => {
  try {
    console.log('🔄 Fetching scholarship with ID:', scholarshipId);
    console.log('🔍 Full API URL will be:', `/api/scholarships/${scholarshipId}`);
    
    const response = await fetch(`/api/scholarships/${scholarshipId}`);
    
    console.log('🔍 Response status:', response.status);
    console.log('🔍 Response OK:', response.ok);
    
    const data = await response.json();
    console.log('🔍 Full API response data:', data);
    
    if (!response.ok) {
      throw new Error(data.error || `Failed to load scholarship (Status: ${response.status})`);
    }
    
    if (!data.scholarship) {
      throw new Error('Scholarship data not found in response');
    }

    console.log('✅ Scholarship loaded successfully:', data.scholarship.title);
    setScholarship(data.scholarship);
      
  } catch (err: any) {
    console.error('❌ Error loading scholarship:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const checkApplicationStatus = async () => {
  try {
    const studentRegno = localStorage.getItem('studentRegno');
    
    if (!studentRegno) {
      console.log('❌ No student registration number found');
      // Use student-specific localStorage key
      const appliedKey = `appliedScholarships_${studentRegno}`;
      const appliedScholarships = JSON.parse(localStorage.getItem(appliedKey) || '[]');
      setHasApplied(appliedScholarships.includes(scholarshipId));
      return;
    }
    
    // Use the correct API endpoint to check for specific scholarship
    const response = await fetch(`/api/applications?student_regno=${studentRegno}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Application check response:', data);
      
      // Check if this specific scholarship is in the applied list
      const hasAppliedToThis = data.applications?.some((app: any) => 
        app.scholarship_id === scholarshipId
      );
      
      setHasApplied(!!hasAppliedToThis);
    } else {
      // Fallback to student-specific localStorage
      const appliedKey = `appliedScholarships_${studentRegno}`;
      const appliedScholarships = JSON.parse(localStorage.getItem(appliedKey) || '[]');
      console.log('📦 Fallback check - Applied scholarships:', appliedScholarships);
      setHasApplied(appliedScholarships.includes(scholarshipId));
    }
  } catch (error) {
    console.log('❌ Error checking application status:', error);
    // Fallback to student-specific localStorage
    const studentRegno = localStorage.getItem('studentRegno');
    const appliedKey = `appliedScholarships_${studentRegno}`;
    const appliedScholarships = JSON.parse(localStorage.getItem(appliedKey) || '[]');
    setHasApplied(appliedScholarships.includes(scholarshipId));
  }
};

  const handleApply = () => {
    setShowApplyForm(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSubmitApplication = async () => {
    setSubmitting(true);
    try {
      const studentRegno = localStorage.getItem('studentRegno');
      const studentName = localStorage.getItem('studentName');
      const studentEmail = localStorage.getItem('studentEmail');
      const studentLevel = localStorage.getItem('studentLevel');

      // Validate that student data exists
      if (!studentRegno) {
        throw new Error('Student information not found. Please log in again.');
      }

      console.log('🔍 Debug Application Submission:');
      console.log('Student RegNo:', studentRegno);
      console.log('Student Name:', studentName);
      console.log('Student Email:', studentEmail);
      console.log('Student Level:', studentLevel);
      console.log('Scholarship ID:', scholarshipId);
      console.log('Scholarship Title:', scholarship?.title);
      console.log('Scholarship Status:', scholarship?.status);

      // Check if scholarship is active
      if (scholarship?.status !== 'active') {
        throw new Error('This scholarship is no longer active');
      }

      const additionalInfo = (document.getElementById('additionalInfo') as HTMLTextAreaElement)?.value || '';
      
      if (!additionalInfo.trim()) {
        throw new Error('Please provide your application statement');
      }

      const applicationData = {
        student_regno: studentRegno,
        scholarship_id: scholarshipId,
        application_data: {
          applied_at: new Date().toISOString(),
          student_name: studentName,
          student_email: studentEmail,
          student_level: studentLevel,
          additional_info: additionalInfo,
          scholarship_title: scholarship?.title
        }
      };

      console.log('📤 Sending application data:', applicationData);

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      const result = await response.json();
      console.log('📥 API Response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }

      // Update application status
      setHasApplied(true);
      setShowApplyForm(false);
      
      // Update localStorage as backup
      const appliedScholarships = JSON.parse(localStorage.getItem('appliedScholarships') || '[]');
      if (!appliedScholarships.includes(scholarshipId)) {
        localStorage.setItem('appliedScholarships', JSON.stringify([...appliedScholarships, scholarshipId]));
      }

      alert('🎉 Application submitted successfully!');

    } catch (err: any) {
      console.error('❌ Application error:', err);
      alert('Error submitting application: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Application Form Component
  const ApplicationForm = () => {
    // Get actual student data
    const studentRegno = localStorage.getItem('studentRegno');
    const studentName = localStorage.getItem('studentName');
    const studentEmail = localStorage.getItem('studentEmail');
    const studentLevel = localStorage.getItem('studentLevel');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Apply for Scholarship</h2>
              <button
                onClick={() => setShowApplyForm(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={submitting}
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mt-1">{scholarship?.title}</p>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Name:</span>
                    <p className="font-medium">{studentName || 'Not available'}</p>
                  </div>
                  <div>
                    <span className="text-blue-700">Registration No:</span>
                    <p className="font-medium">{studentRegno || 'Not available'}</p>
                  </div>
                  <div>
                    <span className="text-blue-700">Email:</span>
                    <p className="font-medium">{studentEmail || 'Not available'}</p>
                  </div>
                  <div>
                    <span className="text-blue-700">Department:</span>
                    <p className="font-medium">{studentLevel || 'Not available'}</p>
                  </div>
                </div>
                {!studentRegno && (
                  <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-sm">
                    ⚠️ Please make sure you are logged in properly.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Required Documents
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Drag & drop files or click to browse</p>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="documents"
                  />
                  <label
                    htmlFor="documents"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
                  >
                    Choose Files
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG files (Max 10MB each)</p>
                </div>
              </div>

              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                  Why should you receive this scholarship? *
                </label>
                <textarea
                  id="additionalInfo"
                  rows={4}
                  placeholder="Please explain why you are a good candidate for this scholarship..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowApplyForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitApplication}
                  disabled={submitting || !studentRegno}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle size={20} />
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">Loading scholarship details...</div>
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || 'Scholarship not found'}
          </div>
          <Link
            href="/student/scholarships"
            className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={16} />
            Back to Scholarships
          </Link>
        </div>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(scholarship.deadline);
  const isExpired = daysRemaining < 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/student/scholarships"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Scholarships
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{scholarship.title}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={20} />
                    <span className="font-medium">Deadline: {formatDate(scholarship.deadline)}</span>
                  </div>
                  {isExpired ? (
                    <span className="bg-red-500 px-3 py-1 rounded-full text-sm font-medium">
                      Expired
                    </span>
                  ) : (
                    <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">
                      {daysRemaining} days remaining
                    </span>
                  )}
                </div>
              </div>

              {/* REMOVED: Apply button from details page - Only show status */}
              <div className="flex gap-3 flex-shrink-0">
                {hasApplied ? (
                  <div className="flex items-center gap-2 bg-green-500 px-6 py-3 rounded-lg">
                    <CheckCircle size={20} />
                    <span className="font-semibold">Applied</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-blue-500 px-6 py-3 rounded-lg">
                    <FileText size={20} />
                    <span className="font-semibold">View Details</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Scholarship Details</h2>
              
              <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-6 rounded-lg border border-gray-200">
                {scholarship.description}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Information</h3>
                <div className="space-y-2 text-blue-800">
                  <div className="flex justify-between">
                    <span>Application Deadline:</span>
                    <span className="font-semibold">{formatDate(scholarship.deadline)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-semibold capitalize">{scholarship.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Remaining:</span>
                    <span className="font-semibold">
                      {isExpired ? 'Expired' : `${daysRemaining} days`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Application:</span>
                    <span className="font-semibold">
                      {hasApplied ? 'Submitted' : 'Not Applied'}
                    </span>
                  </div>
                </div>
              </div>

              {/* REMOVED: Apply button from bottom of details page */}
            </div>
          </div>
        </div>

        {showApplyForm && <ApplicationForm />}
      </div>
    </div>
  );
}