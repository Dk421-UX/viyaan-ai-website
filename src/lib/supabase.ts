import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if credentials are provided
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
export const isSupabaseAdminConfigured = !!(supabaseUrl && supabaseServiceKey);

// Public Anon client (for client-side reads if needed, or anon serverside operations)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Admin Service Role client (bypass RLS for CMS operations, server-only)
export const supabaseAdmin = isSupabaseAdminConfigured
  ? createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

// Helper to check database health and see if tables are initialized
export async function verifyDbConnection() {
  if (!supabaseAdmin) {
    return { connected: false, initialized: false, error: "Supabase credentials missing" };
  }

  try {
    // Quick probe query to check schema
    const { data, error } = await supabaseAdmin
      .from("company_settings")
      .select("id")
      .limit(1);

    if (error) {
      if (error.code === "P0001" || error.message?.includes("does not exist") || error.code === "42P01") {
        return { connected: true, initialized: false, error: "Database connected, but tables are not initialized yet." };
      }
      return { connected: false, initialized: false, error: error.message };
    }

    return { connected: true, initialized: true, error: null };
  } catch (err: any) {
    return { connected: false, initialized: false, error: err.message || "Database connection error" };
  }
}
