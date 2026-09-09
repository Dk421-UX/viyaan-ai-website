#!/usr/bin/env node
/**
 * VIYAAN AI — Secure Admin Password Reset / Bootstrap Tool
 * 
 * Sets a cryptographically strong scrypt password hash in Neon PostgreSQL
 * WITHOUT ever storing plaintext.
 * 
 * Usage:
 *   node scripts/reset_admin_password.mjs "<new_passphrase>"
 * 
 * Or run without arguments for interactive prompt.
 */

import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import { neon } from "@neondatabase/serverless";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

async function loadEnv() {
  const files = [".env.production", ".env.local", ".env"];
  for (const file of files) {
    try {
      const content = await fs.readFile(path.join(rootDir, file), "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const eq = trimmed.indexOf("=");
          if (eq > 0) {
            const k = trimmed.slice(0, eq).trim();
            const v = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
            if (!process.env[k]) process.env[k] = v;
          }
        }
      }
    } catch {}
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

async function promptPassword() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question("Enter new Admin Passphrase (min 12 characters): ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  await loadEnv();

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) {
    console.error("❌ DATABASE_URL is not set in environment or .env.local.");
    process.exit(1);
  }

  let newPassphrase = process.argv[2];
  if (!newPassphrase) {
    newPassphrase = await promptPassword();
  }

  if (!newPassphrase || newPassphrase.length < 12) {
    console.error("❌ Passphrase must be at least 12 characters long.");
    process.exit(1);
  }

  console.log("🔐 Generating cryptographically secure scrypt hash with 32-byte salt...");
  const encodedHash = hashPassword(newPassphrase);

  console.log("🔌 Connecting to Neon PostgreSQL...");
  const sql = neon(dbUrl);

  try {
    // 1. Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS public.admin_credentials (
        id INTEGER PRIMARY KEY DEFAULT 1,
        username TEXT NOT NULL UNIQUE DEFAULT 'admin@viyaan.ai',
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_login_at TIMESTAMPTZ,
        CONSTRAINT single_admin CHECK (id = 1)
      )
    `;

    // 2. Upsert securely
    await sql`
      INSERT INTO public.admin_credentials (id, username, password_hash, created_at, updated_at)
      VALUES (1, 'admin@viyaan.ai', ${encodedHash}, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        updated_at = NOW()
    `;

    console.log("✅ Admin credentials successfully updated in Neon PostgreSQL.");
    console.log("🛡️  Hashing algorithm: scrypt (N=16384, r=8, p=1, 32-byte random salt).");
    console.log("🚫 Plaintext was NEVER stored.");
  } catch (err) {
    console.error("❌ Failed to update admin credentials:", err.message);
    process.exit(1);
  }
}

main().catch(console.error);
