"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface FounderClientProps {
  company: any;
}

export default function FounderClient({ company }: FounderClientProps) {
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E4E4E7] flex flex-col overflow-x-hidden">
      <Navigation />

      <main className="flex-1 flex flex-col justify-center items-center px-5 sm:px-6 md:px-12 pt-[calc(8.5rem+env(safe-area-inset-top))] pb-12 md:pt-44 md:pb-24 blueprint-dots animate-fade-in animate-duration-500">
        <div className="w-full max-w-5xl flex flex-col gap-5 md:gap-12">
          
          {/* Back Navigation */}
          <div className="w-full flex justify-center my-6">
            <a
              href="/"
              onClick={handleBack}
              aria-label="Go back"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-800 bg-neutral-950/80 text-[11px] font-mono text-neutral-400 hover:text-white hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-200 cursor-pointer focus-visible:outline-none select-none"
              style={{ minHeight: '44px' }}
            >
              <span className="text-sm leading-none" aria-hidden="true">←</span>
              <span className="tracking-widest uppercase">Back</span>
            </a>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: Founder Portrait (Visual Focus) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-2xl overflow-hidden border border-neutral-900 bg-neutral-950 p-1.5">
                <div className="w-full h-full rounded-xl overflow-hidden relative grayscale transition-all duration-500 hover:grayscale-0">
                  <Image
                    src={company?.founderImage || "/founder.jpeg"}
                    alt="Dharani Kumar — Founder of Viyaan AI"
                    fill
                    sizes="(max-width: 768px) 340px, 340px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Right: Info & Description */}
            <div className="lg:col-span-7 flex flex-col gap-6 lg:pl-6">
              <div className="flex flex-col gap-2">
                <h1 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-white leading-tight">
                  Dharani Kumar
                </h1>
              </div>

              <p className="font-sans text-sm sm:text-base text-neutral-400 leading-relaxed">
                Viyaan AI is not built behind hidden doors. We design publicly, sharing our challenges, research papers, engineering decisions, and daily lessons. This transparency keeps us disciplined, accountable, and deeply connected with our community.
              </p>

              <div className="border-t border-neutral-900 pt-6 flex flex-col gap-4">
                <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                  Core Mandate
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed text-neutral-400">
                  <div>
                    <h4 className="font-semibold text-white mb-1 font-mono uppercase tracking-wider text-[11px]">Craftsmanship</h4>
                    <p>Refusing to ship code we aren't proud of. Obsessing over latency, design logic, and privacy protocols.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1 font-mono uppercase tracking-wider text-[11px]">Accountability</h4>
                    <p>Documenting our research findings, code repositories, and roadmap details openly.</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <a
                  href={company?.linkedinFounder || "https://www.linkedin.com/in/dharani-kumar-49622b349"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-11 px-5 rounded-lg bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition-colors focus-visible:outline-none"
                >
                  LinkedIn
                </a>
                <a
                  href={company?.twitterFounder || "https://x.com/by_dharani"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-11 px-5 rounded-lg bg-neutral-950 border border-neutral-850 text-white font-mono text-xs font-semibold hover:border-neutral-800 hover:bg-neutral-950 transition-all focus-visible:outline-none"
                >
                  Twitter X
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
