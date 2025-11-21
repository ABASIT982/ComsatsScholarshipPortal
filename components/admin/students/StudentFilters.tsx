'use client'
import { Search, Filter, Download, RefreshCw } from 'lucide-react'
import { useState } from 'react'

interface StudentFiltersProps {
  onFiltersChange: (filters: any) => void
  loading?: boolean
}

export function StudentFilters({ onFiltersChange, loading = false }: StudentFiltersProps) {
  const [filters, setFilters] = useState({
    search: '',
    session: 'all',
    department: 'all',
    level: 'all'
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  // COMSATS Sessions
  const sessions = ['FA21', 'SP21', 'FA22', 'SP22', 'FA23', 'SP23', 'FA24', 'SP24', 'FA25', 'SP25', 'FA26', 'SP26'];
  
  // COMSATS Departments
  const departments = ['BCS', 'BSE', 'BBA', 'BEC', 'BDS', 'MCS', 'MSE', 'MBA', 'MEC', 'MDS'];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        
        {/* Search */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or registration number..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full lg:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Simplified Filters */}
        <div className="flex flex-wrap gap-3">
          
          {/* Session Filter */}
          <select
            value={filters.session}
            onChange={(e) => handleFilterChange('session', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Sessions</option>
            {sessions.map(session => (
              <option key={session} value={session}>{session}</option>
            ))}
          </select>

          {/* Department Filter */}
          <select
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Level Filter */}
          <select
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Levels</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
          </select>

          {/* Action Buttons */}
          <button 
            onClick={() => onFiltersChange(filters)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
            Apply
          </button>

          <button className="flex items-center gap-2 px-4 py-2 text-green-700 bg-green-100 rounded-lg hover:bg-green-200 text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  )
}