import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import ProjectGrid from "@/components/ProjectGrid";
import SiteContainer from "@/components/SiteContainer";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const db = await getDb();
  const seo = db.seo?.home || {};
  return {
    title: seo.title || "Viyaan AI | AI That Helps People Learn Better",
    description: seo.description || "Building intelligent learning solutions through AI, data science, and purposeful innovation.",
  };
}

export default async function Home() {
  const db = await getDb();
  const company = db.companyInfo || {};
  const homepage = db.homepage || {};

  return (
    <div className="site-page">
      <Navigation />
      <main>
        <section className="hero-section">
          <SiteContainer className="hero-content">
            <p className="eyebrow">{company.name || "Viyaan AI"}</p>
            <p className="mt-4 font-display text-lg font-medium text-slate-200">{company.tagline || "Beyond Learning. Beyond Limits."}</p>
            <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.04] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
              {homepage.heroHeading || "AI That Helps People Learn Better."}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              {homepage.heroSubheading || "Building intelligent learning solutions through AI, data science, and purposeful innovation."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#projects" className="cta-primary">Explore Projects</Link>
              <Link href="#vision" className="cta-secondary">Our Vision</Link>
            </div>
          </SiteContainer>
        </section>

        <section id="about" className="page-section border-t border-white/[0.08] scroll-mt-20">
          <SiteContainer>
            <div className="copy-grid">
              <div>
                <p className="eyebrow">About</p>
                <h2 className="section-heading mt-4">{homepage.aboutHeading || "Intelligence With a Purpose."}</h2>
              </div>
              <div className="space-y-6">
                <p className="section-copy">
                  {homepage.aboutText || "Viyaan AI builds intelligent learning experiences that help people move beyond memorisation towards deeper understanding, stronger problem-solving, and independent thinking."}
                </p>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
                  <p className="eyebrow text-sky-400">Our Purpose</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
                    {homepage.aboutPurpose || "To make learning more effective, personalised, and accessible through purposeful AI innovation."}
                  </p>
                </div>
              </div>
            </div>
          </SiteContainer>
        </section>

        <section id="projects" className="page-section border-t border-white/[0.08] scroll-mt-20">
          <SiteContainer>
            <div className="section-header">
              <div>
                <p className="eyebrow">Projects</p>
                <h2 className="section-heading mt-4">Purpose-built learning tools.</h2>
              </div>
              <p className="section-copy max-w-md">Three focused initiatives for revision, preparation, and academic planning.</p>
            </div>
            <div className="mt-8"><ProjectGrid projects={db.products || []} /></div>
          </SiteContainer>
        </section>

        <section id="vision" className="page-section border-y border-white/[0.08] bg-white/[0.02] scroll-mt-20">
          <SiteContainer>
            <div className="copy-grid">
              <div>
                <p className="eyebrow">Vision</p>
                <h2 className="section-heading mt-4">{homepage.visionHeading || "Beyond Answers. Towards Understanding."}</h2>
              </div>
              <p className="section-copy">{homepage.visionText || "We believe AI should help people build understanding, think independently, and continue learning."}</p>
            </div>
          </SiteContainer>
        </section>
      </main>
      <Footer />
    </div>
  );
}
