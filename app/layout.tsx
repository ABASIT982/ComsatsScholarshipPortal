"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from './contexts/AuthContext';

// ✅ APPROACH: Use Head component for metadata in Client Component
import Head from "next/head";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide navbar/footer for these routes
  const hideNavbarFooter = 
    pathname?.startsWith("/admin") || 
    pathname?.startsWith("/student");
  
  // Except show navbar on admin login page
  const showNavbar = pathname === "/admin/login";

  return (
    <html lang="en">
      <head>
        <title>Comsats Scholarship Portal</title>
        <meta name="description" content="University scholarship application and management portal for students and administrators" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-blue-950 text-white">
        {/* WRAP EVERYTHING WITH AuthProvider */}
        <AuthProvider>
          {/* Show navbar only if NOT on admin/student panels OR on admin login */}
          {(showNavbar || !hideNavbarFooter) && <Navbar />}
          
          <main>{children}</main>
          
          {/* Hide footer on admin/student panels */}
          {!hideNavbarFooter && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}