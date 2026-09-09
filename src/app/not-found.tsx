"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { track404PageView } from "@/analytics/events";
import { usePathname } from "next/navigation";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      track404PageView(pathname || window.location.pathname);
    }
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E4E4E7] flex flex-col overflow-x-hidden">
      <Navigation />

      <main className="flex-1 flex flex-col justify-center items-center px-5 sm:px-6 md:px-12 page-content-offset pb-16 md:pb-24 blueprint-dots">
        <div className="w-full max-w-3xl flex flex-col items-center justify-center text-center gap-6 py-20 animate-fade-in">
          <div className="p-3 rounded-2xl border border-neutral-900 bg-neutral-950/80 text-viyaan-cyan">
            <Compass className="w-8 h-8 shrink-0" />
          </div>

          <h1 className="font-display font-bold text-6xl sm:text-8xl tracking-tight text-neutral-800 select-none">
            404
          </h1>

          <div className="max-w-md flex flex-col gap-2">
            <h2 className="font-display font-bold text-xl text-white">
              Coordinates Not Located
            </h2>
            <p className="font-sans text-xs sm:text-sm text-neutral-400 leading-relaxed">
              The spatial route you requested does not map to any active platform or research archive.
            </p>
          </div>

          <div className="mt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition-colors focus-visible:outline-none"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              <span>Return to Headquarters</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
