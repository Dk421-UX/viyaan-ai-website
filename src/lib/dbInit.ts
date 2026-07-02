import { supabaseAdmin, isSupabaseAdminConfigured } from "./supabase";
import fs from "fs/promises";
import path from "path";

const localDbPath = path.join(process.cwd(), "src/data/db.json");

export async function runAutoInitialization() {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return { success: false, message: "Supabase not configured. Operating in Local File Mode." };
  }

  try {
    // 1. Verify if tables exist by querying company_settings
    const { error: probeError } = await supabaseAdmin.from("company_settings").select("id").limit(1);
    
    if (probeError) {
      if (probeError.code === "42P01" || probeError.message?.includes("does not exist")) {
        return {
          success: false,
          needsMigration: true,
          message: "Database connected, but tables do not exist yet. Please execute the SQL script in schema.sql inside your Supabase SQL Editor."
        };
      }
      return { success: false, message: `Database probe error: ${probeError.message}` };
    }

    // 2. Read local db.json data to check if we need to seed
    const fileContent = await fs.readFile(localDbPath, "utf-8");
    const localDb = JSON.parse(fileContent);

    // 3. Auto-seed tables if they are empty
    let seededCount = 0;

    // Seed Company Settings
    const { count: companyCount } = await supabaseAdmin.from("company_settings").select("id", { count: "exact", head: true });
    if (companyCount === 0) {
      const info = localDb.companyInfo || {};
      await supabaseAdmin.from("company_settings").insert({
        id: "only_one",
        name: info.name || "Viyaan AI",
        tagline: info.tagline || "Intelligence Beyond the Human Mind.",
        description: info.description || "",
        email: info.email || "viyaan.ai.team@gmail.com",
        location: info.location || "Chennai, India / Remote",
        linkedin_company: info.linkedinCompany || "",
        linkedin_founder: info.linkedinFounder || "",
        twitter_founder: info.twitterFounder || "",
        response_time: info.responseTime || "2 business days",
        founder_image: info.founderImage || "/founder.jpeg"
      });
      seededCount++;
    }

    // Seed Founder
    const { count: founderCount } = await supabaseAdmin.from("founder").select("id", { count: "exact", head: true });
    if (founderCount === 0) {
      const info = localDb.companyInfo || {};
      await supabaseAdmin.from("founder").insert({
        id: "only_one",
        name: "Dharani Kumar",
        biography: "Viyaan AI is not built behind hidden doors. We design publicly, sharing our challenges, research papers, engineering decisions, and daily lessons. This transparency keeps us disciplined, accountable, and deeply connected with our community.",
        linkedin: info.linkedinFounder || "",
        twitter: info.twitterFounder || "",
        image_url: info.founderImage || "/founder.jpeg"
      });
      seededCount++;
    }

    // Seed Homepage
    const { count: homepageCount } = await supabaseAdmin.from("homepage").select("id", { count: "exact", head: true });
    if (homepageCount === 0) {
      const info = localDb.companyInfo || {};
      await supabaseAdmin.from("homepage").insert({
        id: "only_one",
        tagline: info.tagline || "Intelligence Beyond the Human Mind.",
        description: info.description || "",
        cta_text: "Explore Products",
        cta_url: "/products"
      });
      seededCount++;
    }

    // Seed Navigation
    const { count: navCount } = await supabaseAdmin.from("navigation").select("id", { count: "exact", head: true });
    if (navCount === 0 && localDb.navigation) {
      const rows = localDb.navigation.map((n: any, idx: number) => ({
        label: n.label,
        href: n.href,
        sort_order: idx + 1
      }));
      await supabaseAdmin.from("navigation").insert(rows);
      seededCount++;
    }

    // Seed SEO Settings
    const { count: seoCount } = await supabaseAdmin.from("seo_settings").select("page_key", { count: "exact", head: true });
    if (seoCount === 0 && localDb.seo) {
      const rows = Object.entries(localDb.seo).map(([key, data]: [string, any]) => ({
        page_key: key,
        title: data.title,
        description: data.description
      }));
      await supabaseAdmin.from("seo_settings").insert(rows);
      seededCount++;
    }

    // Seed Products
    const { count: prodCount } = await supabaseAdmin.from("products").select("id", { count: "exact", head: true });
    if (prodCount === 0 && localDb.products) {
      await supabaseAdmin.from("products").insert(localDb.products);
      seededCount++;
    }

    // Seed Blogs (Posts)
    const { count: blogCount } = await supabaseAdmin.from("blogs").select("slug", { count: "exact", head: true });
    if (blogCount === 0 && localDb.posts) {
      const rows = localDb.posts.map((p: any) => ({
        slug: p.slug,
        title: p.title,
        date: p.date,
        category: p.category,
        excerpt: p.excerpt,
        content: p.content,
        tags: p.tags,
        status: p.status,
        seo_title: p.seoTitle,
        seo_desc: p.seoDesc
      }));
      await supabaseAdmin.from("blogs").insert(rows);
      seededCount++;
    }

    // Seed Research
    const { count: researchCount } = await supabaseAdmin.from("research").select("slug", { count: "exact", head: true });
    if (researchCount === 0 && localDb.research) {
      await supabaseAdmin.from("research").insert(localDb.research);
      seededCount++;
    }

    // Seed Innovation Lab (Lab Projects)
    const { count: labCount } = await supabaseAdmin.from("innovation_lab").select("id", { count: "exact", head: true });
    if (labCount === 0 && localDb.labProjects) {
      const rows = localDb.labProjects.map((l: any) => ({
        id: l.id,
        title: l.title,
        type: l.type,
        status_text: l.statusText,
        description: l.description,
        tags: l.tags,
        status: l.status
      }));
      await supabaseAdmin.from("innovation_lab").insert(rows);
      seededCount++;
    }

    // Seed Careers
    const { count: careersCount } = await supabaseAdmin.from("careers").select("id", { count: "exact", head: true });
    if (careersCount === 0 && localDb.careers) {
      const c = localDb.careers;
      await supabaseAdmin.from("careers").insert({
        id: "only_one",
        title: c.title,
        description: c.description,
        linkedin_link: c.linkedinLink
      });
      seededCount++;
    }

    // Seed Homepage Settings (Phase 2)
    const { count: homepageSettingsCount } = await supabaseAdmin.from("homepage_settings").select("id", { count: "exact", head: true });
    if (homepageSettingsCount === 0 && localDb.homepage) {
      const h = localDb.homepage;
      await supabaseAdmin.from("homepage_settings").insert({
        id: "main",
        hero_heading: h.heroHeading || "Intelligence Beyond the Human Mind.",
        hero_subheading: h.heroSubheading || "",
        hero_cta: h.heroCta || "Explore Our Ecosystem",
        hero_cta_link: h.heroCtaLink || "/products",
        hero_second_cta: h.heroSecondCta || "Read Research",
        hero_second_cta_link: h.heroSecondCtaLink || "/research"
      });
      seededCount++;
    }

    // Seed Analytics Settings (Phase 2)
    const { count: analyticsSettingsCount } = await supabaseAdmin.from("analytics_settings").select("id", { count: "exact", head: true });
    if (analyticsSettingsCount === 0 && localDb.analytics) {
      const a = localDb.analytics;
      await supabaseAdmin.from("analytics_settings").insert({
        id: "main",
        ga_tracking_id: a.gaTrackingId || "",
        enable_analytics: a.enableAnalytics ?? false,
        cookie_consent_enabled: a.cookieConsentEnabled ?? true,
        privacy_policy_url: a.privacyPolicyUrl || "/privacy"
      });
      seededCount++;
    }

    // Seed Newsletter Settings (Phase 2)
    const { count: newsletterSettingsCount } = await supabaseAdmin.from("newsletter_settings").select("id", { count: "exact", head: true });
    if (newsletterSettingsCount === 0 && localDb.newsletter) {
      const n = localDb.newsletter;
      await supabaseAdmin.from("newsletter_settings").insert({
        id: "main",
        enabled: n.enabled ?? true,
        title: n.title || "Stay Ahead of the Intelligence Curve",
        description: n.description || ""
      });
      seededCount++;
    }

    // Seed Default Admin if missing
    const { count: adminCount } = await supabaseAdmin.from("admins").select("id", { count: "exact", head: true });
    if (adminCount === 0) {
      await supabaseAdmin.from("admins").insert({
        email: "admin@viyaan.ai",
        passphrase: "viyaan2026"
      });
      seededCount++;
    }

    return {
      success: true,
      message: seededCount > 0 ? `Successfully initialized and seeded ${seededCount} database tables!` : "Database initialized and fully synced."
    };
  } catch (error: any) {
    console.error("Supabase Auto-Initialization error:", error);
    return { success: false, message: `Auto-init crash: ${error.message || error}` };
  }
}
