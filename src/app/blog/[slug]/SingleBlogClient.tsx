"use client";

import React from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import SiteContainer from "@/components/SiteContainer";
import BackNav from "@/components/BackNav";
import { Calendar } from "lucide-react";

interface SingleBlogClientProps {
  post: any;
}

export default function SingleBlogClient({ post }: SingleBlogClientProps) {
  if (!post) {
    return (
      <div className="relative min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col justify-center items-center">
        <Navigation />
        <SiteContainer className="text-center py-24 font-sans text-sm text-neutral-400 flex flex-col items-center gap-3">
          <span>The requested publication could not be located.</span>
          <Link href="/blog" className="cta-secondary">
            <span>Return to Publications</span>
          </Link>
        </SiteContainer>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col overflow-x-hidden selection:bg-[#0066FF]/30">
      <Navigation />

      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#0066FF]/8 to-transparent blur-[140px] pointer-events-none -z-10" />

      <main className="flex-1 page-header-offset">
        <SiteContainer>
          {/* Back navigation in flow */}
          <BackNav label="Back to Publications" fallbackHref="/blog" className="max-w-[740px] mx-auto" />

          {/* Controlled Editorial Measure Article */}
          <article className="max-w-[740px] mx-auto flex flex-col gap-8">
            {/* Article Header */}
            <header className="flex flex-col gap-4 border-b border-white/[0.06] pb-8">
              <div className="flex items-center gap-3 text-xs text-neutral-500 font-sans">
                <span className="text-[#00B2FF] font-medium">{post.category || "Release"}</span>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-600" />
                  <span>{post.date}</span>
                </div>
              </div>

              <h1 className="font-display font-semibold text-[2rem] sm:text-4xl md:text-[2.75rem] text-white tracking-[-0.035em] leading-[1.08]">
                {post.title}
              </h1>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 text-xs font-sans text-neutral-500 mt-1">
                  {post.tags.map((t: string) => (
                    <span
                      key={t}
                      className="bg-white/[0.03] border border-white/[0.06] px-2.5 py-0.5 rounded text-[11px] font-mono text-neutral-400"
                    >
                      #{t.toLowerCase()}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Article Body */}
            <div className="font-sans text-sm sm:text-base text-neutral-300 leading-relaxed flex flex-col gap-6 whitespace-pre-wrap">
              {post.content}
            </div>

            {/* Article Footer */}
            <footer className="border-t border-white/[0.06] pt-6 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-neutral-500 font-sans">
              <Link
                href="/blog"
                className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1 focus-visible:outline-none min-h-[36px]"
              >
                <span>← Return to all publications</span>
              </Link>
              <span className="text-[11px] font-mono text-neutral-600">VIYAAN AI ARCHIVE</span>
            </footer>
          </article>
        </SiteContainer>
      </main>

      <NewsletterSection />
      <Footer />
    </div>
  );
}
