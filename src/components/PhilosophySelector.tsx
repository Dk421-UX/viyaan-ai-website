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
    icon: <Compass className="w-5 h-5" />,
    title: "Deep Research over Trends",
    opposite: "Hype Cycle Hunting",
    description: "Traditional firms rush to build wrapping shells around the latest API updates. We invest in architectural groundwork, custom frameworks, and biological models that outlive version increments.",
    viyaanStance: "Building structural intelligence that serves as a permanent foundation for human-technology collaboration.",
    quote: "True innovation happens when we stop building for tomorrow and start building for decades.",
  },
  {
    id: "quality",
    icon: <Award className="w-5 h-5" />,
    title: "Quality over Quantity",
    opposite: "Feature Churning",
    description: "Instead of releasing dozens of half-finished utilities that demand user attention, we build cohesive environments like JOI and Human OS that fit seamlessly into human routines.",
    viyaanStance: "Meticulously crafting every pixel, interaction, and database memory structure to respect human attention.",
    quote: "Craftsmanship is not about how much you can build, but what you choose to leave out.",
  },
  {
    id: "simplicity",
    icon: <Zap className="w-5 h-5" />,
    title: "Simplicity over Complexity",
    opposite: "Technological Overwhelm",
    description: "Artificial Intelligence does not need to look like a cockpit. By stripping away sci-fi glowing rings and terminal aesthetics, we create interfaces that feel organic and human.",
    viyaanStance: "Hiding advanced technology behind natural, supportive conversations and quiet interfaces.",
    quote: "Simplicity is the ultimate sophistication. Complexity is easy; clarity is hard.",
  },
  {
    id: "symbiosis",
    icon: <Cpu className="w-5 h-5" />,
    title: "Human Symbiosis over Automation",
    opposite: "Replacement & Displacement",
    description: "We do not design systems to replace the writer, the architect, or the learner. We build tools that deepen human reflection, spark imagination, and expand decision capacity.",
    viyaanStance: "AI as a cognitive amplifier that partners with human psychology and creativity.",
    quote: "Technology should not take our place. It should show us what we are capable of becoming.",
  },
  {
    id: "trust",
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Long-Term Trust over Attention",
    opposite: "Ad-revenue / Retention Hacking",
    description: "We measure our success not by hours scrolled, but by goals reached, habits reinforced, and emotional clarity gained. Our systems have zero retention-hacking loops.",
    viyaanStance: "Complete data ownership for users, long-term context memory, and secure local processing.",
    quote: "Trust is the only currency that does not depreciate in times of rapid technological shift.",
  },
];

export default function PhilosophySelector() {
  const [selectedId, setSelectedId] = useState(philosophyItems[0].id);
  const activeItem = philosophyItems.find((item) => item.id === selectedId) || philosophyItems[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-neutral-900 bg-neutral-950/40 p-6 rounded-2xl blueprint-grid">
      {/* Left side: Navigation / Toggles */}
      <div className="lg:col-span-5 flex flex-col gap-3 justify-center">
        {philosophyItems.map((item) => {
          const isActive = item.id === selectedId;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 ${
                isActive
                  ? "bg-neutral-900/80 border-neutral-800 text-white shadow-md shadow-black/40"
                  : "bg-transparent border-transparent text-neutral-400 hover:bg-neutral-900/20 hover:text-neutral-200"
              }`}
            >
              <div
                className={`p-2.5 rounded-lg transition-colors ${
                  isActive ? "bg-viyaan-blue text-white" : "bg-neutral-900 text-neutral-500"
                }`}
              >
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="font-display font-medium text-sm md:text-base leading-snug">
                  {item.title}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5 line-through decoration-neutral-600">
                  {item.opposite}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right side: Detailed Philosophy Description */}
      <div className="lg:col-span-7 flex flex-col justify-between min-h-[350px] bg-neutral-900/40 border border-neutral-900/80 rounded-xl p-6 md:p-8 backdrop-blur-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            <div>
              <span className="text-xs text-viyaan-cyan font-mono tracking-widest uppercase">
                Core Principle
              </span>
              <h3 className="font-display text-xl md:text-2xl font-semibold text-white mt-1">
                {activeItem.title}
              </h3>
            </div>

            <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
              {activeItem.description}
            </p>

            <div className="border-l-2 border-viyaan-blue pl-4 py-1 bg-neutral-950/30 rounded-r-md">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
                How We Practice This
              </span>
              <p className="text-xs md:text-sm text-neutral-400 mt-1 leading-relaxed">
                {activeItem.viyaanStance}
              </p>
            </div>

            <blockquote className="border-t border-neutral-900 pt-6 mt-2 text-neutral-400 italic text-xs md:text-sm leading-relaxed">
              &ldquo;{activeItem.quote}&rdquo;
            </blockquote>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
