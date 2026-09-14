"use client";

import { LogoLoop } from "./react-bits/LogoLoop";
import { GlitchText } from "./react-bits/GlitchText";
import { ScrollReveal } from "./ScrollReveal";

export default function Footer() {
  const platforms = ["Twitter (X)", "Meta", "LinkedIn", "TikTok", "Reddit", "Discord", "Slack", "Mastodon"];

  return (
    <footer className="w-full relative z-10 bg-[#0A0A0F] pt-12 border-t-4 border-retro-magenta overflow-hidden mt-32">
      <LogoLoop items={platforms} />
      
      <ScrollReveal className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <GlitchText text="BugChase OS" />
          <p className="font-mono text-gray-500 text-sm mt-4">
            © 2026 BugChase Systems.<br/>
            All Rights Reserved.
          </p>
        </div>
        
        <div className="flex gap-8 font-pixel text-xs text-gray-400">
          <a href="#" className="hover:text-retro-cyan transition-colors">Documentation</a>
          <a href="#" className="hover:text-retro-magenta transition-colors">API Status</a>
          <a href="#" className="hover:text-retro-yellow transition-colors">Terms of Service</a>
        </div>
      </ScrollReveal>
    </footer>
  );
}
