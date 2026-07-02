import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase";

const GITHUB_PAT = process.env.GITHUB_PAT;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize and create safe filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filename = `${Date.now()}-${safeName}`;

    // 1. Supabase Storage Upload if configured
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      try {
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from("media")
          .upload(filename, buffer, {
            contentType: file.type,
            upsert: true
          });

        if (uploadError) {
          throw new Error(`Supabase Storage upload error: ${uploadError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from("media")
          .getPublicUrl(filename);

        // Record in media_library table
        await supabaseAdmin.from("media_library").insert({
          filename,
          url: publicUrl,
          size_bytes: file.size,
          content_type: file.type
        });

        return NextResponse.json({
          success: true,
          url: publicUrl
        });
      } catch (err: any) {
        console.error("Supabase file upload error, falling back to local file system:", err);
      }
    }

    // 2. Git-based upload fallback if GITHUB credentials exist
    const fileRelativePath = `public/uploads/${filename}`;
    if (GITHUB_PAT && GITHUB_REPO) {
      try {
        const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${fileRelativePath}`;
        const body = {
          message: `Upload media: ${filename}`,
          content: buffer.toString("base64"),
          branch: GITHUB_BRANCH
        };

        const res = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `token ${GITHUB_PAT}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });

        if (res.ok) {
          return NextResponse.json({
            success: true,
            url: `/uploads/${filename}`
          });
        } else {
          const err = await res.json();
          console.error("GitHub file commit failed details:", err);
        }
      } catch (e) {
        console.error("Error committing file upload to GitHub:", e);
      }
    }

    // 3. Local file write fallback
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${filename}` 
    });
  } catch (error) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: "Server upload process failure" }, { status: 500 });
  }
}
