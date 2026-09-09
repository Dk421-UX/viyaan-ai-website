import { NextResponse } from "next/server";
import { 
  checkRateLimit, 
  resetRateLimit, 
  getAdminCredentials, 
  verifyPassword, 
  createSession 
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // 1. Resolve client IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    
    // 2. Enforce sliding window rate limit
    const rateLimit = checkRateLimit(`login:${ip}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { 
          status: 429,
          headers: { "Retry-After": Math.ceil(rateLimit.resetInMs / 1000).toString() }
        }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // 3. Retrieve stored hashed credentials
    const credentials = await getAdminCredentials();
    if (!credentials) {
      return NextResponse.json(
        { 
          error: "Admin credentials not configured. Please use administrative recovery to initialize your passphrase.",
          needsRecovery: true 
        },
        { status: 401 }
      );
    }

    // 4. Timing-safe password verification
    const isValid = verifyPassword(password, credentials.passwordHash, credentials.salt);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // 5. Successful authentication
    resetRateLimit(`login:${ip}`);
    const session = createSession();

    const response = NextResponse.json({
      success: true,
      sessionToken: session.token,
      expiresAt: session.expiresAt
    });

    // 6. Set production-grade HttpOnly cookie
    response.cookies.set("viyaan_admin_session", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (err) {
    console.error("[auth-login] Internal error during authentication:", err);
    return NextResponse.json({ error: "Authentication service unavailable." }, { status: 500 });
  }
}
