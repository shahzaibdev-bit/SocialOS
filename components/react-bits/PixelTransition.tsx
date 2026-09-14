"use client";
import { stepEase } from "@/lib/utils";

import React, { useState } from "react";
import { motion } from "motion/react";

export const PixelTransition = ({ children }: { children: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const gridSize = 8;
  
  return (
    <div 
      className="relative w-full h-full overflow-hidden flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2, ease: stepEase(4) }}
        className="absolute inset-0 z-10 flex flex-wrap"
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-retro-cyan"
            style={{ width: `${100 / gridSize}%`, height: `${100 / gridSize}%` }}
            initial={{ opacity: 1 }}
            animate={{ opacity: isHovered ? 0 : 1 }}
            transition={{
              duration: 0.3,
              delay: (i % gridSize) * 0.02 + Math.floor(i / gridSize) * 0.02,
              ease: stepEase(2),
            }}
          />
        ))}
      </motion.div>
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};
