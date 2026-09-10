"use client";

import React from "react";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import SiteContainer from "@/components/SiteContainer";
import BackNav from "@/components/BackNav";
import { ArrowUpRight, ShieldCheck, Hammer } from "lucide-react";

interface FounderClientProps {
  company: any;
}

export default function FounderClient({ company }: FounderClientProps) {
  const founderImage = company?.founderImage || "/founder.jpeg";
  const linkedin = company?.linkedinFounder || "https://www.linkedin.com/in/dharani-kumar-49622b349";
  const twitter = company?.twitterFounder || "https://x.com/by_dharani";

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col overflow-x-hidden selection:bg-[#0066FF]/30">
      <Navigation />

      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-white/[0.03] to-transparent blur-[140px] pointer-events-none -z-10" />

      <main className="flex-1 page-header-offset">
        <SiteContainer>
          {/* Back navigation */}
          <BackNav label="Back" fallbackHref="/" />

          {/* Balanced 2-Column Desktop Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: Cinema Portrait */}
            <div className="lg:col-span-4 lg:col-start-2 flex flex-col items-center sm:items-start">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] rounded-xl overflow-hidden border border-white/[0.08] bg-[#0A0A0E]">
                <Image
                  src={founderImage}
                  alt="Dharani Kumar — Founder of Viyaan AI"
                  fill
                  sizes="(max-width: 640px) 280px, 320px"
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  priority
                />
              </div>

              <div className="mt-3 text-xs text-neutral-500 font-sans">
                <span>Chennai, India & Remote</span>
              </div>
            </div>

            {/* Right Column: Editorial Narrative & Mandates */}
            <div className="lg:col-span-6 flex flex-col gap-6 max-w-2xl">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#00B2FF] font-mono font-medium">
                  Founding Architect
                </span>
                <h1 className="font-display font-semibold text-3xl sm:text-4xl text-white tracking-[-0.035em]">
                  Dharani Kumar
                </h1>
              </div>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
                Viyaan AI is not built behind closed doors or driven by quarterly venture hype. We design and build in public, publishing our engineering benchmarks, cognitive models, architecture papers, and daily lessons.
              </p>

              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                Our conviction is simple: Artificial Intelligence must be designed around human psychology and attention, not retention loops. Systems like JOI, Human OS, and Viyaan Future represent our commitment to building permanent foundations for human-computer symbiosis.
              </p>

              {/* Foundational Mandates */}
              <div className="border-t border-white/[0.06] pt-6 flex flex-col gap-3.5">
                <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-mono">
                  Foundational Mandates
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="surface-card p-5 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-white text-xs font-medium font-sans">
                      <Hammer className="w-3.5 h-3.5 text-[#00B2FF]" />
                      <span>Craftsmanship</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                      Refusing to ship code we aren't proud of. Obsessing over latency, interaction ergonomics, and privacy protocols.
                    </p>
                  </div>

                  <div className="surface-card p-5 flex flex-col gap-2">
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

              {/* Connect Links */}
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-primary"
                >
                  <span>LinkedIn Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </a>
                <a
                  href={twitter}
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
        </SiteContainer>
      </main>

      <NewsletterSection />
      <Footer />
    </div>
  );
}
