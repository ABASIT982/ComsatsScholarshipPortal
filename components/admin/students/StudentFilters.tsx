'use client'
import { Search, Download, Printer } from 'lucide-react'
import { useState, useEffect } from 'react'

interface StudentFiltersProps {
  students: any[]
  onFilteredStudents: (filtered: any[]) => void
  loading?: boolean
}

export function StudentFilters({ students, onFilteredStudents, loading = false }: StudentFiltersProps) {
  const [filters, setFilters] = useState({
    search: '',
    session: 'all',
    department: 'all',
    level: 'all',
    status: 'all'
  })

  // Auto-apply filters whenever filters or students change
  useEffect(() => {
    applyFilters()
  }, [filters, students])

  const applyFilters = () => {
    let filtered = [...students]

    // Search filter (name or regno)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchLower) ||
        student.regno.toLowerCase().includes(searchLower)
      )
    }

    // Session filter
    if (filters.session !== 'all') {
      filtered = filtered.filter(student => student.session === filters.session)
    }

    // Department filter
    if (filters.department !== 'all') {
      filtered = filtered.filter(student => student.department === filters.department)
    }

    // Level filter - match both cases
    if (filters.level !== 'all') {
      filtered = filtered.filter(student =>
        student.level?.toLowerCase() === filters.level.toLowerCase()
      )
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(student => student.status === filters.status)
    }

    onFilteredStudents(filtered)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Extract unique sessions from students
  const getUniqueSessions = () => {
    const sessions = students.map(s => s.session).filter(s => s && s !== 'Unknown')
    return [...new Set(sessions)].sort().reverse()
  }

  // Extract unique departments from students
  const getUniqueDepartments = () => {
    const depts = students.map(s => s.department).filter(d => d && d !== 'Not assigned')
    return [...new Set(depts)].sort()
  }

  // Export to CSV
  const exportToCSV = () => {
    let filtered = [...students]

    // Apply current filters to export
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchLower) ||
        student.regno.toLowerCase().includes(searchLower)
      )
    }
    if (filters.session !== 'all') {
      filtered = filtered.filter(student => student.session === filters.session)
    }
    if (filters.department !== 'all') {
      filtered = filtered.filter(student => student.department === filters.department)
    }
    if (filters.level !== 'all') {
      filtered = filtered.filter(student => student.level?.toLowerCase() === filters.level.toLowerCase())
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(student => student.status === filters.status)
    }

    let headers = ['Name', 'Reg No', 'Email', 'Level', 'Session', 'Department', 'Status']
    let rows = filtered.map(s => [
      s.name,
      s.regno,
      s.email || '',
      s.level,
      s.session || '',
      s.department || '',
      s.status
    ])

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `students_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Print students list - Professional format
  const printStudents = () => {
    let filtered = [...students]

    // Apply current filters to print
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchLower) ||
        student.regno.toLowerCase().includes(searchLower)
      )
    }
    if (filters.session !== 'all') {
      filtered = filtered.filter(student => student.session === filters.session)
    }
    if (filters.department !== 'all') {
      filtered = filtered.filter(student => student.department === filters.department)
    }
    if (filters.level !== 'all') {
      filtered = filtered.filter(student => student.level?.toLowerCase() === filters.level.toLowerCase())
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(student => student.status === filters.status)
    }

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow pop-ups to print')
      return
    }

    const logoUrl = `${window.location.protocol}//${window.location.host}/images/comsats.jpg`
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const styles = `
      <style>
        @media print {
          body { margin: 0; padding: 0; }
          @page { size: A4; margin: 1.5cm; }
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Times New Roman', Times, serif;
          background: white;
          padding: 20px;
        }
        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #1a5276;
          padding-bottom: 20px;
        }
        .logo-title-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 5px;
        }
        .logo {
          max-width: 70px;
          max-height: 70px;
        }
        .university-name {
          font-size: 22px;
          font-weight: bold;
          color: #1a5276;
        }
        .campus-name {
          font-size: 14px;
          color: #2c3e50;
          text-align: center;
        }
        .document-title {
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          margin: 25px 0 10px 0;
          text-transform: uppercase;
          color: #1a5276;
        }
        .report-info {
          text-align: center;
          margin: 20px 0;
          padding: 10px;
          background: #f8f9fa;
        }
        .info-title {
          font-size: 16px;
          font-weight: bold;
        }
        .meta-info {
          font-size: 12px;
          color: #7f8c8d;
          margin-top: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th {
          background: #1a5276;
          color: white;
          padding: 12px 8px;
          text-align: center;
          font-size: 12px;
          font-weight: bold;
        }
        td {
          padding: 8px;
          text-align: center;
          border-bottom: 1px solid #ddd;
          font-size: 11px;
        }
        .footer-stats {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
          padding-top: 10px;
          border-top: 1px solid #ddd;
          font-size: 11px;
        }
        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
        }
        .signature-box {
          text-align: center;
          width: 250px;
        }
        .signature-line {
          border-top: 1px solid black;
          margin-top: 40px;
          padding-top: 5px;
        }
        .disclaimer {
          text-align: center;
          font-size: 10px;
          color: gray;
          margin-top: 20px;
        }
        .status-active {
          color: #27ae60;
          font-weight: bold;
        }
        .status-inactive {
          color: #e74c3c;
          font-weight: bold;
        }
      </style>
    `

    let tableRows = ''
    filtered.forEach(s => {
      const statusClass = s.status === 'active' ? 'status-active' : 'status-inactive'
      tableRows += `
        <tr>
          <td>${s.name}</td>
          <td>${s.regno}</td>
          <td>${s.email || '-'}</td>
<td>${s.level === 'undergraduate' ? 'Undergraduate' : (s.level === 'graduate' ? 'Graduate' : s.level || 'N/A')}</td>         
 <td>${s.session || '-'}</td>
          <td>${s.department || '-'}</td>
          <td class="${statusClass}">${s.status === 'active' ? 'Active' : 'Inactive'}</td>
        </tr>
      `
    })

    const filterInfo = []
    if (filters.session !== 'all') filterInfo.push(`Session: ${filters.session}`)
    if (filters.department !== 'all') filterInfo.push(`Department: ${filters.department}`)
    if (filters.level !== 'all') filterInfo.push(`Level: ${filters.level === 'undergraduate' ? 'Undergraduate' : 'Graduate'}`)
    if (filters.status !== 'all') filterInfo.push(`Status: ${filters.status}`)

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Students List - ${new Date().toLocaleDateString()}</title>
          ${styles}
        </head>
        <body>
          <div class="header">
            <div class="logo-title-row">
              <img src="${logoUrl}" alt="COMSATS Logo" class="logo" onerror="this.style.display='none'">
              <div class="university-name">COMSATS UNIVERSITY ISLAMABAD</div>
            </div>
            <div class="campus-name">ABBOTTABAD CAMPUS</div>
          </div>

          <div class="document-title">STUDENTS LIST</div>
          
          <div class="report-info">
            <div class="info-title">Student Records</div>
            <div class="meta-info">Generated: ${currentDate}</div>
            ${filterInfo.length > 0 ? `<div class="meta-info">Filters: ${filterInfo.join(' | ')}</div>` : ''}
          </div>

          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Registration No</th>
                <th>Email</th>
                <th>Level</th>
                <th>Session</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div class="footer-stats">
            <span><strong>Total Students:</strong> ${filtered.length}</span>
            <span><strong>Generated On:</strong> ${currentDate}</span>
          </div>

          <div class="signatures">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>Registrar</div>
              <div style="font-size: 11px;">COMSATS University Islamabad</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>Director</div>
              <div style="font-size: 11px;">Abbottabad Campus</div>
            </div>
          </div>

          <div class="disclaimer">
            * This is a system generated document. No signature is required. *
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.print()
  }

  const uniqueSessions = getUniqueSessions()
  const uniqueDepartments = getUniqueDepartments()

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">

        {/* Search */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or reg-no..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full lg:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">

          {/* Session Filter */}
          <select
            value={filters.session}
            onChange={(e) => handleFilterChange('session', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Sessions</option>
            {uniqueSessions.map(session => (
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
            {uniqueDepartments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Level Filter - Fixed */}
          <select
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Levels</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Export & Print Buttons */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 text-green-700 bg-green-100 rounded-lg hover:bg-green-200 text-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={printStudents}
            className="flex items-center gap-2 px-4 py-2 text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 text-sm"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>
    </div>
  )
}