"use client";

import React from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface ProductsClientProps {
  products: any[];
}

export default function ProductsClient({ products }: ProductsClientProps) {
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

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
              Flagship Platforms
            </h1>
            <p className="font-sans text-sm sm:text-base text-neutral-400 leading-relaxed">
              We design tools that link together, providing a unified cognitive support environment across reflection, companionship, and continuity.
            </p>
            <div className="mt-2 flex">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-11 px-5 rounded-lg border border-neutral-800 text-white font-mono text-xs font-semibold hover:border-neutral-700 transition-colors focus-visible:outline-none"
              >
                Explore Platform
              </Link>
            </div>
          </div>

          {/* Visual Focus: Minimalist Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products && products.length > 0 ? (
              products.map((p) => (
                <div 
                  key={p.id} 
                  className="flex flex-col justify-between p-6 rounded-xl border border-neutral-900 bg-neutral-950/40 hover:border-neutral-850 transition-all duration-300 min-h-[240px]"
                >
                  <div className="flex flex-col gap-3">
                    <h3 className="font-display font-semibold text-white text-base">
                      {p.name}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-905/60">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full h-11 rounded-lg bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-white font-mono text-xs font-semibold transition-all duration-300 focus-visible:outline-none"
                    >
                      Launch Platform
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 border border-neutral-900 rounded-xl bg-neutral-950/20 text-neutral-500 text-xs">
                No products published.
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
