"use client";

import React from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import SiteContainer from "@/components/SiteContainer";
import PageIntro from "@/components/PageIntro";
import BackNav from "@/components/BackNav";
import { ArrowUpRight, Cpu } from "lucide-react";

interface LabClientProps {
  projects: any[];
}

export default function LabClient({ projects }: LabClientProps) {
  return (
    <div className="relative min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col overflow-x-hidden selection:bg-[#0066FF]/30">
      <Navigation />

      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#00B2FF]/6 to-transparent blur-[140px] pointer-events-none -z-10" />

      <main className="flex-1 page-header-offset">
        <SiteContainer>
          {/* Back navigation */}
          <BackNav label="Back" fallbackHref="/" />

          {/* Editorial Page Introduction */}
          <PageIntro
            eyebrow="Innovation Lab"
            title="Experimental Instruments"
            description="Exploratory algorithms, internal utility toolchains, and interactive engineering demonstrations developed in public with rigorous telemetry."
            className="mb-12 sm:mb-16"
          />

          {/* Instruments Grid or Intentional Incubations Card */}
          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="surface-card surface-card-hover p-6 sm:p-7 flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs text-neutral-500 font-sans border-b border-white/[0.05] pb-3">
                      <span className="uppercase tracking-wider text-[10px] font-mono text-neutral-400">
                        {proj.type || "Instrument"}
                      </span>
                      <span className="flex items-center gap-1.5 text-[#00B2FF] text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00B2FF]" />
                        <span>{proj.statusText || "Active"}</span>
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <h3 className="font-display font-semibold text-lg text-white">
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
                      className="cta-secondary text-xs w-full justify-between"
                    >
                      <span>Request sandbox access</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Deliberate, Well-Proportioned Active Incubations Card */
            <div className="surface-card p-8 sm:p-10 max-w-2xl mx-auto flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#00B2FF]">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  Active Incubation
                </span>
              </div>

              <h3 className="font-display font-semibold text-xl text-white">
                Attendance Intelligence & Spatial Continuity Models
              </h3>

              <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
                Our exploratory tools—including Attendance Intelligence risk modeling engines and personal continuity mapping frameworks—are currently undergoing internal verification. Request sandbox access to preview pre-release builds.
              </p>

              <div className="pt-2">
                <Link
                  href="/contact?subject=Lab+Sandbox+Access"
                  className="cta-primary"
                >
                  <span>Request Early Sandbox Access</span>
                </Link>
              </div>
            </div>
          )}
        </SiteContainer>
      </main>

      <NewsletterSection />
      <Footer />
    </div>
  );
}
