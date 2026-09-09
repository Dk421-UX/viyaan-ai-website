"use client";

import React from "react";
import SpatialIntelligenceCore from "./SpatialIntelligenceCore";

interface IntelligenceCanvasProps {
  className?: string;
  interactive?: boolean;
}

export default function IntelligenceCanvas({
  className = "",
  interactive = true,
}: IntelligenceCanvasProps) {
  return (
    <div
      className={`relative w-full max-w-sm sm:max-w-md mx-auto h-[110px] sm:h-[130px] md:h-[140px] pointer-events-auto ${className}`}
      aria-hidden="true"
    >
      {/* Soft atmospheric gradient falloff */}
      <div className="absolute inset-0 pointer-events-none z-10 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_85%)]">
        <SpatialIntelligenceCore interactive={interactive} />
      </div>

      {/* Subtle core blue glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] sm:w-[220px] h-[90px] sm:h-[110px] bg-gradient-to-tr from-[#0066FF]/12 via-[#00B2FF]/6 to-transparent rounded-full blur-[50px] pointer-events-none -z-10" />
    </div>
  );
}
