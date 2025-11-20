"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false); // Auto close menu when any link is clicked
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-gradient-to-r from-blue-900/80 via-indigo-900/70 to-purple-900/70 border-b border-blue-400/20 shadow-lg">
      <div className="w-full px-6 md:px-16 py-3 flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/comsats.jpg"
            alt="Comsats Logo"
            width={60}
            height={60}
            className="rounded-full shadow-md border-2 border-blue-400/60"
          />

          <div className="flex flex-col leading-tight text-white">
            <span className="text-4xl md:text-2xl font-bold tracking-wide">
              COMSATS
            </span>
            <span className=" md:text-1xl font-normal text-blue-200 tracking-wide">
              Scholarship Portal
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="relative text-blue-100 font-medium hover:text-cyan-300 transition"
            >
              Home
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-cyan-400 transition-all duration-300 hover:w-full"></span>
            </Link>

            <Link
              href="/#about"
              className="relative text-blue-100 font-medium hover:text-cyan-300 transition"
            >
              About
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-cyan-400 transition-all duration-300 hover:w-full"></span>
            </Link>

            <Link
              href="/contact"
              className="relative text-blue-100 font-medium hover:text-cyan-300 transition"
            >
              Contact
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-cyan-400 transition-all duration-300 hover:w-full"></span>
            </Link>
          </div>

          {/* Login Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:opacity-90 hover:shadow-lg transition"
            >
              Student Login
            </Link>

            <Link
              href="/admin/login"
              className="border-2 border-cyan-400 text-cyan-300 px-5 py-2 rounded-full hover:bg-cyan-400 hover:text-blue-900 transition shadow"
            >
              Admin Login
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-cyan-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* BACKGROUND OVERLAY when menu open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)} // Click outside closes menu
        ></div>
      )}

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 sm:w-1/2 bg-gradient-to-b from-blue-950/95 via-indigo-950/95 to-purple-950/95 backdrop-blur-xl shadow-2xl border-r border-cyan-400/20 transform transition-transform duration-500 ease-in-out z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
      >
        {/* Sidebar Header with Logo */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-cyan-400/20">
          <div className="flex items-center gap-3">
            <Image
              src="/images/comsats.jpg"
              alt="Comsats Logo"
              width={45}
              height={45}
              className="rounded-full border border-cyan-400/40 shadow-md"
            />
            <span className="text-cyan-300 font-semibold text-lg">
              COMSATS Scholarship Portal
            </span>
          </div>
          <button className="text-cyan-300" onClick={() => setIsOpen(false)}>
            <X size={26} />
          </button>
        </div>

        {/* Sidebar Links */}
        {/* Sidebar Links */}
        <div className="flex flex-col gap-5 px-6 py-6 text-left bg-gradient-to-b from-blue-950/90 via-indigo-950/90 to-purple-950/90 md:bg-transparent">

          <Link
            href="/"
            onClick={handleLinkClick}
            className="text-blue-100 hover:text-cyan-300 text-lg transition"
          >
            Home
          </Link>
          <Link
            href="/#about"
            onClick={handleLinkClick}
            className="text-blue-100 hover:text-cyan-300 text-lg transition"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={handleLinkClick}
            className="text-blue-100 hover:text-cyan-300 text-lg transition"
          >
            Contact
          </Link>

          <div className="flex flex-col gap-4 mt-4">
            <Link
              href="/login"
              onClick={handleLinkClick}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold px-6 py-2 rounded-full hover:opacity-90 transition"
            >
              Student Login
            </Link>
            <Link
              href="/admin/login"
              onClick={handleLinkClick}
              className="border-2 border-cyan-400 text-cyan-300 px-6 py-2 rounded-full hover:bg-cyan-400 hover:text-blue-900 transition"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
