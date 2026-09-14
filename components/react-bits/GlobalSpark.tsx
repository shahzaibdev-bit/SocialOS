"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { stepEase } from "@/lib/utils";

export const GlobalSpark = ({ sparkColor = "#00F0FF" }: { sparkColor?: string }) => {
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const id = Date.now();
      setSparks((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== id));
      }, 500);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {sparks.map((spark) => (
          <React.Fragment key={spark.id}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`${spark.id}-${i}`}
                className="absolute w-2 h-2"
                style={{ backgroundColor: sparkColor, left: spark.x - 4, top: spark.y - 4 }}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 0,
                  x: Math.cos((i * 45 * Math.PI) / 180) * 50,
                  y: Math.sin((i * 45 * Math.PI) / 180) * 50,
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
