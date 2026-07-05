"use client";

import { useEffect, useRef, useCallback } from "react";
import * as events from "./events";
import { gtag } from "./analytics";

/**
 * Hook: useAnalytics
 * Exposes all event tracking utilities cleanly to UI components.
 */
export function useAnalytics() {
  return {
    ...events,
  };
}

/**
 * Hook: useTimeOnPage
 * Tracks the amount of time (in seconds) a visitor stays active on a specific page/component view.
 * @param pageName The logical name of the view (e.g. 'JOI Companion', 'Homepage')
 */
export function useTimeOnPage(pageName: string) {
  const startTime = useRef<number>(0);

  useEffect(() => {
    startTime.current = Date.now();

    return () => {
      const elapsedSeconds = Math.round((Date.now() - startTime.current) / 1000);
      // Avoid tracking accidental or extremely short hits (e.g. < 2 seconds bounce)
      if (elapsedSeconds >= 2) {
        gtag("event", "page_engagement_duration", {
          page_name: pageName,
          duration_seconds: elapsedSeconds,
        });
      }
    };
  }, [pageName]);
}

/**
 * Hook: useTrackOnClick
 * Reusable handler that wraps click triggers for custom event emissions.
 * @param eventName The action label
 * @param params Attributes to send
 */
export function useTrackOnClick(eventName: string, params: Record<string, any> = {}) {
  return useCallback(() => {
    gtag("event", eventName, params);
  }, [eventName, params]);
}
