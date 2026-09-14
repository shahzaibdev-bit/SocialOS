import { ScrollReveal } from "./ScrollReveal";
import { ShinyText } from "./react-bits/ShinyText";

export default function Stats() {
  return (
    <section className="w-full relative z-10 py-16 border-y border-gray-800 bg-black/50 my-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
            
            <div className="flex flex-col items-center justify-center p-6">
              <h3 className="text-4xl md:text-5xl font-pixel text-retro-cyan mb-2">
                15M<span className="text-retro-magenta">+</span>
              </h3>
              <p className="text-gray-400 font-mono text-sm uppercase tracking-widest mt-2">
                Posts Automated
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-6">
              <h3 className="text-4xl md:text-5xl font-pixel text-retro-cyan mb-2">
                99.9<span className="text-retro-yellow">%</span>
              </h3>
              <p className="text-gray-400 font-mono text-sm uppercase tracking-widest mt-2">
                Uptime SLA
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-6">
              <h3 className="text-4xl md:text-5xl font-pixel text-retro-cyan mb-2">
                ZERO
              </h3>
              <p className="text-gray-400 font-mono text-sm uppercase tracking-widest mt-2">
                Shadowbans Detected
              </p>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
