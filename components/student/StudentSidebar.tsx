'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  User,
  Award,
  FileText,
  FolderOpen,
  Settings,
  Menu,
  X,
  LogOut,
  Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const menuItems = [
  { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', href: '/student/profile', icon: User },
  { name: 'Scholarships', href: '/student/scholarships', icon: Award },
  { name: 'Applications', href: '/student/applications', icon: FileText },
  { name: 'Documents', href: '/student/documents', icon: FolderOpen },
  { name: 'Settings', href: '/student/settings', icon: Settings },
]

export function StudentSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

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
    <>
      {/* Mobile Menu Button - Positioned outside sidebar */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-blue-700 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-colors"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Fixed Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col transform transition-transform duration-300 ease-in-out h-screen",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        
        {/* Logo Section - Added padding to avoid menu button */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-blue-700 shrink-0 mt-16 lg:mt-0">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
            <Image 
              src="/images/comsats.jpg" 
              alt="COMSATS Logo"
              width={32}
              height={32}
              className="rounded object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm">Student Portal</h1>
            <p className="text-xs text-blue-200">COMSATS</p>
          </div>
        </div>

        {/* Navigation - Scrollable if needed */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group hover:scale-[1.02]",
                  isActive
                    ? "bg-white/20 text-white shadow-lg border border-white/30 backdrop-blur-sm"
                    : "text-blue-100 hover:bg-white/10 hover:text-white hover:shadow-md"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isActive ? "text-white" : "text-blue-300 group-hover:text-white"
                )} />
                <span className="font-semibold">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer Actions - Fixed at bottom */}
        <div className="p-4 border-t border-blue-700 space-y-2 shrink-0">
          {/* Back to Website */}
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200 group hover:scale-[1.02]"
            onClick={() => setIsMobileOpen(false)}
          >
            <Globe className="w-5 h-5 text-blue-300 group-hover:text-white" />
            <span>Back to Website</span>
          </Link>

          {/* Logout */}
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-100 hover:bg-red-500/20 hover:text-white rounded-xl transition-all duration-200 group hover:scale-[1.02]"
          >
            <LogOut className="w-5 h-5 text-red-300 group-hover:text-white" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}