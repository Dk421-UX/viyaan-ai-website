"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import LinkedInIcon from "@/components/LinkedInIcon";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import PageIntro from "@/components/PageIntro";
import SiteContainer from "@/components/SiteContainer";
import { trackContactButtonClick, trackFormSubmission } from "@/analytics/events";

type Company = { email?: string; linkedinCompany?: string; linkedinEnabled?: boolean };

export default function ContactClient({ company }: { company: Company }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const emailAddress = company?.email || "viyaan.ai.team@gmail.com";
  const linkedin = company?.linkedinCompany || "https://www.linkedin.com/company/viyaan-ai";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    setError("");
    trackContactButtonClick("Submit inquiry");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject: subject || "Website inquiry", message }),
      });
      if (!response.ok) throw new Error((await response.json()).error || "Unable to send your message.");
      trackFormSubmission("success", "contact_inquiry");
      setState("success");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unable to send your message.";
      trackFormSubmission("failure", "contact_inquiry", message);
      setError(message);
      setState("error");
    }
  }

  return (
    <div className="site-page">
      <Navigation />
      <main className="page-header-offset">
        <SiteContainer>
          <PageIntro eyebrow="Contact" title="Let’s build better learning tools." description="For project inquiries, partnerships, or thoughtful feedback." className="mb-10 sm:mb-12" />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)] lg:gap-14">
            <div className="space-y-7 text-sm leading-6 text-slate-300">
              <div>
                <p className="eyebrow">Reach us</p>
                <a href={`mailto:${emailAddress}`} className="mt-3 block break-all text-base text-white hover:text-sky-300">{emailAddress}</a>
              </div>
              {company?.linkedinEnabled !== false ? <div>
                <p className="eyebrow">Follow</p>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="Viyaan AI on LinkedIn (opens in a new tab)" className="mt-3 inline-flex items-center gap-2 text-base text-white hover:text-sky-300">
                  <LinkedInIcon className="size-4" /> Official LinkedIn
                </a>
              </div> : null}
            </div>

            <div className="surface-card p-5 sm:p-7">
              {state === "success" ? (
                <div className="flex min-h-56 flex-col items-start justify-center">
                  <CheckCircle2 className="size-7 text-sky-300" aria-hidden="true" />
                  <h2 className="mt-4 font-display text-2xl font-semibold text-white">Message received.</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">Thank you for reaching out. We will review your message and respond when appropriate.</p>
                  <button type="button" onClick={() => { setState("idle"); setMessage(""); }} className="cta-secondary mt-6">Send another message</button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block text-sm text-slate-300">Name<input required value={name} onChange={(event) => setName(event.target.value)} className="input-base mt-2" autoComplete="name" /></label>
                    <label className="block text-sm text-slate-300">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input-base mt-2" autoComplete="email" /></label>
                  </div>
                  <label className="block text-sm text-slate-300">Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} className="input-base mt-2" placeholder="How can we help?" /></label>
                  <label className="block text-sm text-slate-300">Message<textarea required value={message} onChange={(event) => setMessage(event.target.value)} className="textarea-base mt-2" placeholder="Tell us a little about your inquiry." /></label>
                  {state === "error" ? <p className="flex items-center gap-2 text-sm text-rose-300"><AlertCircle className="size-4" />{error}</p> : null}
                  <button type="submit" disabled={state === "saving"} className="cta-primary">{state === "saving" ? "Sending…" : "Send message"}</button>
                </form>
              )}
            </div>
          </div>
        </SiteContainer>
      </main>
      <Footer />
    </div>
  );
}
