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
    <div className={`flex items-center ${className}`}>
      <button
        onClick={handleBack}
        type="button"
        aria-label={label}
        className="back-nav-link group"
      >
        <ArrowLeft className="w-3.5 h-3.5 shrink-0 text-neutral-400 group-hover:text-white" />
        <span>{label}</span>
      </button>
    </div>
  );
}
