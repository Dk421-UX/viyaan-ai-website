import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase";
import { verifyAdminRequest, getAdminCredentials, verifyPassword } from "@/lib/auth";

const messagesJsonPath = path.join(process.cwd(), "src/data/contact_messages.json");

// Helper to load local contact messages
async function readLocalMessages() {
  try {
    const data = await fs.readFile(messagesJsonPath, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

// Helper to write local contact messages
async function writeLocalMessages(messages: any[]) {
  try {
    // Ensure parent dir exists
    await fs.mkdir(path.dirname(messagesJsonPath), { recursive: true });
    await fs.writeFile(messagesJsonPath, JSON.stringify(messages, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Error writing contact messages locally:", e);
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const isSessionValid = verifyAdminRequest(request);
    let isCredentialValid = false;
    const url = new URL(request.url);
    const password = url.searchParams.get("password");

    if (!isSessionValid && password) {
      const credentials = await getAdminCredentials();
      if (credentials) {
        isCredentialValid = verifyPassword(password, credentials.passwordHash, credentials.salt);
      }
    }

    if (!isSessionValid && !isCredentialValid) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 1. Fetch from Supabase if configured
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const { data: records, error } = await supabaseAdmin
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && records) {
        return NextResponse.json(records);
      }
    }

    // 2. Fetch from local JSON if not configured
    const localMessages = await readLocalMessages();
    return NextResponse.json(localMessages);
  } catch (error) {
    console.error("GET messages handler error:", error);
    return NextResponse.json({ error: "Server process failure" }, { status: 500 });
  }
}

// POST: Submit a new contact message
export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured) {
    return NextResponse.json({ error: "Database configuration is missing" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { name, email, company, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    // 1. Insert into Supabase if configured
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin.from("contact_messages").insert({
        name,
        email,
        company: company || null,
        phone: phone || null,
        subject: subject || "No Subject",
        message,
        status: "unread"
      });

      if (!error) {
        return NextResponse.json({ success: true, message: "Inquiry transmitted to Supabase successfully." });
      }
      console.error("Supabase contact write failed, writing locally:", error.message);
    }

    // 2. Fallback to local file write
    const localMessages = await readLocalMessages();
    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      company: company || "",
      phone: phone || "",
      subject: subject || "No Subject",
      message,
      status: "unread",
      created_at: new Date().toISOString()
    };
    localMessages.unshift(newMsg);
    await writeLocalMessages(localMessages);

    return NextResponse.json({ success: true, message: "Inquiry logged locally." });
  } catch (error) {
    console.error("POST message handler error:", error);
    return NextResponse.json({ error: "Server submission process failure" }, { status: 500 });
  }
}

// PATCH/DELETE: Manage contact messages (Admin only)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { action, id, status, password } = body;

    const isSessionValid = verifyAdminRequest(request);
    let isCredentialValid = false;

    if (!isSessionValid && password) {
      const credentials = await getAdminCredentials();
      if (credentials) {
        isCredentialValid = verifyPassword(password, credentials.passwordHash, credentials.salt);
      }
    }

    if (!isSessionValid && !isCredentialValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Action: Update status or delete
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      if (action === "updateStatus") {
        await supabaseAdmin.from("contact_messages").update({ status }).eq("id", id);
      } else if (action === "delete") {
        await supabaseAdmin.from("contact_messages").delete().eq("id", id);
      }
      return NextResponse.json({ success: true });
    }

    // Fallback: Local JSON edit
    const localMessages = await readLocalMessages();
    if (action === "updateStatus") {
      const idx = localMessages.findIndex((m: any) => m.id === id);
      if (idx > -1) {
        localMessages[idx].status = status;
        await writeLocalMessages(localMessages);
      }
    } else if (action === "delete") {
      const updated = localMessages.filter((m: any) => m.id !== id);
      await writeLocalMessages(updated);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT messages handler error:", error);
    return NextResponse.json({ error: "Server process failure" }, { status: 500 });
  }
}
