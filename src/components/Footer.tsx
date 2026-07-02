"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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
          if (data.companyInfo) {
            setCompany(data.companyInfo);
          }
          if (data.newsletter) {
            setNewsletter(data.newsletter);
          }
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
      } else {
        setStatus("error");
        setMessage(data.error || "Subscription failed.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Connection error. Please try again.");
    }
  };

  return (
    <footer className="relative py-16 px-6 md:px-12 border-t border-[#121214] bg-[#050505] mt-auto">
      {/* Newsletter Block */}
      {newsletter?.enabled && (
        <div className="max-w-5xl mx-auto pb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#121214] mb-12">
          <div className="max-w-md">
            <h4 className="font-display font-semibold text-sm text-white tracking-tight">
              {newsletter.title || "Stay Ahead of the Curve"}
            </h4>
            <p className="text-xs text-neutral-500 font-sans mt-1 leading-relaxed">
              {newsletter.description || "Subscribe for product updates and research papers."}
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading" || status === "success"}
                className="w-full sm:w-64 bg-neutral-950 border border-neutral-900 focus:border-neutral-800 disabled:opacity-50 text-xs text-white rounded-lg px-3 py-2.5 outline-none font-mono"
              />
              {message && (
                <span className={`absolute left-0 -bottom-5 text-[9px] font-mono ${status === "success" ? "text-emerald-500" : "text-red-400"}`}>
                  {message}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="h-[38px] px-4 bg-white hover:bg-neutral-200 disabled:bg-neutral-900 disabled:text-neutral-500 text-black font-mono text-[10px] uppercase font-bold tracking-wider rounded-lg flex items-center justify-center transition-colors cursor-pointer"
            >
              {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed" : "Subscribe"}
            </button>
          </form>
        </div>
      )}

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        {/* Left: Branding & Core Mission statement */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-xs tracking-wider text-white">
              VIYAAN AI
            </span>
          </div>
          <p className="text-xs text-neutral-500 max-w-sm leading-relaxed font-mono">
            {company?.tagline || "Intelligence Beyond the Human Mind."}<br />
            An AI Product and Research Company.
          </p>
        </div>

        {/* Right: Channels & Navigation */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 text-xs font-mono text-neutral-400">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Systems</span>
            <a href="https://joi-ai-wq7f.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              JOI Companion AI
            </a>
            <a href="https://human-os-ptot.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Human OS
            </a>
            <a href="https://viyaan-future-ai.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Viyaan Future AI
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Official Channels</span>
            <a href={company?.linkedinCompany || "https://www.linkedin.com/company/viyaan-ai"} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              LinkedIn Company
            </a>
            <a href={company?.twitterFounder || "https://x.com/by_dharani"} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Twitter X
            </a>
            <a href={company?.linkedinFounder || "https://www.linkedin.com/in/dharani-kumar-49622b349"} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Founder Profile
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Legal */}
      <div className="max-w-5xl mx-auto border-t border-[#121214] pt-8 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-neutral-600">
        <span>© {new Date().getFullYear()} VIYAAN AI. ALL RIGHTS RESERVED.</span>
        <span>{company?.location || "Chennai, India / Remote"}</span>
      </div>
    </footer>
  );
}
