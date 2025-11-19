"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function FAQSection() {
  const faqs = [
    {
      question: "How can I apply for a scholarship?",
      answer:
        "You can explore available scholarships on our portal and click the 'Apply Now' button. Follow the instructions carefully and submit your documents.You can explore available scholarships on our portal and click the 'Apply Now' button. Follow the instructions carefully and submit your documents.",
    },
    {
      question: "Who is eligible for scholarships?",
      answer:
        "Eligibility varies for each scholarship. Typically, they are based on academic performance, financial need, or specific programs. Check the details for each scholarship.",
    },
    {
      question: "How will I know if my application is approved?",
      answer:
        "Once your application is reviewed, you will receive an email notification with the decision and further instructions.",
    },
    {
      question: "Can I apply for multiple scholarships?",
      answer:
        "Yes, you can apply for multiple scholarships as long as you meet the eligibility criteria for each.",
    },
    {
      question: "Who is eligible for scholarships?",
      answer:
        "Eligibility varies for each scholarship. Typically, they are based on academic performance, financial need, or specific programs. Check the details for each scholarship.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-6 text-white">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-12 text-cyan-300"
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="space-y-4 text-left">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-cyan-400/30 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full text-left px-6 py-4 font-semibold flex justify-between items-center hover:bg-cyan-400/10 transition"
              >
                {faq.question}
                <span className="ml-4">{openIndex === i ? "-" : "+"}</span>
              </button>
              {openIndex === i && (
                <div className="px-6 py-4 text-blue-200">{faq.answer}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
