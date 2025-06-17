"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export const AnimatedHero = () => {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center relative z-10">
      {/* Text Side */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
          Donate Blood,{" "}
          <span className="text-red-600 drop-shadow-sm">Save Lives</span>
        </h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-xl">
          Every drop counts. Be the hero someone desperately needs. Your small
          act can mean the world to someone.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button
            size="lg"
            asChild
            className="rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md"
          >
            <Link href="/register">
              <Heart className="mr-2 h-4 w-4 animate-pulse" />
              Become a Donor
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="rounded-full border-red-600 text-red-600 hover:bg-red-100"
          >
            <Link href="/requests">Find Blood Requests</Link>
          </Button>
        </div>
      </motion.div>

      {/* Image Side */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative">
          {/* Optional Glow or Shape Overlay */}
          <div className="absolute -top-6 -right-6 h-32 w-32 bg-red-300 rounded-full blur-3xl opacity-30 z-0"></div>

          <img
            src="/blood-donation-illustration.svg"
            alt="Blood Donation"
            className="relative z-10 rounded-2xl shadow-lg max-w-full object-contain"
            width={400}
            height={400}
          />
        </div>
      </motion.div>
    </div>
  );
};
