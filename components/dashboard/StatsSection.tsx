"use client";

import { motion } from "framer-motion";

const stats = [
  { count: "1,200+", label: "Active Donors" },
  { count: "50+", label: "Partner Hospitals" },
  { count: "3,500+", label: "Lives Saved" },
  { count: "120+", label: "Blood Drives" },
];

export const StatsSection = () => {
  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((item, idx) => (
            <motion.div
              key={idx}
              className="p-6 bg-red-50 rounded-2xl shadow-md hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="text-4xl font-bold text-red-600 drop-shadow">
                {item.count}
              </div>
              <div className="text-sm md:text-base text-gray-700 mt-2">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
