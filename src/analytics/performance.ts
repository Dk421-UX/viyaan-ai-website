/**
 * Viyaan AI Founder Analytics System - Performance & Error Telemetry
 * Monitors Core Web Vitals, page load speeds, JavaScript runtime faults, and API rejections.
 */

import { gtag } from "./analytics";

// Helper to push performance events
function emitPerformanceEvent(eventName: string, params: Record<string, any>) {
  gtag("event", eventName, params);
}

/**
 * Capture and format Next.js Core Web Vitals
 */
export function trackWebVitals(metric: { name: string; value: number; delta: number; id: string }) {
  const cleanName = metric.name.toUpperCase();
  emitPerformanceEvent("web_vitals", {
    metric_name: cleanName,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_id: metric.id,
    event_category: "Web Vitals",
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
  });
}

/**
 * Initializes listeners to monitor runtime errors, failed API calls, and load time parameters
 */
export function initPerformanceTracking() {
  if (typeof window === "undefined") return;

  // 1. Capture JavaScript runtime errors
  window.addEventListener("error", (event) => {
    emitPerformanceEvent("js_error", {
      error_message: event.message || "Unknown error",
      error_file: event.filename || "unknown",
      error_line: event.lineno || 0,
      error_column: event.colno || 0,
      error_stack: event.error?.stack ? event.error.stack.substring(0, 180) : "no stack",
    });
  });

  // 2. Capture unhandled promise rejections (Failed API requests / fetches)
  window.addEventListener("unhandledrejection", (event) => {
    let message = "Promise rejected";
    if (event.reason) {
      if (typeof event.reason === "string") {
        message = event.reason;
      } else if (event.reason.message) {
        message = event.reason.message;
      }
    }
    emitPerformanceEvent("api_rejection_error", {
      error_message: message.substring(0, 180),
    });
  });

  // 3. Capture navigation timing performance (TTFB, DOM Interactive, Page Load time)
  window.addEventListener("load", () => {
    // Run asynchronously to allow main thread completion
    setTimeout(() => {
      try {
        const perf = window.performance;
        if (!perf) return;

        const navEntries = perf.getEntriesByType("navigation");
        if (navEntries && navEntries.length > 0) {
          const entry = navEntries[0] as PerformanceNavigationTiming;
          const loadTime = entry.loadEventEnd - entry.startTime;
          const domContentLoaded = entry.domContentLoadedEventEnd - entry.startTime;
          const ttfb = entry.responseStart - entry.requestStart;

          emitPerformanceEvent("page_load_performance", {
            page_load_time_ms: Math.round(loadTime),
            dom_content_loaded_ms: Math.round(domContentLoaded),
            time_to_first_byte_ms: Math.round(ttfb),
            navigation_type: entry.type,
          });

          // Report slow loads (> 4.5 seconds threshold)
          if (loadTime > 4500) {
            emitPerformanceEvent("slow_page_load", {
              load_time_ms: Math.round(loadTime),
              path: window.location.pathname,
            });
          }
        }
      } catch (err) {
        console.error("Failed to gather load performance parameters:", err);
      }
    }, 1000);
  });
}
