'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
// ADD THIS IMPORT
import { useAuth } from '@/app/contexts/AuthContext';

interface Scholarship {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'active' | 'inactive';
}

export default function ApplyScholarshipPage() {
  const params = useParams();
  const router = useRouter();
  const scholarshipId = params.id as string;

    // ADD THIS LINE
  const { user } = useAuth();

  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    documents: [] as File[],
    additionalInfo: ''
  });

// Add this at the top of your ApplyScholarshipPage component
console.log('🔍 URL Scholarship ID:', scholarshipId);
console.log('🔍 Type of ID:', typeof scholarshipId);

// Test if the scholarship exists with this ID
useEffect(() => {
  console.log('🔄 Checking scholarship with ID:', scholarshipId);
  
  // Test the API directly
  fetch(`/api/scholarships/${scholarshipId}`)
    .then(r => r.json())
    .then(data => {
      console.log('🎯 Scholarship API Response:', data);
      if (data.scholarship) {
        console.log('✅ Scholarship FOUND:', data.scholarship);
        setScholarship(data.scholarship);
      } else {
        console.log('❌ Scholarship NOT FOUND in API');
        setError('Scholarship not found');
      }
    })
    .catch(err => {
      console.error('🚨 API Error:', err);
      setError('Failed to load scholarship');
    });
}, [scholarshipId]);

const fetchScholarship = async () => {
  try {
    console.log('🔄 Fetching scholarship with ID:', scholarshipId);
    
    const response = await fetch(`/api/scholarships/${scholarshipId}`);
    const data = await response.json();

    console.log('📦 Scholarship API Response:', {
      status: response.status,
      data: data,
      scholarship: data.scholarship
    });

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch scholarship');
    }

    if (!data.scholarship) {
      throw new Error('Scholarship data is missing from response');
    }

    setScholarship(data.scholarship);
  } catch (err: any) {
    console.error('❌ Error fetching scholarship:', err);
    setError(err.message);
  }
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...files]
      }));
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  setError('');

  try {
    // FIX: Use logged-in student instead of fallback
    if (!user || user.type !== 'student') {
      throw new Error('Please login as a student to apply for scholarships');
    }
    
    const studentRegno = user.regno; // Use actual student regno

    const applicationData = {
      student_regno: studentRegno,
      application_data: {
        additional_info: formData.additionalInfo,
        document_count: formData.documents.length,
        submitted_at: new Date().toISOString(),
        student_name: user.name // Add student name
      }
    };

    console.log('🔄 Sending application as student:', studentRegno);

    const response = await fetch(`/api/scholarships/${scholarshipId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });

    console.log('📩 Response status:', response.status);
    
    const data = await response.json();
    console.log('📦 Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || `Failed to submit application (Status: ${response.status})`);
    }

    // FIX: Store applications per student
    const appliedKey = `appliedScholarships_${studentRegno}`;
    const appliedScholarships = JSON.parse(localStorage.getItem(appliedKey) || '[]');
    localStorage.setItem(appliedKey, JSON.stringify([...appliedScholarships, scholarshipId]));

    setSuccess(true);
    setTimeout(() => {
      router.push('/student/scholarships');
    }, 2000);

  } catch (err: any) {
    console.error('❌ Submission error:', err);
    setError(err.message);
  } finally {
    setSubmitting(false);
  }
};

  if (!scholarship && !error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Your application for <strong>{scholarship?.title}</strong> has been submitted successfully.
            </p>
            <Link
              href="/student/scholarships"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Back to Scholarships
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          href="/student/scholarships"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Scholarship
        </Link>

        {/* Application Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Apply for Scholarship</h1>
          <p className="text-gray-600 mb-6">
            Complete your application for: <strong>{scholarship?.title}</strong>
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Info (Read-only) */}
            {/* Student Info (Read-only) */}
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
  <h3 className="font-semibold text-blue-900 mb-2">Student Information</h3>
  <div className="grid grid-cols-2 gap-4 text-sm">
    <div>
      <span className="text-blue-700">Name:</span>
      {/* FIX: Use actual student data */}
      <p className="font-medium">{user?.name || 'Not logged in'}</p>
    </div>
    <div>
      <span className="text-blue-700">Registration No:</span>
      {/* FIX: Use actual student data */}
      <p className="font-medium">{user?.regno || 'Not logged in'}</p>
    </div>
    <div>
      <span className="text-blue-700">Email:</span>
      {/* FIX: Use actual student data or fallback */}
      <p className="font-medium">{localStorage.getItem('studentEmail') || 'student@edu.pk'}</p>
    </div>
    <div>
      <span className="text-blue-700">Department:</span>
      {/* FIX: Use actual student data or fallback */}
      <p className="font-medium">{localStorage.getItem('studentLevel') || 'Computer Science'}</p>
    </div>
  </div>
</div>

            {/* Documents Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload Required Documents
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">Drag & drop files or click to browse</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="documents"
                />
                <label
                  htmlFor="documents"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
                >
                  Choose Files
                </label>
                <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG files (Max 10MB each)</p>
              </div>

              {/* Selected Files */}
              {formData.documents.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                  <div className="space-y-2">
                    {formData.documents.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information (Optional)
              </label>
              <textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                rows={4}
                placeholder="Any additional information you'd like to share with the scholarship committee..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Link
                href={`/student/scholarships/${scholarshipId}`}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}