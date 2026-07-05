"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackWebVitals } from "@/analytics/performance";

/**
 * WebVitalsTracker Component
 * Captures Next.js Core Web Vitals (LCP, FID/INP, CLS, etc.) and routes them to GA4.
 */
export default function WebVitalsTracker() {
  useReportWebVitals((metric) => {
    // Send metric to our GA4 service
    trackWebVitals(metric);
  });

  return null;
}
