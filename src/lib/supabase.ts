import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if credentials are provided
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
export const isSupabaseAdminConfigured = !!(supabaseUrl && supabaseServiceKey);

function createAnonClient(): SupabaseClient {
  if (!supabaseUrl) {
    throw new Error("Missing env variable: NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!supabaseAnonKey) {
    throw new Error("Missing env variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

function createAdminClient(): SupabaseClient {
  if (!supabaseUrl) {
    throw new Error("Missing env variable: NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!supabaseServiceKey) {
    throw new Error("Missing env variable: SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let cachedAnonClient: SupabaseClient | null = null;
let cachedAdminClient: SupabaseClient | null = null;

// Proxy-wrapped public client
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop, receiver) {
    if (!isSupabaseConfigured) {
      throw new Error(
        "Supabase client cannot be accessed: NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_URL environment variables are missing."
      );
    }
    if (!cachedAnonClient) {
      cachedAnonClient = createAnonClient();
    }
    const value = Reflect.get(cachedAnonClient, prop, receiver);
    return typeof value === "function" ? value.bind(cachedAnonClient) : value;
  },
});

// Proxy-wrapped Admin Service Role client (bypass RLS for CMS operations, server-only)
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(target, prop, receiver) {
    if (!isSupabaseAdminConfigured) {
      throw new Error(
        "Supabase Admin client cannot be accessed: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL environment variables are missing."
      );
    }
    if (!cachedAdminClient) {
      cachedAdminClient = createAdminClient();
    }
    const value = Reflect.get(cachedAdminClient, prop, receiver);
    return typeof value === "function" ? value.bind(cachedAdminClient) : value;
  },
});

// Helper to check database health and see if tables are initialized
export async function verifyDbConnection() {
  if (!isSupabaseAdminConfigured) {
    return { connected: false, initialized: false, error: "Supabase credentials missing" };
  }

  try {
    // Quick probe query to check schema
    const { error } = await supabaseAdmin
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
