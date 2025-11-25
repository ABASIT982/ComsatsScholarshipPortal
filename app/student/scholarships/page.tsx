export default function ScholarshipsPage() {
  // Mock data - replace with actual data from your API
  const scholarshipsData = {
    stats: {
      totalScholarships: 15,
      applied: 8,
      eligible: 12,
      awarded: 3
    },
    availableScholarships: [
      { 
        id: 1, 
        title: "Merit-Based Scholarship", 
        provider: "COMSATS University", 
        amount: "₹50,000", 
        deadline: "2024-03-15", 
        status: "open",
        eligibility: "CGPA ≥ 3.5",
        type: "Merit"
      },
      { 
        id: 2, 
        title: "Need-Based Financial Aid", 
        provider: "HEC Pakistan", 
        amount: "₹75,000", 
        deadline: "2024-03-20", 
        status: "open",
        eligibility: "Family Income < ₹50,000/month",
        type: "Need-Based"
      },
      { 
        id: 3, 
        title: "Sports Scholarship", 
        provider: "Sports Department", 
        amount: "₹30,000", 
        deadline: "2024-03-25", 
        status: "open",
        eligibility: "University Team Player",
        type: "Sports"
      },
      { 
        id: 4, 
        title: "Alumni Scholarship", 
        provider: "Alumni Association", 
        amount: "₹40,000", 
        deadline: "2024-02-28", 
        status: "closed",
        eligibility: "All Students",
        type: "Merit"
      }
    ],
    myApplications: [
      { 
        id: 1, 
        title: "Merit-Based Scholarship", 
        appliedDate: "2024-02-15", 
        status: "under_review", 
        amount: "₹50,000" 
      },
      { 
        id: 2, 
        title: "Need-Based Financial Aid", 
        appliedDate: "2024-02-10", 
        status: "approved", 
        amount: "₹75,000" 
      },
      { 
        id: 3, 
        title: "Sports Scholarship", 
        appliedDate: "2024-02-20", 
        status: "rejected", 
        amount: "₹30,000" 
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Open';
      case 'closed': return 'Closed';
      case 'under_review': return 'Under Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Merit': return 'bg-blue-100 text-blue-800';
      case 'Need-Based': return 'bg-orange-100 text-orange-800';
      case 'Sports': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeadlineColor = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 0) return 'text-red-600 bg-red-50';
    if (daysLeft <= 3) return 'text-red-600 bg-red-50';
    if (daysLeft <= 7) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-4 lg:p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Total Scholarships */}
        <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Scholarships</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">{scholarshipsData.stats.totalScholarships}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Applied */}
        <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Applied</p>
              <p className="text-2xl lg:text-3xl font-bold text-purple-600 mt-1">{scholarshipsData.stats.applied}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Eligible */}
        <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Eligible</p>
              <p className="text-2xl lg:text-3xl font-bold text-green-600 mt-1">{scholarshipsData.stats.eligible}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Awarded */}
        <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Awarded</p>
              <p className="text-2xl lg:text-3xl font-bold text-orange-600 mt-1">{scholarshipsData.stats.awarded}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Available Scholarships */}
        <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Available Scholarships</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {scholarshipsData.availableScholarships.map((scholarship) => (
              <div key={scholarship.id} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{scholarship.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{scholarship.provider}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(scholarship.type)}`}>
                    {scholarship.type}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-sm font-medium text-gray-900">{scholarship.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Eligibility</p>
                    <p className="text-sm font-medium text-gray-900">{scholarship.eligibility}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDeadlineColor(scholarship.deadline)}`}>
                    {getDaysLeft(scholarship.deadline) > 0 ? `${getDaysLeft(scholarship.deadline)} days left` : 'Expired'}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(scholarship.status)}`}>
                      {getStatusText(scholarship.status)}
                    </span>
                    {scholarship.status === 'open' && (
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors">
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Applications */}
        <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">My Applications</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {scholarshipsData.myApplications.map((application) => (
              <div key={application.id} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{application.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Applied: {new Date(application.appliedDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                    {getStatusText(application.status)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{application.amount}</p>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                    {application.status === 'under_review' && (
                      <button className="px-3 py-1 border border-red-300 text-red-700 text-xs font-medium rounded hover:bg-red-50 transition-colors">
                        Withdraw
                      </button>
                    )}
                  </div>
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
              <span className="text-sm font-medium text-gray-700">Browse Scholarships</span>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Eligibility Check</span>
            </div>
          </button>

          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-colors group">
            <div className="text-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-orange-200 transition-colors">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Deadlines</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}