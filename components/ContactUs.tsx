"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  EnvelopeIcon, 
  PhoneArrowUpRightIcon, 
  MapPinIcon, 
  ClockIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  // COMSATS Islamabad Coordinates
  const comsatsLat = 33.6424;
  const comsatsLng = 73.0639;

  return (
    <section className="min-h-screen bg-gradient-to-b from-indigo-950 via-blue-950 to-indigo-950 text-white px-6 py-32">
      <div className="max-w-6xl mx-auto">
        {/* Header - LEFT ALIGNED */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-4 text-left">Contact Us</h1>
          <p className="text-blue-200 text-lg max-w-2xl text-left">
            Have questions about scholarships? We're here to help. Reach out through any channel below.
          </p>
        </motion.div>

        {/* Contact Info Cards - LEFT ALIGNED text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 text-left">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
              <EnvelopeIcon className="w-6 h-6 text-cyan-300" />
            </div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">Email Us</h3>
            <p className="text-blue-200 text-sm">scholarship@comsats.edu.pk</p>
            <p className="text-blue-200 text-sm">admissions@comsats.edu.pk</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 text-left">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
              <PhoneArrowUpRightIcon className="w-6 h-6 text-cyan-300" />
            </div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">Call Us</h3>
            <p className="text-blue-200 text-sm">+92 51 111 001 007</p>
            <p className="text-blue-200 text-sm">+92 51 9049 0000</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 text-left">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
              <MapPinIcon className="w-6 h-6 text-cyan-300" />
            </div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">Visit Us</h3>
            <p className="text-blue-200 text-sm">Park Road, Chak Shahzad</p>
            <p className="text-blue-200 text-sm">Islamabad, Pakistan</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 text-left">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
              <ClockIcon className="w-6 h-6 text-cyan-300" />
            </div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">Office Hours</h3>
            <p className="text-blue-200 text-sm">Mon-Fri: 9:00 AM - 5:00 PM</p>
            <p className="text-blue-200 text-sm">Saturday: 9:00 AM - 1:00 PM</p>
          </div>
        </motion.div>

        {/* Map and Form Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Google Map - WORKING MAP */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg"
          >
            <h3 className="text-xl font-semibold text-cyan-300 mb-4 text-left">Find Us Here</h3>
            <div className="rounded-xl overflow-hidden h-80">
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3302.180387728227!2d73.2667634756097!3d34.141726813000275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38de339a14965f11%3A0xb73cb26ac1297edc!2sCOMSATS%20University%20Abbottabad%20Campus!5e0!3m2!1sen!2s!4v1781173170054!5m2!1sen!2s"
  width="100%"
  height="100%"
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  className="w-full h-full border-0"
/>
            </div>
            <div className="mt-4 text-left">
              <a 
                href={`https://www.google.com/maps?q=${comsatsLat},${comsatsLng}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-200 text-sm inline-flex items-center gap-1"
              >
                <GlobeAltIcon className="w-4 h-4" />
                Open in Google Maps
              </a>
            </div>
          </motion.div>

          {/* Contact Form - LEFT ALIGNED */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-xl font-semibold text-cyan-300 mb-4 text-left">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleChange}
                className="p-3 rounded-xl bg-white/10 border border-cyan-400/30 text-white focus:outline-none focus:border-cyan-300 placeholder:text-blue-300"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email Address"
                value={formData.email}
                onChange={handleChange}
                className="p-3 rounded-xl bg-white/10 border border-cyan-400/30 text-white focus:outline-none focus:border-cyan-300 placeholder:text-blue-300"
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                onChange={handleChange}
                className="p-3 rounded-xl bg-white/10 border border-cyan-400/30 text-white focus:outline-none focus:border-cyan-300 placeholder:text-blue-300"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                className="p-3 rounded-xl bg-white/10 border border-cyan-400/30 text-white focus:outline-none focus:border-cyan-300 resize-none h-32 placeholder:text-blue-300"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-full mt-2 hover:opacity-90 transition-all duration-300 hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>

        {/* Social Media Section - LEFT ALIGNED */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <h3 className="text-lg font-semibold text-cyan-300 mb-4 text-left">Follow Us on Social Media</h3>
          <div className="flex gap-6">
            <a 
              href="https://facebook.com/comsats" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-cyan-500/30 hover:scale-110 transition-all duration-300"
            >
              <FaFacebookF className="text-cyan-300" />
            </a>
            <a 
              href="https://twitter.com/comsats" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-cyan-500/30 hover:scale-110 transition-all duration-300"
            >
              <FaTwitter className="text-cyan-300" />
            </a>
            <a 
              href="https://instagram.com/comsats" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-cyan-500/30 hover:scale-110 transition-all duration-300"
            >
              <FaInstagram className="text-cyan-300" />
            </a>
            <a 
              href="https://linkedin.com/school/comsats" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-cyan-500/30 hover:scale-110 transition-all duration-300"
            >
              <FaLinkedinIn className="text-cyan-300" />
            </a>
          </div>
        </motion.div>

        {/* FAQ Contact Note - LEFT ALIGNED */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-left text-blue-200 text-sm"
        >
          <p>For urgent inquiries, please call our helpline during office hours.</p>
          <p>Average response time for emails: 24-48 hours</p>
        </motion.div>
      </div>
    </section>
  );
}