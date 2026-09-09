import Link from "next/link";
import Navigation from "@/components/Navigation";
import FounderSection from "@/components/FounderSection";
import Footer from "@/components/Footer";
import { getDb } from "@/lib/db";
import { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";

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

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const db = await getDb();
  const company = db.companyInfo || {};
  const homepage = db.homepage || {};
  const products = (db.products || []).filter(
    (p: any) => p.status?.toLowerCase() === "published"
  );
  const research = (db.research || []).filter(
    (r: any) => r.status?.toLowerCase() === "published"
  );

  const tagline = homepage.heroHeading || company.tagline || "Intelligence Beyond the Human Mind.";
  const description =
    homepage.heroSubheading ||
    "Building intelligent systems for human understanding, reflection, and continuity.";

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E4E4E7] flex flex-col overflow-x-hidden selection:bg-[#0066FF]/30">
      <Navigation />

      {/* Atmospheric ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] bg-gradient-to-b from-[#0066FF]/6 to-transparent blur-[140px] pointer-events-none -z-10" />

      <main className="flex-1 flex flex-col">
        {/*
         * ══════════════════════════════════════════════════════════════
         *  SECTION 01: MINIMAL EDITORIAL HERO (NO 3D, INTENTIONAL BREATHING SPACE)
         * ══════════════════════════════════════════════════════════════
         */}
        <section className="relative hero-content-offset pb-16 sm:pb-20 md:pb-24 px-6 sm:px-8 md:px-12">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Dominant statement headline */}
          <h1 className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] tracking-tight text-white leading-[1.08] max-w-3xl lg:max-w-4xl mx-auto">
            {tagline === "Intelligence Beyond the Human Mind." ? (
              <>
                Intelligence Beyond<br className="hidden sm:inline" /> the Human Mind.
              </>
            ) : (
              tagline
            )}
          </h1>

          {/* One concise supporting sentence */}
          <p className="font-sans text-base sm:text-lg text-neutral-400 leading-relaxed max-w-xl mx-auto mt-6 sm:mt-7">
            {description}
          </p>

          {/* Single primary action */}
          <div className="mt-8 sm:mt-9">
            <Link href="/products" className="cta-primary">
              <span>Explore Products</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/*
       * ══════════════════════════════════════════════════════════════
       *  SECTION 02: WHAT WE BUILD
       * ══════════════════════════════════════════════════════════════
       */}
      <section className="relative py-16 sm:py-20 px-6 sm:px-8 md:px-12 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto flex flex-col gap-3">
          <span className="text-xs uppercase tracking-widest text-[#00B2FF] font-sans">
            What We Build
          </span>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
            We build intelligent systems.
          </h2>
          <p className="font-sans text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl mt-1">
            Cognitive architectures designed for human depth—combining emotional presence, psychology-first self-reflection, and permanent continuity.
          </p>
        </div>
      </section>

      {/*
       * ══════════════════════════════════════════════════════════════
       *  SECTION 03: PRODUCTS ECOSYSTEM
       * ══════════════════════════════════════════════════════════════
       */}
      <section className="relative py-16 sm:py-24 px-6 sm:px-8 md:px-12 border-t border-white/[0.05] bg-[#09090C]/30">
        <div className="max-w-5xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-500 font-sans block mb-1">
                Ecosystem
              </span>
              <h2 className="font-display font-semibold text-2xl sm:text-3xl text-white tracking-tight">
                Connected Platforms
              </h2>
            </div>
            <Link href="/products" className="cta-link">
              <span>Explore all platforms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Product Triad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {products.slice(0, 3).map((p: any) => {
              const productName = p.title || p.name;
              const isJoi = p.id?.includes("joi");
              const isHuman = p.id?.includes("human");
              const category = isJoi ? "Emotion" : isHuman ? "Cognition" : "Continuity";
              const accentColor = isJoi ? "#10B981" : isHuman ? "#00B2FF" : "#A855F7";

              return (
                <div
                  key={p.id}
                  className="group relative flex flex-col p-6 sm:p-7 rounded-2xl border border-white/[0.06] bg-[#09090C]/70 hover:bg-[#0E0E14] hover:border-white/[0.14] transition-all duration-300 h-auto"
                >
                  <div className="flex items-center justify-between mb-3.5">
                    <span
                      className="text-[11px] font-sans uppercase tracking-wider px-2 py-0.5 rounded border border-white/[0.08] bg-white/[0.02]"
                      style={{ color: accentColor }}
                    >
                      {category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-neutral-500 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Active</span>
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-lg sm:text-xl text-white group-hover:text-white transition-colors">
                    {productName}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed mt-2 line-clamp-3">
                    {p.tagline || p.description}
                  </p>

                  <div className="mt-5 pt-3.5 border-t border-white/[0.06]">
                    <a
                      href={p.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-1.5 text-xs font-medium text-white hover:text-[#00B2FF] font-sans transition-colors py-0.5 focus-visible:outline-none"
                    >
                      <span>Launch platform</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover/link:text-[#00B2FF] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-200" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/*
       * ══════════════════════════════════════════════════════════════
       *  SECTION 04: RESEARCH (ACTUAL ADMIN DATA ONLY)
       * ══════════════════════════════════════════════════════════════
       */}
      {research.length > 0 && (
        <section className="relative py-16 sm:py-24 px-6 sm:px-8 md:px-12 border-t border-white/[0.05]">
          <div className="max-w-5xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#0066FF] font-sans block mb-1">
                  Research
                </span>
                <h2 className="font-display font-semibold text-2xl sm:text-3xl text-white tracking-tight">
                  Published Manuscripts
                </h2>
              </div>
              <Link href="/research" className="cta-link">
                <span>View research archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Actual Research Item from Admin */}
            <div className="p-7 sm:p-9 rounded-2xl border border-white/[0.06] bg-[#09090C]/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="max-w-xl flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-sans">
                  <span className="text-[#00B2FF]">{research[0].field || "Cognitive Science"}</span>
                  <span>•</span>
                  <span>{research[0].date}</span>
                </div>
                <h3 className="font-display font-semibold text-xl text-white">
                  {research[0].title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
                  {research[0].excerpt}
                </p>
              </div>
              <Link href="/research" className="cta-secondary shrink-0">
                <span>Read paper</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/*
       * ══════════════════════════════════════════════════════════════
       *  SECTION 05: FOUNDER
       * ══════════════════════════════════════════════════════════════
       */}
      <section className="relative py-16 sm:py-24 px-6 sm:px-8 md:px-12 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <FounderSection />
        </div>
      </section>

      {/*
       * ══════════════════════════════════════════════════════════════
       *  SECTION 06: CONTACT / CONVERGENCE
       * ══════════════════════════════════════════════════════════════
       */}
      <section className="relative py-20 sm:py-28 px-6 sm:px-8 md:px-12 border-t border-white/[0.05] bg-gradient-to-b from-[#050505] to-[#09090C]/40 text-center">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00B2FF]" />
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-white tracking-tight">
            Connect with Viyaan AI
          </h2>
          <p className="font-sans text-sm text-neutral-400 leading-relaxed">
            We welcome inquiries regarding research collaboration, platform integration, and foundational engineering.
          </p>
          <div className="mt-2">
            <Link href="/contact" className="cta-primary">
              <span>Initiate Contact</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);
}
