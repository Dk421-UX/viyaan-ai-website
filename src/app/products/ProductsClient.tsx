"use client";

import React from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

interface ProductsClientProps {
  products: any[];
}

// Sleek default SVG icons based on product id
const getProductIcon = (id: string, iconUrl?: string) => {
  if (iconUrl) {
    return <img src={iconUrl} alt="icon" className="w-5 h-5 object-contain" />;
  }
  
  const cleanId = id.toLowerCase();
  if (cleanId.includes("joi")) {
    return (
      <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    );
  }
  if (cleanId.includes("human")) {
    return (
      <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  );
};

// Mesh/Illustration gradient headers
const getProductImage = (id: string, imageUrl?: string) => {
  if (imageUrl) {
    return (
      <div className="w-full h-32 rounded-lg overflow-hidden border border-neutral-900 relative">
        <img src={imageUrl} alt="product illustration" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
      </div>
    );
  }
  
  const cleanId = id.toLowerCase();
  const gradientClass = cleanId.includes("joi") 
    ? "from-emerald-500/10 via-neutral-950/20 to-neutral-950" 
    : cleanId.includes("human")
    ? "from-cyan-500/10 via-neutral-950/20 to-neutral-950"
    : "from-purple-500/10 via-neutral-950/20 to-neutral-950";
    
  return (
    <div className={`w-full h-28 rounded-lg bg-gradient-to-br ${gradientClass} border border-neutral-900/60 flex items-center justify-center overflow-hidden relative`}>
      <div className="absolute inset-0 blueprint-dots opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
      <div className="w-9 h-9 rounded-full bg-neutral-900/80 border border-neutral-800/60 flex items-center justify-center z-10 backdrop-blur-sm">
        {getProductIcon(id)}
      </div>
    </div>
  );
};

// Status indicator badge
const getStatusBadge = (status: string) => {
  const isPub = status.toLowerCase() === "published";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-medium ${
      isPub ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40" : "bg-neutral-900 text-neutral-550 border border-neutral-800"
    }`}>
      <span className={`w-1 h-1 rounded-full ${isPub ? "bg-emerald-400 animate-pulse" : "bg-neutral-500"}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

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
              products.map((p) => {
                const productName = p.title || p.name;
                const productUrl = p.url || "#";
                
                return (
                  <motion.div 
                    key={p.id} 
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4, borderColor: "#262626" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex flex-col justify-between p-5 rounded-xl border border-neutral-900 bg-neutral-950/40 hover:bg-neutral-950/70 transition-colors duration-300 min-h-[350px]"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Product Card Image/Illustration Header */}
                      {getProductImage(p.id, p.image)}
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-neutral-900 border border-neutral-800 flex items-center justify-center flex-shrink-0">
                              {getProductIcon(p.id, p.icon)}
                            </div>
                            <h3 className="font-display font-semibold text-white text-[15px]">
                              {productName}
                            </h3>
                          </div>
                          {getStatusBadge(p.status)}
                        </div>
                        
                        <p className="text-xs text-neutral-400 leading-relaxed font-sans mt-1">
                          {p.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-900/60">
                      <a
                        href={productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full h-11 rounded-lg bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 hover:border-neutral-700 text-white font-mono text-xs font-semibold transition-all duration-300 focus-visible:outline-none"
                      >
                        Launch Platform
                      </a>
                    </div>
                  </motion.div>
                );
              })
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
