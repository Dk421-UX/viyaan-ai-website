"use client";

import React from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import SiteContainer from "@/components/SiteContainer";
import PageIntro from "@/components/PageIntro";
import BackNav from "@/components/BackNav";
import { ArrowUpRight, Download } from "lucide-react";

interface ResearchClientProps {
  papers: any[];
}

export default function ResearchClient({ papers }: ResearchClientProps) {
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
            eyebrow="Research"
            title="Published Manuscripts"
            description="Architectural papers, cognitive models, and retrieval benchmarks released by the Viyaan AI research team."
            className="mb-12 sm:mb-16"
          />

          {/* Research Publications Index */}
          <div className="flex flex-col gap-5 max-w-4xl mx-auto">
            {papers && papers.length > 0 ? (
              papers.map((paper) => (
                <article
                  key={paper.slug || paper.title}
                  className="surface-card surface-card-hover p-6 sm:p-8 flex flex-col gap-4"
                >
                  {/* Metadata Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500 font-sans border-b border-white/[0.05] pb-3">
                    <div className="flex items-center gap-2">
                      {paper.field && (
                        <>
                          <span className="text-[#00B2FF] font-medium">{paper.field}</span>
                          <span>•</span>
                        </>
                      )}
                      {paper.date && <span>{paper.date}</span>}
                    </div>
                    {paper.author && <span>{paper.author}</span>}
                  </div>

                  {/* Title & Excerpt */}
                  <div className="flex flex-col gap-2">
                    <h2 className="font-display font-semibold text-lg sm:text-xl text-white leading-snug">
                      {paper.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed line-clamp-3">
                      {paper.excerpt}
                    </p>
                  </div>

                  {/* Abstract Preview */}
                  {paper.content && (
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed border-l border-white/10 pl-3.5 py-1 line-clamp-2">
                      {paper.content}
                    </p>
                  )}

                  {/* Action Row */}
                  <div className="pt-3 border-t border-white/[0.05] flex items-center justify-end">
                    {paper.pdfUrl ? (
                      <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cta-secondary text-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </a>
                    ) : (
                      <Link
                        href={`/contact?subject=${encodeURIComponent(`Research Inquiry: ${paper.title}`)}`}
                        className="cta-link text-xs text-neutral-300 hover:text-white"
                      >
                        <span>Inquire about this research</span>
                        <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                      </Link>
                    )}
                  </div>
                </article>
              ))
            ) : (
              /* Intentional Empty State */
              <div className="surface-card p-10 sm:p-12 text-center text-neutral-400 text-xs sm:text-sm font-sans max-w-lg mx-auto">
                No research papers currently published. As papers undergo peer review and release verification, they will be indexed here.
              </div>
            )}
          </div>
        </SiteContainer>
      </main>

      <NewsletterSection />
      <Footer />
    </div>
  );
}
