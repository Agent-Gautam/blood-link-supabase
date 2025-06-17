"use client";

import { motion } from "framer-motion";
import { Droplet, Calendar, Users } from "lucide-react";

const features = [
  {
    icon: <Droplet className="h-6 w-6 text-red-600" />,
    title: "Donate Blood",
    desc: "Find nearby camps and donate blood easily with just a few taps.",
  },
  {
    icon: <Calendar className="h-6 w-6 text-red-600" />,
    title: "Organize Camps",
    desc: "Effortlessly plan and manage life-saving blood donation drives.",
  },
  {
    icon: <Users className="h-6 w-6 text-red-600" />,
    title: "Request Blood",
    desc: "Urgently need blood? Raise verified requests quickly and safely.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-red-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <h2 className="text-5xl font-extrabold text-red-700">
            How BloodLink Works
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            Bridging lives through a drop of kindness.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-red-100"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="h-14 w-14 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-red-700">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-base">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
