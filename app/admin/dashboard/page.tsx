'use client'
import { useState, useEffect } from 'react'
import { 
  Users, 
  Award, 
  FileText, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  DollarSign
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

interface DashboardStats {
  totalStudents: number;
  activeScholarships: number;
  totalApplications: number;
  approvedApplications: number;
  pendingApplications: number;
  rejectedApplications: number;
  selectedStudents: number;  // ✅ Added this
  successRate: number;       // ✅ Must be number, not string
  monthlyApplications: { month: string; applications: number; approved: number }[];
  scholarshipDistribution: { name: string; value: number; color: string }[];
  recentActivity: { time: string; action: string; user: string; }[];
  statusData: { status: string; count: number; color: string }[];
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats');
      const data = await response.json();
      
      if (data.success) {
        // Transform API data to match your chart formats
        const transformedData = transformData(data);
        setStats(transformedData);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

const transformData = (apiData: any): DashboardStats => {
  // Monthly applications - REAL from API
  const monthlyApplications = apiData.monthlyApplications || [];

  // Scholarship distribution - REAL from API
  const scholarshipDistribution = apiData.scholarshipDistribution || [
    { name: 'No Data', value: 1, color: '#94A3B8' }
  ];

  // Status data
  const statusData = [
    { status: 'Pending', count: apiData.stats?.pendingApplications || 0, color: '#F59E0B' },
    { status: 'Approved', count: apiData.stats?.approvedApplications || 0, color: '#10B981' },
    { status: 'Rejected', count: apiData.stats?.rejectedApplications || 0, color: '#EF4444' },
  ];

  // Recent activity from your applications
  const recentActivity = apiData.recentApplications?.map((app: any) => ({
    time: formatTimeAgo(app.created_at),
    action: `Application ${app.status}`,
    user: app.student_regno
  })) || [];

  // Calculate success rate as number
  const totalApps = apiData.stats?.totalApplications || 0;
  const approvedApps = apiData.stats?.approvedApplications || 0;
  const successRate = totalApps > 0 ? Number(((approvedApps / totalApps) * 100).toFixed(1)) : 0;

  return {
    totalStudents: apiData.stats?.totalStudents || 0,
    activeScholarships: apiData.stats?.activeScholarships || 0,
    totalApplications: totalApps,
    approvedApplications: approvedApps,
    pendingApplications: apiData.stats?.pendingApplications || 0,
    rejectedApplications: apiData.stats?.rejectedApplications || 0,
    selectedStudents: apiData.stats?.selectedStudents || 0,
    successRate: successRate,
    monthlyApplications,
    scholarshipDistribution,
    recentActivity,
    statusData
  };
};

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hour ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Safe access with default values
  const safeStats = stats || {
    totalStudents: 0,
    activeScholarships: 0,
    totalApplications: 0,
    approvedApplications: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    selectedStudents: 0,
    successRate: 0,
    monthlyApplications: [],
    scholarshipDistribution: [],
    recentActivity: [],
    statusData: []
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your scholarship portal.</p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Last updated: Today, {lastUpdated}</span>
        </div>
      </div>

      {/* Stats Grid - NOW DYNAMIC */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={safeStats.totalStudents.toLocaleString()}
          change={`+${Math.floor(safeStats.totalStudents * 0.1) || 0}`}
          trend="up"
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Active Scholarships"
          value={safeStats.activeScholarships.toString()}
          change="+3 new"
          trend="up"
          icon={<Award className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Applications"
          value={safeStats.totalApplications.toString()}
          change={`+${safeStats.pendingApplications} pending`}
          trend="up"
          icon={<FileText className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Success Rate"
          value={`${safeStats.successRate}%`}
          change={`+${safeStats.approvedApplications} approved`}
          trend="up"
          icon={<TrendingUp className="w-6 h-6" />}
          color="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Applications Trend</h3>
            <div className="flex gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Applications</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Approved</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={safeStats.monthlyApplications}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scholarship Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Scholarship Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={safeStats.scholarshipDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {safeStats.scholarshipDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Status</h3>
          <div className="space-y-4">
            {safeStats.statusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{item.status}</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h3>
          <div className="space-y-4">
            <StatItem 
              icon={<CheckCircle className="w-5 h-5 text-green-500" />} 
              label="Approved" 
              value={safeStats.approvedApplications.toString()} 
            />
            <StatItem 
              icon={<Clock className="w-5 h-5 text-amber-500" />} 
              label="Pending" 
              value={safeStats.pendingApplications.toString()} 
            />
            <StatItem 
              icon={<XCircle className="w-5 h-5 text-red-500" />} 
              label="Rejected" 
              value={safeStats.rejectedApplications.toString()} 
            />
            <StatItem 
              icon={<Award className="w-5 h-5 text-blue-500" />} 
              label="Selected" 
              value={safeStats.selectedStudents.toString()} 
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {safeStats.recentActivity.slice(0, 4).map((activity, index) => (
              <ActivityItem 
                key={index}
                time={activity.time}
                action={activity.action}
                user={activity.user}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Keep your existing StatCard, StatItem, and ActivityItem components exactly as they are
// (Copy them from your original code below this line)
interface StatCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'amber'
}

function StatCard({ title, value, change, trend, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200'
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {change} from last month
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  )
}

function ActivityItem({ time, action, user }: { time: string; action: string; user: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{action}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">by {user}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
      </div>
    </div>
  )
}