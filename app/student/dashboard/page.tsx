'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';

interface StudentInfo {
  name: string;
  regno: string;
  level: string;
  cgpa: number;
  department: string;
  semester?: number;
}

interface Stats {
  applications: number;
  approved: number;
  pending: number;
  rejected: number;
}

interface Activity {
  id: number;
  action: string;
  description: string;
  time: string;
  status: string;
}

interface Deadline {
  id: number;
  title: string;
  deadline: string;
  daysLeft: number;
}

interface DashboardData {
  studentInfo: StudentInfo;
  stats: Stats;
  recentActivities: Activity[];
  upcomingDeadlines: Deadline[];
}

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.type === 'student') {
      fetchDashboardData();
    } else if (user && user.type !== 'student') {
      setLoading(false);
      setError('Access denied. Student only area.');
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      if (!user || user.type !== 'student') return;

      const studentRegno = user.regno;
      console.log('📊 Fetching dashboard for:', studentRegno);

      const response = await fetch(`/api/student/dashboard?student_regno=${studentRegno}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Filter out profile-related activities
          const filteredActivities = result.data.recentActivities.filter(
            (activity: Activity) => !activity.action.includes('Profile')
          );
          result.data.recentActivities = filteredActivities;
          setDashboardData(result.data);
        } else {
          setError(result.error || 'Failed to load dashboard');
        }
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed':
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeadlineColor = (daysLeft: number) => {
    if (daysLeft <= 3) return 'text-red-600 bg-red-50';
    if (daysLeft <= 7) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/30 p-6 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading your dashboard...</div>
      </div>
    );
  }

  if (!user || user.type !== 'student') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Student Login Required</h3>
          <p className="text-gray-600 mb-6">Please log in as a student to view your dashboard.</p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/30 p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50/30 p-6">
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-600">No dashboard data available</p>
        </div>
      </div>
    );
  }

  const { stats, recentActivities, upcomingDeadlines } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50/30 p-4 lg:p-6">
      {/* Stats Cards - Matching Quick Action Card Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Total Applications */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Applications</p>
                <p className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">{stats.applications}</p>
              </div>
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-xs text-gray-500">All time applications</span>
            </div>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Approved</p>
                <p className="text-3xl lg:text-4xl font-bold text-green-600 mt-2">{stats.approved}</p>
              </div>
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-xs text-gray-500">Successfully approved</span>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending</p>
                <p className="text-3xl lg:text-4xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
              </div>
              <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-xs text-gray-500">Awaiting review</span>
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Rejected</p>
                <p className="text-3xl lg:text-4xl font-bold text-red-600 mt-2">{stats.rejected}</p>
              </div>
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-xs text-gray-500">Not approved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Matching Card Style */}
      <div className="mb-6 lg:mb-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/student/scholarships" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all duration-200 group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">New Application</span>
            </Link>

            <Link href="/student/applications" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-green-50 hover:border-green-200 border-2 border-transparent transition-all duration-200 group">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-2 group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">My Applications</span>
            </Link>

            <Link href="/student/profile" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-purple-50 hover:border-purple-200 border-2 border-transparent transition-all duration-200 group">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-2 group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">Profile</span>
            </Link>

            <Link href="/student/documents" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-orange-50 hover:border-orange-200 border-2 border-transparent transition-all duration-200 group">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-2 group-hover:bg-orange-200 transition-colors">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">Documents</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <Link href="/student/applications" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    activity.status === 'approved' ? 'bg-green-500' : 
                    activity.status === 'pending' ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activities</p>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
            <Link href="/student/scholarships" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{deadline.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Due: {new Date(deadline.deadline).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDeadlineColor(deadline.daysLeft)}`}>
                    {deadline.daysLeft} days left
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming deadlines</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}