"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";

export const Squares = ({ speed = 1, borderColor = "#00F0FF" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
      <motion.div
        className="w-[200%] h-[200%] absolute top-[-50%] left-[-50%]"
        style={{
          backgroundImage: `linear-gradient(${borderColor} 1px, transparent 1px), linear-gradient(90deg, ${borderColor} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
        animate={{
          y: [0, 40],
          x: [0, 40]
        }}
        transition={{
          repeat: Infinity,
          duration: 2 / speed,
          ease: "linear",
        }}
      />
    </div>
  );
};
