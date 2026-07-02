import { NextResponse } from "next/server";
import { isSupabaseConfigured, isSupabaseAdminConfigured, verifyDbConnection } from "@/lib/supabase";

export async function GET() {
  const adminConfigured = isSupabaseAdminConfigured;
  const anonConfigured = isSupabaseConfigured;

  if (!adminConfigured) {
    return NextResponse.json({
      status: "local",
      configured: false,
      connected: false,
      initialized: false,
      message: "Supabase environment variables not configured. Operating in local JSON mode."
    });
  }

  const dbHealth = await verifyDbConnection();

  if (!dbHealth.connected) {
    return NextResponse.json({
      status: "error",
      configured: true,
      connected: false,
      initialized: false,
      message: `Failed to connect to Supabase: ${dbHealth.error}`
    });
  }

  if (!dbHealth.initialized) {
    return NextResponse.json({
      status: "migration_needed",
      configured: true,
      connected: true,
      initialized: false,
      message: "Database connected, but tables are not initialized. Please copy the SQL from supabase/schema.sql and run it in the Supabase SQL Editor."
    });
  }

  return NextResponse.json({
    status: "production",
    configured: true,
    connected: true,
    initialized: true,
    message: "Production Supabase database connected and initialized."
  });
}
