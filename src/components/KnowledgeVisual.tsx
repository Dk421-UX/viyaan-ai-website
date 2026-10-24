"use client";

import React, { useState } from "react";
import { BookOpen, Search, BrainCircuit, Lightbulb, Compass, ShieldCheck } from "lucide-react";

export default function KnowledgeVisual() {
  const [activeNode, setActiveNode] = useState<number>(0);

  const nodes = [
    {
      id: 0,
      title: "Context Ingestion",
      tag: "Source Documents",
      desc: "Course syllabi, lecture notes, and textbooks parsed into structured knowledge units.",
      icon: BookOpen,
      color: "#38BDF8",
    },
    {
      id: 1,
      title: "Semantic Retrieval",
      tag: "RAG Pipeline",
      desc: "Embedding search extracts relevant concepts and anchors answers directly in source material.",
      icon: Search,
      color: "#00B2FF",
    },
    {
      id: 2,
      title: "Cognitive Reflection",
      tag: "Self-Diagnosis",
      desc: "Identifies study gaps, tracks revision consistency, and evaluates subject confidence.",
      icon: BrainCircuit,
      color: "#A855F7",
    },
    {
      id: 3,
      title: "Independent Thinking",
      tag: "Deep Retention",
      desc: "Transforms raw answers into conceptual mastery and independent problem-solving skills.",
      icon: Lightbulb,
      color: "#10B981",
    },
  ];

  return (
    <div className="w-full surface-card p-6 sm:p-7 relative overflow-hidden border border-white/[0.09] bg-gradient-to-b from-[#081228]/80 to-[#040816]/90">
      {/* Subtle ambient glow behind diagram */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-44 bg-[#0066FF]/10 blur-[80px] pointer-events-none -z-10" />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5 mb-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00B2FF] animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-300">
            Intelligent Learning Architecture
          </span>
        </div>
        <span className="text-[10px] font-mono text-neutral-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
          Interactive Flow
        </span>
      </div>

      {/* 4 Interactive Flow Stages */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          const isActive = activeNode === index;

          return (
            <button
              key={node.id}
              onClick={() => setActiveNode(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveNode(index);
                }
              }}
              className={`text-left p-3.5 rounded-lg border transition-all cursor-pointer relative ${
                isActive
                  ? "bg-white/[0.06] border-[#00B2FF]/60 shadow-[0_0_20px_rgba(0,178,255,0.15)]"
                  : "bg-white/[0.015] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
              }`}
              aria-pressed={isActive}
              aria-label={`Step ${index + 1}: ${node.title}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="w-7 h-7 rounded-md flex items-center justify-center"
                  style={{
                    backgroundColor: `${node.color}15`,
                    color: node.color,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] font-mono text-neutral-400">0{index + 1}</span>
              </div>

              <h4 className="font-display font-medium text-xs text-white tracking-tight">
                {node.title}
              </h4>
              <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
                {node.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Detail Card */}
      <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-300 font-sans">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#00B2FF] shrink-0" />
          <span>{nodes[activeNode].desc}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-mono text-neutral-400 bg-white/[0.02] px-2.5 py-1 rounded border border-white/[0.06]">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Evidence-Grounded</span>
        </div>
      </div>
    </div>
  );
}
