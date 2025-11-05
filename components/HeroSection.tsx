"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GraduationCap, Award, BookOpen, Users, ArrowRightCircle } from "lucide-react";

// Reusable floating animation
const floatAnimation = {
  y: [0, -20, 0],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export default function HeroSection() {
  return (
    <section className="relative flex flex-col md:flex-row justify-between items-center min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-800 text-white px-8 md:px-20">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_70%)]"></div>

      {/* Floating icons in background */}
      <motion.div animate={floatAnimation} className="absolute top-20 left-16 text-yellow-300 opacity-70">
        <Award size={48} />
      </motion.div>
      <motion.div animate={floatAnimation} className="absolute bottom-24 right-32 text-pink-300 opacity-70">
        <GraduationCap size={54} />
      </motion.div>
      <motion.div animate={floatAnimation} className="absolute top-40 right-60 text-blue-200 opacity-70">
        <BookOpen size={45} />
      </motion.div>
      <motion.div animate={floatAnimation} className="absolute bottom-20 left-24 text-green-300 opacity-70">
        <Users size={50} />
      </motion.div>

      {/* LEFT SIDE — Text Content */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-xl text-left"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">
          Unlock Your Future with Scholarships
        </h1>
        <p className="text-lg text-blue-100 mb-8 leading-relaxed">
          Empowering COMSATS students to apply, compete, and achieve their dreams — through a transparent and automated scholarship platform.
        </p>

        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-pink-400 text-blue-900 font-semibold px-8 py-3 rounded-full shadow-lg hover:opacity-90 transition"
        >
          <ArrowRightCircle className="text-blue-800" size={22} />
          Explore Scholarships
        </motion.button>
      </motion.div>

      {/* RIGHT SIDE — Hero Image */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 mt-10 md:mt-0"
      >
        <Image
          src="/images/student-hero.png"
          alt="Scholarship Students"
          width={800}
          height={800}
          className="drop-shadow-2xl rounded-2xl"
        />
      </motion.div>

      {/* Decorative Animated Rings */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute w-[600px] h-[600px] border border-blue-300/40 rounded-full"
      ></motion.div>

      <motion.div
        animate={{
          scale: [1.1, 1.2, 1.1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute w-[850px] h-[850px] border border-indigo-400/30 rounded-full"
      ></motion.div>
    </section>
  );
}
