"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import SiteContainer from "@/components/SiteContainer";
import PageIntro from "@/components/PageIntro";
import BackNav from "@/components/BackNav";
import {
  ArrowUpRight,
  Calculator,
  Info,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

interface LabClientProps {
  projects: any[];
}

export default function LabClient({ projects }: LabClientProps) {
  // Interactive Attendance Intelligence Sandbox Calculator
  const [conducted, setConducted] = useState<number>(40);
  const [attended, setAttended] = useState<number>(32);
  const [targetThreshold, setTargetThreshold] = useState<number>(75);

  const currentPercent = conducted > 0 ? (attended / conducted) * 100 : 0;
  const targetFraction = targetThreshold / 100;

  let marginClassesToBunk = 0;
  let classesNeededToCatchUp = 0;
  let statusMode: "safe" | "marginal" | "critical" = "safe";

  if (currentPercent >= targetThreshold) {
    // Can miss up to M classes: (attended) / (conducted + M) >= targetFraction
    // attended >= targetFraction * conducted + targetFraction * M
    // M <= (attended - targetFraction * conducted) / targetFraction
    marginClassesToBunk = Math.max(
      0,
      Math.floor((attended - targetFraction * conducted) / targetFraction)
    );
    statusMode = currentPercent > targetThreshold + 5 ? "safe" : "marginal";
  } else {
    // Need to attend N consecutive classes: (attended + N) / (conducted + N) >= targetFraction
    // attended + N >= targetFraction * conducted + targetFraction * N
    // N * (1 - targetFraction) >= targetFraction * conducted - attended
    // N >= (targetFraction * conducted - attended) / (1 - targetFraction)
    if (targetFraction < 1) {
      classesNeededToCatchUp = Math.max(
        0,
        Math.ceil((targetFraction * conducted - attended) / (1 - targetFraction))
      );
    }
    statusMode = "critical";
  }

  return (
    <div className="relative min-h-screen bg-[#040711] text-[#FFFFFF] flex flex-col overflow-x-hidden selection:bg-[#0066FF]/35">
      <Navigation />

      {/* Atmospheric ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#0066FF]/12 via-[#00B2FF]/6 to-transparent blur-[160px] pointer-events-none -z-10" />

      <main className="flex-1 page-header-offset">
        <SiteContainer>
          {/* Back navigation */}
          <BackNav label="Back to Home" fallbackHref="/" />

          {/* Editorial Page Introduction */}
          <PageIntro
            eyebrow="Innovation Lab & Sandbox"
            title="Interactive Learning Instruments & Prototypes"
            description="Exploratory algorithms, retrieval pipelines, and student productivity calculators built in public with transparent assumptions and verifiable utility."
            className="mb-10 sm:mb-14"
          />

          {/* INTERACTIVE DEMO: ATTENDANCE INTELLIGENCE SANDBOX */}
          <div className="surface-card p-6 sm:p-8 mb-16 border border-[#00B2FF]/30 bg-gradient-to-b from-[#08132C]/80 to-[#040816]/90 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#00B2FF]/15 border border-[#00B2FF]/30 flex items-center justify-center text-[#00B2FF]">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-white">
                    Attendance Intelligence Sandbox
                  </h3>
                  <span className="text-[11px] font-mono text-[#38BDF8]">
                    Interactive Margin Calculator • Institutional Baseline Simulator
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-neutral-400 bg-white/[0.04] px-2.5 py-1 rounded border border-white/[0.08] self-start sm:self-auto">
                Live Interactive Instrument
              </span>
            </div>

            {/* Inputs & Calculation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Inputs Form */}
              <div className="md:col-span-6 flex flex-col gap-4">
                <div>
                  <label htmlFor="conducted-classes" className="block text-xs font-mono text-neutral-300 uppercase tracking-wider mb-1.5">
                    Total Classes Conducted: {conducted}
                  </label>
                  <input
                    id="conducted-classes"
                    type="range"
                    min="1"
                    max="100"
                    value={conducted}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setConducted(val);
                      if (attended > val) setAttended(val);
                    }}
                    className="w-full accent-[#00B2FF] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-1">
                    <span>1 class</span>
                    <span>100 classes</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="attended-classes" className="block text-xs font-mono text-neutral-300 uppercase tracking-wider mb-1.5">
                    Classes Attended: {attended}
                  </label>
                  <input
                    id="attended-classes"
                    type="range"
                    min="0"
                    max={conducted}
                    value={attended}
                    onChange={(e) => setAttended(Number(e.target.value))}
                    className="w-full accent-[#00B2FF] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-1">
                    <span>0 classes</span>
                    <span>{conducted} classes</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="target-threshold" className="block text-xs font-mono text-neutral-300 uppercase tracking-wider mb-1.5">
                    Institutional Attendance Threshold: {targetThreshold}%
                  </label>
                  <div className="flex items-center gap-2">
                    {[70, 75, 80, 85].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setTargetThreshold(pct)}
                        className={`text-xs font-mono px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                          targetThreshold === pct
                            ? "bg-[#00B2FF] text-[#040711] font-bold border-[#00B2FF]"
                            : "bg-white/[0.04] text-neutral-300 border-white/[0.08] hover:bg-white/[0.08]"
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Real-time Calculation Outcome */}
              <div className="md:col-span-6 surface-card p-5 border border-white/[0.08] bg-[#040814]/90 flex flex-col justify-between min-h-[220px]">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Calculated Status
                    </span>
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded border flex items-center gap-1.5 ${
                        statusMode === "safe"
                          ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
                          : statusMode === "marginal"
                          ? "text-amber-400 border-amber-400/30 bg-amber-400/10"
                          : "text-rose-400 border-rose-400/30 bg-rose-400/10"
                      }`}
                    >
                      {statusMode === "safe" ? (
                        <ShieldCheck className="w-3.5 h-3.5" />
                      ) : (
                        <ShieldAlert className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {statusMode === "safe"
                          ? "Safe Margin"
                          : statusMode === "marginal"
                          ? "Tight Margin"
                          : "Attendance Deficit"}
                      </span>
                    </span>
                  </div>

                  <div>
                    <span className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                      {currentPercent.toFixed(1)}%
                    </span>
                    <span className="text-xs text-neutral-400 font-mono ml-2">
                      ({attended}/{conducted} classes)
                    </span>
                  </div>

                  <div className="text-xs text-neutral-200 font-sans leading-relaxed pt-2 border-t border-white/[0.06]">
                    {statusMode === "safe" || statusMode === "marginal" ? (
                      <p>
                        You can safely miss{" "}
                        <strong className="text-emerald-400 font-mono text-sm">
                          {marginClassesToBunk}
                        </strong>{" "}
                        more class{marginClassesToBunk === 1 ? "" : "es"} and still stay at or
                        above your target threshold of {targetThreshold}%.
                      </p>
                    ) : (
                      <p>
                        You need to attend the next{" "}
                        <strong className="text-rose-400 font-mono text-sm">
                          {classesNeededToCatchUp}
                        </strong>{" "}
                        consecutive class{classesNeededToCatchUp === 1 ? "" : "es"} without
                        absence to recover to your target threshold of {targetThreshold}%.
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-[10px] font-mono text-neutral-400 pt-3 border-t border-white/[0.06]">
                  Assumes standard institutional attendance ratio formula.
                </div>
              </div>
            </div>

            {/* Transparency Note */}
            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-start gap-2 text-xs text-neutral-400 font-sans">
              <Info className="w-4 h-4 text-[#00B2FF] shrink-0 mt-0.5" />
              <span>
                <strong>Threshold Transparency:</strong> Attendance Intelligence applies mathematical projection formulas based on user-entered class tallies. It does not interface with official university attendance servers unless an institutional API key is provided.
              </span>
            </div>
          </div>

          {/* ALL LAB INSTRUMENTS LIST */}
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="badge-education w-fit">Instruments Under Verification</span>
              <h3 className="font-display font-semibold text-2xl text-white">
                Experimental Research & Utility Toolchains
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects && projects.length > 0 ? (
                projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="surface-card surface-card-hover p-6 sm:p-7 flex flex-col justify-between"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 border-b border-white/[0.06] pb-3">
                        <span className="uppercase tracking-wider text-[10px] text-[#38BDF8]">
                          {proj.type || "Instrument"}
                        </span>
                        <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{proj.statusText || "Active Sandbox"}</span>
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <h4 className="font-display font-semibold text-lg text-white">
                          {proj.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                          {proj.description}
                        </p>
                      </div>

                      {proj.tags && proj.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {proj.tags.map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono text-neutral-400 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.06]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/[0.06]">
                      <Link
                        href={`/contact?subject=${encodeURIComponent(`Lab Sandbox Access: ${proj.title}`)}`}
                        className="cta-secondary text-xs w-full justify-between"
                      >
                        <span>Request Sandbox Access</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="surface-card p-8 col-span-2 text-center text-neutral-400 text-sm">
                  Lab instruments are undergoing verification. Check back shortly.
                </div>
              )}
            </div>
          </div>
        </SiteContainer>
      </main>

      <NewsletterSection />
      <Footer />
    </div>
  );
}
