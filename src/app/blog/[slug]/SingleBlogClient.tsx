"use client";

import React from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BackNav from "@/components/BackNav";
import { Calendar } from "lucide-react";

interface SingleBlogClientProps {
  post: any;
}

export default function SingleBlogClient({ post }: SingleBlogClientProps) {
  if (!post) {
    return (
      <div className="relative min-h-screen bg-[#050505] text-[#E4E4E7] flex flex-col justify-center items-center">
        <Navigation />
        <div className="text-center py-24 font-sans text-sm text-neutral-400 flex flex-col items-center gap-3">
          <span>The requested publication could not be located.</span>
          <Link href="/blog" className="cta-secondary">
            <span>Return to Publications</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E4E4E7] flex flex-col overflow-x-hidden selection:bg-[#0066FF]/30">
      <Navigation />

      {/* Atmospheric ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#0066FF]/6 via-transparent to-transparent blur-[140px] pointer-events-none -z-10" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-5 sm:px-8 page-content-offset pb-20 flex flex-col gap-8 sm:gap-10">
        {/* Back navigation */}
        <BackNav label="Back to Publications" fallbackHref="/blog" />

        <article className="flex flex-col gap-8">
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

            <h1 className="font-display font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-[1.12]">
              {post.title}
            </h1>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs font-sans text-neutral-500 mt-2">
                {post.tags.map((t: string) => (
                  <span
                    key={t}
                    className="bg-white/[0.03] border border-white/[0.06] px-2.5 py-0.5 rounded-full text-[11px] text-neutral-400"
                  >
                    #{t.toLowerCase()}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Article Body */}
          <div className="font-sans text-base sm:text-lg text-neutral-300 leading-relaxed flex flex-col gap-6 whitespace-pre-wrap">
            {post.content}
          </div>

          <footer className="border-t border-white/[0.06] pt-8 mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-neutral-500 font-sans">
            <Link
              href="/blog"
              className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none"
            >
              <span>← Return to publication list</span>
            </Link>
            <span className="text-neutral-600">VIYAAN AI ARCHIVE</span>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
}
