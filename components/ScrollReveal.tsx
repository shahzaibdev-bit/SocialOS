"use client";

import { motion } from "motion/react";
import { stepEase } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const ScrollReveal = ({ children, delay = 0, className = "" }: ScrollRevealProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, type: "spring", bounce: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
