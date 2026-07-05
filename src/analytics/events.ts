/**
 * Viyaan AI Founder Analytics System - Event Declarations
 * Declares all custom and business-focused events to feed into GA4 Custom Dimensions.
 */

import { gtag, redactPII } from "./analytics";

// Helper to push customized events with redacted properties and screen dimensions
function emitEvent(eventName: string, params: Record<string, any> = {}) {
  const safeParams = redactPII(params);
  
  if (typeof window !== "undefined") {
    safeParams["screen_resolution"] = `${window.screen.width}x${window.screen.height}`;
    safeParams["viewport_size"] = `${window.innerWidth}x${window.innerHeight}`;
    safeParams["page_location"] = window.location.href;
    safeParams["page_referrer"] = document.referrer || "direct";
  }

  gtag("event", eventName, safeParams);
}

/**
 * Track SPA Page View
 */
export function trackPageView(url: string, title?: string) {
  emitEvent("page_view", {
    page_path: url,
    page_title: title || (typeof document !== "undefined" ? document.title : ""),
  });
}

/**
 * Track Hero CTA button clicks
 */
export function trackHeroCtaClick(label: string, link: string) {
  emitEvent("hero_cta_click", {
    cta_label: label,
    cta_link: link,
  });
}

/**
 * Track Header/Navbar Navigation link clicks
 */
export function trackNavigationClick(label: string, link: string) {
  emitEvent("navigation_click", {
    nav_label: label,
    nav_link: link,
  });
}

/**
 * Track interactions on product list/grid cards
 */
export function trackProductCardClick(id: string, name: string) {
  emitEvent("product_card_click", {
    product_id: id,
    product_name: name,
  });
}

/**
 * Track final launch button triggers
 */
export function trackProductLaunchClick(id: string, name: string) {
  emitEvent("product_launch_click", {
    product_id: id,
    product_name: name,
  });
}

/**
 * Track product detail reviews
 */
export function trackProductDetailsView(id: string, name: string) {
  emitEvent("product_details_view", {
    product_id: id,
    product_name: name,
  });
}

/**
 * Track contact channel selections
 * @param channel e.g., 'Email', 'LinkedIn', 'GitHub'
 * @param details e.g., link or handle clicked
 */
export function trackContactClick(channel: string, details: string) {
  emitEvent("contact_click", {
    contact_channel: channel,
    contact_details: details,
  });
}

/**
 * Track newsletter form interaction
 */
export function trackNewsletterSubscribe(emailProvided: boolean) {
  emitEvent("newsletter_subscribe", {
    email_provided: emailProvided,
  });
}

/**
 * Track newsletter subscription success
 */
export function trackNewsletterSuccess() {
  emitEvent("newsletter_success", {
    message: "Subscription added successfully",
  });
}

/**
 * Track newsletter subscription failure
 */
export function trackNewsletterFailed(errorMessage: string) {
  emitEvent("newsletter_failed", {
    error_message: errorMessage,
  });
}

/**
 * Track external website redirects
 */
export function trackExternalLinkClick(url: string) {
  emitEvent("external_link_click", {
    destination_url: url,
  });
}

/**
 * Track mailto: actions
 */
export function trackEmailClick(email: string) {
  emitEvent("email_click", {
    email_address: email,
  });
}

/**
 * Track Footer link navigation
 */
export function trackFooterLinkClick(label: string, href: string) {
  emitEvent("footer_link_click", {
    link_label: label,
    link_href: href,
  });
}

/**
 * Track Search usages
 */
export function trackSearchUsed(term: string) {
  emitEvent("search_used", {
    search_term: term,
  });
}

/**
 * Track custom 404 views
 */
export function track404PageView(path: string) {
  emitEvent("404_page_view", {
    missing_path: path,
  });
}

/**
 * Track document/paper download clicks
 */
export function trackDownload(fileName: string, fileUrl: string) {
  emitEvent("download", {
    file_name: fileName,
    file_url: fileUrl,
  });
}

/**
 * Track user scroll progression depth
 */
export function trackScrollDepth(percentage: number) {
  emitEvent("scroll_depth", {
    depth_percentage: percentage,
  });
}

/**
 * Track form submission status
 */
export function trackFormSubmission(status: "success" | "failure", formId: string, errorMsg?: string) {
  if (status === "success") {
    emitEvent("form_submission_success", { form_id: formId });
  } else {
    emitEvent("form_submission_failure", { form_id: formId, error_message: errorMsg || "unknown error" });
  }
}

/**
 * Track contact button clicks
 */
export function trackContactButtonClick(label: string) {
  emitEvent("contact_button_click", { button_label: label });
}

/**
 * Track product details opened (alias for compatibility)
 */
export function trackProductDetailsOpened(id: string, name: string) {
  trackProductDetailsView(id, name);
}
