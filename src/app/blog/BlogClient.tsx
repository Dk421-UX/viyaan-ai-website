"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface BlogClientProps {
  posts: any[];
}

export default function BlogClient({ posts }: BlogClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  // Filter posts
  const categories = ["All", "Ecosystem Release", "Engineering", "Philosophy", "Updates"];
  
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      (post.tags && post.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase())));
      
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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

          {/* Headline & Paragraph */}
          <div className="max-w-2xl flex flex-col gap-4 sm:gap-6">
            <h1 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-white leading-tight">
              Corporate Ledger
            </h1>
            <p className="font-sans text-sm sm:text-base text-neutral-450 leading-relaxed">
              Read our latest release notes, engineering logs, design logs, and reflections on built platforms.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-neutral-900 pb-6 mt-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 text-[10px] font-mono">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-neutral-400 border-neutral-900 hover:border-neutral-800 hover:text-white"
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="w-full sm:w-64 relative font-mono text-xs">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ledger..."
                className="w-full bg-neutral-950 border border-neutral-900 focus:border-neutral-700 outline-none rounded-lg px-3 py-2 text-white placeholder-neutral-750"
              />
            </div>
          </div>

          {/* Blog Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <article 
                  key={post.slug}
                  className="flex flex-col justify-between border border-neutral-900 bg-neutral-950/40 rounded-xl p-6 hover:border-neutral-850 transition-all duration-300 min-h-[220px]"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                      <span className="uppercase">{post.category}</span>
                      <span>{post.date}</span>
                    </div>
                    <h2 className="font-display font-semibold text-white text-lg tracking-tight">
                      <Link href={`/blog/${post.slug}`} className="hover:text-viyaan-cyan transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="font-sans text-xs text-neutral-450 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-neutral-905/60 flex items-center justify-between text-[10px] font-mono">
                    <div className="flex gap-2">
                      {post.tags && post.tags.slice(0, 2).map((t: string) => (
                        <span key={t} className="text-neutral-500">#{t}</span>
                      ))}
                    </div>
                    <Link href={`/blog/${post.slug}`} className="text-white hover:text-viyaan-cyan transition-colors font-bold">
                      Read Entry →
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-2 text-center py-16 border border-neutral-900 rounded-xl bg-neutral-950/20 text-neutral-500 text-xs font-mono">
                No entries match the filter criteria.
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
