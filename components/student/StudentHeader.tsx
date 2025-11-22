'use client'
import { Bell, User, Settings, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function StudentHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [studentName, setStudentName] = useState('Student')
  const router = useRouter()

  // Get student name from localStorage
  useEffect(() => {
    const name = localStorage.getItem('studentName') || 'Student'
    console.log('👤 Student name from localStorage:', name)
    setStudentName(name)
  }, [])

  const handleSignOut = () => {
    // Clear all student data
    localStorage.removeItem('studentToken')
    localStorage.removeItem('studentName')
    localStorage.removeItem('studentLevel')
    localStorage.removeItem('studentRegno')
    localStorage.removeItem('isAuthenticated')
    router.push('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
  {/* Welcome Message - Royal Blue (Recommended) */}
<div>
  <h1 className="text-2xl font-light text-gray-800">
    Hello, <span className="font-semibold text-blue-700">{studentName}</span>
  </h1>
</div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-900">{studentName}</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-200"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}