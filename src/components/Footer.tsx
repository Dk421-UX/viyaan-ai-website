"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { trackNewsletterSuccess, trackNewsletterFailed, trackFormSubmission } from "@/analytics/events";
import { ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function Footer() {
  const [company, setCompany] = useState<any>(null);
  const [newsletter, setNewsletter] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          if (data.companyInfo) setCompany(data.companyInfo);
          if (data.newsletter) setNewsletter(data.newsletter);
        }
      })
      .catch((e) => console.error("Error loading footer content dynamically:", e));
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
        trackFormSubmission("success", "newsletter_footer");
      } else {
        const errorMsg = data.error || "Subscription failed.";
        setStatus("error");
        setMessage(errorMsg);
        trackNewsletterFailed(errorMsg);
        trackFormSubmission("failure", "newsletter_footer", errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || "Connection error.";
      setStatus("error");
      setMessage("Connection error. Please try again.");
      trackNewsletterFailed(errorMsg);
      trackFormSubmission("failure", "newsletter_footer", errorMsg);
    }
  };

  return (
    <footer className="relative border-t border-white/[0.05] bg-[#050505] pt-16 pb-12 px-5 sm:px-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Optional Newsletter Section if enabled */}
        {newsletter?.enabled && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-12 border-b border-white/[0.05]">
            <div className="max-w-md flex flex-col gap-1">
              <h4 className="font-display font-medium text-base text-white">
                {newsletter.title || "Stay informed on foundational research"}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
                {newsletter.description || "Receive architecture papers, model updates, and engineering dispatches."}
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading" || status === "success"}
                className="h-10 px-3.5 rounded-lg bg-[#09090C] border border-white/[0.08] text-xs text-white placeholder-neutral-500 font-sans focus:border-[#00B2FF] focus:outline-none w-full sm:w-64 transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="cta-primary h-10 text-xs px-4"
              >
                <span>{status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed" : "Subscribe"}</span>
              </button>
            </form>

            {message && (
              <span className={`text-xs font-sans flex items-center gap-1.5 ${status === "success" ? "text-emerald-400" : "text-red-400"}`}>
                {status === "success" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {message}
              </span>
            )}
          </div>
        )}

        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Brand & Mission Statement */}
          <div className="flex flex-col gap-2 max-w-sm">
            <span className="font-display font-semibold text-sm tracking-tight text-white">
              VIYAAN AI
            </span>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
              {company?.tagline || "Intelligence Beyond the Human Mind."}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-xs sm:text-sm text-neutral-400 font-sans" aria-label="Footer navigation">
            <Link href="/products" className="hover:text-white transition-colors">
              Products
            </Link>
            <Link href="/research" className="hover:text-white transition-colors">
              Research
            </Link>
            <Link href="/lab" className="hover:text-white transition-colors">
              Lab
            </Link>
            <Link href="/founder" className="hover:text-white transition-colors">
              Founder
            </Link>
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </nav>

          {/* Social Channels */}
          <div className="flex items-center gap-5 text-xs text-neutral-400 font-sans">
            <a
              href={company?.linkedinCompany || "https://www.linkedin.com/company/viyaan-ai"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-600" />
            </a>
            <a
              href={company?.twitterFounder || "https://x.com/by_dharani"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>Twitter</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-600" />
            </a>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-600 font-sans">
          <span>© 2026 Viyaan AI. All rights reserved.</span>
          <span>Building intelligent systems for human understanding.</span>
        </div>
      </div>
    </footer>
  );
}
