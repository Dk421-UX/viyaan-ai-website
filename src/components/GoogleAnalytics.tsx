"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { initGA, updateConsent } from "@/analytics/analytics";
import { initPerformanceTracking } from "@/analytics/performance";
import PageTracker from "@/analytics/pageTracker";

interface GoogleAnalyticsProps {
  measurementId: string;
  cookieConsentEnabled: boolean;
}

/**
 * GoogleAnalytics Controller Component
 * Manages script loading, calls initialization, boots error tracking, and shows cookie warning.
 */
export default function GoogleAnalytics({ measurementId, cookieConsentEnabled }: GoogleAnalyticsProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [consentStateChecked, setConsentStateChecked] = useState(false);

  // 1. Initial consent resolution and runtime analytics bootup
  useEffect(() => {
    if (!measurementId) return;

    // Boot Performance Diagnostics & Error Trackers
    initPerformanceTracking();

    if (!cookieConsentEnabled) {
      // Direct load if banner disabled
      initGA(measurementId, true);
      setConsentStateChecked(true);
    } else {
      const localConsent = localStorage.getItem("viyaan_cookie_consent");
      if (localConsent === "granted") {
        initGA(measurementId, true);
        setConsentStateChecked(true);
      } else if (localConsent === "denied") {
        initGA(measurementId, false);
        setConsentStateChecked(true);
      } else {
        // Unconfigured consent. Load GA in restricted/denied mode first, then show prompt banner
        initGA(measurementId, false);
        setConsentStateChecked(true);
        const timer = setTimeout(() => setShowBanner(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [measurementId, cookieConsentEnabled]);

  const handleAcceptAll = () => {
    localStorage.setItem("viyaan_cookie_consent", "granted");
    updateConsent(true);
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("viyaan_cookie_consent", "denied");
    updateConsent(false);
    setShowBanner(false);
  };

  if (!measurementId) return null;

  return (
    <>
      {/* Route changes, scroll milestones, and automated click triggers */}
      {consentStateChecked && <PageTracker />}

      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed bottom-5 left-5 right-5 sm:left-auto sm:right-5 sm:w-[350px] z-[9999] p-5 rounded-xl border border-neutral-900 bg-neutral-950/90 backdrop-blur-md shadow-2xl flex flex-col gap-4 font-sans select-none"
          >
            <div className="flex flex-col gap-1.5">
              <h4 className="font-display font-semibold text-white text-xs tracking-wider uppercase">
                Privacy Configuration
              </h4>
              <p className="text-[11px] text-neutral-450 leading-relaxed font-sans">
                We employ Google Analytics to refine platform interactions and verify telemetry metrics. Data is collected securely and anonymized.
              </p>
            </div>

            <div className="flex gap-2 w-full mt-1">
              <button
                onClick={handleDecline}
                className="flex-1 h-9 rounded-lg border border-neutral-900 hover:border-neutral-800 text-neutral-400 hover:text-white font-mono text-[10px] font-semibold transition-all focus-visible:outline-none"
              >
                DECLINE
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 h-9 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono text-[10px] font-semibold transition-all focus-visible:outline-none shadow-md shadow-emerald-500/10"
              >
                ACCEPT ALL
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
