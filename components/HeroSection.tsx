"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GraduationCap, Award, BookOpen, Users, ArrowRightCircle } from "lucide-react";
import { useEffect, useState } from "react";

// -----------------------------This is for Floating background icons animation--------------------------------
const floatAnimation = {
  y: [0, -20, 0],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

// ----------------------------This is for Images for slideshow--------------------------------------
const heroImages = [
  "/images/heroSection1.avif",
  "/images/heroSection3.avif",
  "/images/heroSection4.avif",
  "/images/heroSection2.webp",
];

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex flex-col lg:flex-row justify-start lg:justify-between items-center min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-800 text-white px-6 lg:px-20 pt-28 lg:pt-24 pb-12 lg:pb-0 gap-8 sm:gap-12 lg:gap-0">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_70%)]"></div>

      <motion.div animate={floatAnimation} className="absolute top-20 left-10 text-yellow-300 opacity-60">
        <Award size={40} />
      </motion.div>
      <motion.div animate={floatAnimation} className="absolute bottom-24 right-24 text-pink-300 opacity-60">
        <GraduationCap size={46} />
      </motion.div>
      <motion.div animate={floatAnimation} className="absolute top-40 right-44 text-blue-200 opacity-60">
        <BookOpen size={40} />
      </motion.div>
      <motion.div animate={floatAnimation} className="absolute bottom-20 left-16 text-green-300 opacity-60">
        <Users size={44} />
      </motion.div>

      {/* -------------------This is for FIXED LEFT SIDE (Text Content)------------------------ */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="
          relative z-10 max-w-xl text-left flex-1
          w-full
          mt-0 lg:mt-0
          mb-0 lg:mb-0
          px-1
        "
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300 leading-tight">
          Unlock Your Future with Scholarships
        </h1>

        <p className="text-base sm:text-lg text-blue-100 mb-8 leading-relaxed">
          Empowering COMSATS students to apply, compete, and achieve their dreams — through a transparent and automated scholarship platform.
        </p>

        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-pink-400 text-blue-900 font-semibold px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition"
        >
          <ArrowRightCircle className="text-blue-800" size={22} />
          Explore Scholarships
        </motion.button>
      </motion.div>

      {/* --------------------------This is for FIXED RIGHT SIDE (Image Carousel Container) --------------------------*/}
      <div
        className="
          relative 
          flex justify-center items-center 
          w-full lg:w-1/2 
          {/* ADJUSTED: Increased md: height for iPad Pro screens, maintains stacking */}
          h-[350px] sm:h-[500px] md:h-[550px] lg:h-auto 
          mt-0 lg:mt-0 
          order-last lg:order-none
        "
      >
        {heroImages.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 100 }}
            animate={{
              opacity: index === currentImage ? 1 : 0,
              x: index === currentImage ? 0 : -100,
            }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className={`absolute ${index === currentImage ? "z-10" : "z-0"}`}
          >
            <img
              src={img}
              alt={`Scholarship ${index + 1}`}
              width={600} 
              height={600}
              className="
                drop-shadow-2xl rounded-3xl object-cover max-w-full
                {/* ADJUSTED: Increased md: width for iPad Pro screens */}
                w-[320px] sm:w-[500px] md:w-[550px] lg:w-[600px]
                transition-all duration-700
              "
            />
          </motion.div>
        ))}
      </div>
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute w-[600px] h-[600px] border border-blue-300/40 rounded-full"
      />
      <motion.div
        animate={{ scale: [1.1, 1.2, 1.1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute w-[850px] h-[850px] border border-indigo-400/30 rounded-full"
      />
    </section>
  );
}
