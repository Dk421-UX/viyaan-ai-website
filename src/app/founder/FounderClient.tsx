"use client";

import React from "react";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BackNav from "@/components/BackNav";
import { ArrowUpRight, ShieldCheck, Hammer } from "lucide-react";

interface FounderClientProps {
  company: any;
}

export default function FounderClient({ company }: FounderClientProps) {
  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E4E4E7] flex flex-col overflow-x-hidden selection:bg-[#0066FF]/30">
      <Navigation />

      {/* Warm human ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-white/[0.03] to-transparent blur-[140px] pointer-events-none -z-10" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-5 sm:px-8 page-content-offset pb-20 flex flex-col gap-10 sm:gap-12">
        {/* Back navigation */}
        <BackNav label="Back" fallbackHref="/" />

        {/* Editorial Layout: Portrait + Prose */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: Cinema Portrait */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#09090C] p-2 shadow-2xl">
              <div className="w-full h-full rounded-xl overflow-hidden relative">
                <Image
                  src={company?.founderImage || "/founder.jpeg"}
                  alt="Dharani Kumar — Founder of Viyaan AI"
                  fill
                  sizes="(max-width: 768px) 340px, 340px"
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  priority
                />
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs text-neutral-500 font-sans">
                Chennai, India & Remote
              </span>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs uppercase tracking-widest text-[#00B2FF] font-sans">
                Founding Architect
              </span>
              <h1 className="font-display font-semibold text-3xl sm:text-5xl tracking-tight text-white">
                Dharani Kumar
              </h1>
            </div>

            <p className="text-base text-neutral-300 leading-relaxed font-sans">
              Viyaan AI is not built behind closed doors or driven by quarterly venture hype. We design and build in public, publishing our engineering benchmarks, cognitive models, architecture papers, and daily lessons.
            </p>

            <p className="text-sm text-neutral-400 leading-relaxed font-sans">
              Our conviction is simple: Artificial Intelligence must be designed around human psychology and attention, not retention loops. Systems like JOI, Human OS, and Viyaan Future represent our commitment to building permanent foundations for human-computer symbiosis.
            </p>

            {/* Foundational Mandates */}
            <div className="border-t border-white/[0.06] pt-6 flex flex-col gap-4">
              <span className="text-xs uppercase tracking-wider text-neutral-500 font-sans block">
                Foundational Mandates
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-white/[0.06] bg-[#09090C]/60 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-white text-xs font-medium font-sans">
                    <Hammer className="w-3.5 h-3.5 text-[#00B2FF]" />
                    <span>Craftsmanship</span>
                  </div>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                    Refusing to ship code we aren't proud of. Obsessing over latency, interaction ergonomics, and data privacy protocols.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-white/[0.06] bg-[#09090C]/60 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-white text-xs font-medium font-sans">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Accountability</span>
                  </div>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                    Documenting our research findings, algorithms, and roadmap openly with zero marketing distortion.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Connect Actions */}
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={company?.linkedinFounder || "https://www.linkedin.com/in/dharani-kumar-49622b349"}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary"
              >
                <span>LinkedIn Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              </a>
              <a
                href={company?.twitterFounder || "https://x.com/by_dharani"}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary"
              >
                <span>Twitter / X</span>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
