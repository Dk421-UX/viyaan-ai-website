"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, BookOpen, Hammer, Compass } from "lucide-react";

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
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
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function FounderSection() {
  return (
    <div className="border border-neutral-900 bg-neutral-950/20 rounded-2xl p-6 md:p-8 blueprint-grid">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column: Image & Social Links */}
        <div className="lg:col-span-4 flex flex-col items-center gap-6 text-center">
          <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-neutral-800 p-1.5 bg-neutral-950">
            <div className="w-full h-full rounded-xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
              <Image
                src="/founder.jpeg"
                alt="Dharani Kumar — Founder of Viyaan AI"
                fill
                sizes="(max-width: 768px) 192px, 192px"
                className="object-cover"
                priority
              />
            </div>
            {/* Fine border accents */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-viyaan-cyan"></div>
            <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-viyaan-cyan"></div>
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-viyaan-cyan"></div>
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-viyaan-cyan"></div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg text-white">Dharani Kumar</h4>
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mt-0.5">Founder & Architect</p>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/in/dharani-kumar-49622b349"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg border border-neutral-900 bg-neutral-950 text-neutral-400 hover:text-viyaan-cyan hover:border-neutral-800 transition-all"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/by_dharani"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg border border-neutral-900 bg-neutral-950 text-neutral-400 hover:text-viyaan-cyan hover:border-neutral-800 transition-all"
              aria-label="Twitter X Profile"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right column: Building in Public & Philosophy */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div>
            <span className="text-xs text-viyaan-blue font-mono tracking-widest uppercase block mb-1">
              Building in Public
            </span>
            <h3 className="font-display text-xl md:text-2xl font-semibold text-white">
              An Open Journey of Discipline and Craft
            </h3>
          </div>

          <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
            Viyaan AI is not built behind thick mahogany doors or hidden under layers of stealth. We build publicly, sharing our challenges, research papers, engineering decisions, and daily lessons. This transparency keeps us disciplined, accountable, and deeply connected with our community.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-neutral-900 pt-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-viyaan-cyan">
                <Hammer className="w-4 h-4" />
                <h5 className="font-display font-medium text-white text-xs md:text-sm">Craftsmanship</h5>
              </div>
              <p className="text-[11px] md:text-xs text-neutral-500 leading-relaxed">
                Refusing to ship code we aren't proud of. Obsessing over speed, layout simplicity, and database privacy protocols.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-viyaan-blue">
                <BookOpen className="w-4 h-4" />
                <h5 className="font-display font-medium text-white text-xs md:text-sm">Continuous Learning</h5>
              </div>
              <p className="text-[11px] md:text-xs text-neutral-500 leading-relaxed">
                Adapting user research findings directly into core products. Approaching machine models with child-like curiosity.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-zinc-300">
                <Compass className="w-4 h-4" />
                <h5 className="font-display font-medium text-white text-xs md:text-sm">Long-term Vision</h5>
              </div>
              <p className="text-[11px] md:text-xs text-neutral-500 leading-relaxed">
                Structuring decisions around a 50-year horizon. Choosing durable trust over short-term attention spikes.
              </p>
            </div>
          </div>

          <blockquote className="border-l-2 border-neutral-800 pl-4 py-1 italic text-xs text-neutral-400 leading-relaxed bg-neutral-950/20 rounded-r">
            &ldquo;Viyaan AI belongs to the ecosystem we serve. I am here to help lay the bricks, but the mission itself—amplifying human potential—remains the focus.&rdquo;
          </blockquote>
        </div>
      </div>
    </div>
  );
}
