"use client";
import { stepEase } from "@/lib/utils";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

export const GlitchText = ({ text }: { text: string }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative inline-block font-pixel text-xl text-white">
      <motion.span
        className="relative z-10"
        animate={{ x: isGlitching ? [0, -2, 2, -1, 0] : 0 }}
        transition={{ duration: 0.2, ease: stepEase(5) }}
      >
        {text}
      </motion.span>
      {isGlitching && (
        <>
          <span className="absolute top-0 left-[2px] text-retro-cyan z-0 mix-blend-screen opacity-70">{text}</span>
          <span className="absolute top-0 -left-[2px] text-retro-magenta z-0 mix-blend-screen opacity-70">{text}</span>
        </>
      )}
    </div>
  );
};
