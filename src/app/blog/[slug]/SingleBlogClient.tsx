"use client";

import React from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface SingleBlogClientProps {
  post: any;
}

export default function SingleBlogClient({ post }: SingleBlogClientProps) {
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  if (!post) {
    return (
      <div className="relative min-h-screen bg-[#050505] text-[#E4E4E7] flex flex-col justify-center items-center">
        <Navigation />
        <div className="text-center py-20 font-mono text-xs text-neutral-500">
          <span>Article not found. </span>
          <Link href="/" className="text-white underline hover:text-viyaan-cyan ml-1">Return to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E4E4E7] flex flex-col overflow-x-hidden">
      <Navigation />

      <main className="flex-1 flex flex-col justify-center items-center px-5 sm:px-6 md:px-12 pt-[calc(8.5rem+env(safe-area-inset-top))] pb-12 md:pt-44 md:pb-24 blueprint-dots animate-fade-in animate-duration-500">
        <div className="w-full max-w-3xl flex flex-col gap-5 md:gap-10">
          
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

          {/* Article Header */}
          <div className="flex flex-col gap-4 border-b border-neutral-900 pb-8">
            <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-500">
              <span className="uppercase text-viyaan-cyan font-bold">{post.category}</span>
              <span>•</span>
              <span>{post.date}</span>
            </div>
            
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight">
              {post.title}
            </h1>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-neutral-500 mt-1">
                {post.tags.map((t: string) => (
                  <span key={t} className="bg-neutral-950 border border-neutral-900 px-2 py-0.5 rounded-md">
                    #{t.toLowerCase()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Article Body */}
          <div className="font-sans text-sm sm:text-base text-neutral-305 leading-relaxed flex flex-col gap-6 whitespace-pre-wrap">
            {post.content}
          </div>

          {/* Back Trigger bottom */}
          <div className="border-t border-neutral-900 pt-8 mt-12 flex justify-between items-center text-xs font-mono">
            <a href="/blog" onClick={handleBack} className="text-neutral-400 hover:text-white transition-colors">
              ← Return to ledger
            </a>
            <span className="text-neutral-600">VIYAAN AI LEDGER</span>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
