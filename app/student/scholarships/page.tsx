'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Eye } from 'lucide-react';
// ADD THIS IMPORT
import { useAuth } from '@/app/contexts/AuthContext';

interface Scholarship {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export default function StudentScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [appliedScholarships, setAppliedScholarships] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    fetchScholarships();
    fetchAppliedScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const response = await fetch('/api/scholarships?forStudent=true');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch scholarships');
      }

      setScholarships(data.scholarships || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const fetchAppliedScholarships = async () => {
  try {
    if (!user || user.type !== 'student') {
      console.log('❌ No student logged in');
      setAppliedScholarships([]);
      return;
    }
    
    const studentRegno = user.regno;
    
    console.log('🔄 Fetching applied scholarships for:', studentRegno);
    
    // Try API first
    const response = await fetch(`/api/applications?student_regno=${studentRegno}`);
    
    if (response.ok) {
      const data = await response.json();
      const appliedIds = data.applications?.map((app: any) => app.scholarship_id) || [];
      console.log('✅ Applied scholarships from API:', appliedIds);
      setAppliedScholarships(appliedIds);
      
      // Also update localStorage as backup
      const appliedKey = `appliedScholarships_${studentRegno}`;
      localStorage.setItem(appliedKey, JSON.stringify(appliedIds));
    } else {
      // Fallback to localStorage
      const appliedKey = `appliedScholarships_${studentRegno}`;
      const localApplied = JSON.parse(localStorage.getItem(appliedKey) || '[]');
      console.log('📦 Applied scholarships from localStorage:', localApplied);
      setAppliedScholarships(localApplied);
    }
  } catch (error) {
    console.log('❌ Error fetching applied scholarships:', error);
    if (user && user.type === 'student') {
      const appliedKey = `appliedScholarships_${user.regno}`;
      const localApplied = JSON.parse(localStorage.getItem(appliedKey) || '[]');
      setAppliedScholarships(localApplied);
    } else {
      setAppliedScholarships([]);
    }
  }
};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse text-center py-12">Loading scholarships...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Scholarships</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore scholarship opportunities and apply for financial support for your education
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {scholarships.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="text-gray-400 text-6xl mb-4">🎓</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No scholarships available</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              There are currently no active scholarship programs. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((scholarship) => {
              const daysRemaining = getDaysRemaining(scholarship.deadline);
              const isUrgent = daysRemaining <= 7;
              const isExpired = daysRemaining < 0;
              const hasApplied = appliedScholarships.includes(scholarship.id);
              const canApply = !isExpired && scholarship.status === 'active' && !hasApplied;

              return (
                <div
                  key={scholarship.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  <div className="mb-4">
                    {isExpired ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <Clock size={14} />
                        Expired
                      </span>
                    ) : isUrgent ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        <Clock size={14} />
                        {daysRemaining} days left
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <Calendar size={14} />
                        {daysRemaining} days left
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 flex-grow">
                    {scholarship.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {scholarship.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                    <Calendar size={16} />
                    <span>Deadline: {formatDate(scholarship.deadline)}</span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {/* View Details Button */}
                    <Link
                      href={`/student/scholarships/${scholarship.id}`}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Eye size={18} />
                      View Details
                    </Link>

                    {/* Apply Now Button - Only in cards */}
                    <Link
                      href={`/student/scholarships/${scholarship.id}/apply`}
                      className={`w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium ${
                        canApply
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
                      }`}
                    >
                      <ArrowRight size={18} />
                      {hasApplied ? 'Already Applied' : canApply ? 'Apply Now' : 'Application Closed'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}