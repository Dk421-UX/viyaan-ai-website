"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trackProductCardClick, trackProductDetailsOpened } from "@/analytics/events";
import BackNav from "@/components/BackNav";
import { ArrowUpRight, Check } from "lucide-react";

interface ProductsClientProps {
  products: any[];
}

export default function ProductsClient({ products }: ProductsClientProps) {
  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E4E4E7] flex flex-col overflow-x-hidden selection:bg-[#0066FF]/30">
      <Navigation />

      {/* Atmospheric ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#0066FF]/8 via-transparent to-transparent blur-[140px] pointer-events-none -z-10" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-5 sm:px-8 page-content-offset pb-20 flex flex-col gap-10 sm:gap-12">
        {/* Back navigation */}
        <BackNav label="Back" fallbackHref="/" />

        {/* Editorial Header */}
        <div className="flex flex-col gap-3.5 max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-[#00B2FF] font-sans">
            Products
          </span>
          <h1 className="font-display font-semibold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            Systems designed around human cognition.
          </h1>
          <p className="font-sans text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl">
            A cohesive cognitive architecture supporting emotional awareness, self-understanding, and future-self continuity.
          </p>
        </div>

        {/* Products Grid / Specifications */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {products.map((p) => {
              const productName = p.title || p.name;
              const productUrl = p.url || "#";
              const isJoi = p.id?.includes("joi");
              const isHuman = p.id?.includes("human");
              const category = isJoi ? "Emotion" : isHuman ? "Cognition" : "Continuity";
              const accentColor = isJoi ? "#10B981" : isHuman ? "#00B2FF" : "#A855F7";

              return (
                <div
                  key={p.id}
                  className="group relative flex flex-col p-6 sm:p-7 rounded-2xl border border-white/[0.06] bg-[#09090C]/80 hover:bg-[#0E0E14] hover:border-white/[0.14] transition-all duration-300 h-auto"
                >
                  {/* Header: Category & Active status */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-[11px] font-sans uppercase tracking-wider px-2 py-0.5 rounded border border-white/[0.08] bg-white/[0.02]"
                      style={{ color: accentColor }}
                    >
                      {category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-neutral-500 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Active</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="flex flex-col gap-2">
                    <h2 className="font-display font-semibold text-lg sm:text-xl text-white group-hover:text-white transition-colors">
                      {productName}
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Features checklist */}
                  {p.features && Array.isArray(p.features) && p.features.length > 0 && (
                    <div className="flex flex-col gap-2 mt-4 pt-3.5 border-t border-white/[0.05]">
                      {p.features.slice(0, 3).map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-neutral-400 font-sans">
                          <Check className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Launch action */}
                  <div className="mt-5 pt-4 border-t border-white/[0.06]">
                    <a
                      href={productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackProductCardClick(p.id, productName);
                        trackProductDetailsOpened(p.id, productName);
                      }}
                      className="group/link inline-flex items-center gap-2 text-xs sm:text-[13px] font-medium text-white hover:text-[#00B2FF] font-sans transition-colors py-1 focus-visible:outline-none"
                    >
                      <span>Launch platform</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover/link:text-[#00B2FF] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-200" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Intentional, Museum-grade Empty State */
          <div className="p-12 sm:p-16 rounded-2xl border border-white/[0.06] bg-[#09090C]/40 text-center flex flex-col items-center gap-4 max-w-xl mx-auto">
            <span className="w-2 h-2 rounded-full bg-[#00B2FF]" />
            <h3 className="font-display font-semibold text-xl sm:text-2xl text-white">
              Systems in Deployment
            </h3>
            <p className="text-sm text-neutral-400 font-sans leading-relaxed">
              Our core platforms—JOI Companion AI, Human OS, and Viyaan Future—are currently transitioning into public availability. Please check back shortly or connect directly with our engineering team.
            </p>
            <Link href="/contact" className="cta-secondary mt-2">
              <span>Contact Engineering</span>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
