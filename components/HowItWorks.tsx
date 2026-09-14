"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ShinyText } from "./react-bits/ShinyText";
import { ScrollReveal } from "./ScrollReveal";
import { BrainCircuit, CheckCircle2, Clock3, Send, ShieldCheck, Sparkles, Zap } from "lucide-react";

const steps = [
  {
    title: "AI Drafts",
    label: "01",
    description: "Brand voice, prompt context, and platform rules become ready-to-review content.",
    icon: BrainCircuit,
    color: "text-retro-cyan",
    border: "border-retro-cyan",
    glow: "rgba(0,240,255,0.28)",
    bars: ["w-full bg-retro-cyan", "w-10/12 bg-retro-yellow", "w-8/12 bg-retro-magenta"],
    feed: ["Trend scan", "Brand voice", "Draft pack"],
  },
  {
    title: "Guardrails Check",
    label: "02",
    description: "Tone, limits, approvals, and safety rules are validated before anything moves forward.",
    icon: ShieldCheck,
    color: "text-retro-magenta",
    border: "border-retro-magenta",
    glow: "rgba(255,0,60,0.28)",
    bars: ["w-11/12 bg-retro-magenta", "w-full bg-retro-cyan", "w-9/12 bg-retro-yellow"],
    feed: ["Tone pass", "Limit check", "Manager review"],
  },
  {
    title: "Queue Publishes",
    label: "03",
    description: "Approved posts enter the schedule queue and publish at the right local time.",
    icon: Zap,
    color: "text-retro-yellow",
    border: "border-retro-yellow",
    glow: "rgba(255,215,0,0.28)",
    bars: ["w-full bg-retro-yellow", "w-9/12 bg-retro-cyan", "w-7/12 bg-retro-magenta"],
    feed: ["Timezone lock", "BullMQ queue", "Publish event"],
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const active = steps[activeStep];
  const ActiveIcon = active.icon;

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <section id="workflow" className="w-full relative z-10 py-10 md:py-14">
      <ScrollReveal className="text-center mb-10 relative z-10">
        <h2 className="text-3xl md:text-5xl uppercase mb-4">
          <ShinyText text="The Agentic Workflow" />
        </h2>
        <p className="text-base md:text-lg text-gray-400 font-mono max-w-2xl mx-auto">
          Draft, validate, approve, and publish from one clear operating model.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-6 lg:gap-8 items-stretch">
        <div
          className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4"
          onMouseLeave={() => setIsPaused(false)}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;

            return (
              <ScrollReveal key={step.title} delay={index * 0.08}>
                <motion.button
                  type="button"
                  onMouseEnter={() => {
                    setActiveStep(index);
                    setIsPaused(true);
                  }}
                  onFocus={() => {
                    setActiveStep(index);
                    setIsPaused(true);
                  }}
                  onClick={() => {
                    setActiveStep(index);
                    setIsPaused(true);
                  }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group w-full text-left bg-[#090910]/95 border-2 ${isActive ? step.border : "border-gray-800"} p-5 min-h-[168px] transition-colors duration-300 shadow-[6px_6px_0_rgba(0,0,0,0.8)]`}
                  style={{ boxShadow: isActive ? `0 0 28px ${step.glow}, 6px 6px 0 rgba(0,0,0,0.9)` : "6px 6px 0 rgba(0,0,0,0.8)" }}
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <span className={`font-pixel text-sm ${isActive ? step.color : "text-gray-500"}`}>
                      {step.label}
                    </span>
                    <Icon size={30} className={isActive ? step.color : "text-gray-600"} />
                  </div>
                  <h3 className="font-pixel text-sm md:text-base text-white mb-3 leading-relaxed">
                    {step.title}
                  </h3>
                  <p className="font-mono text-sm text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </motion.button>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.12}>
          <motion.div
            className="relative min-h-[450px] border-2 border-gray-800 bg-black overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.12)]"
            animate={{ borderColor: activeStep === 0 ? "#00F0FF" : activeStep === 1 ? "#FF003C" : "#FFD700" }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                backgroundPosition: activeStep % 2 === 0 ? "0px 0px" : "32px 18px",
              }}
              transition={{ duration: 1.4, repeat: Infinity, repeatType: "reverse" }}
              style={{
                backgroundImage:
                  "linear-gradient(90deg, transparent 24px, #00F0FF 25px), linear-gradient(transparent 24px, #00F0FF 25px)",
                backgroundSize: "26px 26px",
              }}
            />

            <div className="relative h-10 border-b-2 border-gray-800 bg-[#101018] flex items-center justify-between px-4">
              <span className="font-pixel text-[10px] text-retro-cyan">MODEL.EXE</span>
              <div className="flex items-center gap-2">
                {steps.map((step, index) => (
                  <button
                    key={step.label}
                    type="button"
                    aria-label={`Show ${step.title}`}
                    onClick={() => {
                      setActiveStep(index);
                      setIsPaused(true);
                    }}
                    className={`w-3 h-3 border border-black ${activeStep === index ? step.border.replace("border-", "bg-") : "bg-gray-700"}`}
                  />
                ))}
              </div>
            </div>

            <div className="relative p-5 md:p-8 h-[calc(100%-40px)] flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Brief", "Guardrail", "Schedule"].map((item, index) => (
                  <motion.div
                    key={item}
                    animate={{ opacity: index <= activeStep ? 1 : 0.35, y: index === activeStep ? -3 : 0 }}
                    className="border-2 border-gray-800 bg-[#0D0D12] p-4 text-center"
                  >
                    <div className={`mx-auto mb-3 w-9 h-9 border-2 border-black flex items-center justify-center ${index === 0 ? "bg-retro-cyan" : index === 1 ? "bg-retro-magenta" : "bg-retro-yellow"}`}>
                      {index === 0 && <Sparkles size={18} className="text-black" />}
                      {index === 1 && <CheckCircle2 size={18} className="text-black" />}
                      {index === 2 && <Clock3 size={18} className="text-black" />}
                    </div>
                    <span className="font-pixel text-[10px] text-white">{item}</span>
                  </motion.div>
                ))}
              </div>

              <div className="relative flex-1 min-h-[190px] border-2 border-retro-cyan/70 bg-[#06060B] p-5 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.title}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.28 }}
                    className="h-full flex flex-col justify-center gap-5"
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        animate={{ rotate: [0, 6, -6, 0], scale: [1, 1.08, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8 }}
                        className={`w-14 h-14 border-2 border-black ${activeStep === 0 ? "bg-retro-cyan" : activeStep === 1 ? "bg-retro-magenta" : "bg-retro-yellow"} flex items-center justify-center`}
                      >
                        <ActiveIcon size={30} className="text-black" />
                      </motion.div>
                      <div>
                        <p className={`font-pixel text-sm ${active.color}`}>{active.title}</p>
                        <p className="font-mono text-sm text-gray-400 mt-2">{active.feed.join(" / ")}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {active.bars.map((bar, index) => (
                        <motion.div key={bar} className="h-4 bg-gray-800 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.65, delay: index * 0.12 }}
                            className={`h-full ${bar}`}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-2 border-retro-magenta bg-[#12070C] p-4"
                animate={{ boxShadow: ["0 0 0 rgba(255,0,60,0)", "0 0 24px rgba(255,0,60,0.25)", "0 0 0 rgba(255,0,60,0)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div>
                  <p className="font-pixel text-xs text-retro-magenta mb-2">Human Approval</p>
                  <p className="font-mono text-sm text-gray-300">Draft-only mode keeps every AI action reviewable.</p>
                </div>
                <button className="h-12 px-5 bg-retro-cyan text-black font-pixel text-xs uppercase flex items-center justify-center gap-2 shadow-retro-magenta">
                  <Send size={16} />
                  Publish
                </button>
              </motion.div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
