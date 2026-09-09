"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BackNav from "@/components/BackNav";
import { ArrowRight, Search, Calendar } from "lucide-react";

interface BlogClientProps {
  posts: any[];
}

export default function BlogClient({ posts }: BlogClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Ecosystem Release", "Engineering", "Philosophy", "Updates"];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      (post.tags && post.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase())));

    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const standardPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E4E4E7] flex flex-col overflow-x-hidden selection:bg-[#0066FF]/30">
      <Navigation />

      {/* Atmospheric ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#0066FF]/6 via-transparent to-transparent blur-[140px] pointer-events-none -z-10" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-5 sm:px-8 page-content-offset pb-20 flex flex-col gap-10 sm:gap-12">
        {/* Back navigation */}
        <BackNav label="Back" fallbackHref="/" />

        {/* Editorial Header */}
        <div className="flex flex-col gap-4 max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-[#00B2FF] font-sans">
            Publications
          </span>
          <h1 className="font-display font-semibold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            Dispatches & Essays
          </h1>
          <p className="font-sans text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl">
            Official release documentation, cognitive design logs, engineering essays, and reflections from the Viyaan AI research team.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-white/[0.05] pb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-sans transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-white text-black font-medium"
                    : "bg-white/[0.03] text-neutral-400 border border-white/[0.06] hover:text-white hover:border-white/[0.14]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-60 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search essays..."
              className="w-full bg-[#09090C] border border-white/[0.08] focus:border-[#00B2FF] outline-none rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 font-sans transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Lead Featured Article */}
        {featuredPost && (
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block p-8 sm:p-12 rounded-2xl border border-white/[0.06] bg-[#09090C]/60 hover:bg-[#0E0E14] hover:border-white/[0.14] transition-all duration-300"
          >
            <div className="flex flex-col gap-4 max-w-3xl">
              <div className="flex items-center gap-3 text-xs text-neutral-500 font-sans">
                <span className="text-[#00B2FF] font-medium">{featuredPost.category}</span>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-neutral-600" />
                  <span>{featuredPost.date}</span>
                </div>
                <span className="hidden sm:inline px-2 py-0.5 rounded text-[10px] bg-white/[0.04] text-neutral-400">
                  Featured
                </span>
              </div>

              <h2 className="font-display font-semibold text-2xl sm:text-3xl lg:text-4xl text-white group-hover:text-white leading-tight transition-colors">
                {featuredPost.title}
              </h2>

              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-sans line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="pt-4 flex items-center gap-1.5 text-xs text-[#00B2FF] font-sans">
                <span>Read article</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        )}

        {/* Subsequent Articles Grid */}
        {standardPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {standardPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col justify-between p-7 rounded-2xl border border-white/[0.06] bg-[#09090C]/60 hover:bg-[#0E0E14] hover:border-white/[0.14] transition-all duration-300 min-h-[240px]"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-xs text-neutral-500 font-sans">
                    <span className="text-[#00B2FF]">{post.category}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="font-display font-semibold text-lg text-white group-hover:text-[#00B2FF] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between text-xs text-neutral-400 font-sans">
                  <span>Read entry</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="p-12 text-center border border-white/[0.06] rounded-2xl bg-[#09090C]/30 text-neutral-400 text-sm font-sans">
            No articles found matching your criteria.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
