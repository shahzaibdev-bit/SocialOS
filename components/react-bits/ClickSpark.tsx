"use client";
import { stepEase } from "@/lib/utils";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export const ClickSpark = ({
  children,
  sparkColor = "#00F0FF",
}: {
  children: React.ReactNode;
  sparkColor?: string;
}) => {
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setSparks((prev) => [...prev, { id: Date.now(), x, y }]);
    setTimeout(() => {
      setSparks((prev) => prev.slice(1));
    }, 500);
  };

  return (
    <div className="relative inline-block cursor-pointer" onClick={handleClick}>
      {children}
      <AnimatePresence>
        {sparks.map((spark) => (
          <React.Fragment key={spark.id}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`${spark.id}-${i}`}
                className="absolute w-2 h-2 pointer-events-none"
                style={{ backgroundColor: sparkColor, left: spark.x, top: spark.y }}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 0,
                  x: Math.cos((i * 45 * Math.PI) / 180) * 40,
                  y: Math.sin((i * 45 * Math.PI) / 180) * 40,
                }}
                transition={{ duration: 0.4, ease: stepEase(4) }}
              />
            ))}
          </React.Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
};
