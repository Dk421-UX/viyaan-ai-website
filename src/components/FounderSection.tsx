"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
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

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
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
    <div className="rounded-2xl border border-white/[0.06] bg-[#09090C]/60 p-7 sm:p-10 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10">
        {/* Portrait & Identity */}
        <div className="flex flex-col items-center text-center shrink-0">
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#050505]">
            <Image
              src="/founder.jpeg"
              alt="Dharani Kumar — Founder of Viyaan AI"
              fill
              sizes="160px"
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              priority
            />
          </div>

          <div className="mt-3">
            <h4 className="font-display font-medium text-base text-white">Dharani Kumar</h4>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">Founder & Architect</p>
          </div>

          <div className="flex items-center gap-2.5 mt-3">
            <a
              href="https://www.linkedin.com/in/dharani-kumar-49622b349"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-neutral-400 hover:text-white hover:border-white/[0.14] transition-all"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-3.5 h-3.5 shrink-0" />
            </a>
            <a
              href="https://x.com/by_dharani"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-neutral-400 hover:text-white hover:border-white/[0.14] transition-all"
              aria-label="Twitter X Profile"
            >
              <Twitter className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
        </div>

        {/* Vision Narrative & Read More */}
        <div className="flex flex-col justify-between gap-5 flex-1 text-center md:text-left">
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-[#00B2FF] font-sans">
              Founding Vision
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-white tracking-tight">
              An Open Journey of Discipline and Craft
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed font-sans max-w-xl">
              Viyaan AI is not built behind hidden doors or driven by venture hype. We design in public, sharing our research, engineering decisions, and daily lessons to build systems that amplify human potential.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/founder"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white font-sans transition-colors group"
            >
              <span>Explore founding philosophy</span>
              <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
