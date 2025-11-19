"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Award, GraduationCap, Wallet, Users, Globe2, Star } from "lucide-react";

export default function Scholarships() {
  const scholarships = [
    {
      title: "Merit Scholarship",
      description:
        "Awarded to students with outstanding academic performance in their current or previous semester.",
      icon: <Award className="w-12 h-12 text-cyan-400" />,
      image: "/images/needBased.png",
    },
    {
      title: "Need-Based Scholarship",
      description:
        "For students who demonstrate financial need. Supporting deserving candidates to continue their education.",
      icon: <Wallet className="w-12 h-12 text-cyan-400" />,
      image: "/images/needBased.png",
    },
    {
      title: "HEC Scholarship",
      description:
        "Scholarship programs funded under the Higher Education Commission and COMSATS collaboration.",
      icon: <GraduationCap className="w-12 h-12 text-cyan-400" />,
      image: "/images/needBased.png",
    },
  ];

  const stats = [
    {
      number: "1,250+",
      label: "Students Awarded",
      icon: <Users className="w-8 h-8 text-cyan-400" />,
    },
    {
      number: "15M+",
      label: "Total Aid Distributed (PKR)",
      icon: <Wallet className="w-8 h-8 text-cyan-400" />,
    },
    {
      number: "25+",
      label: "Active Scholarship Programs",
      icon: <Star className="w-8 h-8 text-cyan-400" />,
    },
    {
      number: "10+",
      label: "Partner Organizations",
      icon: <Globe2 className="w-8 h-8 text-cyan-400" />,
    },
  ];

  return (
    <section
      id="scholarships"
      className="py-24 bg-gradient-to-b from-blue-950 via-indigo-950 to-blue-950 text-white"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-cyan-300 mb-4 text-left"
        >
          Explore Available Scholarships
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-blue-200 text-base md:text-lg max-w-3xl mb-16 leading-relaxed text-left"
        >
          COMSATS offers various scholarships to recognize academic excellence
          and support financially challenged students. Learn more about the
          programs available for both undergraduate and graduate students.
        </motion.p>

        {/* Scholarship Cards Grid */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-10">
          {scholarships.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="group relative bg-white/10 backdrop-blur-lg border border-cyan-400/30 rounded-2xl overflow-hidden shadow-xl hover:border-cyan-300 hover:shadow-cyan-400/30 transition"
            >
              <div className="h-40 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={200}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6 text-left">
                <div className="flex items-center gap-4 mb-4">
                  {item.icon}
                  <h3 className="text-2xl font-semibold text-cyan-300">
                    {item.title}
                  </h3>
                </div>
                <p className="text-blue-200 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How to Apply Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 bg-white/10 border border-cyan-400/30 backdrop-blur-md rounded-2xl p-10 text-center max-w-5xl mx-auto shadow-lg"
        >
          <h3 className="text-3xl font-semibold text-cyan-300 mb-4">
            How to Apply
          </h3>
          <p className="text-blue-200 text-lg leading-relaxed mb-6">
            Students can log in to their portal accounts to explore available
            scholarships, check eligibility, and apply directly online.
            Applications are reviewed by the scholarship committee each semester.
          </p>
          <button className="mt-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-blue-950 font-semibold px-6 py-2 rounded-full shadow-lg hover:opacity-90 transition">
            View All Scholarships
          </button>
        </motion.div>

        {/* Transition Text (no card, just a visual break) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 mb-10 text-center"
        >
          <h3 className="text-3xl md:text-4xl font-semibold text-cyan-300 mb-3">
            Empowering Student Success
          </h3>
          <p className="text-blue-200 max-w-2xl mx-auto text-lg leading-relaxed">
            Every scholarship represents a story of dedication, perseverance,
            and achievement. Together, we build futures — one student at a time.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 bg-white/10 border border-cyan-400/30 backdrop-blur-lg rounded-3xl p-10 max-w-5xl mx-auto shadow-xl hover:border-cyan-300 transition"
        >
          <h3 className="text-3xl font-semibold text-cyan-300 mb-10">
            Our Scholarship Impact
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center justify-center bg-white/10 border border-cyan-400/30 rounded-2xl p-6 shadow-lg hover:border-cyan-300 hover:shadow-cyan-400/30 transition"
              >
                {stat.icon}
                <h4 className="text-2xl font-bold text-cyan-300 mt-3 mb-1">
                  {stat.number}
                </h4>
                <p className="text-blue-200 text-sm font-medium text-center">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
