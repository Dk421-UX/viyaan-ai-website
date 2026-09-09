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
        console.error("[getDb] Production Neon query failed.");
        throw new Error(
          `[Database Error] Neon PostgreSQL is configured but query execution failed in production: ${neonErr instanceof Error ? neonErr.message : "Service unavailable"}`
        );
      }
    }
  }

  // 2. Supabase Fallback (Temporary grace period if configured)
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    console.log("[getDb] Fetching data from Supabase fallback...");
    try {
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
        if (process.env.NODE_ENV === "production") {
          throw new Error("[Database Error] Supabase fallback tables are not initialized.");
        }
        return getLocalDb();
      }

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

      return {
        companyInfo: companyRes.data || {},
        navigation: navRes.data || [],
        seo: seoSettings,
        products: productsRes.data || [],
        posts: (blogsRes.data || []).map((b: any) => ({
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
        })),
        research: researchRes.data || [],
        labProjects: labRes.data || [],
        careers: careersRes.data || {},
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
        linkedinSync: []
      };
    } catch (error) {
      if (process.env.NODE_ENV === "production") {
        throw error;
      }
      return getLocalDb();
    }
  }

  // 3. Strict Production Isolation: Do NOT silently fallback to db.json in production
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[Database Configuration Error] Production database is unavailable. Neon DATABASE_URL must be configured in environment."
    );
  }

  // 4. Local Development Fallback (only reached when NODE_ENV !== 'production')
  console.log("[getDb] Cloud database not configured. Operating in local JSON mode for development.");
  return getLocalDb();
}
