import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { 
  isNeonConfigured, 
  getMediaLibraryNeon, 
  deleteMediaRecordNeon 
} from "@/lib/neon";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase";
import { verifyAdminRequest, getAdminCredentials, verifyPassword } from "@/lib/auth";

const GITHUB_PAT = process.env.GITHUB_PAT;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

const localUploadDir = path.join(process.cwd(), "public", "uploads");

// GET: List all media files
export async function GET() {
  // 1. Neon Media List if configured (Primary)
  if (isNeonConfigured) {
    try {
      const records = await getMediaLibraryNeon();
      if (records) {
        const mediaFiles = records.map((r: any) => ({
          name: r.filename,
          url: r.url,
          size: r.size_bytes,
          sha: null
        }));
        return NextResponse.json(mediaFiles);
      }
    } catch (neonErr) {
      console.error("[media] Error listing files from Neon:", neonErr);
    }
  }

  // 2. Supabase Media List fallback
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data: records, error } = await supabaseAdmin
        .from("media_library")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      if (records) {
        const mediaFiles = records.map((r: any) => ({
          name: r.filename,
          url: r.url,
          size: r.size_bytes,
          sha: null
        }));
        return NextResponse.json(mediaFiles);
      }
    } catch (e: any) {
      console.error("Error listing files from Supabase, using local directory fallback:", e);
    }
  }

  // 3. Git-based list fallback if GITHUB credentials exist
  if (GITHUB_PAT && GITHUB_REPO) {
    try {
      const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/public/uploads?ref=${GITHUB_BRANCH}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `token ${GITHUB_PAT}`,
          Accept: "application/vnd.github+json",
          "Cache-Control": "no-cache"
        }
      });
      if (res.ok) {
        const files = await res.json();
        if (Array.isArray(files)) {
          const mediaFiles = files
            .filter((f) => f.type === "file")
            .map((f) => ({
              name: f.name,
              url: `/uploads/${f.name}`,
              size: f.size,
              sha: f.sha
            }));
          return NextResponse.json(mediaFiles);
        }
      } else if (res.status === 404) {
        return NextResponse.json([]);
      }
    } catch (e) {
      console.error("Error listing files from GitHub:", e);
    }
  }

  // 4. Fallback to local FS list
  try {
    await fs.mkdir(localUploadDir, { recursive: true });
    const fileNames = await fs.readdir(localUploadDir);
    const mediaFiles = [];
    
    for (const name of fileNames) {
      const filePath = path.join(localUploadDir, name);
      const stats = await fs.stat(filePath);
      mediaFiles.push({
        name,
        url: `/uploads/${name}`,
        size: stats.size,
        sha: null
      });
    }
    return NextResponse.json(mediaFiles);
  } catch (error) {
    console.error("Error listing local files:", error);
    return NextResponse.json({ error: "Failed to list media files" }, { status: 500 });
  }
}

// POST/DELETE: Delete a media file
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filename, sha, password } = body;

    const isSessionValid = verifyAdminRequest(request);
    let isCredentialValid = false;

    if (!isSessionValid && password) {
      const credentials = await getAdminCredentials();
      if (credentials) {
        isCredentialValid = verifyPassword(password, credentials.passwordHash, credentials.salt);
      }
    }

    if (!isSessionValid && !isCredentialValid) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    // 1. Neon Media Delete if configured (Primary)
    if (isNeonConfigured) {
      try {
        await deleteMediaRecordNeon(filename);
      } catch (neonErr) {
        console.error("[media] Neon delete media error:", neonErr);
      }
    }

    // 2. Supabase Media Delete if configured (Fallback)
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.storage
          .from("media")
          .remove([filename]);

        await supabaseAdmin
          .from("media_library")
          .delete()
          .eq("filename", filename);

        return NextResponse.json({ success: true });
      } catch (err: any) {
        console.error("Supabase media delete error:", err);
      }
    }

    // 3. Try Git-based delete if GITHUB credentials exist
    if (GITHUB_PAT && GITHUB_REPO && sha) {
      try {
        const fileRelativePath = `public/uploads/${filename}`;
        const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${fileRelativePath}`;
        
        const deleteBody = {
          message: `Delete media: ${filename}`,
          sha,
          branch: GITHUB_BRANCH
        };

        const res = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: `token ${GITHUB_PAT}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(deleteBody)
        });

        if (res.ok) {
          return NextResponse.json({ success: true });
        } else {
          const err = await res.json();
          console.error("GitHub file deletion details:", err);
        }
      } catch (e) {
        console.error("Error deleting file from GitHub:", e);
      }
    }

    // 4. Local file delete fallback
    try {
      const filePath = path.join(localUploadDir, filename);
      await fs.unlink(filePath);
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete media handler error:", error);
    return NextResponse.json({ error: "Failed to delete media asset" }, { status: 500 });
  }
}
