import { NextResponse } from "next/server";
import { 
  isNeonConfigured, 
  verifyNeonConnection, 
  getNeonDiagnostics 
} from "@/lib/neon";
import { 
  isSupabaseConfigured, 
  isSupabaseAdminConfigured, 
  verifyDbConnection, 
  getSupabaseDiagnostics 
} from "@/lib/supabase";
import { getRecoveryKey } from "@/lib/auth";

export async function GET() {
  const isProduction = process.env.NODE_ENV === "production";
  const recoveryConfigured = !!getRecoveryKey();

  // 1. Check Neon PostgreSQL (Primary Serverless Database)
  if (isNeonConfigured) {
    const neonDiag = getNeonDiagnostics();
    const neonHealth = await verifyNeonConnection();

    if (!neonHealth.connected) {
      return NextResponse.json({
        status: "error",
        provider: "Neon PostgreSQL",
        environment: isProduction ? "production" : "development",
        configured: true,
        connected: false,
        initialized: false,
        recoveryConfigured,
        message: `Failed to connect to Neon PostgreSQL: ${neonHealth.error}`,
        diagnostics: {
          hasDatabaseUrl: neonDiag.hasDatabaseUrl,
          provider: "neon"
        }
      });
    }

    if (!neonHealth.initialized) {
      return NextResponse.json({
        status: "migration_needed",
        provider: "Neon PostgreSQL",
        environment: isProduction ? "production" : "development",
        configured: true,
        connected: true,
        initialized: false,
        recoveryConfigured,
        message: "Neon database connected, but tables are not initialized. Please execute neon/schema.sql in the Neon SQL Console or run the migration script.",
        diagnostics: {
          hasDatabaseUrl: neonDiag.hasDatabaseUrl,
          provider: "neon"
        }
      });
    }

    return NextResponse.json({
      status: "production",
      provider: "Neon PostgreSQL",
      environment: isProduction ? "production" : "development",
      configured: true,
      connected: true,
      initialized: true,
      recoveryConfigured,
      message: "Production Neon PostgreSQL database connected and operational.",
      diagnostics: {
        hasDatabaseUrl: neonDiag.hasDatabaseUrl,
        provider: "neon"
      }
    });
  }

  // 2. Check Supabase (Migration Fallback)
  const supabaseDiag = getSupabaseDiagnostics();
  if (supabaseDiag.isAdminConfigured) {
    const dbHealth = await verifyDbConnection();

    if (!dbHealth.connected) {
      return NextResponse.json({
        status: "error",
        provider: "Supabase PostgreSQL",
        environment: isProduction ? "production" : "development",
        configured: true,
        connected: false,
        initialized: false,
        recoveryConfigured,
        message: `Failed to connect to Supabase: ${dbHealth.error}`,
        diagnostics: {
          hasSupabaseUrl: supabaseDiag.hasUrl,
          hasSupabaseAnonKey: supabaseDiag.hasAnonKey,
          hasSupabaseServiceRoleKey: supabaseDiag.hasServiceRoleKey,
          provider: "supabase"
        }
      });
    }

    if (!dbHealth.initialized) {
      return NextResponse.json({
        status: "migration_needed",
        provider: "Supabase PostgreSQL",
        environment: isProduction ? "production" : "development",
        configured: true,
        connected: true,
        initialized: false,
        recoveryConfigured,
        message: "Database connected, but tables are not initialized. Please execute supabase/schema.sql in the Supabase SQL Editor.",
        diagnostics: {
          hasSupabaseUrl: supabaseDiag.hasUrl,
          hasSupabaseAnonKey: supabaseDiag.hasAnonKey,
          hasSupabaseServiceRoleKey: supabaseDiag.hasServiceRoleKey,
          provider: "supabase"
        }
      });
    }

    return NextResponse.json({
      status: "production",
      provider: "Supabase PostgreSQL",
      environment: isProduction ? "production" : "development",
      configured: true,
      connected: true,
      initialized: true,
      recoveryConfigured,
      message: "Production Supabase database connected and operational (migration fallback).",
      diagnostics: {
        hasSupabaseUrl: supabaseDiag.hasUrl,
        hasSupabaseAnonKey: supabaseDiag.hasAnonKey,
        hasSupabaseServiceRoleKey: supabaseDiag.hasServiceRoleKey,
        provider: "supabase"
      }
    });
  }

  // 3. Cloud Database Unconfigured
  if (isProduction) {
    return NextResponse.json({
      status: "unconfigured",
      provider: null,
      environment: "production",
      configured: false,
      connected: false,
      initialized: false,
      recoveryConfigured,
      message: "Production database service is not configured. Neon DATABASE_URL environment variable is missing in your deployment environment (Vercel / Render).",
      diagnostics: {
        hasDatabaseUrl: false,
        hasSupabaseServiceRoleKey: false,
        provider: null
      }
    });
  }

  return NextResponse.json({
    status: "local",
    provider: "local_json",
    environment: "development",
    configured: false,
    connected: false,
    initialized: false,
    recoveryConfigured,
    message: "Development mode: Neon DATABASE_URL not configured. Operating in local JSON mode.",
    diagnostics: {
      hasDatabaseUrl: false,
      hasSupabaseServiceRoleKey: false,
      provider: "local"
    }
  });
}
