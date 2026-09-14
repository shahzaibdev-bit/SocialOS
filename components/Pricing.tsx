"use client";

import Link from "next/link";
import { ElectricBorder } from "./react-bits/ElectricBorder";
import { ClickSpark } from "./react-bits/ClickSpark";
import { ScrollReveal } from "./ScrollReveal";

const tiers = [
  {
    name: "Player 1",
    price: "$29",
    features: ["3 Social Accounts", "50 AI Posts /mo", "Basic Analytics"],
    color: "retro-cyan"
  },
  {
    name: "Co-Op (Pro)",
    price: "$89",
    features: ["15 Social Accounts", "Unlimited AI Posts", "Advanced Analytics", "MCP API Access"],
    color: "retro-magenta",
    isPro: true
  },
  {
    name: "Arcade Master",
    price: "$199",
    features: ["Unlimited Accounts", "Custom AI Models", "White-label Reports", "SLA Support"],
    color: "retro-yellow"
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="w-full relative z-10 py-12">
      <ScrollReveal className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-pixel text-white mb-4 uppercase">
          Insert <span className="text-retro-magenta">Coin</span>
        </h2>
        <p className="text-xl text-gray-400 font-mono">Choose your subscription plan.</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {tiers.map((tier, idx) => {
          const CardContent = (
            <div className={`w-full h-full p-8 border-4 ${
              tier.isPro ? 'border-retro-magenta shadow-retro-magenta' : 
              tier.color === 'retro-cyan' ? 'border-retro-cyan shadow-retro-cyan' : 'border-retro-yellow shadow-retro-yellow'
            } flex flex-col bg-[#12121A]`}>
              
              {/* Cabinet Top Area */}
              <div className="text-center pb-6 border-b-2 border-gray-800 mb-6 relative">
                {tier.isPro && (
                  <div className="absolute -top-4 right-[-10px] bg-retro-magenta text-white font-pixel text-[10px] px-2 py-1 rotate-12">
                    MOST POPULAR
                  </div>
                )}
                <h3 className={`font-pixel text-xl uppercase ${
                  tier.isPro ? 'text-retro-magenta' : 
                  tier.color === 'retro-cyan' ? 'text-retro-cyan' : 'text-retro-yellow'
                } mb-2`}>{tier.name}</h3>
                <div className="text-4xl font-pixel text-white">{tier.price}<span className="text-lg text-gray-500">/mo</span></div>
              </div>

              {/* Screen Area */}
              <div className="flex-grow mb-8 bg-black p-4 border-2 border-gray-800 shadow-[inset_0_0_20px_rgba(0,0,0,1)] crt">
                <ul className="space-y-4">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="font-mono text-sm text-gray-300 flex items-start before:content-['>'] before:text-retro-cyan before:mr-2">
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Coin Slot / CTA */}
              <div className="mt-auto flex justify-center">
                <ClickSpark sparkColor={tier.isPro ? "#FF003C" : "#00F0FF"}>
                  <Link href="/signup" className={`block w-full py-4 text-center font-pixel text-xs uppercase text-white bg-black border-2 hover:-translate-y-1 active:translate-y-1 transition-transform ${
                    tier.isPro ? 'border-retro-magenta shadow-retro-magenta' : 
                    tier.color === 'retro-cyan' ? 'border-retro-cyan shadow-retro-cyan' : 'border-retro-yellow shadow-retro-yellow'
                  }`}>
                    {tier.isPro ? 'INSERT COIN (START PRO)' : 'INSERT COIN'}
                  </Link>
                </ClickSpark>
              </div>
            </div>
          );

          if (tier.isPro) {
            return (
              <ScrollReveal key={idx} delay={idx * 0.1} className="relative z-20 scale-105">
                <ElectricBorder color="#FF003C">
                  {CardContent}
                </ElectricBorder>
              </ScrollReveal>
            );
          }

          return (
            <ScrollReveal key={idx} delay={idx * 0.1} className="relative z-10">
              {CardContent}
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
