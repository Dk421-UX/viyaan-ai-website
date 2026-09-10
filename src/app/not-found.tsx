"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SiteContainer from "@/components/SiteContainer";
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
    <div className="relative min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col overflow-x-hidden">
      <Navigation />

      <main className="flex-1 flex flex-col justify-center items-center page-header-offset pb-20">
        <SiteContainer className="flex flex-col items-center justify-center text-center py-16 sm:py-24">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#00B2FF] mb-6">
            <Compass className="w-5 h-5 shrink-0" />
          </div>

          <span className="text-[11px] uppercase tracking-widest text-[#00B2FF] font-mono font-medium mb-2">
            Error 404
          </span>

          <h1 className="font-display font-semibold text-3xl sm:text-4xl text-white tracking-tight">
            Page Not Located
          </h1>

          <p className="font-sans text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md mt-3 mb-8">
            The requested location does not map to any active platform, research paper, or public dispatch in the Viyaan AI index.
          </p>

          <Link href="/" className="cta-primary">
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span>Return to Overview</span>
          </Link>
        </SiteContainer>
      </main>

      <Footer />
    </div>
  );
}
