import { NextResponse } from "next/server";
import { 
  checkRateLimit, 
  resetRateLimit, 
  verifyRecoveryKey, 
  createResetToken, 
  validateResetToken, 
  consumeResetToken, 
  validatePasswordStrength, 
  hashPassword, 
  saveAdminCredentials, 
  destroyAllSessions 
} from "@/lib/auth";

// POST: Validate recovery key & issue single-use expiring reset token
export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    const rateLimit = checkRateLimit(`recovery-req:${ip}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many recovery attempts. Please try again later." },
        { 
          status: 429,
          headers: { "Retry-After": Math.ceil(rateLimit.resetInMs / 1000).toString() }
        }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { recoveryKey } = body;

    if (!recoveryKey || typeof recoveryKey !== "string") {
      return NextResponse.json({ error: "Administrative recovery key is required." }, { status: 400 });
    }

    const isValidKey = verifyRecoveryKey(recoveryKey);
    if (!isValidKey) {
      return NextResponse.json({ error: "Invalid administrative recovery key." }, { status: 401 });
    }

    resetRateLimit(`recovery-req:${ip}`);
    const resetToken = createResetToken();

    return NextResponse.json({
      success: true,
      resetToken,
      expiresInSeconds: 15 * 60,
      message: "Recovery key verified. You may now set a new passphrase."
    });
  } catch (err) {
    console.error("[auth-recovery] Error during recovery request:", err);
    return NextResponse.json({ error: "Recovery service unavailable." }, { status: 500 });
  }
}

// PUT: Consume reset token and set new admin passphrase
export async function PUT(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    const rateLimit = checkRateLimit(`recovery-reset:${ip}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many password reset attempts. Please try again later." },
        { 
          status: 429,
          headers: { "Retry-After": Math.ceil(rateLimit.resetInMs / 1000).toString() }
        }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { resetToken, newPassword } = body;

    if (!resetToken || !newPassword) {
      return NextResponse.json({ error: "Reset token and new passphrase are required." }, { status: 400 });
    }

    // 1. Verify single-use expiring token
    const isTokenValid = validateResetToken(resetToken);
    if (!isTokenValid) {
      return NextResponse.json({ error: "Reset token is invalid or has expired. Please initiate recovery again." }, { status: 400 });
    }

    // 2. Validate password strength
    const strength = validatePasswordStrength(newPassword);
    if (!strength.valid) {
      return NextResponse.json({ error: strength.reason || "Passphrase does not meet security requirements." }, { status: 400 });
    }

    // 3. Hash with unique salt using scrypt
    const { hash, salt } = hashPassword(newPassword);

    // 4. Persist new credentials
    const saved = await saveAdminCredentials(hash, salt);
    if (!saved) {
      return NextResponse.json({ error: "Failed to persist new credentials." }, { status: 500 });
    }

    // 5. Invalidate token and purge old sessions
    consumeResetToken(resetToken);
    destroyAllSessions();
    resetRateLimit(`recovery-reset:${ip}`);

    return NextResponse.json({
      success: true,
      message: "Admin passphrase successfully updated. All previous sessions have been invalidated. You may now log in."
    });
  } catch (err) {
    console.error("[auth-recovery] Error resetting password:", err);
    return NextResponse.json({ error: "Password reset service unavailable." }, { status: 500 });
  }
}
