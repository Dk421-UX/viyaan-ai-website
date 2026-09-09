import crypto from "crypto";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { isSupabaseAdminConfigured, supabaseAdmin } from "./supabase";

const AUTH_FILE_PATH = path.join(process.cwd(), "src/data/admin_auth.json");
const SESSIONS_FILE_PATH = path.join(process.cwd(), "src/data/.admin_sessions.json");

export interface AdminCredentialRecord {
  passwordHash: string;
  salt: string;
  updatedAt: string;
  version: number;
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

// Global cross-module cache in globalThis
const globalStore = globalThis as unknown as {
  __viyaan_sessions?: Map<string, SessionRecord>;
  __viyaan_reset_tokens?: Map<string, ResetTokenRecord>;
  __viyaan_rate_limits?: Map<string, { count: number; resetAt: number }>;
};

if (!globalStore.__viyaan_sessions) globalStore.__viyaan_sessions = new Map<string, SessionRecord>();
if (!globalStore.__viyaan_reset_tokens) globalStore.__viyaan_reset_tokens = new Map<string, ResetTokenRecord>();
if (!globalStore.__viyaan_rate_limits) globalStore.__viyaan_rate_limits = new Map<string, { count: number; resetAt: number }>();

const activeSessions = globalStore.__viyaan_sessions;
const activeResetTokens = globalStore.__viyaan_reset_tokens;
const rateLimitStore = globalStore.__viyaan_rate_limits;

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

// File sync helper for sessions across Next.js workers/processes
function syncSessionsToFile() {
  try {
    const list = Array.from(activeSessions.values());
    fsSync.writeFileSync(SESSIONS_FILE_PATH, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    // Non-fatal
  }
}

function loadSessionsFromFile(): Map<string, SessionRecord> {
  try {
    if (fsSync.existsSync(SESSIONS_FILE_PATH)) {
      const data = fsSync.readFileSync(SESSIONS_FILE_PATH, "utf-8");
      const list: SessionRecord[] = JSON.parse(data);
      const now = Date.now();
      const map = new Map<string, SessionRecord>();
      for (const item of list) {
        if (item && item.token && item.expiresAt > now) {
          map.set(item.token, item);
        }
      }
      return map;
    }
  } catch {
    // Fallback
  }
  return new Map<string, SessionRecord>();
}

// Initialize sessions from file if empty
if (activeSessions.size === 0) {
  const loaded = loadSessionsFromFile();
  for (const [k, v] of loaded.entries()) {
    activeSessions.set(k, v);
  }
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

export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const derived = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
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
// Credential Persistence (Local storage + Supabase sync)
// ============================================================================
export async function getAdminCredentials(): Promise<AdminCredentialRecord | null> {
  // Check Supabase if configured
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin.from("admins").select("*").limit(1);
      if (data && data.length > 0 && data[0].password_hash && data[0].salt) {
        return {
          passwordHash: data[0].password_hash,
          salt: data[0].salt,
          updatedAt: data[0].updated_at || new Date().toISOString(),
          version: data[0].version || 1,
        };
      }
    } catch (err) {
      console.error("[auth] Error reading admin credential from Supabase:", err);
    }
  }

  // Fallback to local admin_auth.json
  try {
    const raw = await fs.readFile(AUTH_FILE_PATH, "utf-8");
    return JSON.parse(raw);
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
  };

  let savedLocally = false;
  try {
    await fs.writeFile(AUTH_FILE_PATH, JSON.stringify(record, null, 2), "utf-8");
    savedLocally = true;
  } catch (err) {
    console.error("[auth] Error saving credentials locally:", err);
  }

  // Sync to Supabase if configured
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from("admins").upsert({
        id: "primary_admin",
        password_hash: hash,
        salt,
        updated_at: new Date().toISOString(),
        version: 1,
      });
    } catch (err) {
      console.error("[auth] Error syncing credentials to Supabase:", err);
    }
  }

  return savedLocally;
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

export function createResetToken(): string {
  const token = crypto.randomBytes(32).toString("hex");
  const now = Date.now();
  activeResetTokens.set(token, {
    token,
    createdAt: now,
    expiresAt: now + RESET_TOKEN_TTL_MS,
    used: false,
  });
  return token;
}

export function validateResetToken(token: string): boolean {
  if (!token) return false;
  const record = activeResetTokens.get(token);
  if (!record) return false;
  if (record.used) return false;
  if (Date.now() > record.expiresAt) {
    activeResetTokens.delete(token);
    return false;
  }
  return true;
}

export function consumeResetToken(token: string): boolean {
  if (!validateResetToken(token)) return false;
  const record = activeResetTokens.get(token);
  if (record) {
    record.used = true;
    activeResetTokens.delete(token);
  }
  return true;
}

// ============================================================================
// Session Management (With persistence across worker processes)
// ============================================================================
export function createSession(): SessionRecord {
  const token = crypto.randomBytes(32).toString("hex");
  const now = Date.now();
  const session: SessionRecord = {
    token,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };
  activeSessions.set(token, session);
  syncSessionsToFile();
  return session;
}

export function verifySession(token: string | null | undefined): boolean {
  if (!token) return false;

  // 1. Check in-memory map
  let session = activeSessions.get(token);

  // 2. If not in current worker memory, reload from file
  if (!session) {
    const fileSessions = loadSessionsFromFile();
    session = fileSessions.get(token);
    if (session) {
      activeSessions.set(token, session);
    }
  }

  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    syncSessionsToFile();
    return false;
  }
  return true;
}

export function destroySession(token: string) {
  if (token) {
    activeSessions.delete(token);
    syncSessionsToFile();
  }
}

export function destroyAllSessions() {
  activeSessions.clear();
  syncSessionsToFile();
}

// ============================================================================
// Request Guard for Admin APIs
// ============================================================================
export function extractSessionToken(request: Request): string | null {
  // 1. Authorization: Bearer <token> header (case-insensitive)
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
