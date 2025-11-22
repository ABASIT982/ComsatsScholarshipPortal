import { StudentSidebar } from '@/components/student/StudentSidebar'
import { StudentHeader } from '@/components/student/StudentHeader'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <StudentHeader />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}