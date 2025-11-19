"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Scholarships from "@/components/Scholarships";
import AboutUs from "@/components/AboutUs";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Scholarships />
      <AboutUs />
    </>
  );
}
