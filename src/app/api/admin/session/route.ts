import { NextResponse } from "next/server";
import { extractSessionToken, verifySession, destroySession } from "@/lib/auth";

// GET: Check active session status
export async function GET(request: Request) {
  const token = extractSessionToken(request);
  const isValid = verifySession(token);

  if (!isValid) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}

// DELETE: Terminate active session & clear cookie
export async function DELETE(request: Request) {
  const token = extractSessionToken(request);
  if (token) {
    destroySession(token);
  }

  const response = NextResponse.json({ success: true, message: "Session terminated." });
  response.cookies.set("viyaan_admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
