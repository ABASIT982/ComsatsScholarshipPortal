"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

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
      <body className="bg-blue-950 text-white">
        {/* Show navbar only if NOT on admin/student panels OR on admin login */}
        {(showNavbar || !hideNavbarFooter) && <Navbar />}
        
        <main>{children}</main>
        
        {/* Hide footer on admin/student panels */}
        {!hideNavbarFooter && <Footer />}
      </body>
    </html>
  );
}