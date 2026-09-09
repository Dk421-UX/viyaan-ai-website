"use client";

import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trackFormSubmission, trackContactButtonClick } from "@/analytics/events";
import BackNav from "@/components/BackNav";
import { ArrowUpRight, CheckCircle2, AlertCircle, Clock, Send } from "lucide-react";

interface ContactClientProps {
  company: any;
}

export default function ContactClient({ company }: ContactClientProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    trackContactButtonClick("Submit Inquiry");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company: companyName,
          phone,
          subject: subject || "Website Inquiry",
          message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        trackFormSubmission("success", "contact_inquiry");
      } else {
        const err = await res.json();
        const errStr = err.error || "Submission failure. Please try again.";
        setErrorMsg(errStr);
        trackFormSubmission("failure", "contact_inquiry", errStr);
      }
    } catch (err: any) {
      const errStr = err.message || "Connection failure.";
      setErrorMsg("Connection failure. Please check your network.");
      trackFormSubmission("failure", "contact_inquiry", errStr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E4E4E7] flex flex-col overflow-x-hidden selection:bg-[#0066FF]/30">
      <Navigation />

      {/* Atmospheric ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#0066FF]/6 via-transparent to-transparent blur-[140px] pointer-events-none -z-10" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-5 sm:px-8 page-content-offset pb-20 flex flex-col gap-10 sm:gap-12">
        {/* Back navigation */}
        <BackNav label="Back" fallbackHref="/" />

        {/* Editorial Header */}
        <div className="flex flex-col gap-4 max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-[#00B2FF] font-sans">
            Contact
          </span>
          <h1 className="font-display font-semibold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            Connect with Viyaan AI
          </h1>
          <p className="font-sans text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl">
            Whether you are proposing research collaboration, exploring platform integrations, or seeking technical consultation, our engineering team reviews inquiries directly.
          </p>
        </div>

        {/* Two-Column Form & Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: Communications & SLA */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-7 rounded-2xl border border-white/[0.06] bg-[#09090C]/60 flex flex-col gap-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-500 font-sans block mb-1">
                  Official Channels
                </span>
                <h3 className="font-display font-semibold text-lg text-white">
                  Direct Inquiries
                </h3>
              </div>

              <div className="flex flex-col gap-5 text-xs font-sans">
                <div className="flex flex-col gap-1">
                  <span className="text-neutral-500">Email Address</span>
                  <a
                    href={`mailto:${company?.email || "viyaan.ai.team@gmail.com"}`}
                    className="text-sm text-white hover:text-[#00B2FF] transition-colors break-all"
                  >
                    {company?.email || "viyaan.ai.team@gmail.com"}
                  </a>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-neutral-500">LinkedIn Headquarters</span>
                  <a
                    href={company?.linkedinCompany || "https://www.linkedin.com/company/viyaan-ai"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#00B2FF] transition-colors inline-flex items-center gap-1"
                  >
                    <span>linkedin.com/company/viyaan-ai</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                  </a>
                </div>

                <div className="flex flex-col gap-1 pt-4 border-t border-white/[0.06]">
                  <span className="text-neutral-500">Response SLA</span>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Inquiries reviewed within {company?.responseTime || "2 business days"}.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Premium Contact Form */}
          <div className="lg:col-span-8">
            <div className="p-8 sm:p-10 rounded-2xl border border-white/[0.06] bg-[#09090C]/80">
              {submitted ? (
                <div className="py-12 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-semibold text-2xl text-white">
                    Inquiry Transmitted
                  </h3>
                  <p className="text-sm text-neutral-400 font-sans max-w-md leading-relaxed">
                    Thank you for reaching out. Your message has been routed to our core team. We will review and respond according to our standard schedule.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="cta-secondary mt-2"
                  >
                    <span>Send Another Inquiry</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-xs text-neutral-400 font-sans">
                        Full Name <span className="text-[#00B2FF]">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ada Lovelace"
                        className="h-11 px-3.5 rounded-lg bg-[#050505] border border-white/[0.08] text-sm text-white placeholder-neutral-600 focus:border-[#00B2FF] focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-xs text-neutral-400 font-sans">
                        Email Address <span className="text-[#00B2FF]">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ada@example.com"
                        className="h-11 px-3.5 rounded-lg bg-[#050505] border border-white/[0.08] text-sm text-white placeholder-neutral-600 focus:border-[#00B2FF] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="company" className="text-xs text-neutral-400 font-sans">
                        Organization / Affiliation
                      </label>
                      <input
                        id="company"
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Institution or Company"
                        className="h-11 px-3.5 rounded-lg bg-[#050505] border border-white/[0.08] text-sm text-white placeholder-neutral-600 focus:border-[#00B2FF] focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="subject" className="text-xs text-neutral-400 font-sans">
                        Subject
                      </label>
                      <input
                        id="subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Research Inquiry / Integration"
                        className="h-11 px-3.5 rounded-lg bg-[#050505] border border-white/[0.08] text-sm text-white placeholder-neutral-600 focus:border-[#00B2FF] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-xs text-neutral-400 font-sans">
                      Message <span className="text-[#00B2FF]">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Outline your proposal, research questions, or integration requirements..."
                      className="p-3.5 rounded-lg bg-[#050505] border border-white/[0.08] text-sm text-white placeholder-neutral-600 focus:border-[#00B2FF] focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="flex items-center gap-2 text-xs text-red-400 font-sans bg-red-950/30 border border-red-900/40 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="cta-primary w-full sm:w-auto"
                    >
                      <span>{loading ? "Transmitting..." : "Submit Inquiry"}</span>
                      <Send className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
