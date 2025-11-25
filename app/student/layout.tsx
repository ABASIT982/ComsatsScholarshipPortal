import { StudentSidebar } from '@/components/student/StudentSidebar'
import { StudentHeader } from '@/components/student/StudentHeader'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50/30">
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-0 h-screen z-40">
          <StudentSidebar />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Fixed Header */}
          <div className="fixed top-0 right-0 left-0 lg:left-64 z-30">
            <StudentHeader />
          </div>
          
          {/* Scrollable Content */}
          <main className="flex-1 overflow-auto mt-16 lg:mt-20 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}