'use client'
import { Bell, User, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../app/contexts/AuthContext'

export function AdminHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()
  const { logout } = useAuth()

  const handleSignOut = () => {
    logout();
    router.push('/admin/login')
  }

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-6 py-4">
      <div className="flex items-center justify-end">
        
        {/* Right Section */}
        <div className="flex items-center gap-4">
          
          {/* Notifications */}
          <button className="relative p-3 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-100">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* User Profile with Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-800 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-900">Administrator</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 backdrop-blur-sm">
                <div className="px-4 py-3 border-b border-gray-100 bg-blue-50/50 rounded-t-xl">
                  <p className="text-sm font-semibold text-gray-900">Administrator</p>
                  <p className="text-xs text-gray-500 mt-1">admin@scholarship.edu</p>
                </div>
                
                <div className="py-1">
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200">
                    <Settings className="w-4 h-4" />
                    Account Settings
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