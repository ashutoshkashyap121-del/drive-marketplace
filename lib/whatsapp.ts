// lib/whatsapp.ts
// WhatsApp Business notifications via Fast2SMS
// Templates must be pre-approved in Meta WhatsApp Manager

const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY!;
const WABA_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "1025099124020438";

// ─── Core send function ───────────────────────────────────────────────────────

async function sendWhatsApp({
  to,
  templateName,
  variables,
}: {
  to: string;
  templateName: string;
  variables: string[];
}) {
  try {
    // Sanitize number — remove +91, spaces, dashes
    const mobile = to.replace(/^\+91/, "").replace(/\D/g, "");

    const payload = {
      phone_number_id: WABA_PHONE_NUMBER_ID,
      to: `91${mobile}`,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: variables.map((v) => ({ type: "text", text: v })),
          },
        ],
      },
    };

    const res = await fetch("https://www.fast2sms.com/dev/whatsapp", {
      method: "POST",
      headers: {
        authorization: FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || data.return === false) {
      console.error("[WHATSAPP_ERROR]", templateName, data);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[WHATSAPP_NETWORK_ERROR]", templateName, err);
    return false;
  }
}

// ─── 1. Learner — Booking Confirmed ──────────────────────────────────────────

export async function waBookingConfirmedLearner({
  learnerName,
  learnerMobile,
  trainerName,
  bookingId,
  bookingDate,
  address,
}: {
  learnerName: string;
  learnerMobile: string;
  trainerName: string;
  bookingId: number;
  bookingDate: string;
  address: string;
}) {
  return sendWhatsApp({
    to: learnerMobile,
    templateName: "booking_confirmed_learner",
    variables: [
      learnerName,
      trainerName,
      bookingId.toString(),
      bookingDate,
      address,
    ],
  });
}

// ─── 2. Trainer — New Booking Received ───────────────────────────────────────

export async function waNewBookingTrainer({
  trainerName,
  trainerMobile,
  learnerName,
  learnerMobile,
  bookingDate,
  address,
  amount,
}: {
  trainerName: string;
  trainerMobile: string;
  learnerName: string;
  learnerMobile: string;
  bookingDate: string;
  address: string;
  amount: number;
}) {
  return sendWhatsApp({
    to: trainerMobile,
    templateName: "new_booking_trainer",
    variables: [
      trainerName,
      learnerName,
      learnerMobile,
      bookingDate,
      address,
      amount.toString(),
    ],
  });
}

// ─── 3. Learner — Booking Cancelled ──────────────────────────────────────────

export async function waBookingCancelledLearner({
  learnerName,
  learnerMobile,
  bookingId,
  refundAmount,
}: {
  learnerName: string;
  learnerMobile: string;
  bookingId: number;
  refundAmount: number;
}) {
  return sendWhatsApp({
    to: learnerMobile,
    templateName: "booking_cancelled_learner",
    variables: [
      learnerName,
      bookingId.toString(),
      refundAmount.toString(),
    ],
  });
}