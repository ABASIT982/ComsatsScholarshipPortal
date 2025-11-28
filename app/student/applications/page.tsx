'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, CheckCircle, XCircle, Clock4 } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext'; // ADD THIS IMPORT

interface Application {
  id: string;
  scholarship_id: string;
  student_regno: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  notes?: string;
  scholarship?: {
    title: string;
    deadline: string;
  };
}

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // ADD THIS LINE - Get logged-in student
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.type === 'student') {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [user]); // ADD user dependency

  // REPLACE the entire useEffect with this function:
  const fetchApplications = async () => {
    try {
      if (!user || user.type !== 'student') {
        setApplications([]);
        setLoading(false);
        return;
      }

      const studentRegno = user.regno;

      // FIRST: Try to fetch from API (real data)
      console.log('🔄 Fetching applications for:', studentRegno);
      
      const response = await fetch(`/api/applications?student_regno=${studentRegno}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Applications from API:', data.applications);
        setApplications(data.applications || []);
      } else {
        // FALLBACK: Use student-specific localStorage
        console.log('📦 Using localStorage fallback for:', studentRegno);
        const appliedKey = `appliedScholarships_${studentRegno}`;
        const appliedScholarships = JSON.parse(localStorage.getItem(appliedKey) || '[]');
        
        // Create applications from localStorage data
        const mockApplications: Application[] = appliedScholarships.map((scholarshipId: string, index: number) => ({
          id: `app-${studentRegno}-${index}`,
          scholarship_id: scholarshipId,
          student_regno: studentRegno, // USE ACTUAL STUDENT REGNO
          status: 'pending',
          applied_at: new Date().toISOString(),
          scholarship: {
            title: `Scholarship ${scholarshipId.slice(0, 8)}`, // Better title
            deadline: '2024-12-31'
          }
        }));

        setApplications(mockApplications);
      }
    } catch (err) {
      console.error('❌ Error fetching applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock4 className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // ADD loading state for no student
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">Loading your applications...</div>
        </div>
      </div>
    );
  }

  // ADD no student logged in state
  if (!user || user.type !== 'student') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="text-gray-400 text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Student Login Required</h3>
            <p className="text-gray-600 text-lg mb-6">
              Please log in as a student to view your applications.
            </p>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">
            Track your scholarship applications - <span className="font-medium">{user.name}</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No applications yet</h3>
            <p className="text-gray-600 text-lg mb-6">
              You haven't applied for any scholarships yet.
            </p>
            <Link
              href="/student/scholarships"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Browse Scholarships
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusIcon(application.status)}
                      <h3 className="font-semibold text-lg text-gray-900">
                        {application.scholarship?.title || 'Scholarship'}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Applied: {formatDate(application.applied_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Status: 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </span>
                      </div>
                      <div>
                        <span>Your ID: {application.student_regno}</span>
                      </div>
                    </div>

                    {application.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{application.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}