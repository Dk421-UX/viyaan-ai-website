import { NextResponse } from "next/server";
import { 
  isSupabaseConfigured, 
  isSupabaseAdminConfigured, 
  verifyDbConnection, 
  getSupabaseDiagnostics 
} from "@/lib/supabase";
import { getRecoveryKey } from "@/lib/auth";

export async function GET() {
  const isProduction = process.env.NODE_ENV === "production";
  const diagnostics = getSupabaseDiagnostics();
  const recoveryConfigured = !!getRecoveryKey();

  if (!diagnostics.isAdminConfigured) {
    if (isProduction) {
      return NextResponse.json({
        status: "unconfigured",
        environment: "production",
        configured: false,
        connected: false,
        initialized: false,
        recoveryConfigured,
        message: "Production database service is not configured. Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) are missing in Vercel.",
        diagnostics: {
          hasSupabaseUrl: diagnostics.hasUrl,
          hasSupabaseAnonKey: diagnostics.hasAnonKey,
          hasSupabaseServiceRoleKey: diagnostics.hasServiceRoleKey,
        }
      });
    }

    return NextResponse.json({
      status: "local",
      environment: "development",
      configured: false,
      connected: false,
      initialized: false,
      recoveryConfigured,
      message: "Development mode: Supabase environment variables not configured. Operating in local JSON mode.",
      diagnostics: {
        hasSupabaseUrl: diagnostics.hasUrl,
        hasSupabaseAnonKey: diagnostics.hasAnonKey,
        hasSupabaseServiceRoleKey: diagnostics.hasServiceRoleKey,
      }
    });
  }

  const dbHealth = await verifyDbConnection();

  if (!dbHealth.connected) {
    return NextResponse.json({
      status: "error",
      environment: isProduction ? "production" : "development",
      configured: true,
      connected: false,
      initialized: false,
      recoveryConfigured,
      message: `Failed to connect to Supabase: ${dbHealth.error}`,
      diagnostics: {
        hasSupabaseUrl: diagnostics.hasUrl,
        hasSupabaseAnonKey: diagnostics.hasAnonKey,
        hasSupabaseServiceRoleKey: diagnostics.hasServiceRoleKey,
      }
    });
  }

  if (!dbHealth.initialized) {
    return NextResponse.json({
      status: "migration_needed",
      environment: isProduction ? "production" : "development",
      configured: true,
      connected: true,
      initialized: false,
      recoveryConfigured,
      message: "Database connected, but tables are not initialized. Please execute supabase/schema.sql in the Supabase SQL Editor.",
      diagnostics: {
        hasSupabaseUrl: diagnostics.hasUrl,
        hasSupabaseAnonKey: diagnostics.hasAnonKey,
        hasSupabaseServiceRoleKey: diagnostics.hasServiceRoleKey,
      }
    });
  }

  return NextResponse.json({
    status: "production",
    environment: isProduction ? "production" : "development",
    configured: true,
    connected: true,
    initialized: true,
    recoveryConfigured,
    message: "Production Supabase database connected and operational.",
    diagnostics: {
      hasSupabaseUrl: diagnostics.hasUrl,
      hasSupabaseAnonKey: diagnostics.hasAnonKey,
      hasSupabaseServiceRoleKey: diagnostics.hasServiceRoleKey,
    }
  });
}
