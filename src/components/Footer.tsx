"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SiteContainer from "./SiteContainer";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (data?.companyInfo) {
          setCompany(data.companyInfo);
        }
      })
      .catch((e) => console.error("Error loading company info for footer:", e));
  }, []);

  const tagline = company?.tagline || "Intelligence Beyond the Human Mind.";
  const linkedin = company?.linkedinCompany || "https://www.linkedin.com/company/viyaan-ai";
  const twitter = company?.twitterFounder || "https://x.com/by_dharani";

  return (
    <footer className="relative border-t border-white/[0.06] bg-[#050505] pt-[clamp(4rem,6vw,6rem)] pb-10 mt-auto">
      <SiteContainer>
        {/* Main 3-Column Architectural Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
          {/* Column 1: Brand & Positioning (~40%) */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <Link
              href="/"
              className="font-display font-semibold text-sm tracking-tight text-white hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <span>VIYAAN AI</span>
            </Link>
            <p className="font-sans text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
              {tagline}
            </p>
          </div>

          {/* Column 2: Navigation Links (~35%) */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-mono">
              Directory
            </span>
            <nav
              className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs text-neutral-400 font-sans"
              aria-label="Footer navigation"
            >
              <Link href="/products" className="hover:text-white transition-colors py-0.5">
                Products
              </Link>
              <Link href="/research" className="hover:text-white transition-colors py-0.5">
                Research
              </Link>
              <Link href="/lab" className="hover:text-white transition-colors py-0.5">
                Lab
              </Link>
              <Link href="/founder" className="hover:text-white transition-colors py-0.5">
                Founder
              </Link>
              <Link href="/blog" className="hover:text-white transition-colors py-0.5">
                Blog
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors py-0.5">
                Contact
              </Link>
            </nav>
          </div>

          {/* Column 3: Social & Ecosystem (~25%) */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-mono">
              Network
            </span>
            <div className="flex flex-col gap-2 text-xs text-neutral-400 font-sans">
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1.5 py-0.5"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-600" />
              </a>
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1.5 py-0.5"
              >
                <span>Twitter / X</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-600" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Metadata Row */}
        <div className="mt-14 pt-7 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-neutral-500 font-sans">
          <span>© 2026 Viyaan AI. All rights reserved.</span>
          <span className="text-neutral-500">
            Building intelligent systems for human understanding.
          </span>
        </div>
      </SiteContainer>
    </footer>
  );
}
