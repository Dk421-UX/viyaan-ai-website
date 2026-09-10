"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import SiteContainer from "@/components/SiteContainer";
import PageIntro from "@/components/PageIntro";
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
            eyebrow="Publications"
            title="Dispatches & Essays"
            description="Official release documentation, cognitive design logs, engineering essays, and reflections from the Viyaan AI research team."
            className="mb-10 sm:mb-12"
          />

          {/* Search & Category Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-white/[0.06] pb-7 mb-10 sm:mb-12">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer min-h-[36px] ${
                    selectedCategory === cat
                      ? "bg-white text-black font-medium"
                      : "bg-white/[0.02] text-neutral-400 border border-white/[0.06] hover:text-white hover:border-white/[0.12]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-64 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search essays..."
                className="input-base w-full pr-8 text-xs"
                aria-label="Search essays"
              />
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Lead Featured Article */}
          {featuredPost && (
            <div className="mb-8 sm:mb-10">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="surface-card surface-card-hover block p-7 sm:p-9 md:p-10 group"
              >
                <div className="flex flex-col gap-3 max-w-3xl">
                  <div className="flex items-center gap-3 text-xs text-neutral-500 font-sans">
                    <span className="text-[#00B2FF] font-medium">{featuredPost.category}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-neutral-600" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-neutral-400">
                      Featured
                    </span>
                  </div>

                  <h2 className="font-display font-semibold text-xl sm:text-2xl md:text-3xl text-white group-hover:text-white leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans line-clamp-2">
                    {featuredPost.excerpt}
                  </p>

                  <div className="pt-2 flex items-center gap-1 text-xs text-[#00B2FF] font-sans">
                    <span>Read dispatch</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Subsequent Articles Grid */}
          {standardPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {standardPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="surface-card surface-card-hover p-6 flex flex-col group"
                >
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5 text-xs text-neutral-500 font-sans">
                      <span className="text-[#00B2FF]">{post.category}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>

                    <h3 className="font-display font-semibold text-base sm:text-lg text-white group-hover:text-[#00B2FF] transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-neutral-400 leading-relaxed font-sans line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between text-xs text-neutral-400 font-sans">
                    <span>Read entry</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filteredPosts.length === 0 && (
            <div className="surface-card p-10 text-center text-neutral-400 text-xs sm:text-sm font-sans max-w-lg mx-auto">
              No articles found matching your query.
            </div>
          )}
        </SiteContainer>
      </main>

      <NewsletterSection />
      <Footer />
    </div>
  );
}
