"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

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
          message
        })
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Submission failure. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Connection failure. Check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E4E4E7] flex flex-col overflow-x-hidden">
      <Navigation />

      <main className="flex-1 flex flex-col justify-center items-center px-5 sm:px-6 md:px-12 pt-[calc(8.5rem+env(safe-area-inset-top))] pb-12 md:pt-44 md:pb-24 blueprint-dots animate-fade-in animate-duration-500">
        <div className="w-full max-w-5xl flex flex-col gap-5 md:gap-12">
          
          {/* Back Navigation */}
          <div className="w-full flex justify-center my-6">
            <a
              href="/"
              onClick={handleBack}
              aria-label="Go back"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-800 bg-neutral-950/80 text-[11px] font-mono text-neutral-400 hover:text-white hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-200 cursor-pointer focus-visible:outline-none select-none"
              style={{ minHeight: '44px' }}
            >
              <span className="text-sm leading-none" aria-hidden="true">←</span>
              <span className="tracking-widest uppercase">Back</span>
            </a>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: Channels & Info */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-white leading-tight">
                  Connect with Us
                </h1>
              </div>

              <p className="font-sans text-sm text-neutral-400 leading-relaxed">
                Whether you want to explore collaboration, propose research projects, or follow our journey, we welcome structured communications.
              </p>

              {/* Factual Channels List */}
              <div className="border-t border-neutral-900 pt-6 flex flex-col gap-4 font-mono text-xs text-neutral-400">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-neutral-500 uppercase">Direct Email</span>
                  <a href={`mailto:${company?.email || "viyaan.ai.team@gmail.com"}`} className="text-white hover:underline py-1">
                    {company?.email || "viyaan.ai.team@gmail.com"}
                  </a>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-neutral-500 uppercase">LinkedIn Page</span>
                  <a href={company?.linkedinCompany || "https://www.linkedin.com/company/viyaan-ai"} target="_blank" rel="noopener noreferrer" className="text-white hover:underline py-1">
                    linkedin.com/company/viyaan-ai
                  </a>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-neutral-500 uppercase">Response SLA</span>
                  <span className="text-neutral-450">Verified inquiries answered within {company?.responseTime || "2 business days"}.</span>
                </div>
              </div>
            </div>

            {/* Right: Form (Visual Focus) */}
            <div className="lg:col-span-7 bg-neutral-950/30 border border-neutral-900 rounded-xl p-5 sm:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                  <div className="w-10 h-10 rounded-full bg-viyaan-blue/10 border border-viyaan-blue/30 flex items-center justify-center text-viyaan-blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="font-display font-semibold text-white text-base">Inquiry Transmitted</h3>
                  <p className="text-xs text-neutral-500 font-mono">Thank you. We have logged your request.</p>
                </div>
              ) : (
                <form 
                  onSubmit={handleSubmit} 
                  className="flex flex-col gap-5 text-xs font-mono"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-neutral-500 uppercase">Name</label>
                      <input 
                        type="text" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-neutral-950 border border-neutral-900 focus:border-neutral-700 outline-none rounded-lg px-3 h-11 text-white placeholder-neutral-700" 
                        placeholder="Your name" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-neutral-500 uppercase">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-neutral-950 border border-neutral-900 focus:border-neutral-700 outline-none rounded-lg px-3 h-11 text-white placeholder-neutral-700" 
                        placeholder="email@example.com" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-neutral-500 uppercase">Company (Optional)</label>
                      <input 
                        type="text" 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="bg-neutral-950 border border-neutral-900 focus:border-neutral-700 outline-none rounded-lg px-3 h-11 text-white placeholder-neutral-700" 
                        placeholder="Company name" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-neutral-500 uppercase">Phone (Optional)</label>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-neutral-950 border border-neutral-900 focus:border-neutral-700 outline-none rounded-lg px-3 h-11 text-white placeholder-neutral-700" 
                        placeholder="Phone number" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-neutral-500 uppercase">Subject (Optional)</label>
                    <input 
                      type="text" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="bg-neutral-950 border border-neutral-900 focus:border-neutral-700 outline-none rounded-lg px-3 h-11 text-white placeholder-neutral-700" 
                      placeholder="Subject of inquiry" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-neutral-500 uppercase">Message Details</label>
                    <textarea 
                      rows={5} 
                      required 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-neutral-950 border border-neutral-900 focus:border-neutral-700 outline-none rounded-lg px-3 py-2 text-white placeholder-neutral-700 resize-none" 
                      placeholder="Detail your request or inquiry..." 
                    />
                  </div>

                  {errorMsg && (
                    <div className="text-red-400 text-xs font-mono">{errorMsg}</div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-white hover:bg-neutral-200 text-black transition-colors text-xs font-semibold h-11 rounded-lg flex items-center justify-center cursor-pointer mt-2 focus-visible:outline-none disabled:bg-neutral-700 disabled:cursor-not-allowed"
                  >
                    {loading ? "Transmitting..." : "Transmit Inquiry"}
                  </button>
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
