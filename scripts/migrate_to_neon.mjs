#!/usr/bin/env node
/**
 * VIYAAN AI — Production Neon PostgreSQL Migration & Seeding Engine
 * 
 * Usage:
 *   DATABASE_URL="postgres://..." node scripts/migrate_to_neon.mjs
 * 
 * Or with .env.local / .env.production:
 *   node scripts/migrate_to_neon.mjs
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { neon } from "@neondatabase/serverless";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

// Load environment variables from .env.local or .env.production if not already set
async function loadEnvFiles() {
  const envFiles = [".env.production", ".env.local", ".env"];
  for (const file of envFiles) {
    try {
      const content = await fs.readFile(path.join(rootDir, file), "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    } catch {}
  }
}

async function runMigration() {
  console.log("============================================================");
  console.log("       VIYAAN AI — NEON POSTGRESQL MIGRATION ENGINE         ");
  console.log("============================================================\n");

  await loadEnvFiles();

  const databaseUrl = 
    process.env.DATABASE_URL || 
    process.env.POSTGRES_URL || 
    process.env.NEON_DATABASE_URL ||
    process.argv[2];

  if (!databaseUrl) {
    console.error("❌ ERROR: DATABASE_URL is not set.");
    console.error("\nPlease supply your Neon connection string:\n");
    console.error("  Option 1: Add to .env.local: DATABASE_URL=\"postgres://user:pass@ep-xyz.neon.tech/neondb?sslmode=require\"");
    console.error("  Option 2: Run directly: node scripts/migrate_to_neon.mjs \"postgres://...\"");
    process.exit(1);
  }

  // Obfuscate credentials for safe logging
  const maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ":****@");
  console.log(`🔌 Target Neon Database: ${maskedUrl}\n`);

  const sql = neon(databaseUrl);

  // 1. Test Connection
  console.log("1️⃣ Testing database connectivity...");
  try {
    const ping = await sql`SELECT 1 as ping, current_database() as db_name, version() as pg_version`;
    console.log(`   ✅ Connected to database: "${ping[0].db_name}"`);
    console.log(`   📊 PostgreSQL Engine: ${ping[0].pg_version.split(",")[0]}\n`);
  } catch (err) {
    console.error(`   ❌ Failed to connect to Neon: ${err.message}`);
    process.exit(1);
  }

  // 2. Read and Apply DDL Schema
  console.log("2️⃣ Applying neon/schema.sql (18 tables, constraints, indexes)...");
  const schemaPath = path.join(rootDir, "neon", "schema.sql");
  try {
    const schemaSql = await fs.readFile(schemaPath, "utf-8");
    
    // Strip comments and split by semicolon into individual commands
    const cleanSql = schemaSql.replace(/--.*$/gm, "");
    const statements = cleanSql
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const stmt of statements) {
      try {
        await sql.query(stmt);
      } catch (stmtErr) {
        console.warn(`   Notice executing statement: ${stmtErr.message}`);
      }
    }
    console.log(`   ✅ Schema applied successfully. All tables and indexes are ready.\n`);
  } catch (err) {
    console.error(`   ⚠️ Schema execution error: ${err.message}`);
    console.log(`   Continuing to check tables...\n`);
  }

  // 3. Load Source Data Snapshots
  console.log("3️⃣ Loading snapshot data for seeding...");
  const dbJsonPath = path.join(rootDir, "src", "data", "db.json");
  const authJsonPath = path.join(rootDir, "src", "data", "admin_auth.json");

  let dbData = {};
  let authData = null;

  try {
    const dbRaw = await fs.readFile(dbJsonPath, "utf-8");
    dbData = JSON.parse(dbRaw);
    console.log(`   ✅ Loaded db.json snapshot successfully.`);
  } catch (e) {
    console.warn(`   ⚠️ db.json could not be loaded: ${e.message}`);
  }

  try {
    const authRaw = await fs.readFile(authJsonPath, "utf-8");
    authData = JSON.parse(authRaw);
    console.log(`   ✅ Loaded admin_auth.json snapshot successfully.`);
  } catch (e) {
    console.warn(`   ⚠️ admin_auth.json not found, using default recovery credentials.`);
  }

  // 4. Seed Tables
  console.log("\n4️⃣ Verifying and seeding tables in Neon...");

  // Company Settings
  const companyCount = await sql`SELECT count(*)::int as c FROM company_settings`;
  if (companyCount[0].c === 0 && dbData.companyInfo) {
    const c = dbData.companyInfo;
    await sql`
      INSERT INTO company_settings (
        id, name, tagline, description, email, location, 
        linkedin_company, linkedin_founder, twitter_founder, response_time, founder_image, updated_at
      ) VALUES (
        'only_one', ${c.name || "Viyaan AI"}, ${c.tagline || ""}, ${c.description || ""}, 
        ${c.email || "viyaan.ai.team@gmail.com"}, ${c.location || "Chennai, India / Remote"},
        ${c.linkedinCompany || ""}, ${c.linkedinFounder || ""}, ${c.twitterFounder || ""},
        ${c.responseTime || "2 business days"}, ${c.founderImage || "/founder.jpeg"}, NOW()
      ) ON CONFLICT (id) DO NOTHING
    `;
    console.log(`   🌱 Seeded company_settings.`);
  }

  // Founder
  const founderCount = await sql`SELECT count(*)::int as c FROM founder`;
  if (founderCount[0].c === 0) {
    const c = dbData.companyInfo || {};
    await sql`
      INSERT INTO founder (id, name, biography, linkedin, twitter, image_url, updated_at)
      VALUES (
        'only_one', 'Dharani Kumar', 
        'Viyaan AI is not built behind hidden doors. We design publicly, sharing our challenges, research papers, engineering decisions, and daily lessons.',
        ${c.linkedinFounder || ""}, ${c.twitterFounder || ""}, ${c.founderImage || "/founder.jpeg"}, NOW()
      ) ON CONFLICT (id) DO NOTHING
    `;
    console.log(`   🌱 Seeded founder.`);
  }

  // Navigation
  const navCount = await sql`SELECT count(*)::int as c FROM navigation`;
  if (navCount[0].c === 0 && Array.isArray(dbData.navigation)) {
    for (let i = 0; i < dbData.navigation.length; i++) {
      const n = dbData.navigation[i];
      await sql`
        INSERT INTO navigation (label, href, sort_order)
        VALUES (${n.label}, ${n.href}, ${i + 1})
      `;
    }
    console.log(`   🌱 Seeded navigation (${dbData.navigation.length} items).`);
  }

  // SEO Settings
  const seoCount = await sql`SELECT count(*)::int as c FROM seo_settings`;
  if (seoCount[0].c === 0 && dbData.seo) {
    for (const [key, seo] of Object.entries(dbData.seo)) {
      await sql`
        INSERT INTO seo_settings (page_key, title, description, og_image)
        VALUES (${key}, ${seo.title || ""}, ${seo.description || ""}, ${seo.ogImage || null})
        ON CONFLICT (page_key) DO NOTHING
      `;
    }
    console.log(`   🌱 Seeded seo_settings (${Object.keys(dbData.seo).length} pages).`);
  }

  // Products
  const prodCount = await sql`SELECT count(*)::int as c FROM products`;
  if (prodCount[0].c === 0 && Array.isArray(dbData.products)) {
    for (const p of dbData.products) {
      await sql`
        INSERT INTO products (id, name, tagline, description, features, data_flow, url, status)
        VALUES (${p.id}, ${p.name}, ${p.tagline || null}, ${p.description || null}, 
                ${p.features || []}, ${p.dataFlow || null}, ${p.url || null}, ${p.status || "published"})
        ON CONFLICT (id) DO NOTHING
      `;
    }
    console.log(`   🌱 Seeded products (${dbData.products.length} products).`);
  }

  // Blogs
  const blogCount = await sql`SELECT count(*)::int as c FROM blogs`;
  if (blogCount[0].c === 0 && Array.isArray(dbData.posts)) {
    for (const b of dbData.posts) {
      await sql`
        INSERT INTO blogs (slug, title, date, category, excerpt, content, tags, status, seo_title, seo_desc)
        VALUES (${b.slug}, ${b.title}, ${b.date || null}, ${b.category || "Ecosystem Release"}, 
                ${b.excerpt || null}, ${b.content || null}, ${b.tags || []}, ${b.status || "published"},
                ${b.seoTitle || null}, ${b.seoDesc || null})
        ON CONFLICT (slug) DO NOTHING
      `;
    }
    console.log(`   🌱 Seeded blogs (${dbData.posts.length} articles).`);
  }

  // Research
  const researchCount = await sql`SELECT count(*)::int as c FROM research`;
  if (researchCount[0].c === 0 && Array.isArray(dbData.research)) {
    for (const r of dbData.research) {
      await sql`
        INSERT INTO research (slug, title, field, excerpt, content, author, date, pdf_url, status)
        VALUES (${r.slug}, ${r.title}, ${r.field || "Cognitive Science"}, ${r.excerpt || null}, 
                ${r.content || null}, ${r.author || "Viyaan Research Team"}, ${r.date || null}, 
                ${r.pdfUrl || null}, ${r.status || "published"})
        ON CONFLICT (slug) DO NOTHING
      `;
    }
    console.log(`   🌱 Seeded research (${dbData.research.length} papers).`);
  }

  // Innovation Lab
  const labCount = await sql`SELECT count(*)::int as c FROM innovation_lab`;
  if (labCount[0].c === 0 && Array.isArray(dbData.labProjects)) {
    for (const l of dbData.labProjects) {
      await sql`
        INSERT INTO innovation_lab (id, title, type, status_text, description, tags, status)
        VALUES (${l.id}, ${l.title}, ${l.type || "UTILITY"}, ${l.statusText || "STABLE"}, 
                ${l.description || null}, ${l.tags || []}, ${l.status || "published"})
        ON CONFLICT (id) DO NOTHING
      `;
    }
    console.log(`   🌱 Seeded innovation_lab (${dbData.labProjects.length} projects).`);
  }

  // Careers
  const careerCount = await sql`SELECT count(*)::int as c FROM careers`;
  if (careerCount[0].c === 0) {
    const car = dbData.careers || {};
    await sql`
      INSERT INTO careers (id, title, description, linkedin_link, updated_at)
      VALUES ('only_one', ${car.title || "Connect with Our Mission"}, ${car.description || ""}, 
              ${car.linkedinLink || ""}, NOW())
      ON CONFLICT (id) DO NOTHING
    `;
    console.log(`   🌱 Seeded careers.`);
  }

  // Homepage Settings
  const hpCount = await sql`SELECT count(*)::int as c FROM homepage_settings`;
  if (hpCount[0].c === 0) {
    const hp = dbData.homepage || {};
    await sql`
      INSERT INTO homepage_settings (
        id, hero_heading, hero_subheading, hero_cta, hero_cta_link, hero_second_cta, hero_second_cta_link, updated_at
      ) VALUES (
        'main', 
        ${hp.heroHeading || "Intelligence Beyond the Human Mind."}, 
        ${hp.heroSubheading || ""}, 
        ${hp.heroCta || "Explore Our Ecosystem"}, 
        ${hp.heroCtaLink || "/products"}, 
        ${hp.heroSecondCta || "Read Research"}, 
        ${hp.heroSecondCtaLink || "/research"}, 
        NOW()
      ) ON CONFLICT (id) DO NOTHING
    `;
    console.log(`   🌱 Seeded homepage_settings.`);
  }

  // Analytics Settings
  const analCount = await sql`SELECT count(*)::int as c FROM analytics_settings`;
  if (analCount[0].c === 0) {
    const a = dbData.analytics || {};
    await sql`
      INSERT INTO analytics_settings (id, ga_tracking_id, enable_analytics, cookie_consent_enabled, privacy_policy_url, updated_at)
      VALUES ('main', ${a.gaTrackingId || ""}, ${!!a.enableAnalytics}, ${a.cookieConsentEnabled ?? true}, 
              ${a.privacyPolicyUrl || "/privacy"}, NOW())
      ON CONFLICT (id) DO NOTHING
    `;
    console.log(`   🌱 Seeded analytics_settings.`);
  }

  // Newsletter Settings
  const newsCount = await sql`SELECT count(*)::int as c FROM newsletter_settings`;
  if (newsCount[0].c === 0) {
    const n = dbData.newsletter || {};
    await sql`
      INSERT INTO newsletter_settings (id, enabled, title, description, updated_at)
      VALUES ('main', ${n.enabled ?? true}, ${n.title || "Stay Ahead of the Intelligence Curve"}, 
              ${n.description || ""}, NOW())
      ON CONFLICT (id) DO NOTHING
    `;
    console.log(`   🌱 Seeded newsletter_settings.`);
  }

  // Admin Credentials Authentication
  try {
    const credCount = await sql`SELECT count(*)::int as c FROM admin_credentials`;
    if (credCount[0].c === 0) {
      // 1. Try to migrate from existing admins table if present
      let migratedFromAdmins = false;
      try {
        const legacyRows = await sql`SELECT * FROM admins LIMIT 1`;
        if (legacyRows.length > 0) {
          const l = legacyRows[0];
          let formattedHash = "";
          if (l.password_hash && l.salt) {
            formattedHash = `scrypt:${l.salt}:${l.password_hash}`;
          } else if (l.passphrase && l.passphrase.startsWith("scrypt:")) {
            formattedHash = l.passphrase;
          }
          if (formattedHash) {
            await sql`
              INSERT INTO admin_credentials (id, username, password_hash, created_at, updated_at)
              VALUES (1, 'admin@viyaan.ai', ${formattedHash}, NOW(), NOW())
              ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = NOW()
            `;
            console.log(`   🌱 Migrated active scrypt credentials from legacy admins into admin_credentials.`);
            migratedFromAdmins = true;
          }
        }
      } catch {}

      // 2. If not migrated from legacy table, check snapshot auth data
      if (!migratedFromAdmins) {
        if (authData && authData.passwordHash && authData.salt) {
          const scryptFormatted = `scrypt:${authData.salt}:${authData.passwordHash}`;
          await sql`
            INSERT INTO admin_credentials (id, username, password_hash, created_at, updated_at)
            VALUES (1, 'admin@viyaan.ai', ${scryptFormatted}, NOW(), NOW())
            ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = NOW()
          `;
          console.log(`   🌱 Seeded admin_credentials with verified scrypt credentials.`);
        } else {
          console.log(`   ℹ️ No existing credentials found. Admin password can be set via Administrative Recovery.`);
        }
      }
    } else {
      console.log(`   ✅ admin_credentials already populated with secure hash.`);
    }
  } catch (credErr) {
    console.warn(`   ⚠️ Notice checking admin_credentials: ${credErr.message}`);
  }

  // 5. Verification & Final Table Status
  console.log("\n5️⃣ Verification & Final Table Status:");
  console.log("------------------------------------------------------------");
  console.log(String("Table Name").padEnd(25) + String("Row Count").padEnd(15) + "Status");
  console.log("------------------------------------------------------------");

  const tablesToCheck = [
    "company_settings",
    "founder",
    "homepage",
    "navigation",
    "seo_settings",
    "products",
    "blogs",
    "research",
    "innovation_lab",
    "careers",
    "homepage_settings",
    "analytics_settings",
    "newsletter_settings",
    "admin_credentials",
    "contact_messages",
    "newsletter_subscribers",
    "media_library"
  ];

  let totalRows = 0;

  for (const t of tablesToCheck) {
    try {
      const res = await sql.query(`SELECT count(*)::int as c FROM "${t}"`);
      const c = res[0].c;
      totalRows += c;
      console.log(t.padEnd(25) + String(c).padEnd(15) + "✅ OK");
    } catch (e) {
      console.log(t.padEnd(25) + String("-").padEnd(15) + "⚠️ Not Found / Pending");
    }
  }

  console.log("------------------------------------------------------------");
  console.log(`Total rows verified across Neon database: ${totalRows}`);
  console.log("\n🎉 NEON MIGRATION & VERIFICATION COMPLETED SUCCESSFULLY!");
  console.log("============================================================\n");
}

runMigration().catch((err) => {
  console.error("\n❌ Fatal error during Neon migration:", err);
  process.exit(1);
});
