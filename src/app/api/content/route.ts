import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getDb, writeLocalDb } from "@/lib/db";
import {
  isNeonConfigured,
  updateCompanySettingsNeon,
  saveNavigationNeon,
  saveSeoSettingsNeon,
  saveProductNeon,
  deleteProductNeon,
  savePostNeon,
  deletePostNeon,
  saveResearchNeon,
  deleteResearchNeon,
  saveLabProjectNeon,
  deleteLabProjectNeon,
  saveCareersNeon,
  saveHomepageSettingsNeon,
  saveAnalyticsSettingsNeon,
  saveNewsletterSettingsNeon,
} from "@/lib/neon";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase";
import { runAutoInitialization } from "@/lib/dbInit";
import { verifyAdminRequest, getAdminCredentials, verifyPassword } from "@/lib/auth";

const localDbPath = path.join(process.cwd(), "src/data/db.json");

// Environment variables for GitHub Git-based CMS fallback
const GITHUB_PAT = process.env.GITHUB_PAT;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

// Trigger auto-initialization in background on first load
let initialized = false;
async function ensureDbInit() {
  if (isSupabaseAdminConfigured && !initialized) {
    initialized = true;
    try {
      const res = await runAutoInitialization();
      console.log("DB Auto-Initialization Run:", res.message);
    } catch (e) {
      console.error("Auto-init trigger error:", e);
    }
  }
}

export async function GET() {
  try {
    await ensureDbInit();
    const data = await getDb();
    if (!data) {
      return NextResponse.json({ error: "Failed to load database" }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API content] Database load failed:", error);
    return NextResponse.json(
      { error: "Database unavailable. Verify the server-side Neon DATABASE_URL configuration." },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureDbInit();
    const body = await request.json();
    const { action, data, password } = body;

    // 1. Authenticate request via HttpOnly session / Bearer token, or secure password verification
    const isSessionValid = verifyAdminRequest(request);
    let isCredentialValid = false;
    if (!isSessionValid && password) {
      const credentials = await getAdminCredentials();
      if (credentials) {
        isCredentialValid = verifyPassword(password, credentials.passwordHash, credentials.salt);
      }
    }

    if (!isSessionValid && !isCredentialValid) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. Perform CMS Action in Neon PostgreSQL if configured (Primary)
    if (isNeonConfigured) {
      try {
        switch (action) {
          case "updateSettings":
            await updateCompanySettingsNeon(data);
            break;

          case "saveNavigation":
            await saveNavigationNeon(data);
            break;

          case "saveSEO":
            await saveSeoSettingsNeon(data);
            break;

          case "saveProduct":
            await saveProductNeon(data);
            break;

          case "savePost":
            await savePostNeon(data);
            break;

          case "saveResearch":
            await saveResearchNeon(data);
            break;

          case "saveLabProject":
            await saveLabProjectNeon(data);
            break;

          case "saveCareers":
            await saveCareersNeon(data);
            break;

          case "saveHomepage":
            await saveHomepageSettingsNeon(data);
            break;

          case "saveAnalytics":
            await saveAnalyticsSettingsNeon(data);
            break;

          case "saveNewsletterSettings":
            await saveNewsletterSettingsNeon(data);
            break;

          case "syncLinkedIn":
            const newPost = {
              slug: `linkedin-${data.id}-${Date.now()}`,
              title: `Update: ${data.author}`,
              date: data.date,
              category: data.category || "LinkedIn Sync",
              excerpt: data.text.substring(0, 120) + "...",
              content: data.text,
              tags: ["LinkedIn", "Update"],
              status: "published",
              seoTitle: `Viyaan AI News: Update from ${data.author}`,
              seoDesc: data.text.substring(0, 150)
            };
            await savePostNeon(newPost);
            break;

          case "deleteItem":
            const { type, id } = data;
            if (type === "post") {
              await deletePostNeon(id);
            } else if (type === "product") {
              await deleteProductNeon(id);
            } else if (type === "research") {
              await deleteResearchNeon(id);
            } else if (type === "lab") {
              await deleteLabProjectNeon(id);
            }
            break;

          default:
            return NextResponse.json({ error: "Invalid CMS action" }, { status: 400 });
        }

        const freshDb = await getDb();
        return NextResponse.json({ success: true, db: freshDb });
      } catch (neonError: any) {
        console.error("[CMS Neon Error] Action write error:", neonError);
        if (process.env.NODE_ENV === "production" && !isSupabaseAdminConfigured) {
          return NextResponse.json({ error: "Failed to persist changes in production Neon database." }, { status: 500 });
        }
      }
    }

    // 3. Perform CMS Action in Supabase if configured (Migration Fallback)
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      try {
        switch (action) {
          case "updateSettings":
            await supabaseAdmin.from("company_settings").upsert({
              id: "only_one",
              name: data.name,
              tagline: data.tagline,
              description: data.description,
              email: data.email,
              location: data.location,
              linkedin_company: data.linkedinCompany || data.linkedin_company,
              linkedin_founder: data.linkedinFounder || data.linkedin_founder,
              twitter_founder: data.twitterFounder || data.twitter_founder,
              response_time: data.responseTime || data.response_time,
              founder_image: data.founderImage || data.founder_image
            });
            break;

          case "saveNavigation":
            await supabaseAdmin.from("navigation").delete().neq("id", 0);
            if (data && data.length > 0) {
              const rows = data.map((n: any, idx: number) => ({
                label: n.label,
                href: n.href,
                sort_order: idx + 1
              }));
              await supabaseAdmin.from("navigation").insert(rows);
            }
            break;

          case "saveSEO":
            const seoPromises = Object.entries(data).map(([key, pageSeo]: [string, any]) =>
              supabaseAdmin.from("seo_settings").upsert({
                page_key: key,
                title: pageSeo.title,
                description: pageSeo.description,
                og_image: pageSeo.ogImage || pageSeo.og_image
              })
            );
            await Promise.all(seoPromises);
            break;

          case "saveProduct":
            const { error: productUpsertError } = await supabaseAdmin.from("products").upsert({
              id: data.id,
              name: data.name,
              tagline: data.tagline,
              description: data.description,
              features: data.features,
              data_flow: data.dataFlow || data.data_flow,
              url: data.url,
              status: data.status || "published"
            });
            if (productUpsertError) {
              throw productUpsertError;
            }
            break;

          case "savePost":
            await supabaseAdmin.from("blogs").upsert({
              slug: data.slug,
              title: data.title,
              date: data.date,
              category: data.category,
              excerpt: data.excerpt,
              content: data.content,
              tags: data.tags,
              status: data.status || "published",
              seo_title: data.seoTitle || data.seo_title,
              seo_desc: data.seoDesc || data.seo_desc
            });
            break;

          case "saveResearch":
            await supabaseAdmin.from("research").upsert({
              slug: data.slug,
              title: data.title,
              field: data.field,
              excerpt: data.excerpt,
              content: data.content,
              author: data.author,
              date: data.date,
              pdf_url: data.pdfUrl || data.pdf_url,
              status: data.status || "published"
            });
            break;

          case "saveLabProject":
            await supabaseAdmin.from("innovation_lab").upsert({
              id: data.id,
              title: data.title,
              type: data.type,
              status_text: data.statusText || data.status_text,
              description: data.description,
              tags: data.tags,
              status: data.status || "published"
            });
            break;

          case "saveCareers":
            await supabaseAdmin.from("careers").upsert({
              id: "only_one",
              title: data.title,
              description: data.description,
              linkedin_link: data.linkedinLink || data.linkedin_link
            });
            break;

          case "saveHomepage":
            await supabaseAdmin.from("homepage_settings").upsert({
              id: "main",
              hero_heading: data.heroHeading,
              hero_subheading: data.heroSubheading,
              hero_cta: data.heroCta,
              hero_cta_link: data.heroCtaLink,
              hero_second_cta: data.heroSecondCta,
              hero_second_cta_link: data.heroSecondCtaLink
            });
            break;

          case "saveAnalytics":
            await supabaseAdmin.from("analytics_settings").upsert({
              id: "main",
              ga_tracking_id: data.gaTrackingId,
              enable_analytics: data.enableAnalytics,
              cookie_consent_enabled: data.cookieConsentEnabled,
              privacy_policy_url: data.privacyPolicyUrl
            });
            break;

          case "saveNewsletterSettings":
            break;

          case "syncLinkedIn":
            const sbPost = {
              slug: `linkedin-${data.id}-${Date.now()}`,
              title: `Update: ${data.author}`,
              date: data.date,
              category: data.category || "LinkedIn Sync",
              excerpt: data.text.substring(0, 120) + "...",
              content: data.text,
              tags: ["LinkedIn", "Update"],
              status: "published",
              seo_title: `Viyaan AI News: Update from ${data.author}`,
              seo_desc: data.text.substring(0, 150)
            };
            await supabaseAdmin.from("blogs").insert(sbPost);
            break;

          case "deleteItem":
            const { type, id } = data;
            if (type === "post") {
              await supabaseAdmin.from("blogs").delete().eq("slug", id);
            } else if (type === "product") {
              await supabaseAdmin.from("products").delete().eq("id", id);
            } else if (type === "research") {
              await supabaseAdmin.from("research").delete().eq("slug", id);
            } else if (type === "lab") {
              await supabaseAdmin.from("innovation_lab").delete().eq("id", id);
            }
            break;

          default:
            return NextResponse.json({ error: "Invalid CMS action" }, { status: 400 });
        }

        const freshDb = await getDb();
        return NextResponse.json({ success: true, db: freshDb });
      } catch (supabaseError: any) {
        console.error("Supabase action write error, falling back to JSON:", supabaseError);
      }
    }

    // 4. Production policy check: Fail if production cloud database is missing
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Production database is not configured. Neon DATABASE_URL is missing." },
        { status: 503 }
      );
    }

    // 5. Fallback CMS Operation: Local / Git-based DB.json write (Development only)
    const localDb = await getDb();

    switch (action) {
      case "updateSettings":
        localDb.companyInfo = { ...localDb.companyInfo, ...data };
        break;

      case "saveNavigation":
        localDb.navigation = data;
        break;

      case "saveSEO":
        localDb.seo = data;
        break;

      case "saveProduct":
        const pIndex = localDb.products.findIndex((p: any) => p.id === data.id);
        if (pIndex > -1) localDb.products[pIndex] = data;
        else localDb.products.push(data);
        break;

      case "savePost":
        const postIndex = localDb.posts.findIndex((p: any) => p.slug === data.slug);
        if (postIndex > -1) localDb.posts[postIndex] = data;
        else localDb.posts.unshift(data);
        break;

      case "saveResearch":
        const rIndex = localDb.research.findIndex((r: any) => r.slug === data.slug);
        if (rIndex > -1) localDb.research[rIndex] = data;
        else localDb.research.unshift(data);
        break;

      case "saveLabProject":
        const lIndex = localDb.labProjects.findIndex((l: any) => l.id === data.id);
        if (lIndex > -1) localDb.labProjects[lIndex] = data;
        else localDb.labProjects.push(data);
        break;

      case "saveCareers":
        localDb.careers = data;
        break;

      case "saveHomepage":
        localDb.homepage = data;
        break;

      case "saveAnalytics":
        localDb.analytics = data;
        break;

      case "saveNewsletterSettings":
        localDb.newsletter = data;
        break;

      case "syncLinkedIn":
        const localNewPost = {
          slug: `linkedin-${data.id}-${Date.now()}`,
          title: `Update: ${data.author}`,
          date: data.date,
          category: data.category || "LinkedIn Sync",
          excerpt: data.text.substring(0, 120) + "...",
          content: data.text,
          tags: ["LinkedIn", "Update"],
          status: "published",
          seoTitle: `Viyaan AI News: Update from ${data.author}`,
          seoDesc: data.text.substring(0, 150)
        };
        localDb.posts.unshift(localNewPost);
        break;

      case "deleteItem":
        const { type, id } = data;
        if (type === "post") {
          localDb.posts = localDb.posts.filter((p: any) => p.slug !== id);
        } else if (type === "product") {
          localDb.products = localDb.products.filter((p: any) => p.id !== id);
        } else if (type === "research") {
          localDb.research = localDb.research.filter((r: any) => r.slug !== id);
        } else if (type === "lab") {
          localDb.labProjects = localDb.labProjects.filter((l: any) => l.id !== id);
        }
        break;

      default:
        return NextResponse.json({ error: "Invalid CMS action" }, { status: 400 });
    }

    // Sync to GitHub if credentials exist
    if (GITHUB_PAT && GITHUB_REPO) {
      try {
        const getUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/src/data/db.json?ref=${GITHUB_BRANCH}`;
        const res = await fetch(getUrl, {
          headers: {
            Authorization: `token ${GITHUB_PAT}`,
            Accept: "application/vnd.github+json"
          }
        });
        let sha = null;
        if (res.ok) {
          const fileData = await res.json();
          sha = fileData.sha;
        }

        const commitUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/src/data/db.json`;
        await fetch(commitUrl, {
          method: "PUT",
          headers: {
            Authorization: `token ${GITHUB_PAT}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: `CMS Update: ${new Date().toISOString()}`,
            content: Buffer.from(JSON.stringify(localDb, null, 2), "utf-8").toString("base64"),
            sha,
            branch: GITHUB_BRANCH
          })
        });
      } catch (gitErr) {
        console.error("Git fallback write error:", gitErr);
      }
    }

    // Write locally
    const success = await writeLocalDb(localDb);
    if (!success) {
      return NextResponse.json({ error: "Failed to write local database" }, { status: 500 });
    }

    return NextResponse.json({ success: true, db: localDb });
  } catch (error) {
    console.error("API CMS error:", error);
    return NextResponse.json({ error: "Server process failure" }, { status: 500 });
  }
}
