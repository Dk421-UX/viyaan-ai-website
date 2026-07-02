import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase";

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
  const password = resolveAuthHeader(request);
  const validPassphrase = "viyaan2026";

  if (password !== validPassphrase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isSupabaseAdminConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return NextResponse.json(data);
    }
  }

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

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      // Check for duplicate
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

    // Fallback: local file
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
  try {
    const body = await request.json();
    const { id, password } = body;

    if (password !== "viyaan2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      await supabaseAdmin.from("newsletter_subscribers").delete().eq("id", id);
      return NextResponse.json({ success: true });
    }

    const subs = await readLocalSubscribers();
    const updated = subs.filter((s: any) => s.id !== id);
    await writeLocalSubscribers(updated);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}
