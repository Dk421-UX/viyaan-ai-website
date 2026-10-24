import { neon } from "@neondatabase/serverless";
import fs from "node:fs";

function localDatabaseUrl() {
  try {
    const match = fs.readFileSync(".env.local", "utf8").match(/^DATABASE_URL=(.+)$/m);
    return match?.[1]?.trim().replace(/^['\"]|['\"]$/g, "") || "";
  } catch {
    return "";
  }
}

const databaseUrl = process.env.DATABASE_URL || localDatabaseUrl();

if (!databaseUrl) {
  console.error("DATABASE_URL is required to migrate LinkedIn settings.");
  process.exit(1);
}

const sql = neon(databaseUrl);

try {
  await sql`ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS linkedin_enabled BOOLEAN NOT NULL DEFAULT TRUE`;
  await sql`ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS linkedin_description TEXT`;
  await sql`ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS linkedin_logo_url TEXT`;
  await sql`ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS linkedin_data_source TEXT NOT NULL DEFAULT 'manual'`;
  await sql`ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0`;
  await sql`ALTER TABLE public.homepage_settings ADD COLUMN IF NOT EXISTS about_purpose TEXT DEFAULT 'To make learning more effective, personalised, and accessible through purposeful AI innovation.'`;
  console.log("Database schema migrations verified and completed.");
} catch (err) {
  console.error("LinkedIn settings migration failed:", err);
  process.exitCode = 1;
}
