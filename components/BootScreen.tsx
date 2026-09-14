"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5; // random increments for retro feel
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-retro-bg flex flex-col items-center justify-center z-[100] crt">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        className="font-pixel text-retro-cyan text-3xl md:text-5xl mb-12 text-center shadow-retro-magenta/50 drop-shadow-lg"
      >
        BugChase OS
      </motion.div>
      
      <div className="w-64 max-w-[80vw] h-8 border-4 border-retro-cyan p-1 bg-black relative">
        <div 
          className="h-full bg-retro-cyan transition-all duration-100 ease-linear"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      
      <div className="mt-6 font-pixel text-retro-yellow text-sm animate-pulse tracking-widest">
        LOADING...
      </div>
    </div>
  );
}

