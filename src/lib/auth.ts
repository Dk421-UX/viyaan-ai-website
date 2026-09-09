import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { isNeonConfigured, getAdminCredentialsNeon, saveAdminCredentialsNeon } from "./neon";
import { isSupabaseAdminConfigured, supabaseAdmin } from "./supabase";

const AUTH_FILE_PATH = path.join(process.cwd(), "src/data/admin_auth.json");

export interface AdminCredentialRecord {
  passwordHash: string;
  salt: string;
  updatedAt: string;
  version: number;
  source?: "neon" | "supabase" | "local_fallback";
  isLegacyPlain?: boolean;
  legacyRaw?: string;
  unconfigured?: boolean;
}

export interface SessionRecord {
  token: string;
  createdAt: number;
  expiresAt: number;
}

export interface ResetTokenRecord {
  token: string;
  createdAt: number;
  expiresAt: number;
  used: boolean;
}

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

// Cross-invocation in-memory cache for sliding-window rate limiting
const globalStore = globalThis as unknown as {
  __viyaan_rate_limits?: Map<string, { count: number; resetAt: number }>;
};
if (!globalStore.__viyaan_rate_limits) {
  globalStore.__viyaan_rate_limits = new Map<string, { count: number; resetAt: number }>();
}
const rateLimitStore = globalStore.__viyaan_rate_limits;

// ============================================================================
// Cryptographic Secret for Stateless Serverless Tokens (HMAC-SHA256)
// ============================================================================
function getSessionSigningSecret(): string {
  // Use dedicated secret, or recovery key, or a deterministic fallback
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_RECOVERY_KEY || "viyaan-ai-secure-signing-engine-2026";
  return secret;
}

// ============================================================================
// Rate Limiting
// ============================================================================
export function checkRateLimit(identifier: string, maxAttempts = MAX_ATTEMPTS): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: maxAttempts - 1, resetInMs: RATE_LIMIT_WINDOW_MS };
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false, remaining: 0, resetInMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxAttempts - entry.count, resetInMs: entry.resetAt - now };
}

export function resetRateLimit(identifier: string) {
  rateLimitStore.delete(identifier);
}

// ============================================================================
// Password Hashing & Verification (scrypt with unique 32-byte salt)
// ============================================================================
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString("hex");
  return { hash, salt };
}

export function verifyPassword(
  password: string,
  storedHashOrRecord: string | AdminCredentialRecord,
  salt?: string,
  legacyRaw?: string
): boolean {
  if (!password) return false;

  let storedHash = "";
  let storedSalt = "";
  let rawLegacy = legacyRaw;

  if (typeof storedHashOrRecord === "object" && storedHashOrRecord !== null) {
    storedHash = storedHashOrRecord.passwordHash;
    storedSalt = storedHashOrRecord.salt;
    rawLegacy = storedHashOrRecord.legacyRaw;
  } else {
    storedHash = storedHashOrRecord || "";
    storedSalt = salt || "";
  }

  // 1. Check legacy plain text match if applicable
  if (rawLegacy) {
    try {
      const a = Buffer.from(password);
      const b = Buffer.from(rawLegacy);
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
        return true;
      }
    } catch {}
  }

  // Fallback check for default initial schema.sql passphrase if flagged as legacy
  if (storedHash === "LEGACY_PLAIN") {
    try {
      const a = Buffer.from(password);
      const b = Buffer.from("viyaan2026");
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
        return true;
      }
    } catch {}
  }

  // 2. Standard scrypt timing-safe verification
  try {
    if (!storedHash || !storedSalt) return false;
    const derived = crypto.scryptSync(password, storedSalt, 64, { N: 16384, r: 8, p: 1 });
    const stored = Buffer.from(storedHash, "hex");
    if (derived.length !== stored.length) return false;
    return crypto.timingSafeEqual(derived, stored);
  } catch {
    return false;
  }
}

// Password strength validation (minimum 12 characters, sensible policy)
export function validatePasswordStrength(password: string): { valid: boolean; reason?: string } {
  if (!password || typeof password !== "string") {
    return { valid: false, reason: "Passphrase is required." };
  }
  if (password.length < 12) {
    return { valid: false, reason: "Passphrase must be at least 12 characters long." };
  }
  const commonWeak = ["admin12345678", "password12345", "viyaan123456", "123456789012"];
  if (commonWeak.includes(password.toLowerCase())) {
    return { valid: false, reason: "Passphrase is too common or predictable." };
  }
  return { valid: true };
}

// ============================================================================
// Credential Persistence (Neon PostgreSQL + Supabase + Local fallback policy)
// ============================================================================
export async function getAdminCredentials(): Promise<AdminCredentialRecord | null> {
  // 1. Query Neon PostgreSQL if configured (Primary)
  if (isNeonConfigured) {
    try {
      const neonCreds = await getAdminCredentialsNeon();
      if (neonCreds) {
        return neonCreds;
      }
    } catch (err) {
      console.error("[auth] Error reading admin credential from Neon:", err);
    }
  }

  // 2. Query Supabase if configured (Migration Fallback)
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.from("admins").select("*").limit(1);
      if (!error && data && data.length > 0) {
        const row = data[0];
        
        // Case A: Row has dedicated password_hash and salt columns
        if (row.password_hash && row.salt) {
          return {
            passwordHash: row.password_hash,
            salt: row.salt,
            updatedAt: row.updated_at || new Date().toISOString(),
            version: row.version || 1,
            source: "supabase",
          };
        }

        // Case B: Row has passphrase column
        if (row.passphrase) {
          // Check if formatted as "scrypt:<salt>:<hash>"
          if (typeof row.passphrase === "string" && row.passphrase.startsWith("scrypt:")) {
            const parts = row.passphrase.split(":");
            if (parts.length === 3 && parts[1] && parts[2]) {
              return {
                passwordHash: parts[2],
                salt: parts[1],
                updatedAt: row.created_at || new Date().toISOString(),
                version: 1,
                source: "supabase",
              };
            }
          }

          // Legacy plain text passphrase (e.g. initial 'viyaan2026' from schema.sql)
          return {
            passwordHash: "LEGACY_PLAIN",
            salt: "",
            updatedAt: row.created_at || new Date().toISOString(),
            version: 1,
            source: "supabase",
            isLegacyPlain: true,
            legacyRaw: row.passphrase,
          };
        }
      }
    } catch (err) {
      console.error("[auth] Error reading admin credential from Supabase:", err);
    }
  }

  const isProduction = process.env.NODE_ENV === "production";

  // 3. Production Fallback Policy:
  // In production, do NOT silently authenticate against local json files.
  if (isProduction) {
    console.warn("[auth] Production cloud database (Neon/Supabase) not configured.");
    return {
      passwordHash: "",
      salt: "",
      updatedAt: "",
      version: 0,
      source: "local_fallback",
      unconfigured: true,
    };
  }

  // 4. Local Development Fallback
  try {
    const raw = await fs.readFile(AUTH_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      source: "local_fallback",
    };
  } catch {
    return null;
  }
}

export async function saveAdminCredentials(hash: string, salt: string): Promise<boolean> {
  const record: AdminCredentialRecord = {
    passwordHash: hash,
    salt,
    updatedAt: new Date().toISOString(),
    version: 1,
    source: isNeonConfigured ? "neon" : isSupabaseAdminConfigured ? "supabase" : "local_fallback",
  };

  let savedInCloud = false;

  // 1. Sync to Neon PostgreSQL if configured (Primary)
  if (isNeonConfigured) {
    try {
      await saveAdminCredentialsNeon(hash, salt);
      savedInCloud = true;
      console.log("[auth] Credentials synced to Neon PostgreSQL successfully.");
    } catch (neonErr) {
      console.error("[auth] Error saving credentials to Neon:", neonErr);
    }
  }

  // 2. Sync to Supabase if configured (Migration Fallback)
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const scryptFormatted = `scrypt:${salt}:${hash}`;
      
      // Look up existing admin record to preserve UUID id
      const { data: existing } = await supabaseAdmin.from("admins").select("id").limit(1);

      if (existing && existing.length > 0) {
        const existingId = existing[0].id;
        
        // Attempt update with all potential columns
        const { error: updateErr } = await supabaseAdmin
          .from("admins")
          .update({
            passphrase: scryptFormatted,
            password_hash: hash,
            salt: salt,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingId);

        if (updateErr) {
          // If schema does not have password_hash/salt, fallback to updating passphrase only
          const { error: fallbackErr } = await supabaseAdmin
            .from("admins")
            .update({ passphrase: scryptFormatted })
            .eq("id", existingId);

          if (!fallbackErr) {
            savedInCloud = true;
          } else {
            console.error("[auth] Supabase admin update error:", fallbackErr);
          }
        } else {
          savedInCloud = true;
        }
      } else {
        // Insert new row if table is empty
        const { error: insertErr } = await supabaseAdmin.from("admins").insert({
          email: "admin@viyaan.ai",
          passphrase: scryptFormatted
        });
        if (!insertErr) {
          savedInCloud = true;
        } else {
          console.error("[auth] Supabase admin insert error:", insertErr);
        }
      }
    } catch (err) {
      console.error("[auth] Error saving credentials to Supabase:", err);
    }
  }

  // 2. Best-effort local file update (swallows EROFS on read-only serverless filesystems)
  let savedLocally = false;
  try {
    await fs.writeFile(AUTH_FILE_PATH, JSON.stringify(record, null, 2), "utf-8");
    savedLocally = true;
  } catch {
    // Normal and expected on read-only serverless filesystems (e.g., Vercel)
  }

  if (isNeonConfigured || isSupabaseAdminConfigured) {
    return savedInCloud;
  }

  // In development, return local save status
  return savedLocally || savedInCloud || process.env.NODE_ENV !== "production";
}

// ============================================================================
// Administrative Bootstrap & Recovery
// ============================================================================
export function getRecoveryKey(): string | null {
  return process.env.ADMIN_RECOVERY_KEY || null;
}

export function verifyRecoveryKey(submittedKey: string): boolean {
  const expectedKey = getRecoveryKey();
  if (!expectedKey || !submittedKey) return false;
  try {
    const a = Buffer.from(submittedKey.trim());
    const b = Buffer.from(expectedKey.trim());
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// Stateless HMAC-signed reset token (15-minute expiration)
export function createResetToken(): string {
  const now = Date.now();
  const expiresAt = now + RESET_TOKEN_TTL_MS;
  const payload = JSON.stringify({
    type: "admin_reset",
    iat: now,
    exp: expiresAt,
    jti: crypto.randomBytes(16).toString("hex"),
  });
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const secret = getSessionSigningSecret();
  const signature = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  return `${payloadB64}.${signature}`;
}

export function validateResetToken(token: string): boolean {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signature] = parts;
  try {
    const secret = getSessionSigningSecret();
    const expectedSig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");

    const a = Buffer.from(signature);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return false;
    }

    const json = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload = JSON.parse(json);

    if (!payload || payload.type !== "admin_reset") return false;
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}

export function consumeResetToken(token: string): boolean {
  return validateResetToken(token);
}

// ============================================================================
// Stateless Serverless Session Management (HMAC-SHA256 Signed Tokens)
// ============================================================================
export function createSession(): SessionRecord {
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;
  const payload = JSON.stringify({
    role: "admin",
    iat: now,
    exp: expiresAt,
    jti: crypto.randomBytes(16).toString("hex"),
  });
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const secret = getSessionSigningSecret();
  const signature = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  const token = `${payloadB64}.${signature}`;

  return {
    token,
    createdAt: now,
    expiresAt,
  };
}

export function verifySession(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signature] = parts;
  try {
    const secret = getSessionSigningSecret();
    const expectedSig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");

    const a = Buffer.from(signature);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return false;
    }

    const json = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload = JSON.parse(json);

    if (!payload || payload.role !== "admin") return false;
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}

export function destroySession(_token?: string) {
  void _token;
  // Stateless tokens are invalidated by clearing the client-side HttpOnly cookie
}

export function destroyAllSessions() {
  // Stateless tokens can be globally invalidated by rotating ADMIN_SESSION_SECRET or clearing cookies
}

// ============================================================================
// Request Guard for Admin APIs
// ============================================================================
export function extractSessionToken(request: Request): string | null {
  // 1. Authorization: Bearer <token> header
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  // 2. Cookie header (viyaan_admin_session)
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(/viyaan_admin_session=([^;]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
  }

  // 3. Optional fallback x-admin-token header
  const tokenHeader = request.headers.get("x-admin-token");
  if (tokenHeader) {
    return tokenHeader.trim();
  }

  return null;
}

export function verifyAdminRequest(request: Request): boolean {
  const token = extractSessionToken(request);
  return verifySession(token);
}
