import { NextResponse } from "next/server";
import crypto from "crypto";

const RTO_TOKEN_SECRET = process.env.RTO_TOKEN_SECRET!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

// Token is valid for 7 days — allows retakes
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function createAccessToken(paymentId: string): string {
  const payload = `${paymentId}:${Date.now()}`;
  const sig = crypto
    .createHmac("sha256", RTO_TOKEN_SECRET)
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifyAccessToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;
    const [paymentId, issuedAt, sig] = parts;
    // Check expiry
    if (Date.now() - parseInt(issuedAt) > TOKEN_TTL_MS) return false;
    // Recompute sig
    const expected = crypto
      .createHmac("sha256", RTO_TOKEN_SECRET)
      .update(`${paymentId}:${issuedAt}`)
      .digest("hex");
    return crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    // Verify Razorpay signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSig = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(razorpay_signature, "hex"),
      Buffer.from(expectedSig, "hex")
    );

    if (!isValid) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Create access token
    const token = createAccessToken(razorpay_payment_id);

    // Set httpOnly cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("rto_access", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/rto-test/mock",
      maxAge: TOKEN_TTL_MS / 1000,
    });

    return response;
  } catch (err) {
    console.error("RTO verify error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}