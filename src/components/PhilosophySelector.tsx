"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Cpu, Award, Zap, Compass } from "lucide-react";

interface PhilosophyItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  opposite: string;
  description: string;
  viyaanStance: string;
  quote: string;
}

const philosophyItems: PhilosophyItem[] = [
  {
    id: "research",
    icon: <Compass className="w-4 h-4" />,
    title: "Deep Research over Trends",
    opposite: "Hype Cycle Hunting",
    description:
      "Traditional firms rush to build wrapping shells around the latest API updates. We invest in architectural groundwork, custom retrieval frameworks, and cognitive continuity models that outlive version increments.",
    viyaanStance:
      "Building structural intelligence that serves as a permanent foundation for human-technology collaboration.",
    quote:
      "True innovation happens when we stop building for tomorrow and start building for decades.",
  },
  {
    id: "quality",
    icon: <Award className="w-4 h-4" />,
    title: "Quality over Quantity",
    opposite: "Feature Churning",
    description:
      "Instead of releasing dozens of half-finished utilities that demand user attention, we build cohesive environments like JOI and Human OS that fit seamlessly into human routines.",
    viyaanStance:
      "Meticulously crafting every pixel, interaction, and memory structure to respect human cognitive bandwidth.",
    quote:
      "Craftsmanship is not about how much you can build, but what you choose to leave out.",
  },
  {
    id: "simplicity",
    icon: <Zap className="w-4 h-4" />,
    title: "Simplicity over Complexity",
    opposite: "Technological Overwhelm",
    description:
      "Artificial Intelligence does not need to look like a cockpit. By stripping away sci-fi glowing rings and terminal aesthetics, we create interfaces that feel organic, calm, and human.",
    viyaanStance:
      "Hiding advanced technology behind natural, supportive conversations and quiet interfaces.",
    quote:
      "Simplicity is the ultimate sophistication. Complexity is easy; clarity is hard.",
  },
  {
    id: "symbiosis",
    icon: <Cpu className="w-4 h-4" />,
    title: "Human Symbiosis over Automation",
    opposite: "Replacement & Displacement",
    description:
      "We do not design systems to replace the writer, the architect, or the learner. We build tools that deepen human reflection, spark imagination, and expand decision capacity.",
    viyaanStance:
      "AI as a cognitive amplifier that partners with human psychology and creativity.",
    quote:
      "Technology should not take our place. It should show us what we are capable of becoming.",
  },
  {
    id: "trust",
    icon: <ShieldCheck className="w-4 h-4" />,
    title: "Long-Term Trust over Attention",
    opposite: "Retention Hacking",
    description:
      "We measure our success not by hours scrolled, but by goals reached, habits reinforced, and emotional clarity gained. Our systems have zero retention-hacking loops.",
    viyaanStance:
      "Complete data ownership for users, long-term context memory, and secure local processing.",
    quote:
      "Trust is the only currency that does not depreciate in times of rapid technological shift.",
  },
];

export default function PhilosophySelector() {
  const [selectedId, setSelectedId] = useState(philosophyItems[0].id);
  const activeItem =
    philosophyItems.find((item) => item.id === selectedId) || philosophyItems[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-white/[0.05] bg-[#09090C]/60 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
      {/* Left side: Navigation / Toggles */}
      <div className="lg:col-span-5 flex flex-col gap-2 justify-center">
        {philosophyItems.map((item) => {
          const isActive = item.id === selectedId;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center gap-3.5 cursor-pointer ${
                isActive
                  ? "bg-white/[0.06] border-white/[0.12] text-white"
                  : "bg-transparent border-transparent text-neutral-400 hover:bg-white/[0.02] hover:text-neutral-200"
              }`}
            >
              <div
                className={`p-2 rounded-lg transition-colors shrink-0 ${
                  isActive
                    ? "bg-[#0066FF] text-white"
                    : "bg-white/[0.04] text-neutral-400"
                }`}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-medium text-sm leading-snug truncate">
                  {item.title}
                </p>
                <p className="text-[11px] text-neutral-500 line-through decoration-neutral-600 mt-0.5">
                  {item.opposite}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right side: Detailed Philosophy Description */}
      <div className="lg:col-span-7 flex flex-col justify-between min-h-[320px] bg-[#050505]/60 border border-white/[0.05] rounded-xl p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5"
          >
            <div>
              <span className="text-xs text-[#00B2FF] font-sans tracking-wide">
                Foundational Principle
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-white mt-1">
                {activeItem.title}
              </h3>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed font-sans">
              {activeItem.description}
            </p>

            <div className="border-l-2 border-[#0066FF] pl-4 py-1">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-sans block">
                How We Practice This
              </span>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 leading-relaxed font-sans">
                {activeItem.viyaanStance}
              </p>
            </div>

            <blockquote className="border-t border-white/[0.05] pt-5 mt-1 text-neutral-400 font-serif italic text-xs sm:text-sm leading-relaxed">
              &ldquo;{activeItem.quote}&rdquo;
            </blockquote>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
