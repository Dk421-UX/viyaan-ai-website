"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { track404PageView } from "@/analytics/events";
import { usePathname } from "next/navigation";

/**
 * Custom 404 Not Found Page
 * Renders a premium, themed page and logs the 404 visit in Google Analytics.
 */
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

      <main className="flex-1 flex flex-col justify-center items-center px-5 sm:px-6 md:px-12 pt-[calc(8.5rem+env(safe-area-inset-top))] pb-12 md:pt-44 md:pb-24 blueprint-dots">
        <div className="w-full max-w-5xl flex flex-col items-center justify-center text-center gap-6 py-20 animate-fade-in animate-duration-500">
          <h1 className="font-display font-bold text-7xl sm:text-9xl tracking-tighter text-neutral-800 select-none">
            404
          </h1>
          <div className="max-w-md flex flex-col gap-3">
            <h2 className="font-display font-semibold text-lg sm:text-xl text-white">
              Ledger Entry Not Found
            </h2>
            <p className="font-sans text-xs sm:text-sm text-neutral-500 leading-relaxed">
              The coordinates you requested do not exist in our system logs. It may have been relocated, archived, or never existed.
            </p>
          </div>
          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-white text-black font-mono text-[10px] uppercase font-bold tracking-wider hover:bg-neutral-200 transition-colors focus-visible:outline-none"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
