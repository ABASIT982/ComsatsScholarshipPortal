"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />

      {/* About Section */}
      <section id="about" className="py-20 bg-white text-center px-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">About</h2>
        <p className="max-w-3xl mx-auto text-gray-600">
          This system automates scholarship management — from application to merit list generation — ensuring fair and transparent distribution based on academic performance.
        </p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-blue-50 text-center px-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Contact Us</h2>
        <p className="text-gray-600">For technical support, reach us at:</p>
        <p className="font-semibold text-blue-700">support@comsats.edu.pk</p>
      </section>
    </>
  );
}
