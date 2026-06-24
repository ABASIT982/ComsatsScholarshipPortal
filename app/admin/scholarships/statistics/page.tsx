'use client'

import { useState, useEffect } from 'react'
import { Award, Users, FileText, CheckCircle, Archive, XCircle, Clock, TrendingUp, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ScholarshipStatisticsPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/scholarships/statistics')
            const data = await response.json()
            setStats(data)
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/scholarships" className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Scholarship Statistics</h1>
                    <p className="text-gray-500 text-sm">Overview of all scholarship data</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-500" />
                        <p className="text-sm text-gray-500">Total Scholarships</p>
                    </div>
                    <p className="text-2xl font-bold mt-1">{stats?.total || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <p className="text-sm text-gray-500">Active</p>
                    </div>
                    <p className="text-2xl font-bold mt-1">{stats?.active || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <p className="text-sm text-gray-500">Expired</p>
                    </div>
                    <p className="text-2xl font-bold mt-1">{stats?.expired || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center gap-2">
                        <Archive className="w-5 h-5 text-gray-500" />
                        <p className="text-sm text-gray-500">Archived (Inactive)</p>
                    </div>
                    <p className="text-2xl font-bold mt-1">{stats?.archived || 0}</p>
                </div>
            </div>
            {/* Application Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-500" />
                        <p className="text-sm text-gray-500">Total Applications</p>
                    </div>
                    <p className="text-2xl font-bold mt-1">{stats?.totalApplications || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-orange-500" />
                        <p className="text-sm text-gray-500">Students Applied</p>
                    </div>
                    <p className="text-2xl font-bold mt-1">{stats?.uniqueStudents || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <p className="text-sm text-gray-500">Success Rate</p>
                    </div>
                    <p className="text-2xl font-bold mt-1">{stats?.successRate || 0}%</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-500" />
                        <p className="text-sm text-gray-500">Active Deadlines</p>
                    </div>
                    <p className="text-2xl font-bold mt-1">{stats?.activeDeadlines || 0}</p>
                </div>
            </div>

            {/* Scholarship Distribution Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h2 className="font-semibold text-gray-900">Scholarship Distribution</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scholarship</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Applications</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Approved</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Deadline</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stats?.scholarships?.map((sch: any, idx: number) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{sch.title}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${sch.status === 'active' ? 'bg-green-100 text-green-700' :
                                                sch.status === 'expired' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {sch.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-600">{sch.applications}</td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-600">{sch.approved}</td>
                                    <td className="px-6 py-4 text-center text-sm font-medium">
                                        {sch.applications > 0 ? Math.round((sch.approved / sch.applications) * 100) : 0}%
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-500">
                                        {sch.deadline ? new Date(sch.deadline).toLocaleDateString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}