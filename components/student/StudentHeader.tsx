'use client'
import { Bell, User, Settings, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../app/contexts/AuthContext'

export function StudentHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [studentName, setStudentName] = useState('Student')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [currentRegno, setCurrentRegno] = useState('') // Track current user
  const router = useRouter()
  const { logout } = useAuth()

  // In StudentHeader component
  useEffect(() => {
    const name = localStorage.getItem('studentName') || 'Student'
    const regno = localStorage.getItem('studentRegno') || ''
    const avatar = localStorage.getItem('studentAvatar') || null

    console.log('👤 Student data from localStorage:', { name, regno, avatar })

    setStudentName(name)
    setCurrentRegno(regno)

    // Only set avatar if we have both regno and avatar
    if (regno && avatar) {
      setAvatarUrl(avatar)
    } else {
      setAvatarUrl(null)
    }
  }, [])

  const handleSignOut = () => {
    // Clear all user data from localStorage on sign out
    localStorage.removeItem('studentAvatar')
    logout()
    router.push('/login')
  }

  // Get initials from student name for fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-4 lg:px-6 py-3 lg:py-4">
      <div className="flex items-center justify-between">
        {/* Welcome Message - Fixed for mobile */}
        <div className="ml-16 lg:ml-0 flex-1 min-w-0">
          <h1 className="text-base lg:text-2xl font-light text-gray-800 truncate">
            Hello, <span className="font-semibold text-blue-700">{studentName}</span>
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
          {/* Notifications */}
          <button className="relative p-2 lg:p-3 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-100">
            <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="absolute top-1 right-1 lg:top-2 lg:right-2 w-2 h-2 lg:w-2.5 lg:h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* User Profile with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 lg:gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
            >
              {/* Profile Picture - Shows avatar if exists, otherwise shows initials */}
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                {avatarUrl && currentRegno ? (
                  <img
                    src={avatarUrl}
                    alt={studentName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, fallback to initials
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <span className="text-white font-semibold text-sm lg:text-base">
                    {getInitials(studentName)}
                  </span>
                )}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-900">{studentName}</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 lg:w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 backdrop-blur-sm">
                <div className="px-4 py-3 border-b border-gray-100 bg-blue-50/50 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                      {avatarUrl && currentRegno ? (
                        <img
                          src={avatarUrl}
                          alt={studentName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold text-sm">
                          {getInitials(studentName)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{studentName}</p>
                      <p className="text-xs text-gray-500 mt-1">Student</p>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => router.push('/student/profile')}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-b-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}