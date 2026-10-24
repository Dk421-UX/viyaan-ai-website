"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BrandMark from "./BrandMark";
import SiteContainer from "./SiteContainer";
import LinkedInIcon from "./LinkedInIcon";

type Company = { tagline?: string; linkedinCompany?: string; linkedinEnabled?: boolean; copyrightText?: string };

export default function Footer() {
  const [company, setCompany] = useState<Company>({});

  useEffect(() => {
    fetch("/api/content")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setCompany(data?.companyInfo || {}))
      .catch(() => undefined);
  }, []);

  const linkedin = company.linkedinCompany || "https://www.linkedin.com/company/viyaan-ai";

  return (
    <footer className="border-t border-white/[0.08] bg-[#030612] py-10">
      <SiteContainer>
        <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <Link href="/" className="inline-flex" aria-label="Viyaan AI home"><BrandMark /></Link>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">{company.tagline || "Beyond Learning. Beyond Limits."}</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-400">
            <Link href="/#about" className="hover:text-white">About</Link>
            <Link href="/#projects" className="hover:text-white">Projects</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            {company.linkedinEnabled !== false ? <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="Viyaan AI on LinkedIn (opens in a new tab)" className="inline-flex items-center gap-1.5 hover:text-white">
              <LinkedInIcon className="size-4" /> LinkedIn
            </a> : null}
          </div>
        </div>
        <div className="mt-8 border-t border-white/[0.08] pt-5 text-xs text-slate-500">
          {company.copyrightText || "© 2026 Viyaan AI. All rights reserved."}
        </div>
      </SiteContainer>
    </footer>
  );
}
