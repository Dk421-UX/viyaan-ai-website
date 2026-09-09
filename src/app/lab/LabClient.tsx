"use client";

import React from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BackNav from "@/components/BackNav";
import { ArrowUpRight, Cpu } from "lucide-react";

interface LabClientProps {
  projects: any[];
}

export default function LabClient({ projects }: LabClientProps) {
  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E4E4E7] flex flex-col overflow-x-hidden selection:bg-[#0066FF]/30">
      <Navigation />

      {/* Atmospheric ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#00B2FF]/6 via-transparent to-transparent blur-[140px] pointer-events-none -z-10" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-5 sm:px-8 page-content-offset pb-20 flex flex-col gap-10 sm:gap-12">
        {/* Back navigation */}
        <BackNav label="Back" fallbackHref="/" />

        {/* Editorial Header */}
        <div className="flex flex-col gap-4 max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-[#00B2FF] font-sans">
            Innovation Lab
          </span>
          <h1 className="font-display font-semibold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            Experimental Instruments
          </h1>
          <p className="font-sans text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl">
            Where exploratory algorithms, internal utility toolchains, and interactive engineering demonstrations are developed in public with rigorous telemetry and human ergonomics.
          </p>
        </div>

        {/* Modular Lab Instruments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects && projects.length > 0 ? (
            projects.map((proj) => (
              <div
                key={proj.id}
                className="flex flex-col justify-between p-7 sm:p-8 rounded-2xl border border-white/[0.06] bg-[#09090C]/60 hover:bg-[#0E0E14] hover:border-white/[0.14] transition-all duration-300 min-h-[260px]"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-xs text-neutral-500 font-sans border-b border-white/[0.05] pb-3">
                    <span className="uppercase tracking-wider text-[11px] text-neutral-400">
                      {proj.type || "Instrument"}
                    </span>
                    <span className="flex items-center gap-1.5 text-[#00B2FF]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00B2FF]" />
                      <span>{proj.statusText || "Active"}</span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-display font-semibold text-xl text-white">
                      {proj.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.05]">
                  <Link
                    href={`/contact?subject=${encodeURIComponent(`Lab Access: ${proj.title}`)}`}
                    className="cta-secondary w-full justify-between"
                  >
                    <span>Request sandbox access</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-10 sm:p-14 rounded-2xl border border-white/[0.06] bg-[#09090C]/40 text-center flex flex-col items-center gap-4 max-w-xl mx-auto">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#00B2FF]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-xl text-white">
                Active Incubations
              </h3>
              <p className="text-sm text-neutral-400 font-sans leading-relaxed">
                Our exploratory tools—including Attendance Intelligence models and cognitive mapping frameworks—are currently undergoing internal verification. Request sandbox access to preview pre-release builds.
              </p>
              <Link
                href="/contact?subject=Lab+Sandbox+Access"
                className="cta-primary mt-2"
              >
                <span>Request Early Access</span>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
