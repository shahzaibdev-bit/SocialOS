"use client";

import Link from "next/link";
import { GlitchText } from "./react-bits/GlitchText";
import { Magnet } from "./react-bits/Magnet";
import { ClickSpark } from "./react-bits/ClickSpark";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-retro-bg border-b-2 border-retro-cyan h-20 flex items-center justify-between px-6 lg:px-12">
      <div className="flex items-center gap-2">
        <GlitchText text="BugChase OS" />
      </div>
      
      <div className="hidden md:flex items-center gap-8 font-pixel text-xs">
        <Magnet>
          <a href="#features" className="hover:text-retro-yellow transition-colors">Features</a>
        </Magnet>
        <Magnet>
          <a href="#workflow" className="hover:text-retro-magenta transition-colors">Workflow</a>
        </Magnet>
        <Magnet>
          <a href="#pricing" className="hover:text-retro-cyan transition-colors">Pricing</a>
        </Magnet>
      </div>

      <ClickSpark sparkColor="#00F0FF">
        <Link href="/dashboard/integrations" className="block bg-transparent border-2 border-retro-cyan text-retro-cyan px-6 py-3 font-pixel text-xs uppercase shadow-retro-cyan hover:shadow-retro-cyan-hover hover:translate-y-[2px] hover:translate-x-[2px] transition-all active:shadow-none active:translate-y-[4px] active:translate-x-[4px]">
          Connect Accounts
        </Link>
      </ClickSpark>
    </nav>
  );
}
