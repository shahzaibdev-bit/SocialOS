"use client";

import React, { useState, useEffect } from "react";

export const DecryptedText = ({ text, speed = 50 }: { text: string; speed?: number }) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "!<>-_\\\\/[]{}—=+*^?#________";

  useEffect(() => {
    let iteration = 0;
    let interval: NodeJS.Timeout;

    const startAnimation = () => {
      interval = setInterval(() => {
        setDisplayText((prev) =>
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3;
      }, speed);
    };
    
    startAnimation();

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayText}</span>;
};
