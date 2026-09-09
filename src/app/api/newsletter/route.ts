import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { 
  isNeonConfigured, 
  getNewsletterSubscribersNeon, 
  insertNewsletterSubscriberNeon, 
  deleteNewsletterSubscriberNeon 
} from "@/lib/neon";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase";
import { verifyAdminRequest, getAdminCredentials, verifyPassword } from "@/lib/auth";

const subscribersJsonPath = path.join(process.cwd(), "src/data/newsletter_subscribers.json");

async function readLocalSubscribers() {
  try {
    const data = await fs.readFile(subscribersJsonPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeLocalSubscribers(subscribers: any[]) {
  try {
    await fs.mkdir(path.dirname(subscribersJsonPath), { recursive: true });
    await fs.writeFile(subscribersJsonPath, JSON.stringify(subscribers, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Error writing subscribers locally:", e);
    return false;
  }
}

function resolveAuthHeader(request: Request) {
  const url = new URL(request.url);
  return url.searchParams.get("password");
}

// GET: Admin list subscribers
export async function GET(request: Request) {
  const isSessionValid = verifyAdminRequest(request);
  let isCredentialValid = false;
  const password = resolveAuthHeader(request);

  if (!isSessionValid && password) {
    const credentials = await getAdminCredentials();
    if (credentials) {
      isCredentialValid = verifyPassword(password, credentials.passwordHash, credentials.salt);
    }
  }

  if (!isSessionValid && !isCredentialValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Neon PostgreSQL (Primary)
  if (isNeonConfigured) {
    try {
      const records = await getNewsletterSubscribersNeon();
      return NextResponse.json(records);
    } catch (neonErr) {
      console.error("[newsletter] Neon get subscribers error:", neonErr);
    }
  }

  // 2. Supabase Fallback
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return NextResponse.json(data);
    }
  }

  // 3. Local JSON (Development)
  const local = await readLocalSubscribers();
  return NextResponse.json(local);
}

// POST: Public subscribe
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    // 1. Neon PostgreSQL (Primary)
    if (isNeonConfigured) {
      try {
        await insertNewsletterSubscriberNeon(email, name);
        return NextResponse.json({ success: true, message: "Subscribed successfully." });
      } catch (neonErr) {
        console.error("[newsletter] Neon subscribe error:", neonErr);
        if (process.env.NODE_ENV === "production") {
          return NextResponse.json({ error: "Subscription service temporarily unavailable." }, { status: 500 });
        }
      }
    }

    // 2. Supabase Fallback
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const { data: existing } = await supabaseAdmin
        .from("newsletter_subscribers")
        .select("id")
        .eq("email", email)
        .limit(1);

      if (existing && existing.length > 0) {
        return NextResponse.json({ success: true, message: "Already subscribed." });
      }

      const { error } = await supabaseAdmin.from("newsletter_subscribers").insert({
        email,
        name: name || null,
        subscribed_at: new Date().toISOString(),
      });

      if (!error) {
        return NextResponse.json({ success: true, message: "Subscribed successfully." });
      }
    }

    // 3. Local fallback
    const subs = await readLocalSubscribers();
    const alreadyExists = subs.some((s: any) => s.email === email);
    if (alreadyExists) {
      return NextResponse.json({ success: true, message: "Already subscribed." });
    }
    subs.unshift({
      id: `sub-${Date.now()}`,
      email,
      name: name || "",
      subscribed_at: new Date().toISOString(),
    });
    await writeLocalSubscribers(subs);
    return NextResponse.json({ success: true, message: "Subscribed successfully." });
  } catch (e) {
    return NextResponse.json({ error: "Subscription failed." }, { status: 500 });
  }
}

// DELETE: Admin remove subscriber
export async function DELETE(request: Request) {
  const isSessionValid = verifyAdminRequest(request);
  let isCredentialValid = false;
  const password = resolveAuthHeader(request);

  if (!isSessionValid && password) {
    const credentials = await getAdminCredentials();
    if (credentials) {
      isCredentialValid = verifyPassword(password, credentials.passwordHash, credentials.salt);
    }
  }

  if (!isSessionValid && !isCredentialValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (!id && !email) {
      return NextResponse.json({ error: "Missing identifier" }, { status: 400 });
    }

    const target = id || email!;

    // 1. Neon PostgreSQL (Primary)
    if (isNeonConfigured) {
      try {
        await deleteNewsletterSubscriberNeon(target);
        return NextResponse.json({ success: true });
      } catch (neonErr) {
        console.error("[newsletter] Neon delete subscriber error:", neonErr);
      }
    }

    // 2. Supabase Fallback
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      let query = supabaseAdmin.from("newsletter_subscribers").delete();
      if (id) {
        query = query.eq("id", id);
      } else {
        query = query.eq("email", email);
      }
      const { error } = await query;
      if (!error) {
        return NextResponse.json({ success: true });
      }
    }

    // 3. Local fallback
    const subs = await readLocalSubscribers();
    const filtered = subs.filter((s: any) => (id ? s.id !== id : s.email !== email));
    await writeLocalSubscribers(filtered);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Deletion failed." }, { status: 500 });
  }
}
