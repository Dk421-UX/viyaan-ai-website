import Link from "next/link";
import Navigation from "@/components/Navigation";
import FounderSection from "@/components/FounderSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import SiteContainer from "@/components/SiteContainer";
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
    <div className="relative min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col overflow-x-hidden selection:bg-[#0066FF]/30">
      <Navigation />

      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-[#0066FF]/8 to-transparent blur-[140px] pointer-events-none -z-10" />

      <main className="flex-1 flex flex-col">
        {/*
         * ─────────────────────────────────────────────────────────────
         *  HERO SECTION: RESTRAINED, CONFIDENT COMPANY STATEMENT
         * ─────────────────────────────────────────────────────────────
         */}
        <section className="relative hero-header-offset pb-[clamp(4.5rem,7vw,7.5rem)]">
          <SiteContainer>
            <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="flex flex-col items-start text-left max-w-3xl lg:col-span-8 lg:col-start-3">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#00B2FF] font-mono font-medium mb-4">
                Foundational AI Systems
              </span>

              <h1 className="font-display font-semibold text-[2.5rem] sm:text-5xl lg:text-[4rem] tracking-[-0.045em] text-white leading-[1.02]">
                {tagline === "Intelligence Beyond the Human Mind." ? (
                  <>
                    Intelligence Beyond<br className="hidden sm:inline" /> the Human Mind.
                  </>
                ) : (
                  tagline
                )}
              </h1>

              <p className="font-sans text-sm sm:text-base text-neutral-400 leading-7 max-w-xl mt-6">
                {description}
              </p>

              <div className="mt-8 flex items-center gap-3">
                <Link href="/products" className="cta-primary">
                  <span>Explore Products</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
                <Link href="/research" className="cta-secondary">
                  <span>Research</span>
                </Link>
              </div>
            </div>
            </div>
          </SiteContainer>
        </section>

        {/*
         * ─────────────────────────────────────────────────────────────
         *  SECTION 02: WHAT WE BUILD
         * ─────────────────────────────────────────────────────────────
         */}
        <section className="relative page-section border-t border-white/[0.06]">
          <SiteContainer>
            <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="flex flex-col gap-3 content-measure lg:col-span-7 lg:col-start-3">
              <span className="text-[11px] uppercase tracking-widest text-[#00B2FF] font-mono font-medium">
                Mandate
              </span>
              <h2 className="font-display font-semibold text-xl sm:text-2xl md:text-3xl text-white tracking-tight">
                We build intelligent systems.
              </h2>
              <p className="font-sans text-xs sm:text-sm text-neutral-400 leading-relaxed mt-1">
                Cognitive architectures designed for human depth—combining emotional presence, psychology-first self-reflection, and permanent continuity.
              </p>
            </div>
            </div>
          </SiteContainer>
        </section>

        {/*
         * ─────────────────────────────────────────────────────────────
         *  SECTION 03: PRODUCT ECOSYSTEM
         * ─────────────────────────────────────────────────────────────
         */}
        <section className="relative page-section border-t border-white/[0.06] bg-[#07070A]/50">
          <SiteContainer>
            <div className="flex flex-col gap-8 sm:gap-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-mono font-medium">
                    Ecosystem
                  </span>
                  <h2 className="font-display font-semibold text-xl sm:text-2xl md:text-3xl text-white tracking-tight">
                    Connected Platforms
                  </h2>
                </div>
                <Link href="/products" className="cta-link">
                  <span>Explore all platforms</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
                {products.slice(0, 3).map((p: any, index: number) => {
                  const productName = p.title || p.name;
                  const isJoi = p.id?.includes("joi");
                  const isHuman = p.id?.includes("human");
                  const category = isJoi ? "Emotion" : isHuman ? "Cognition" : "Continuity";
                  const accentColor = isJoi ? "#10B981" : isHuman ? "#00B2FF" : "#A855F7";

                  return (
                    <div
                      key={p.id}
                      className={`surface-card surface-card-hover p-6 sm:p-7 flex flex-col ${index === 0 ? "lg:col-span-6" : "lg:col-span-3"}`}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-white/[0.08] bg-white/[0.02]"
                            style={{ color: accentColor }}
                          >
                            {category}
                          </span>
                          <span className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-sans">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>Active</span>
                          </span>
                        </div>

                        <div>
                          <h3 className="font-display font-semibold text-base sm:text-lg text-white">
                            {productName}
                          </h3>
                          <p className="text-xs text-neutral-400 font-sans leading-relaxed mt-2 line-clamp-3">
                            {p.tagline || p.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-white/[0.05]">
                        <a
                          href={p.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cta-link text-xs text-white hover:text-[#00B2FF] font-medium"
                        >
                          <span>Launch platform</span>
                          <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SiteContainer>
        </section>

        {/*
         * ─────────────────────────────────────────────────────────────
         *  SECTION 04: RESEARCH (CMS-DRIVEN ONLY)
         * ─────────────────────────────────────────────────────────────
         */}
        {research.length > 0 && (
          <section className="relative page-section border-t border-white/[0.06]">
            <SiteContainer>
              <div className="flex flex-col gap-6 sm:gap-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] uppercase tracking-widest text-[#0066FF] font-mono font-medium">
                      Research
                    </span>
                    <h2 className="font-display font-semibold text-xl sm:text-2xl md:text-3xl text-white tracking-tight">
                      Published Manuscripts
                    </h2>
                  </div>
                  <Link href="/research" className="cta-link">
                    <span>View research archive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="surface-card p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="max-w-xl flex flex-col gap-2">
                    {(research[0].field || research[0].date) && (
                      <div className="flex items-center gap-2 text-xs text-neutral-500 font-sans">
                        {research[0].field && <span className="text-[#00B2FF] font-medium">{research[0].field}</span>}
                        {research[0].field && research[0].date && <span>•</span>}
                        {research[0].date && <span>{research[0].date}</span>}
                      </div>
                    )}
                    <h3 className="font-display font-semibold text-lg sm:text-xl text-white">
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
            </SiteContainer>
          </section>
        )}

        {/*
         * ─────────────────────────────────────────────────────────────
         *  SECTION 05: FOUNDER
         * ─────────────────────────────────────────────────────────────
         */}
        <section className="relative page-section border-t border-white/[0.06]">
          <SiteContainer>
            <FounderSection />
          </SiteContainer>
        </section>

        {/*
         * ─────────────────────────────────────────────────────────────
         *  SECTION 06: CONTACT / CONVERGENCE
         * ─────────────────────────────────────────────────────────────
         */}
        <section className="relative page-section border-t border-white/[0.06] text-center">
          <SiteContainer>
            <div className="max-w-lg mx-auto flex flex-col items-center gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B2FF]" />
              <h2 className="font-display font-semibold text-2xl sm:text-3xl text-white tracking-tight">
                Connect with Viyaan AI
              </h2>
              <p className="font-sans text-xs sm:text-sm text-neutral-400 leading-relaxed">
                We welcome inquiries regarding research collaboration, platform integration, and foundational engineering.
              </p>
              <div className="mt-2">
                <Link href="/contact" className="cta-primary">
                  <span>Initiate Contact</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              </div>
            </div>
          </SiteContainer>
        </section>
      </main>

      <NewsletterSection />
      <Footer />
    </div>
  );
}
