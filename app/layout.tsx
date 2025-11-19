// app/layout.tsx
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "COMSATS Scholarship Portal",
  description: "Empowering students with scholarships",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-blue-950 text-white">
        <Navbar /> {/* Navbar now shows on all pages */}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
