"use client";
import { stepEase } from "@/lib/utils";

import React, { useState } from "react";
import { motion } from "motion/react";

export const ElectricBorder = ({ children, color = "#FF003C" }: { children: React.ReactNode; color?: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative p-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <motion.div
          className="absolute inset-0 z-0 border-2"
          style={{ borderColor: color }}
          animate={{
            clipPath: [
              "polygon(0 0, 10% 0, 10% 10%, 0 10%)",
              "polygon(90% 0, 100% 0, 100% 10%, 90% 10%)",
              "polygon(90% 90%, 100% 90%, 100% 100%, 90% 100%)",
              "polygon(0 90%, 10% 90%, 10% 100%, 0 100%)",
              "polygon(0 0, 10% 0, 10% 10%, 0 10%)",
            ]
          }}
          transition={{ duration: 0.5, ease: stepEase(4), repeat: Infinity }}
        />
      )}
      
      {/* Glitch lines around the border */}
      {isHovered && (
        <motion.div
          className="absolute inset-[-4px] z-0 border border-retro-cyan opacity-50"
          animate={{
            x: [-2, 2, -1, 3, 0],
            y: [1, -2, 2, -1, 0],
          }}
          transition={{ duration: 0.2, ease: stepEase(3), repeat: Infinity }}
        />
      )}
      
      <div className="relative z-10 bg-retro-bg w-full h-full">
        {children}
      </div>
    </div>
  );
};
