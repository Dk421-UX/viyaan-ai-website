/**
 * Viyaan AI Founder Analytics System - Core Initializer
 * Establishes Google Analytics 4 integration, ensures PII protection, and handles user consent.
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const IS_PROD = process.env.NODE_ENV === "production";

// Safe wrapper to invoke Google tag API
export function gtag(...args: any[]) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  } else if (!IS_PROD) {
    console.log("[GA4 Founder System Debug] gtag call:", args);
  }
}

/**
 * Filter and Redact PII (Personally Identifiable Information)
 * Scans parameters and replaces sensitive info like emails, phone numbers, and keys.
 */
export function redactPII(params: Record<string, any>): Record<string, any> {
  const redacted: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      // Regex check for email addresses
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      // Regex check for phone numbers
      const isPhone = /(\+?\d{1,4}[-.\s]??\d{1,3}[-.\s]??\d{1,4}[-.\s]??\d{1,4})/g.test(value);
      // Check parameter key for sensitive names
      const isSensitiveKey = 
        key.toLowerCase().includes("password") || 
        key.toLowerCase().includes("passphrase") ||
        key.toLowerCase().includes("key") ||
        key.toLowerCase().includes("secret") ||
        key.toLowerCase().includes("token");

      if (isEmail) {
        redacted[key] = "[REDACTED_EMAIL]";
      } else if (isPhone && value.length > 8) {
        redacted[key] = "[REDACTED_PHONE]";
      } else if (isSensitiveKey) {
        redacted[key] = "[REDACTED_SENSITIVE_KEY]";
      } else {
        redacted[key] = value;
      }
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
}

/**
 * Initialize Google Analytics 4 (gtag.js)
 * @param measurementId GA4 Measurement ID (e.g. G-XXXXXXX)
 * @param consentGranted Initial cookie consent selection
 */
export function initGA(measurementId: string, consentGranted: boolean = true) {
  if (typeof window === "undefined" || !measurementId) return;

  // Initialize Data Layer & gtag function
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }

  // Set default privacy consent configuration
  const consentVal = consentGranted ? "granted" : "denied";
  gtag("consent", "default", {
    ad_storage: consentVal,
    ad_user_data: consentVal,
    ad_personalization: consentVal,
    analytics_storage: consentVal,
    wait_for_update: 500,
  });

  // Inject script tag
  const scriptId = "google-tag-manager";
  if (!document.getElementById(scriptId)) {
    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  // Configure GA4 base configurations
  gtag("js", new Date());
  gtag("config", measurementId, {
    send_page_view: false, // Managed manually by PageTracker to capture SPA transitions
    debug_mode: !IS_PROD,  // Displays events instantly in GA4 DebugView during local development
    cookie_flags: "max-age=7200;secure;samesite=none",
  });

  // Configure user details if returning or new visitor
  const isNewVisitor = !localStorage.getItem("viyaan_analytics_visited");
  if (isNewVisitor) {
    localStorage.setItem("viyaan_analytics_visited", "true");
    gtag("set", "user_properties", { visitor_type: "new" });
  } else {
    gtag("set", "user_properties", { visitor_type: "returning" });
  }
}

/**
 * Update Analytics Consent state dynamically
 * @param granted True if analytics cookies allowed
 */
export function updateConsent(granted: boolean) {
  const consentVal = granted ? "granted" : "denied";
  gtag("consent", "update", {
    ad_storage: consentVal,
    ad_user_data: consentVal,
    ad_personalization: consentVal,
    analytics_storage: consentVal,
  });
}
