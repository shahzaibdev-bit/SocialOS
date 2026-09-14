"use client";

import React from "react";
import { motion } from "motion/react";

export const ShinyText = ({ text, className = "" }: { text: string; className?: string }) => {
  return (
    <div className={`relative inline-block overflow-hidden ${className}`}>
      <span className="relative z-10 text-white font-pixel">{text}</span>
      <motion.div
        className="absolute top-0 -inset-full h-full w-1/2 z-20 block opacity-50 transform -skew-x-12"
        style={{
          background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8), transparent)"
        }}
        animate={{
          left: ["-100%", "200%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
          repeatDelay: 1,
        }}
      />
    </div>
  );
};
