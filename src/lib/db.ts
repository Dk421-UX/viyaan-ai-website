import fs from "fs/promises";
import path from "path";
import { isNeonConfigured, getDbFromNeon } from "./neon";
import { supabaseAdmin, isSupabaseAdminConfigured } from "./supabase";

const dbPath = path.join(process.cwd(), "src/data/db.json");

// Local DB fallback loader
async function getLocalDb() {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading local db.json:", error);
    return {
      companyInfo: {},
      navigation: [],
      seo: {},
      products: [],
      posts: [],
      research: [],
      labProjects: [],
      careers: {},
      homepage: {},
      analytics: {},
      newsletter: {},
      linkedinSync: []
    };
  }
}

// Write to local DB fallback
export async function writeLocalDb(data: any) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing local db.json:", error);
    return false;
  }
}

export async function getDb() {
  // 1. Prioritize Neon PostgreSQL (Primary Serverless Production Database)
  if (isNeonConfigured) {
    try {
      console.log("[getDb] Fetching data from Neon PostgreSQL...");
      const neonData = await getDbFromNeon();
      return neonData;
    } catch (neonErr) {
      console.error("[getDb] Neon PostgreSQL query error:", neonErr);
      if (process.env.NODE_ENV === "production") {
        console.warn("[getDb] Production Neon query failed. Checking fallback sources...");
      }
    }
  }

  // 2. Supabase Fallback (Grace period during migration)
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    console.log("[getDb] Fetching data from Supabase fallback...");
    try {
    // Fetch all tables in parallel to ensure extremely fast render times
    const [
      companyRes,
      navRes,
      seoRes,
      productsRes,
      blogsRes,
      researchRes,
      labRes,
      careersRes,
      homepageSettingsRes,
      analyticsSettingsRes,
      newsletterSettingsRes
    ] = await Promise.all([
      supabaseAdmin.from("company_settings").select("*").eq("id", "only_one").single(),
      supabaseAdmin.from("navigation").select("*").order("sort_order", { ascending: true }),
      supabaseAdmin.from("seo_settings").select("*"),
      supabaseAdmin.from("products").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("blogs").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("research").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("innovation_lab").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("careers").select("*").eq("id", "only_one").single(),
      supabaseAdmin.from("homepage_settings").select("*").eq("id", "main").single(),
      supabaseAdmin.from("analytics_settings").select("*").eq("id", "main").single(),
      supabaseAdmin.from("newsletter_settings").select("*").eq("id", "main").single()
    ]);

    if (productsRes.error) {
      console.error("[getDb] Error querying products table from Supabase:", productsRes.error);
    } else {
      console.log(`[getDb] Successfully fetched ${productsRes.data?.length || 0} products from Supabase products table.`);
    }

    // Handle missing tables gracefully (e.g. if the user hasn't run schema.sql yet)
    const hasTableErrors = [
      companyRes.error,
      navRes.error,
      seoRes.error,
      productsRes.error,
      blogsRes.error,
      researchRes.error,
      labRes.error,
      careersRes.error,
      homepageSettingsRes.error,
      analyticsSettingsRes.error,
      newsletterSettingsRes.error
    ].some(
      (err) =>
        err &&
        (err.code === "42P01" || err.message?.includes("does not exist"))
    );

    if (hasTableErrors) {
      console.warn("Supabase tables not initialized or missing. Falling back to local db.json.");
      return getLocalDb();
    }

    // Parse SEO Settings from rows back into page_key keyed object
    const seoSettings: any = {};
    if (seoRes.data) {
      seoRes.data.forEach((row: any) => {
        seoSettings[row.page_key] = {
          title: row.title,
          description: row.description,
          og_image: row.og_image
        };
      });
    }

    const localFallback = await getLocalDb();

    // Construct the standard database shape that pages expect
    return {
      companyInfo: companyRes.data || localFallback.companyInfo || {},
      navigation: (navRes.data && navRes.data.length > 0) ? navRes.data : localFallback.navigation || [],
      seo: Object.keys(seoSettings).length > 0 ? seoSettings : localFallback.seo || {},
      products: (productsRes.data && productsRes.data.length > 0) ? productsRes.data : localFallback.products || [],
      posts: (blogsRes.data && blogsRes.data.length > 0)
        ? blogsRes.data.map((b: any) => ({
            slug: b.slug,
            title: b.title,
            date: b.date,
            category: b.category,
            excerpt: b.excerpt,
            content: b.content,
            tags: b.tags,
            status: b.status,
            seoTitle: b.seo_title,
            seoDesc: b.seo_desc
          }))
        : localFallback.posts || [],
      research: (researchRes.data && researchRes.data.length > 0) ? researchRes.data : localFallback.research || [],
      labProjects: (labRes.data && labRes.data.length > 0) ? labRes.data : localFallback.labProjects || [],
      careers: careersRes.data || localFallback.careers || {},
      homepage: homepageSettingsRes.data ? {
        heroHeading: homepageSettingsRes.data.hero_heading,
        heroSubheading: homepageSettingsRes.data.hero_subheading,
        heroCta: homepageSettingsRes.data.hero_cta,
        heroCtaLink: homepageSettingsRes.data.hero_cta_link,
        heroSecondCta: homepageSettingsRes.data.hero_second_cta,
        heroSecondCtaLink: homepageSettingsRes.data.hero_second_cta_link
      } : {},
      analytics: analyticsSettingsRes.data ? {
        gaTrackingId: analyticsSettingsRes.data.ga_tracking_id,
        enableAnalytics: analyticsSettingsRes.data.enable_analytics,
        cookieConsentEnabled: analyticsSettingsRes.data.cookie_consent_enabled,
        privacyPolicyUrl: analyticsSettingsRes.data.privacy_policy_url
      } : {},
      newsletter: newsletterSettingsRes.data ? {
        enabled: newsletterSettingsRes.data.enabled,
        title: newsletterSettingsRes.data.title,
        description: newsletterSettingsRes.data.description
      } : {},
      linkedinSync: [] // Kept for interface backward compatibility
    };
  } catch (error) {
    console.error("Supabase fetch failed, using local db.json fallback:", error);
    return getLocalDb();
  }
}

  // 3. Local Fallback (Development & unconfigured grace period)
  console.log("[getDb] Cloud database not configured. Falling back to local db.json.");
  return getLocalDb();
}
