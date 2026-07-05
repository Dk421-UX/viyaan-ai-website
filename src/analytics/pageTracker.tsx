"use client";

import React, { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  trackPageView, 
  trackScrollDepth, 
  trackEmailClick, 
  trackDownload, 
  trackExternalLinkClick, 
  trackHeroCtaClick, 
  trackNavigationClick,
  trackFooterLinkClick
} from "./events";

// Subcomponent that uses useSearchParams inside a Suspense boundary
function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Log page view on route transitions
  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    trackPageView(url);
  }, [pathname, searchParams]);

  // 2. Automated Scroll Depth tracker (25%, 50%, 75%, 100%)
  useEffect(() => {
    const trackedDepths = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (scrollHeight <= 0) return;

      const percentage = Math.round((scrollTop / scrollHeight) * 100);
      const milestones = [25, 50, 75, 100];

      for (const milestone of milestones) {
        if (percentage >= milestone && !trackedDepths.has(milestone)) {
          trackedDepths.add(milestone);
          trackScrollDepth(milestone);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]); // Reset milestone triggers per page/pathname change

  return null;
}

/**
 * PageTracker Component
 * Automated event listener that tracks navigation transitions, scroll depth, and interaction clicks.
 */
export default function PageTracker() {
  // 3. Document-wide event listener for downloads, external links, email and layout clicks
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const text = anchor.innerText || anchor.textContent || "";
      
      if (!href) return;

      const cleanText = text.trim();

      // Email link tracking
      if (href.startsWith("mailto:")) {
        trackEmailClick(href.replace("mailto:", ""));
        return;
      }

      // Download file detection
      const extensions = [
        ".pdf", ".zip", ".tar", ".gz", ".rar", ".exe", ".msi", 
        ".csv", ".xlsx", ".docx", ".epub", ".mp3", ".mp4"
      ];
      const isDownload = extensions.some(
        (ext) => href.toLowerCase().endsWith(ext) || href.toLowerCase().includes(ext + "?")
      );
      if (isDownload) {
        trackDownload(href.split("/").pop() || "unidentified_file", href);
        return;
      }

      // External outbound redirection tracking
      if (href.startsWith("http://") || href.startsWith("https://")) {
        const urlObj = new URL(href);
        if (urlObj.hostname !== window.location.hostname) {
          trackExternalLinkClick(href);
          return;
        }
      }

      // Hero click tracker
      const isHero = anchor.closest(".hero-cta-btn") || anchor.getAttribute("data-cta") === "hero";
      if (isHero) {
        trackHeroCtaClick(cleanText, href);
        return;
      }

      // Footer click tracker
      const isFooter = anchor.closest("footer");
      if (isFooter) {
        trackFooterLinkClick(cleanText, href);
        return;
      }

      // Navigation click tracker
      const isNav = anchor.closest("nav") || anchor.closest(".nav-link") || anchor.classList.contains("nav-item");
      if (isNav) {
        trackNavigationClick(cleanText, href);
        return;
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  return (
    <Suspense fallback={null}>
      <RouteTracker />
    </Suspense>
  );
}
