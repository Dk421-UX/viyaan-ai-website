"use client";

import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import SiteContainer from "@/components/SiteContainer";
import PageIntro from "@/components/PageIntro";
import BackNav from "@/components/BackNav";
import { trackFormSubmission, trackContactButtonClick } from "@/analytics/events";
import { ArrowUpRight, CheckCircle2, AlertCircle, Clock } from "lucide-react";

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

  const emailAddress = company?.email || "viyaan.ai.team@gmail.com";
  const linkedin = company?.linkedinCompany || "https://www.linkedin.com/company/viyaan-ai";
  const responseTime = company?.responseTime || "2 business days";

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
    <div className="relative min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col overflow-x-hidden selection:bg-[#0066FF]/30">
      <Navigation />

      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#0066FF]/8 to-transparent blur-[140px] pointer-events-none -z-10" />

      <main className="flex-1 page-header-offset">
        <SiteContainer>
          {/* Back navigation */}
          <BackNav label="Back" fallbackHref="/" />

          {/* Editorial Page Introduction */}
          <PageIntro
            eyebrow="Contact"
            title="Connect with Viyaan AI"
            description="Whether proposing research collaboration, exploring platform integrations, or seeking technical consultation, our engineering team reviews inquiries directly."
            className="mb-12 sm:mb-16"
          />

          {/* Balanced 2-Column Desktop Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Official Channels (~38%) */}
            <div className="lg:col-span-4 lg:col-start-2 flex flex-col gap-6">
              <div className="surface-card p-6 sm:p-7 flex flex-col gap-5">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-mono block mb-1">
                    Official Channels
                  </span>
                  <h3 className="font-display font-semibold text-base sm:text-lg text-white">
                    Direct Inquiries
                  </h3>
                </div>

                <div className="flex flex-col gap-4 text-xs font-sans">
                  <div className="flex flex-col gap-1">
                    <span className="text-neutral-500">Email Address</span>
                    <a
                      href={`mailto:${emailAddress}`}
                      className="text-sm text-white hover:text-[#00B2FF] transition-colors break-all"
                    >
                      {emailAddress}
                    </a>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-neutral-500">LinkedIn Headquarters</span>
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-[#00B2FF] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>linkedin.com/company/viyaan-ai</span>
                      <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                    </a>
                  </div>

                  <div className="flex flex-col gap-1 pt-3 border-t border-white/[0.05]">
                    <span className="text-neutral-500">Response Protocol</span>
                    <div className="flex items-center gap-2 text-neutral-400 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Inquiries reviewed within {responseTime}.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Inquiry Form (~62%) */}
            <div className="lg:col-span-6">
              <div className="surface-card p-6 sm:p-8">
                {submitted ? (
                  <div className="py-10 flex flex-col items-center text-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-semibold text-xl sm:text-2xl text-white">
                      Inquiry Transmitted
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 font-sans max-w-md leading-relaxed">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="flex flex-col gap-1.5">
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
                          className="input-base text-xs"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-xs text-neutral-400 font-sans">
                          Work / Academic Email <span className="text-[#00B2FF]">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="ada@domain.org"
                          className="input-base text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="company" className="text-xs text-neutral-400 font-sans">
                          Organization / Institution
                        </label>
                        <input
                          id="company"
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Research Lab / Company"
                          className="input-base text-xs"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="phone" className="text-xs text-neutral-400 font-sans">
                          Phone Number (Optional)
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="input-base text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="subject" className="text-xs text-neutral-400 font-sans">
                        Topic of Inquiry
                      </label>
                      <input
                        id="subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Research Collaboration, Integration, or Media"
                        className="input-base text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message" className="text-xs text-neutral-400 font-sans">
                        Inquiry Details <span className="text-[#00B2FF]">*</span>
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please provide details regarding your technical requirements or proposal..."
                        className="p-3.5 rounded-lg bg-[#070709] border border-white/[0.07] text-xs text-white placeholder-neutral-500 focus:border-[#00B2FF] focus:outline-none transition-colors font-sans leading-relaxed"
                      />
                    </div>

                    {errorMsg && (
                      <div className="flex items-center gap-2 text-xs text-rose-400 font-sans">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <span className="text-[11px] text-neutral-500 font-sans">
                        Transmitted directly to Viyaan AI systems.
                      </span>
                      <button
                        type="submit"
                        disabled={loading}
                        className="cta-primary w-full sm:w-auto"
                      >
                        <span>{loading ? "Transmitting..." : "Submit Inquiry"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </SiteContainer>
      </main>

      <NewsletterSection />
      <Footer />
    </div>
  );
}
