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
  Shield,
  HelpCircle,
  Menu,
  X,
  Bell,
  LogOut,
  BarChart3,
  Sparkles,
  Globe,
  AlertCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Calculator } from 'lucide-react'

// Type guard
function hasSubmenu(item: any): item is { 
  name: string; 
  icon: any; 
  submenu: any[] 
} {
  return item.submenu && Array.isArray(item.submenu)
}

const menuItems = [
  { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', href: '/student/profile', icon: User },
  { name: 'Scholarships', href: '/student/scholarships', icon: Award },
  { name: 'Recommended', href: '/student/recommended', icon: Sparkles },
  { name: 'Applications', href: '/student/applications', icon: FileText },
  { name: 'Check Eligibility', href: '/student/eligibility', icon: Calculator },
  { name: 'Merit List', href: '/student/merit-list', icon: BarChart3 },
  { name: 'Notifications', href: '/student/notifications', icon: Bell },
  { name: 'Disputes', href: '/student/disputes', icon: AlertCircle },
  { 
    name: 'Help Center', 
    icon: HelpCircle,
    submenu: [
      { name: 'FAQs', href: '/student/help/faqs', icon: HelpCircle },
      { name: 'Guidelines', href: '/student/help/guidelines', icon: FileText },
      { name: 'Policies', href: '/student/help/policies', icon: Shield },
    ]
  },
  { name: 'Settings', href: '/student/settings', icon: Settings },
]

export function StudentSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleSignOut = () => {
    localStorage.removeItem('studentToken')
    localStorage.removeItem('studentName')
    localStorage.removeItem('studentLevel')
    localStorage.removeItem('studentRegno')
    localStorage.removeItem('isAuthenticated')
    router.push('/login')
  }

  const toggleDropdown = (menuName: string) => {
    setOpenDropdown(openDropdown === menuName ? null : menuName)
  }

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-blue-700 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-colors"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col transform transition-transform duration-300 ease-in-out h-screen",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>

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

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon

            if (hasSubmenu(item)) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group hover:scale-[1.02]",
                      openDropdown === item.name
                        ? "bg-white/20 text-white shadow-lg border border-white/30 backdrop-blur-sm"
                        : "text-blue-100 hover:bg-white/10 hover:text-white hover:shadow-md"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn(
                        "w-5 h-5 transition-transform duration-200",
                        openDropdown === item.name ? "text-white" : "text-blue-300 group-hover:text-white"
                      )} />
                      <span className="font-semibold">{item.name}</span>
                    </div>
                    {openDropdown === item.name ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {openDropdown === item.name && (
                    <div className="ml-6 mt-1 space-y-0.5">
                      {item.submenu.map((subItem: any) => {
                        const SubIcon = subItem.icon
                        const isSubActive = pathname === subItem.href

                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href || '#'}
                            onClick={() => setIsMobileOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02]",
                              isSubActive
                                ? "bg-blue-600/80 text-white shadow-inner border border-blue-500"
                                : "text-blue-100 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            <SubIcon className={cn(
                              "w-4 h-4",
                              isSubActive ? "text-white" : "text-blue-300"
                            )} />
                            <span className="font-medium">{subItem.name}</span>
                            {isSubActive && (
                              <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href || '#'}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group hover:scale-[1.02]",
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

        <div className="p-4 border-t border-blue-700 space-y-2 shrink-0">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-100 hover:bg-red-500/20 hover:text-white rounded-xl transition-all duration-200 group hover:scale-[1.02]"
          >
            <LogOut className="w-5 h-5 text-red-300 group-hover:text-white" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}