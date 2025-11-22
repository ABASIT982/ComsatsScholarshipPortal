'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  User,
  Award,
  FileText,
  FolderOpen,
  Settings
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

  return (
    <div className="fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white">
      {/* Logo with COMSATS Image */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-blue-700">
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

      {/* Navigation */}
      <nav className="px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all",
                isActive
                  ? "bg-white/20 text-white border border-white/30"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}