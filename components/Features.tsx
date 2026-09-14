"use client";

import { TiltedCard } from "./react-bits/TiltedCard";
import { PixelTransition } from "./react-bits/PixelTransition";
import { ScrollReveal } from "./ScrollReveal";
import { Brain, CloudLightning, UserCheck, Code, Zap, Shield } from "lucide-react";

const features = [
  {
    id: 1,
    title: "AI MCP Integration",
    desc: "Connect LLMs directly to your social graphs with Multi-Agent Control Protocols.",
    icon: <Brain size={48} className="text-retro-magenta" />,
    colorClass: "border-retro-magenta shadow-retro-magenta"
  },
  {
    id: 2,
    title: "Stateless Cloud Scheduling",
    desc: "100% serverless queue processing with zero state drift.",
    icon: <CloudLightning size={48} className="text-retro-cyan" />,
    colorClass: "border-retro-cyan shadow-retro-cyan"
  },
  {
    id: 3,
    title: "Human-in-the-Loop",
    desc: "Mandatory manual approval pipelines before any AI agent posts to production.",
    icon: <UserCheck size={48} className="text-retro-yellow" />,
    colorClass: "border-retro-yellow shadow-retro-yellow"
  },
  {
    id: 4,
    title: "Programmatic API",
    desc: "Full GraphQL & REST access to the underlying scheduling engine.",
    icon: <Code size={48} className="text-retro-cyan" />,
    colorClass: "border-retro-cyan shadow-retro-cyan"
  },
  {
    id: 5,
    title: "Instant Propagation",
    desc: "Cross-post to 15+ platforms simultaneously with zero latency.",
    icon: <Zap size={48} className="text-retro-yellow" />,
    colorClass: "border-retro-yellow shadow-retro-yellow"
  },
  {
    id: 6,
    title: "Shadowban Protection",
    desc: "AI detects and avoids platform-specific shadowban triggers before posting.",
    icon: <Shield size={48} className="text-retro-magenta" />,
    colorClass: "border-retro-magenta shadow-retro-magenta"
  }
];

export default function Features() {
  return (
    <section id="features" className="w-full relative z-10 py-12">
      <ScrollReveal className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-pixel text-white mb-4 uppercase">
          Select <span className="text-retro-cyan">Player</span>
        </h2>
        <p className="text-xl text-gray-400 font-mono">Choose your weapon for social dominance.</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <ScrollReveal key={feature.id} delay={idx * 0.1}>
            <TiltedCard className="w-full h-[280px]">
              <div className={`w-full h-full bg-[#111118] border-2 ${feature.colorClass} flex flex-col group overflow-hidden relative`}>
                
                {/* OS Style Title Bar */}
                <div className={`w-full h-8 border-b-2 ${feature.colorClass} flex items-center px-3 justify-between bg-[#0A0A0F]`}>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-retro-magenta border border-black shadow-[1px_1px_0_0_rgba(0,0,0,1)]" />
                    <div className="w-3 h-3 bg-retro-yellow border border-black shadow-[1px_1px_0_0_rgba(0,0,0,1)]" />
                    <div className="w-3 h-3 bg-retro-cyan border border-black shadow-[1px_1px_0_0_rgba(0,0,0,1)]" />
                  </div>
                  <span className="text-[10px] font-pixel text-gray-400 uppercase tracking-widest">{feature.title.substring(0, 15)}</span>
                </div>

                {/* Scanline Background Overlay */}
                <div className="absolute inset-0 top-8 pointer-events-none opacity-20 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-0" />

                <div className="p-6 flex flex-col justify-between flex-grow relative z-10">
                  <div className="h-16 w-16 mb-4 bg-black/80 border border-gray-700">
                    <PixelTransition>
                      {feature.icon}
                    </PixelTransition>
                  </div>
                  <div>
                    <h3 className="font-pixel text-sm mb-3 uppercase leading-relaxed text-white">
                      {feature.title}
                    </h3>
                    <p className="font-mono text-sm text-gray-400">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            </TiltedCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
