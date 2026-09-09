"use client";

import React, { useEffect, useState } from "react";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only activate on fine pointer devices (desktop with mouse) and respect reduced motion
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasFinePointer || isReducedMotion) {
      return;
    }

    setMounted(true);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest("a, button, input, textarea, select, [role='button'], [data-interactive='true']")
        );
        setIsHovered(isInteractive);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    const render = () => {
      // Smooth lerp for outer spatial ring
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      setPosition({ x: ringX, y: ringY });
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!mounted || !isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 hidden md:block"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: isVisible ? 1 : 0,
      }}
      aria-hidden="true"
    >
      {/* Precision outer spatial ring */}
      <div
        className={`rounded-full border transition-all duration-200 ease-out flex items-center justify-center ${
          isHovered
            ? "w-9 h-9 border-viyaan-cyan/80 bg-viyaan-cyan/[0.08] shadow-[0_0_15px_rgba(0,178,255,0.25)] scale-110"
            : "w-6 h-6 border-white/20 bg-transparent"
        }`}
      >
        {/* Central core dot */}
        <div
          className={`rounded-full transition-all duration-150 ${
            isHovered
              ? "w-1.5 h-1.5 bg-viyaan-cyan shadow-[0_0_8px_#00b2ff]"
              : "w-1 h-1 bg-white/70"
          }`}
        />
      </div>
    </div>
  );
}
