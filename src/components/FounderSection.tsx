"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function FounderSection() {
  return (
    <div className="surface-card p-6 sm:p-8 md:p-10">
      <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
        {/* Founder Portrait */}
        <div className="flex flex-col items-center sm:items-start shrink-0">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-white/[0.08] bg-[#070709]">
            <Image
              src="/founder.jpeg"
              alt="Dharani Kumar — Founder of Viyaan AI"
              fill
              sizes="(max-width: 640px) 112px, 128px"
              className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              priority
            />
          </div>

          <div className="mt-3 text-center sm:text-left">
            <h4 className="font-display font-medium text-sm text-white">Dharani Kumar</h4>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">Founder & Architect</p>
          </div>

          <div className="flex items-center gap-2 mt-2.5">
            <a
              href="https://www.linkedin.com/in/dharani-kumar-49622b349"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md border border-white/[0.06] bg-white/[0.02] text-neutral-400 hover:text-white hover:border-white/[0.14] transition-all min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://x.com/by_dharani"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md border border-white/[0.06] bg-white/[0.02] text-neutral-400 hover:text-white hover:border-white/[0.14] transition-all min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label="Twitter / X Profile"
            >
              <TwitterIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Vision Narrative */}
        <div className="flex flex-col justify-between gap-4 flex-1">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-widest text-[#00B2FF] font-mono font-medium">
              Founding Vision
            </span>
            <h3 className="font-display text-lg sm:text-xl font-semibold text-white tracking-tight">
              An Open Journey of Discipline and Craft
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans max-w-xl">
              Viyaan AI is not built behind hidden doors or driven by venture hype. We design in public, sharing our research, engineering decisions, and daily lessons to build systems that amplify human potential.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/founder"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white font-sans transition-colors min-h-[36px]"
            >
              <span>Explore founding philosophy</span>
              <ArrowRight className="w-3 h-3 text-neutral-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
