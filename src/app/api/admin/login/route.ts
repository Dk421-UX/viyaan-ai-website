import { NextResponse } from "next/server";
import { 
  checkRateLimit, 
  resetRateLimit, 
  getAdminCredentials, 
  verifyPassword, 
  createSession,
  getRecoveryKey,
  hashPassword,
  saveAdminCredentials,
  recordAdminLogin
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

    // 3. Retrieve stored credentials from Supabase (or local store in dev)
    const credentials = await getAdminCredentials();
    
    // Production safety: fail clearly if cloud database is unconfigured in production
    if (!credentials || credentials.unconfigured) {
      const hasRecovery = !!getRecoveryKey();
      return NextResponse.json(
        { 
          error: "Production database service is not configured. Neon DATABASE_URL is missing in your deployment environment (Vercel / Render / .env.production). Please configure DATABASE_URL or initialize via Administrative Recovery.",
          needsRecovery: hasRecovery,
          unconfigured: true
        },
        { status: 503 }
      );
    }

    // 4. Timing-safe password verification (supports scrypt and legacy plain text with auto-upgrade)
    const isValid = verifyPassword(password, credentials.passwordHash, credentials.salt, credentials.legacyRaw);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Automatic migration: If verified via legacy plain text, immediately upgrade to scrypt hash
    if (credentials.isLegacyPlain) {
      try {
        const { hash, salt } = hashPassword(password);
        saveAdminCredentials(hash, salt).catch((e) => {
          console.error("[auth-login] Background password migration error:", e);
        });
      } catch (migrationErr) {
        console.error("[auth-login] Migration error:", migrationErr);
      }
    }

    // 5. Successful authentication
    resetRateLimit(`login:${ip}`);
    recordAdminLogin().catch(() => {});
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
