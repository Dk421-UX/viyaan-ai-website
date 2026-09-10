"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackNavProps {
  label?: string;
  fallbackHref?: string;
  className?: string;
}

export default function BackNav({
  label = "Back",
  fallbackHref = "/",
  className = "",
}: BackNavProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <div className={`flex items-center mb-6 sm:mb-8 ${className}`}>
      <button
        onClick={handleBack}
        type="button"
        aria-label={label}
        className="inline-flex items-center gap-2 min-h-[44px] py-1 text-xs text-neutral-400 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B2FF] rounded font-sans cursor-pointer group"
      >
        <ArrowLeft className="w-3.5 h-3.5 shrink-0 text-neutral-500 group-hover:text-white transition-all duration-150 group-hover:-translate-x-0.5" />
        <span className="tracking-tight">{label}</span>
      </button>
    </div>
  );
}
