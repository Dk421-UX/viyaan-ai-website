"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, RefreshCw, BrainCircuit, Sparkles, ShieldCheck, Compass } from "lucide-react";

interface PillarItem {
  id: string;
  icon: React.ReactNode;
  pillar: string;
  subtitle: string;
  opposite: string;
  description: string;
  engineeringImplementation: string;
  verifiableValue: string;
}

const learningPillars: PillarItem[] = [
  {
    id: "understand",
    icon: <BookOpen className="w-4 h-4 text-[#38BDF8]" />,
    pillar: "UNDERSTAND",
    subtitle: "Understanding over Memorization",
    opposite: "Passive Rote Memorization",
    description:
      "Learning begins when concepts click, not when answers are recited. We design AI that breaks down multi-layered technical concepts, grounds explanations in curriculum source material, and fosters foundational conceptual clarity.",
    engineeringImplementation:
      "Context-grounded semantic retrieval (ExamRAG) parsing source textbooks and syllabi to provide verifiable explanations with source citations.",
    verifiableValue:
      "Learners connect definitions to underlying principles rather than copying output blindly.",
  },
  {
    id: "revise",
    icon: <RefreshCw className="w-4 h-4 text-[#00B2FF]" />,
    pillar: "REVISE",
    subtitle: "Structure over Clutter",
    opposite: "Scattered Cramming",
    description:
      "Effective revision requires structured recall and high-signal synthesis. Our tools make key definitions, formula derivations, and past questions effortlessly searchable and structured for high-retention review.",
    engineeringImplementation:
      "High-density hierarchical chunking and reranking engines that surface exact concepts when exam deadlines approach.",
    verifiableValue:
      "Systematic study sessions that replace chaotic all-nighters with targeted concept review.",
  },
  {
    id: "reflect",
    icon: <BrainCircuit className="w-4 h-4 text-[#A855F7]" />,
    pillar: "REFLECT",
    subtitle: "Self-Diagnosis over Guesswork",
    opposite: "Uncertain Exam Anxiety",
    description:
      "Learners need an honest mirror for their study habits. By reflecting on consistency, confidence gaps, and revision patterns, students gain realistic insights into where their preparation stands.",
    engineeringImplementation:
      "Interactive self-assessment diagnostic engines (EXAMORACLE) that analyze habit consistency and study distributions without claiming ungrounded score certainty.",
    verifiableValue:
      "Students identify blind spots early in the semester when there is still time to adjust.",
  },
  {
    id: "think",
    icon: <Sparkles className="w-4 h-4 text-[#10B981]" />,
    pillar: "THINK INDEPENDENTLY",
    subtitle: "Agency over AI Dependence",
    opposite: "Passive Answer Copying",
    description:
      "Technology should strengthen the human learner, not replace human judgment. We design interfaces that prompt learners to verify, test their own logic, and formulate independent solutions.",
    engineeringImplementation:
      "Socratic explanation modes, confidence self-checks, and clear reminders to verify AI-generated answers against original textbooks.",
    verifiableValue:
      "Students graduate from seeking answers to mastering the discipline of problem-solving.",
  },
];

export default function PhilosophySelector() {
  const [selectedId, setSelectedId] = useState(learningPillars[0].id);
  const activeItem =
    learningPillars.find((item) => item.id === selectedId) || learningPillars[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 border border-white/[0.08] bg-[#070E22]/70 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
      {/* Left side: Navigation / Toggles */}
      <div className="lg:col-span-5 flex flex-col gap-2.5 justify-center" role="tablist" aria-label="Learning Pillars">
        {learningPillars.map((item) => {
          const isActive = item.id === selectedId;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${item.id}`}
              id={`tab-${item.id}`}
              onClick={() => setSelectedId(item.id)}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-200 flex items-center gap-3.5 cursor-pointer ${
                isActive
                  ? "bg-white/[0.07] border-[#00B2FF]/40 text-white shadow-lg shadow-black/20"
                  : "bg-transparent border-transparent text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-200"
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
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-xs tracking-wider text-white">
                    {item.pillar}
                  </span>
                  <span className="text-[10px] font-mono text-[#00B2FF]">
                    {isActive ? "Active Principle" : ""}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 font-sans mt-0.5 truncate">
                  {item.subtitle}
                </p>
                <p className="text-[10px] text-neutral-400 line-through decoration-neutral-500 font-mono mt-0.5">
                  vs {item.opposite}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right side: Detailed Philosophy Description */}
      <div
        className="lg:col-span-7 flex flex-col justify-between min-h-[340px] bg-[#050B1B]/80 border border-white/[0.07] rounded-xl p-6 sm:p-8"
        role="tabpanel"
        id={`panel-${activeItem.id}`}
        aria-labelledby={`tab-${activeItem.id}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-5"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Compass className="w-3.5 h-3.5 text-[#00B2FF]" />
                <span className="text-xs text-[#00B2FF] font-mono tracking-wider uppercase font-medium">
                  Learning Pillar • {activeItem.pillar}
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-white">
                {activeItem.subtitle}
              </h3>
            </div>

            <p className="text-sm text-neutral-200 leading-relaxed font-sans">
              {activeItem.description}
            </p>

            <div className="border-l-2 border-[#0066FF] pl-4 py-1.5 bg-white/[0.015] rounded-r-lg">
              <span className="text-[11px] text-[#38BDF8] uppercase tracking-wider font-mono font-medium block">
                How We Engineer This
              </span>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1 leading-relaxed font-sans">
                {activeItem.engineeringImplementation}
              </p>
            </div>

            <div className="border-t border-white/[0.07] pt-4 mt-1 flex items-center justify-between text-xs text-neutral-300 font-sans">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{activeItem.verifiableValue}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
