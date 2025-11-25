export default function StudentDashboard() {
  // Mock data - replace with actual data from your API
  const dashboardData = {
    studentInfo: {
      name: "Abdul Basit",
      regno: "FA22-BCS-001",
      level: "Undergraduate",
      cgpa: 3.75,
      department: "Computer Science"
    },
    stats: {
      applications: 12,
      approved: 8,
      pending: 3,
      rejected: 1
    },
    recentActivities: [
      { id: 1, action: "Scholarship Application", description: "Merit-based scholarship submitted", time: "2 hours ago", status: "pending" },
      { id: 2, action: "Document Upload", description: "Transcript uploaded successfully", time: "1 day ago", status: "completed" },
      { id: 3, action: "Profile Update", description: "Personal information updated", time: "2 days ago", status: "completed" }
    ],
    upcomingDeadlines: [
      { id: 1, title: "Need-Based Scholarship", deadline: "2024-03-15", daysLeft: 5 },
      { id: 2, title: "Sports Scholarship", deadline: "2024-03-20", daysLeft: 10 },
      { id: 3, title: "Semester Fee Submission", deadline: "2024-03-25", daysLeft: 15 }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeadlineColor = (daysLeft: number) => {
    if (daysLeft <= 3) return 'text-red-600 bg-red-50';
    if (daysLeft <= 7) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-4 lg:p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Total Applications */}
        <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">{dashboardData.stats.applications}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl lg:text-3xl font-bold text-green-600 mt-1">{dashboardData.stats.approved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl lg:text-3xl font-bold text-yellow-600 mt-1">{dashboardData.stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* CGPA */}
        <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current CGPA</p>
              <p className="text-2xl lg:text-3xl font-bold text-purple-600 mt-1">{dashboardData.studentInfo.cgpa}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Activities */}
        <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Recent Activities</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {dashboardData.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-2 mt-2 rounded-full ${activity.status === 'completed' ? 'bg-green-500' : activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Upcoming Deadlines</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {dashboardData.upcomingDeadlines.map((deadline) => (
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
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 lg:mt-8 bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors group">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200 transition-colors">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">New Application</span>
            </div>
          </button>

          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors group">
            <div className="text-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-green-200 transition-colors">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">My Applications</span>
            </div>
          </button>

          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-colors group">
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-200 transition-colors">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Profile</span>
            </div>
          </button>

          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-colors group">
            <div className="text-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-orange-200 transition-colors">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Documents</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}