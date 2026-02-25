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

  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        authorization: FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q", // Quick/Transactional route
        numbers: cleanMobile,
        message: message,
        flash: 0,
        language: "english",
      }),
    });

    const data = await res.json();

    if (data.return === true) {
      console.log(`[SMS] Sent to ${cleanMobile}`);
      return true;
    } else {
      console.error(`[SMS] Failed:`, data.message || data);
      return false;
    }
  } catch (err) {
    console.error("[SMS] Error:", err);
    return false;
  }
}

// ─── Notification functions ───────────────────────────────────────────────────

/**
 * Notify admin when a new trainer registers
 * Called from: app/api/trainers/register/route.ts
 */
export async function smsAdminNewTrainer({
  name,
  mobile,
  city,
}: {
  name: string;
  mobile: string;
  city: string;
}) {
  const adminMobile = process.env.ADMIN_MOBILE;
  if (!adminMobile) return;

  const message = `LearnDrive: New trainer application received!\nName: ${name}\nMobile: ${mobile}\nCity: ${city}\nReview at: drive-marketplace.vercel.app/admin`;

  return sendSMS(adminMobile, message);
}

/**
 * Notify trainer when their application is approved
 * Called from: app/api/admin/trainers/approve/route.ts
 */
export async function smsTrainerApproved({
  name,
  mobile,
  city,
}: {
  name: string;
  mobile: string;
  city: string;
}) {
  const message = `Hi ${name}! Your LearnDrive trainer application has been APPROVED. Your profile is now live and learners in ${city} can start booking you. Welcome aboard! - LearnDrive Team`;

  return sendSMS(mobile, message);
}

/**
 * Notify trainer when their application is rejected
 * Called from: app/api/admin/trainers/approve/route.ts
 */
export async function smsTrainerRejected({
  name,
  mobile,
  reason,
}: {
  name: string;
  mobile: string;
  reason?: string;
}) {
  const reasonText = reason ? `\nReason: ${reason}` : "";
  const message = `Hi ${name}, unfortunately your LearnDrive trainer application was not approved at this time.${reasonText}\nFor queries contact: support@learndrive.in - LearnDrive Team`;

  return sendSMS(mobile, message);
}

/**
 * Notify trainer when a new booking is made
 * Called from: app/api/bookings/route.ts
 */
export async function smsTrainerNewBooking({
  trainerName,
  trainerMobile,
  customerName,
  customerMobile,
  city,
  packageName,
  amount,
}: {
  trainerName: string;
  trainerMobile: string;
  customerName: string;
  customerMobile: string;
  city: string;
  packageName: string;
  amount: number;
}) {
  const message = `LearnDrive: New booking!\nLearner: ${customerName}\nContact: ${customerMobile}\nPackage: ${packageName}\nAmount: Rs.${amount}\nCity: ${city}\nContact the learner to confirm timing. - LearnDrive`;

  return sendSMS(trainerMobile, message);
}

/**
 * Notify admin when a new booking is made
 * Called from: app/api/bookings/route.ts
 */
export async function smsAdminNewBooking({
  customerName,
  trainerName,
  amount,
  platformFee,
}: {
  customerName: string;
  trainerName: string;
  amount: number;
  platformFee: number;
}) {
  const adminMobile = process.env.ADMIN_MOBILE;
  if (!adminMobile) return;

  const message = `LearnDrive: New booking!\nLearner: ${customerName}\nTrainer: ${trainerName}\nAmount: Rs.${amount}\nPlatform fee: Rs.${platformFee}\nReview at: drive-marketplace.vercel.app/admin`;

  return sendSMS(adminMobile, message);
}

/**
 * Notify learner when their booking is confirmed by admin
 * Called from: app/api/admin/bookings/update/route.ts
 */
export async function smsLearnerBookingConfirmed({
  customerName,
  customerMobile,
  trainerName,
  trainerMobile,
  bookingId,
}: {
  customerName: string;
  customerMobile: string;
  trainerName: string;
  trainerMobile: string;
  bookingId: number;
}) {
  const message = `Hi ${customerName}! Your driving session with ${trainerName} is CONFIRMED (Booking #${bookingId}). Your trainer will contact you on ${trainerMobile} to arrange timing. - LearnDrive`;

  return sendSMS(customerMobile, message);
}