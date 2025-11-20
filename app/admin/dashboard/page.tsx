'use client'
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
  LineChart, 
  Line, 
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

// Mock data for charts
const applicationData = [
  { month: 'Jan', applications: 45, approved: 35 },
  { month: 'Feb', applications: 52, approved: 42 },
  { month: 'Mar', applications: 48, approved: 38 },
  { month: 'Apr', applications: 65, approved: 52 },
  { month: 'May', applications: 58, approved: 46 },
  { month: 'Jun', applications: 72, approved: 58 },
]

const scholarshipDistribution = [
  { name: 'Merit-Based', value: 45, color: '#3B82F6' },
  { name: 'Need-Based', value: 30, color: '#10B981' },
  { name: 'Sports', value: 15, color: '#F59E0B' },
  { name: 'Research', value: 10, color: '#EF4444' },
]

const statusData = [
  { status: 'Pending', count: 23, color: '#F59E0B' },
  { status: 'Approved', count: 156, color: '#10B981' },
  { status: 'Rejected', count: 12, color: '#EF4444' },
  { status: 'Under Review', count: 34, color: '#3B82F6' },
]

export default function AdminDashboard() {
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
          <span>Last updated: Today, 2:30 PM</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value="1,847"
          change="+12.5%"
          trend="up"
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Active Scholarships"
          value="28"
          change="+3 new"
          trend="up"
          icon={<Award className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Applications"
          value="225"
          change="+18.2%"
          trend="up"
          icon={<FileText className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Success Rate"
          value="78.5%"
          change="+2.1%"
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
              <BarChart data={applicationData}>
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
                  data={scholarshipDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {scholarshipDistribution.map((entry, index) => (
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
            {statusData.map((item, index) => (
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
            <StatItem icon={<CheckCircle className="w-5 h-5 text-green-500" />} label="Approved This Month" value="42" />
            <StatItem icon={<Clock className="w-5 h-5 text-amber-500" />} label="Pending Review" value="23" />
            <StatItem icon={<XCircle className="w-5 h-5 text-red-500" />} label="Rejected" value="5" />
            <StatItem icon={<DollarSign className="w-5 h-5 text-blue-500" />} label="Total Allocation" value="₹2.8M" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <ActivityItem time="2 min ago" action="New application submitted" user="John Doe" />
            <ActivityItem time="15 min ago" action="Scholarship approved" user="Sarah Wilson" />
            <ActivityItem time="1 hour ago" action="Document verified" user="Mike Johnson" />
            <ActivityItem time="2 hours ago" action="New scholarship added" user="Admin" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
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

// Stat Item Component
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

// Activity Item Component
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