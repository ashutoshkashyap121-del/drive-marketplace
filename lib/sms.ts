// lib/sms.ts
// Fast2SMS integration for LearnDrive
// Docs: https://docs.fast2sms.com

const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY!;
const BASE_URL = "https://www.fast2sms.com/dev/bulkV2";

// ─── Core SMS sender ──────────────────────────────────────────────────────────

async function sendSMS(mobile: string, message: string): Promise<boolean> {
  if (!FAST2SMS_API_KEY) {
    console.warn("[SMS] FAST2SMS_API_KEY not set — skipping SMS");
    return false;
  }

  // Clean mobile number — remove +91 prefix if present
  const cleanMobile = mobile.replace(/^\+91/, "").replace(/\D/g, "");

  if (cleanMobile.length !== 10) {
    console.warn(`[SMS] Invalid mobile number: ${mobile}`);
    return false;
  }

  // Fast2SMS rejects messages with newlines — replace with space
  const cleanMessage = message.replace(/\n/g, " ").trim();

  console.log(`[SMS] Sending to ${cleanMobile}: ${cleanMessage.slice(0, 50)}...`);

  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        authorization: FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        numbers: cleanMobile,
        message: cleanMessage,
        flash: 0,
        language: "english",
      }),
    });

    const rawText = await res.text();
    console.log(`[SMS] Fast2SMS raw response:`, rawText);

    let data: any;
    try { data = JSON.parse(rawText); } catch { data = { raw: rawText }; }

    if (data.return === true) {
      console.log(`[SMS] ✅ Sent successfully to ${cleanMobile}`);
      return true;
    } else {
      console.error(`[SMS] ❌ Failed:`, JSON.stringify(data));
      return false;
    }
  } catch (err) {
    console.error("[SMS] ❌ Network error:", err);
    return false;
  }
}

// ─── Notification functions ───────────────────────────────────────────────────

export async function smsAdminNewTrainer({ name, mobile, city }: { name: string; mobile: string; city: string }) {
  const adminMobile = process.env.ADMIN_MOBILE;
  if (!adminMobile) return;
  return sendSMS(adminMobile, `LearnDrive: New trainer application from ${name} (${mobile}) in ${city}. Review: drive-marketplace.vercel.app/admin`);
}

export async function smsTrainerApproved({ name, mobile, city }: { name: string; mobile: string; city: string }) {
  return sendSMS(mobile, `Hi ${name}! Your LearnDrive trainer profile is now APPROVED and live in ${city}. Learners can now book you. Welcome! - LearnDrive`);
}

export async function smsTrainerRejected({ name, mobile, reason }: { name: string; mobile: string; reason?: string }) {
  const r = reason ? ` Reason: ${reason}.` : "";
  return sendSMS(mobile, `Hi ${name}, your LearnDrive application was not approved.${r} Contact support@learndrive.in - LearnDrive`);
}

export async function smsTrainerNewBooking({ trainerMobile, customerName, customerMobile, packageName, amount }: {
  trainerName: string; trainerMobile: string; customerName: string; customerMobile: string; city: string; packageName: string; amount: number;
}) {
  return sendSMS(trainerMobile, `LearnDrive: New booking! Learner: ${customerName}, Contact: ${customerMobile}, Package: ${packageName}, Amount: Rs${amount}. Contact learner to confirm. - LearnDrive`);
}

export async function smsAdminNewBooking({ customerName, trainerName, amount, platformFee }: {
  customerName: string; trainerName: string; amount: number; platformFee: number;
}) {
  const adminMobile = process.env.ADMIN_MOBILE;
  if (!adminMobile) return;
  return sendSMS(adminMobile, `LearnDrive: New booking! Learner: ${customerName}, Trainer: ${trainerName}, Amount: Rs${amount}, Fee: Rs${platformFee}. Review: drive-marketplace.vercel.app/admin`);
}

export async function smsLearnerBookingConfirmed({ customerName, customerMobile, trainerName, trainerMobile, bookingId }: {
  customerName: string; customerMobile: string; trainerName: string; trainerMobile: string; bookingId: number;
}) {
  return sendSMS(customerMobile, `Hi ${customerName}! Your driving session with ${trainerName} is CONFIRMED (Ref #${bookingId}). Trainer will call you on ${trainerMobile} to arrange timing. - LearnDrive`);
}

export async function smsTrainerWelcome({ name, mobile, city }: { name: string; mobile: string; city: string }) {
  return sendSMS(mobile, `Hi ${name}! Welcome to LearnDrive! Your trainer application for ${city} is received. Our team will review within 24-48 hrs and call you to activate your profile. Questions? Call +91 87008 96528 - LearnDrive`);
}