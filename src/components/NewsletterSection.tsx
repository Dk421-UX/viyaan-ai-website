"use client";

import React, { useState, useEffect } from "react";
import SiteContainer from "./SiteContainer";
import { trackNewsletterSuccess, trackNewsletterFailed, trackFormSubmission } from "@/analytics/events";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface NewsletterSectionProps {
  className?: string;
}

export default function NewsletterSection({ className = "" }: NewsletterSectionProps) {
  const [newsletter, setNewsletter] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (data?.newsletter) {
          setNewsletter(data.newsletter);
        }
      })
      .catch((e) => console.error("Error loading newsletter config:", e));
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Subscribed successfully.");
        setEmail("");
        trackNewsletterSuccess();
        trackFormSubmission("success", "newsletter_section");
      } else {
        const errorMsg = data.error || "Subscription failed.";
        setStatus("error");
        setMessage(errorMsg);
        trackNewsletterFailed(errorMsg);
        trackFormSubmission("failure", "newsletter_section", errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || "Connection error.";
      setStatus("error");
      setMessage("Connection error. Please try again.");
      trackNewsletterFailed(errorMsg);
      trackFormSubmission("failure", "newsletter_section", errorMsg);
    }
  };

  // If explicitly disabled in CMS, do not render
  if (newsletter && newsletter.enabled === false) {
    return null;
  }

  const title = newsletter?.title || "Stay Ahead of the Intelligence Curve";
  const description =
    newsletter?.description ||
    "Receive research updates, product releases, and architectural dispatches directly in your inbox.";

  return (
    <section className={`relative border-t border-white/[0.06] bg-[#07070A] py-[clamp(4.5rem,7vw,6.5rem)] ${className}`}>
      <SiteContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center gap-8 lg:gap-10">
          {/* Left Column: Heading & Description */}
          <div className="flex flex-col gap-3 max-w-xl lg:col-span-6">
            <span className="text-[11px] uppercase tracking-widest text-[#00B2FF] font-mono font-medium">
              Dispatches
            </span>
            <h3 className="font-display font-semibold text-xl sm:text-2xl text-white tracking-tight">
              {title}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-neutral-400 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Right Column: Input & CTA */}
          <div className="w-full lg:col-span-5 lg:col-start-8 flex flex-col gap-2.5">
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading" || status === "success"}
                className="input-base w-full sm:w-72 text-xs"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="cta-primary shrink-0"
              >
                <span>
                  {status === "loading"
                    ? "Subscribing..."
                    : status === "success"
                    ? "Subscribed"
                    : "Subscribe"}
                </span>
              </button>
            </form>

            {message && (
              <span
                className={`text-xs font-sans flex items-center gap-1.5 ${
                  status === "success" ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{message}</span>
              </span>
            )}
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
