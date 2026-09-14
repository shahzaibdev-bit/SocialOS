"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import BootScreen from "@/components/BootScreen";
import DigitalDust from "@/components/DigitalDust";

export default function Home() {
  const [booting, setBooting] = useState(true);

  if (booting) {
    return <BootScreen onComplete={() => setBooting(false)} />;
  }

  return (
    <>
      <DigitalDust />
      <main className="flex min-h-screen flex-col items-center justify-between w-full relative z-10 overflow-hidden">
        <Navbar />
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24 pb-32">
          <Hero />
          <Stats />
          <Features />
          <HowItWorks />
          <Pricing />
        </div>
        <Footer />
      </main>
    </>
  );
}
