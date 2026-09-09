"use client";

import React from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BackNav from "@/components/BackNav";
import { ArrowUpRight, Download } from "lucide-react";

interface ResearchClientProps {
  papers: any[];
}

export default function ResearchClient({ papers }: ResearchClientProps) {
  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E4E4E7] flex flex-col overflow-x-hidden selection:bg-[#0066FF]/30">
      <Navigation />

      {/* Atmospheric ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#0066FF]/8 via-transparent to-transparent blur-[140px] pointer-events-none -z-10" />

      <main className="flex-1 max-w-4xl mx-auto w-full px-5 sm:px-8 page-content-offset pb-20 flex flex-col gap-8 sm:gap-10">
        {/* Back navigation */}
        <BackNav label="Back" fallbackHref="/" />

        {/* Editorial Header */}
        <div className="flex flex-col gap-3 max-w-2xl">
          <span className="text-xs uppercase tracking-widest text-[#0066FF] font-sans">
            Research
          </span>
          <h1 className="font-display font-semibold text-3xl sm:text-5xl tracking-tight text-white leading-tight">
            Published Manuscripts
          </h1>
          <p className="font-sans text-sm sm:text-base text-neutral-400 leading-relaxed">
            Architectural papers, cognitive models, and retrieval benchmarks released by the Viyaan AI research team.
          </p>
        </div>

        {/* Actual Research Papers List */}
        <div className="flex flex-col gap-6 mt-2">
          {papers && papers.length > 0 ? (
            papers.map((paper) => (
              <article
                key={paper.slug || paper.title}
                className="p-7 sm:p-9 rounded-2xl border border-white/[0.06] bg-[#09090C]/60 hover:bg-[#0E0E14]/80 hover:border-white/[0.12] transition-all duration-300 flex flex-col gap-5"
              >
                {/* Meta row */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500 font-sans border-b border-white/[0.05] pb-3.5">
                  <div className="flex items-center gap-2">
                    {paper.field && (
                      <>
                        <span className="text-[#00B2FF] font-medium">{paper.field}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{paper.date || "2026"}</span>
                  </div>
                  <span>{paper.author || "Viyaan Research Team"}</span>
                </div>

                {/* Paper Title & Excerpt */}
                <div className="flex flex-col gap-2.5">
                  <h2 className="font-display font-semibold text-xl sm:text-2xl text-white leading-snug">
                    {paper.title}
                  </h2>
                  <p className="text-sm text-neutral-300 font-sans leading-relaxed">
                    {paper.excerpt}
                  </p>
                </div>

                {/* Paper Content / Abstract */}
                {paper.content && (
                  <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed border-l-2 border-white/10 pl-4 py-1">
                    {paper.content}
                  </p>
                )}

                {/* Direct Action */}
                <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
                  <span className="text-xs text-neutral-500 font-sans">
                    Architecture paper
                  </span>

                  {paper.pdfUrl ? (
                    <a
                      href={paper.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-secondary"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  ) : (
                    <Link
                      href={`/contact?subject=${encodeURIComponent(`Research Inquiry: ${paper.title}`)}`}
                      className="text-xs text-neutral-300 hover:text-white font-sans inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Inquire about this research</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
                    </Link>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="p-12 text-center border border-white/[0.06] rounded-2xl bg-[#09090C]/30 text-neutral-400 text-sm font-sans max-w-lg mx-auto">
              No research papers currently published in this section. As papers undergo release verification, they will be indexed here.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
