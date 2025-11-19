"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { EnvelopeIcon, PhoneArrowUpRightIcon } from "@heroicons/react/24/outline";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your feedback! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section
      id="contact"
      className="min-h-screen bg-gradient-to-b from-indigo-950 via-blue-950 to-indigo-950 text-white px-6 py-32" // increased top padding
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.h1
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-cyan-300 mb-4 text-left"
        >
          Contact Us
        </motion.h1>

        <motion.p
          initial={false}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-blue-200 text-base md:text-lg mb-16 max-w-3xl text-left"
        >
          Have questions or feedback? We're here to help. Reach out via email, phone, or social media —
          or send your feedback directly through the form below.
        </motion.p>

        {/* Contact Info */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-lg flex flex-col items-center">
            <EnvelopeIcon className="w-10 h-10 text-cyan-300 mb-4" />
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">Email</h3>
            <p className="text-blue-200">scholarship@comsats.edu.pk</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-lg flex flex-col items-center">
            <PhoneArrowUpRightIcon className="w-10 h-10 text-cyan-300 mb-4" />
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">Phone</h3>
            <p className="text-blue-200">+92 51 111 001 007</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-lg flex flex-col items-center">
            <h3 className="text-xl font-semibold text-cyan-300 mb-4">Social Media</h3>
            <div className="flex gap-4 text-cyan-300 text-2xl">
              <a href="https://facebook.com/comsats" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
              <a href="https://twitter.com/comsats" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://instagram.com/comsats" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://linkedin.com/school/comsats" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
            </div>
          </div>
        </motion.div>

        {/* Feedback Form */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-xl max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-semibold text-cyan-300 mb-6 text-left">Send Us Your Feedback</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 rounded-xl bg-white/10 border border-cyan-400/30 text-white focus:outline-none focus:border-cyan-300"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 rounded-xl bg-white/10 border border-cyan-400/30 text-white focus:outline-none focus:border-cyan-300"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="p-3 rounded-xl bg-white/10 border border-cyan-400/30 text-white focus:outline-none focus:border-cyan-300 resize-none h-32"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-blue-950 font-semibold py-3 rounded-full mt-2 hover:opacity-90 transition"
            >
              Submit Feedback
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
