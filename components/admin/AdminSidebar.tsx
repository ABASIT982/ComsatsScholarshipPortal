'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Award,
  BarChart3,
  Bell,
  Settings,
  FileText,
  GraduationCap,
  Menu,
  X,
  LogOut,
  Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'


const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Students', href: '/admin/students', icon: Users },
  { name: 'Scholarships', href: '/admin/scholarships', icon: Award },
  { name: 'Merit Lists', href: '/admin/merit-lists', icon: BarChart3 },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Reports', href: '/admin/reports', icon: FileText },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleSignOut = () => {
    // Clear admin authentication
    localStorage.removeItem('adminToken')
    sessionStorage.removeItem('adminAuth')
    
    // Redirect to admin login page
    router.push('/admin/login')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-blue-700 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-colors"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Fixed Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-80 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col transform transition-transform duration-300 ease-in-out h-screen",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        
        {/* Logo Section */}
        <div className="flex items-center gap-4 px-6 py-6 border-b border-blue-700 shrink-0">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
            <img src="/images/comsats.jpg" 
             alt="COMSATS Logo"
            width={32}
            height={32}
            className="rounded object-contain"
             />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Scholarship Portal</h1>
            <p className="text-sm text-blue-200">Admin Console</p>
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
                  "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group hover:scale-[1.02]",
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

          {/* Settings */}
          <Link
            href="/admin/settings"
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02]",
              pathname === '/admin/settings'
                ? "bg-white/20 text-white border border-white/30"
                : "text-blue-100 hover:bg-white/10 hover:text-white"
            )}
            onClick={() => setIsMobileOpen(false)}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
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