'use client'
import { useState, useEffect } from 'react'
import { StudentTable } from '@/components/admin/students/StudentTable'
import { StudentFilters } from '@/components/admin/students/StudentFilters'

interface Student {
  id: string
  name: string
  regno: string
  department: string
  level: 'undergraduate' | 'graduate'
  session: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  cgpa?: number
  registrationDate: string
  avatar?: string
  email?: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [updating, setUpdating] = useState(false)

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/students')

      if (response.ok) {
        const data = await response.json()
        console.log('Fetched students:', data.students)
        setStudents(data.students || [])
        setFilteredStudents(data.students || [])
      } else {
        console.error('Failed to fetch students')
        setStudents([])
        setFilteredStudents([])
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      setStudents([])
      setFilteredStudents([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (newFilters: any) => {
    let filtered = students

    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase()
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchLower) ||
        student.regno.toLowerCase().includes(searchLower)
      )
    }

    if (newFilters.session !== 'all') {
      filtered = filtered.filter(student => student.session === newFilters.session)
    }

    if (newFilters.department !== 'all') {
      filtered = filtered.filter(student => student.department === newFilters.department)
    }

    if (newFilters.level !== 'all') {
      filtered = filtered.filter(student => student.level === newFilters.level)
    }

    setFilteredStudents(filtered)
  }

  const handleViewStudent = (student: Student) => {
    console.log('Viewing student email:', student.email) // Debug log
    setSelectedStudent(student)
    setShowViewModal(true)
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent({ ...student })
    setShowEditModal(true)
  }

  const handleUpdateStudent = async () => {
    if (!editingStudent) return

    setUpdating(true)
    try {
      const response = await fetch('/api/admin/students/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingStudent.id,
          name: editingStudent.name,
          email: editingStudent.email
        })
      })

      if (response.ok) {
        alert('Student updated successfully!')
        setShowEditModal(false)
        fetchStudents()
      } else {
        const error = await response.json()
        alert(`Failed to update: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating student:', error)
      alert('Failed to update student')
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const getInitials = (name: string) => {
    if (!name) return 'S'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
        <p className="text-gray-600 mt-2">Manage and view all registered students</p>
      </div>

      <StudentFilters onFiltersChange={applyFilters} loading={loading} />
      <StudentTable
        students={filteredStudents}
        loading={loading}
        onViewStudent={handleViewStudent}
        onEditStudent={handleEditStudent}
      />

      {/* VIEW STUDENT MODAL - Email fixed, Department & Session removed */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Student Profile</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Profile Photo */}
              <div className="flex justify-center mb-4">
                {selectedStudent.avatar ? (
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {getInitials(selectedStudent.name)}
                    </span>
                  </div>
                )}
              </div>

              {/* Student Details - No Department, No Session */}
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="text-base font-semibold text-gray-900">{selectedStudent.name}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Registration Number</p>
                  <p className="text-base font-mono text-gray-900">{selectedStudent.regno}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-base text-gray-900">{selectedStudent.email || 'Not provided'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Level</p>
                  <p className="text-base capitalize text-gray-900">{selectedStudent.level}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <p>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${selectedStudent.status === 'active' ? 'bg-green-100 text-green-800' :
                        selectedStudent.status === 'inactive' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                      }`}>
                      {selectedStudent.status}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Registration Date</p>
                  <p className="text-base text-gray-900">
                    {selectedStudent.registrationDate ? new Date(selectedStudent.registrationDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t flex justify-end gap-3">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    handleEditStudent(selectedStudent)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL - Only Name and Email */}
      {showEditModal && editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Edit Student</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                  <input
                    type="text"
                    value={editingStudent.regno}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    disabled
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingStudent.email || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="student@example.com"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStudent}
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}