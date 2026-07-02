import Link from "next/link";
import Navigation from "@/components/Navigation";
import IntelligenceCanvas from "@/components/IntelligenceCanvas";
import Footer from "@/components/Footer";
import { getDb } from "@/lib/db";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const db = await getDb();
  const seo = db.seo?.home || {};
  return {
    title: seo.title || "Viyaan AI — Intelligence Beyond the Human Mind",
    description:
      seo.description ||
      "Building next-generation intelligent systems with emotional awareness, psychology-first design, and long-term reflection retention.",
  };
}

export default async function Home() {
  const db = await getDb();
  const company = db.companyInfo || {};
  const homepage = db.homepage || {};

  const tagline = homepage.heroHeading || company.tagline || "Intelligence Beyond the Human Mind.";
  const description = homepage.heroSubheading || company.description || "Viyaan AI is a technology startup focused on building intelligent systems using Artificial Intelligence, Data Science, and Automation.";
  const primaryCta = homepage.heroCta || "Explore Products";
  const primaryCtaLink = homepage.heroCtaLink || "/products";
  const secondaryCta = homepage.heroSecondCta || "";
  const secondaryCtaLink = homepage.heroSecondCtaLink || "";

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E4E4E7] flex flex-col overflow-x-hidden">
      <Navigation />

      {/*
       * ══════════════════════════════════════════════════════════════
       *  MOBILE HERO  — visible only on screens < 768px
       *
       *  Dedicated independent layout. No shared styles with desktop.
       *
       *  Header height (initial/not-scrolled):
       *    pt-[calc(1.5rem+safe-area)] + h-8(2rem) + pb-6(1.5rem)
       *    = calc(5rem + env(safe-area-inset-top))
       * ══════════════════════════════════════════════════════════════
       */}
      <div className="md:hidden flex flex-col flex-1 blueprint-dots animate-fade-in animate-duration-500">

        {/* ① Exact header clearance — pushes content below fixed nav */}
        <div
          aria-hidden="true"
          style={{ height: "calc(5rem + env(safe-area-inset-top))" }}
        />

        {/* ② Hero content — starts 40px below the header */}
        <div className="flex flex-col gap-6 px-5 pt-10 pb-8">
          {/* Heading: fluid 36px–42px across all mobile viewports */}
          <h1
            className="font-display font-bold tracking-tight text-white"
            style={{
              fontSize: "clamp(2.25rem, 10vw, 2.625rem)",
              lineHeight: 1.15,
              maxWidth: "90%",
            }}
          >
            {tagline}
          </h1>

          {/* Description */}
          <p
            className="font-sans text-sm text-neutral-400 leading-relaxed"
            style={{ maxWidth: "85vw" }}
          >
            {description}
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-wrap gap-3">
            {primaryCta && (
              <Link
                href={primaryCtaLink}
                className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition-colors focus-visible:outline-none"
              >
                {primaryCta}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCtaLink}
                className="inline-flex items-center justify-center h-11 px-6 rounded-lg border border-neutral-800 bg-neutral-950/80 hover:bg-neutral-900 text-neutral-300 font-mono text-xs font-semibold hover:border-neutral-700 transition-all focus-visible:outline-none"
              >
                {secondaryCta}
              </Link>
            )}
          </div>
        </div>

        {/* ③ Interactive canvas */}
        <div className="w-full px-5 pb-16">
          <IntelligenceCanvas />
        </div>
      </div>

      {/*
       * ══════════════════════════════════════════════════════════════
       *  DESKTOP HERO  — visible only on screens ≥ 768px
       *
       *  Dedicated independent layout. No shared styles with mobile.
       *  Desktop typography and centering unchanged.
       * ══════════════════════════════════════════════════════════════
       */}
      <main className="hidden md:flex flex-1 flex-col justify-center items-center px-6 pt-44 pb-24 blueprint-dots animate-fade-in animate-duration-500">
        <div className="w-full max-w-5xl flex flex-col gap-12 lg:gap-16">

          {/* Hero Content */}
          <div className="max-w-2xl flex flex-col gap-6">
            <h1 className="font-display font-bold text-5xl lg:text-6xl tracking-tight text-white leading-[1.1]">
              {tagline}
            </h1>
            <p className="font-sans text-base text-neutral-400 leading-relaxed">
              {description}
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              {primaryCta && (
                <Link
                  href={primaryCtaLink}
                  className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition-colors focus-visible:outline-none"
                >
                  {primaryCta}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCtaLink}
                  className="inline-flex items-center justify-center h-10 px-5 rounded-lg border border-neutral-850 bg-neutral-950/80 hover:bg-neutral-900 text-neutral-300 font-mono text-xs font-semibold hover:border-neutral-700 transition-all focus-visible:outline-none"
                >
                  {secondaryCta}
                </Link>
              )}
            </div>
          </div>

          {/* Interactive canvas */}
          <div className="w-full">
            <IntelligenceCanvas />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

