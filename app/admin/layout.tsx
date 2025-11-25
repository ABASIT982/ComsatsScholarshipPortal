"use client";
import { usePathname } from "next/navigation";
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50/30">
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-0 h-screen z-40">
          <AdminSidebar />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:ml-80">
          {/* Fixed Header */}
          <div className="fixed top-0 right-0 left-0 lg:left-80 z-30">
            <AdminHeader />
          </div>
          
          {/* Scrollable Content */}
          <main className="flex-1 overflow-auto mt-20 lg:mt-24 p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}