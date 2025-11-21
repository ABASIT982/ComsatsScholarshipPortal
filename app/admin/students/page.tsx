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
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/students')
      
      if (response.ok) {
        const data = await response.json()
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

  // Apply filters - FIXED ERROR
  const applyFilters = (newFilters: any) => {
    let filtered = students

    // Search filter - FIXED: Only search by name and regno
    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase()
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchLower) ||
        student.regno.toLowerCase().includes(searchLower)
      )
    }

    // Session filter
    if (newFilters.session !== 'all') {
      filtered = filtered.filter(student => student.session === newFilters.session)
    }

    // Department filter
    if (newFilters.department !== 'all') {
      filtered = filtered.filter(student => student.department === newFilters.department)
    }

    // Level filter
    if (newFilters.level !== 'all') {
      filtered = filtered.filter(student => student.level === newFilters.level)
    }

    setFilteredStudents(filtered)
  }

  const handleViewStudent = (student: Student) => {
    // TODO: Implement view student modal
    console.log('View student:', student)
  }

  const handleEditStudent = (student: Student) => {
    // TODO: Implement edit student
    console.log('Edit student:', student)
  }

  useEffect(() => {
    fetchStudents()
  }, [])

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
    </div>
  )
}