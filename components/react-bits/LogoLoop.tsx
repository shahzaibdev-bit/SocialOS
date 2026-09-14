"use client";
import { stepEase } from "@/lib/utils";

import React from "react";
import { motion } from "motion/react";

export const LogoLoop = ({ items }: { items: string[] }) => {
  return (
    <div className="w-full overflow-hidden flex bg-black border-y-2 border-retro-cyan py-4">
      <motion.div
        className="flex whitespace-nowrap gap-16 items-center"
        animate={{ x: [0, -1035] }} // Arbitrary pixel value, adjusted below
        transition={{
          repeat: Infinity,
          ease: stepEase(40),
          duration: 10,
        }}
      >
        {/* Double the items for seamless loop */}
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <div key={idx} className="font-pixel text-gray-500 uppercase text-sm tracking-widest inline-flex items-center">
            {item}
            <span className="ml-16 text-retro-magenta opacity-50">*</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
