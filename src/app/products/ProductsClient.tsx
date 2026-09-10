"use client";

import React from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import SiteContainer from "@/components/SiteContainer";
import PageIntro from "@/components/PageIntro";
import BackNav from "@/components/BackNav";
import { trackProductCardClick, trackProductDetailsOpened } from "@/analytics/events";
import { ArrowUpRight, Check } from "lucide-react";

interface ProductsClientProps {
  products: any[];
}

export default function ProductsClient({ products }: ProductsClientProps) {
  return (
    <div className="relative min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col overflow-x-hidden selection:bg-[#0066FF]/30">
      <Navigation />

      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#0066FF]/8 to-transparent blur-[140px] pointer-events-none -z-10" />

      <main className="flex-1 page-header-offset">
        <SiteContainer>
          {/* Back navigation */}
          <BackNav label="Back" fallbackHref="/" />

          {/* Editorial Page Introduction */}
          <PageIntro
            eyebrow="Products"
            title="Systems designed around human cognition."
            description="A cohesive cognitive architecture supporting emotional awareness, self-understanding, and future-self continuity."
            className="mb-12 sm:mb-16"
          />

          {/* Products Grid */}
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
              {products.map((p, index) => {
                const productName = p.title || p.name;
                const productUrl = p.url || "#";
                const isJoi = p.id?.includes("joi");
                const isHuman = p.id?.includes("human");
                const category = isJoi ? "Emotion" : isHuman ? "Cognition" : "Continuity";
                const accentColor = isJoi ? "#10B981" : isHuman ? "#00B2FF" : "#A855F7";

                return (
                  <article
                    key={p.id}
                    className={`surface-card surface-card-hover p-6 sm:p-7 flex flex-col ${index === 0 ? "lg:col-span-6" : "lg:col-span-3"}`}
                  >
                    <div>
                      {/* Category & Status Row */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-white/[0.08] bg-white/[0.02]"
                          style={{ color: accentColor }}
                        >
                          {category}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Active</span>
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="flex flex-col gap-2">
                        <h2 className="font-display font-semibold text-lg sm:text-xl text-white">
                          {productName}
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed line-clamp-3">
                          {p.tagline || p.description}
                        </p>
                      </div>

                      {/* Features List */}
                      {p.features && Array.isArray(p.features) && p.features.length > 0 && (
                        <div className="flex flex-col gap-2 mt-5 pt-4 border-t border-white/[0.05]">
                          {p.features.slice(0, 3).map((feature: string, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-xs text-neutral-400 font-sans leading-normal"
                            >
                              <Check className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Launch Action in Normal Document Flow */}
                    <div className="mt-6 pt-4 border-t border-white/[0.06]">
                      <a
                        href={productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          trackProductCardClick(p.id, productName);
                          trackProductDetailsOpened(p.id, productName);
                        }}
                        className="cta-link text-xs text-white hover:text-[#00B2FF] font-medium"
                      >
                        <span>Launch platform</span>
                        <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Intentional Empty State */
            <div className="surface-card p-10 sm:p-14 text-center flex flex-col items-center gap-4 max-w-lg mx-auto">
              <span className="w-2 h-2 rounded-full bg-[#00B2FF]" />
              <h3 className="font-display font-semibold text-xl text-white">
                Systems in Deployment
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
                Our core platforms—JOI Companion AI, Human OS, and Viyaan Future—are currently transitioning into public availability.
              </p>
              <Link href="/contact" className="cta-secondary mt-2">
                <span>Contact Engineering</span>
              </Link>
            </div>
          )}
        </SiteContainer>
      </main>

      <NewsletterSection />
      <Footer />
    </div>
  );
}
