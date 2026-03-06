// lib/notifications.ts
// Central notification system — currently email only via Resend
// Structured so WhatsApp can be added later with minimal changes

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://learndrive.in";
const FROM_EMAIL = process.env.FROM_EMAIL || "LearnDrive <notifications@learndrive.in>";

// ─── Core send function ───────────────────────────────────────────────────────

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("[RESEND_ERROR]", err);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[RESEND_NETWORK_ERROR]", err);
    return false;
  }
}

// ─── Email Templates ──────────────────────────────────────────────────────────

function baseTemplate(content: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#0a1628 0%,#0f2040 100%);padding:32px 40px;">
          <h1 style="margin:0;color:#fbbf24;font-size:24px;font-weight:800;letter-spacing:-0.5px;">
            🚗 LearnDrive
          </h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.5);font-size:13px;">
            India's Verified Driving Trainer Platform
          </p>
        </div>

        <!-- Content -->
        <div style="padding:40px;">
          ${content}
        </div>

        <!-- Footer -->
        <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
          <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
            LearnDrive · Delhi NCR, Mumbai, Bangalore<br/>
            <a href="${BASE_URL}/terms" style="color:#9ca3af;">Terms</a> &nbsp;·&nbsp;
            <a href="${BASE_URL}/privacy" style="color:#9ca3af;">Privacy</a> &nbsp;·&nbsp;
            <a href="mailto:support@learndrive.in" style="color:#9ca3af;">support@learndrive.in</a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

// ─── 1. Trainer Registration → Admin ─────────────────────────────────────────

export async function notifyAdminNewTrainer(trainer: {
  id: number;
  name: string;
  mobile: string;
  email: string | null;
  city: string;
  vehicleTypes: string[];
  experience: number;
  licenseNumber: string;
}) {
  const html = baseTemplate(`
    <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:12px;padding:20px;margin-bottom:28px;">
      <p style="margin:0;font-size:15px;font-weight:700;color:#92400e;">
        🔔 New Trainer Application Received
      </p>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:12px 0;color:#6b7280;font-size:14px;width:140px;">Name</td>
        <td style="padding:12px 0;color:#111827;font-size:14px;font-weight:600;">${trainer.name}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:12px 0;color:#6b7280;font-size:14px;">Mobile</td>
        <td style="padding:12px 0;color:#111827;font-size:14px;font-weight:600;">+91 ${trainer.mobile}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:12px 0;color:#6b7280;font-size:14px;">Email</td>
        <td style="padding:12px 0;color:#111827;font-size:14px;">${trainer.email || "—"}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:12px 0;color:#6b7280;font-size:14px;">City</td>
        <td style="padding:12px 0;color:#111827;font-size:14px;">${trainer.city}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:12px 0;color:#6b7280;font-size:14px;">Vehicles</td>
        <td style="padding:12px 0;color:#111827;font-size:14px;">${trainer.vehicleTypes.join(", ")}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:12px 0;color:#6b7280;font-size:14px;">Experience</td>
        <td style="padding:12px 0;color:#111827;font-size:14px;">${trainer.experience} years</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#6b7280;font-size:14px;">Licence No.</td>
        <td style="padding:12px 0;color:#111827;font-size:14px;font-family:monospace;">${trainer.licenseNumber}</td>
      </tr>
    </table>

    <a href="${BASE_URL}/admin"
      style="display:inline-block;background:#fbbf24;color:#0f172a;font-weight:700;font-size:15px;
             padding:14px 32px;border-radius:10px;text-decoration:none;">
      Review Application →
    </a>
  `);

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `🔔 New Trainer Application — ${trainer.name} (${trainer.city})`,
    html,
  });
}

// ─── 2. Trainer Approved → Trainer ───────────────────────────────────────────

export async function notifyTrainerApproved(trainer: {
  id: number;
  name: string;
  email: string;
  city: string;
}) {
  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:32px;">
      <div style="width:72px;height:72px;background:#d1fae5;border-radius:50%;display:inline-flex;
                  align-items:center;justify-content:center;font-size:36px;margin-bottom:16px;">
        ✅
      </div>
      <h2 style="margin:0;color:#111827;font-size:24px;font-weight:800;">You're Approved!</h2>
      <p style="margin:8px 0 0;color:#6b7280;font-size:15px;">
        Welcome to the LearnDrive trainer network
      </p>
    </div>

    <p style="color:#374151;font-size:15px;line-height:1.7;margin-bottom:20px;">
      Hi <strong>${trainer.name}</strong>,
    </p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin-bottom:20px;">
      Great news! Your LearnDrive trainer profile has been <strong>verified and approved</strong>. 
      Your profile is now live and learners in <strong>${trainer.city}</strong> can find and book you.
    </p>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:28px;">
      <p style="margin:0 0 12px;font-weight:700;color:#166534;font-size:14px;">What happens next:</p>
      <ul style="margin:0;padding:0 0 0 20px;color:#374151;font-size:14px;line-height:2;">
        <li>Learners can now search and find your profile</li>
        <li>You'll receive an email when a new booking is made</li>
        <li>Keep your phone on — learners may call to confirm sessions</li>
        <li>Complete sessions promptly to build your rating</li>
      </ul>
    </div>

    <a href="${BASE_URL}/trainers/${trainer.id}"
      style="display:inline-block;background:#fbbf24;color:#0f172a;font-weight:700;font-size:15px;
             padding:14px 32px;border-radius:10px;text-decoration:none;margin-bottom:24px;">
      View Your Profile →
    </a>

    <p style="color:#9ca3af;font-size:13px;margin:24px 0 0;">
      Questions? Reply to this email or WhatsApp us at your registered number.
    </p>
  `);

  return sendEmail({
    to: trainer.email,
    subject: `✅ You're approved on LearnDrive — Welcome, ${trainer.name}!`,
    html,
  });
}

// ─── 3. Trainer Rejected → Trainer ───────────────────────────────────────────

export async function notifyTrainerRejected(trainer: {
  name: string;
  email: string;
  reason?: string;
}) {
  const html = baseTemplate(`
    <p style="color:#374151;font-size:15px;line-height:1.7;margin-bottom:20px;">
      Hi <strong>${trainer.name}</strong>,
    </p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin-bottom:20px;">
      Thank you for applying to join LearnDrive. After reviewing your application, 
      we're unable to approve your profile at this time.
    </p>

    ${trainer.reason ? `
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px;margin-bottom:28px;">
      <p style="margin:0 0 8px;font-weight:700;color:#991b1b;font-size:14px;">Reason:</p>
      <p style="margin:0;color:#374151;font-size:14px;">${trainer.reason}</p>
    </div>
    ` : ""}

    <p style="color:#374151;font-size:15px;line-height:1.7;margin-bottom:28px;">
      You're welcome to re-apply once the above issue is resolved. If you believe 
      this is a mistake or need clarification, please contact us.
    </p>

    <a href="mailto:support@learndrive.in"
      style="display:inline-block;background:#f3f4f6;color:#374151;font-weight:700;font-size:15px;
             padding:14px 32px;border-radius:10px;text-decoration:none;">
      Contact Support
    </a>
  `);

  return sendEmail({
    to: trainer.email,
    subject: `LearnDrive Trainer Application Update — ${trainer.name}`,
    html,
  });
}

// ─── 4. Booking Made → Trainer + Learner ─────────────────────────────────────

export async function notifyBookingMade({
  trainer,
  learner,
  booking,
}: {
  trainer: { name: string; email: string; mobile: string };
  learner: { name: string; email: string; mobile: string };
  booking: {
    id: number;
    packageName: string;
    amount: number;
    bookingDate: string;
    address: string;
    city: string;
  };
}) {
  // Email to trainer
  const trainerHtml = baseTemplate(`
    <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:12px;padding:20px;margin-bottom:28px;">
      <p style="margin:0;font-size:15px;font-weight:700;color:#92400e;">
        🔔 New Booking Received!
      </p>
    </div>

    <p style="color:#374151;font-size:15px;line-height:1.7;margin-bottom:20px;">
      Hi <strong>${trainer.name}</strong>, you have a new booking!
    </p>

    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:12px 0;color:#6b7280;font-size:14px;width:140px;">Learner</td>
        <td style="padding:12px 0;color:#111827;font-size:14px;font-weight:600;">${learner.name}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:12px 0;color:#6b7280;font-size:14px;">Mobile</td>
        <td style="padding:12px 0;color:#111827;font-size:14px;font-weight:600;">+91 ${learner.mobile}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:12px 0;color:#6b7280;font-size:14px;">Package</td>
        <td style="padding:12px 0;color:#111827;font-size:14px;">${booking.packageName}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:12px 0;color:#6b7280;font-size:14px;">Amount</td>
        <td style="padding:12px 0;color:#111827;font-size:14px;font-weight:700;">₹${booking.amount}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:12px 0;color:#6b7280;font-size:14px;">Date</td>
        <td style="padding:12px 0;color:#111827;font-size:14px;">${booking.bookingDate}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#6b7280;font-size:14px;">Address</td>
        <td style="padding:12px 0;color:#111827;font-size:14px;">${booking.address}, ${booking.city}</td>
      </tr>
    </table>

    <p style="color:#374151;font-size:14px;line-height:1.7;margin-bottom:24px;">
      Please contact the learner to confirm the session time. 
      Call <strong>+91 ${learner.mobile}</strong> to coordinate.
    </p>

    <a href="${BASE_URL}/admin"
      style="display:inline-block;background:#fbbf24;color:#0f172a;font-weight:700;font-size:15px;
             padding:14px 32px;border-radius:10px;text-decoration:none;">
      View Booking →
    </a>
  `);

  // Email to learner
  const learnerHtml = baseTemplate(`
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:48px;margin-bottom:12px;">🎉</div>
      <h2 style="margin:0;color:#111827;font-size:24px;font-weight:800;">Booking Confirmed!</h2>
      <p style="margin:8px 0 0;color:#6b7280;font-size:15px;">
        Your driving lesson is booked
      </p>
    </div>

    <p style="color:#374151;font-size:15px;line-height:1.7;margin-bottom:20px;">
      Hi <strong>${learner.name}</strong>, your booking is confirmed!
    </p>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:24px;margin-bottom:28px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr style="border-bottom:1px solid #d1fae5;">
          <td style="padding:10px 0;color:#6b7280;font-size:14px;width:120px;">Trainer</td>
          <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:600;">${trainer.name}</td>
        </tr>
        <tr style="border-bottom:1px solid #d1fae5;">
          <td style="padding:10px 0;color:#6b7280;font-size:14px;">Contact</td>
          <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:600;">+91 ${trainer.mobile}</td>
        </tr>
        <tr style="border-bottom:1px solid #d1fae5;">
          <td style="padding:10px 0;color:#6b7280;font-size:14px;">Package</td>
          <td style="padding:10px 0;color:#111827;font-size:14px;">${booking.packageName}</td>
        </tr>
        <tr style="border-bottom:1px solid #d1fae5;">
          <td style="padding:10px 0;color:#6b7280;font-size:14px;">Date</td>
          <td style="padding:10px 0;color:#111827;font-size:14px;">${booking.bookingDate}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#6b7280;font-size:14px;">Address</td>
          <td style="padding:10px 0;color:#111827;font-size:14px;">${booking.address}, ${booking.city}</td>
        </tr>
      </table>
    </div>

    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;margin-bottom:28px;">
      <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6;">
        💡 <strong>Tip:</strong> Make sure you have your Learner's Licence ready before the session. 
        Your trainer will contact you to confirm the exact timing.
      </p>
    </div>

    <p style="color:#9ca3af;font-size:13px;margin:0;">
      Need help? Email us at 
      <a href="mailto:support@learndrive.in" style="color:#fbbf24;">support@learndrive.in</a>
    </p>
  `);

  // Send both emails in parallel
  const [trainerResult, learnerResult] = await Promise.all([
    sendEmail({
      to: trainer.email,
      subject: `🔔 New Booking — ${learner.name} (${booking.packageName})`,
      html: trainerHtml,
    }),
    learner.email
      ? sendEmail({
          to: learner.email,
          subject: `✅ Booking Confirmed — ${booking.packageName} with ${trainer.name}`,
          html: learnerHtml,
        })
      : Promise.resolve(true),
  ]);

  return { trainerResult, learnerResult };
}

// ─── 5. Admin notify also on booking (optional) ───────────────────────────────

export async function notifyAdminNewBooking(booking: {
  learnerName: string;
  trainerName: string;
  packageName: string;
  amount: number;
  city: string;
}) {
  const html = baseTemplate(`
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0;font-size:15px;font-weight:700;color:#166534;">
        💰 New Booking — ₹${booking.amount}
      </p>
    </div>
    <p style="color:#374151;font-size:15px;">
      <strong>${booking.learnerName}</strong> booked 
      <strong>${booking.packageName}</strong> with 
      <strong>${booking.trainerName}</strong> in ${booking.city}.
    </p>
    <p style="color:#6b7280;font-size:14px;">Platform fee: ₹${Math.round(booking.amount * 0.15)}</p>
    <a href="${BASE_URL}/admin" style="display:inline-block;background:#fbbf24;color:#0f172a;
       font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;">
      View in Admin →
    </a>
  `);

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `💰 New Booking ₹${booking.amount} — ${booking.learnerName} → ${booking.trainerName}`,
    html,
  });
}