"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";

export const AnimatedHero = () => {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center relative z-10">

      {/* Text Side */}
      <motion.div
        className="space-y-6 z-40"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-white">
          Donate Blood,{" "}
          <span className="text-red-600 drop-shadow-sm">Save Lives</span>
        </h1>
        <p className="text-white text-lg md:text-xl max-w-xl">
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
      
    </div>
  );
};
