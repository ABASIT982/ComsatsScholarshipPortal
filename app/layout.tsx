"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if user is on admin panel pages (and logged in)
  const isAdminPanel = pathname?.startsWith("/admin") && pathname !== "/admin/login";
  const isLoggedInAsAdmin = typeof window !== 'undefined' && localStorage.getItem("admin");

  return (
    <html lang="en">
      <body className="bg-blue-950 text-white">
        {/* Only show normal navbar if NOT on admin panel OR if on admin login page */}
        {(!isAdminPanel || pathname === "/admin/login") && <Navbar />}
        
        <main>{children}</main>
        
        {/* Only show footer if NOT on admin panel */}
        {!isAdminPanel && <Footer />}
      </body>
    </html>
  );
}