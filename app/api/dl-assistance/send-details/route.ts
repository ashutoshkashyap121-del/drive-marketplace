import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { customerData, orderId } = await req.json();
    const {
      name, email, mobile, city, vehicleType,
      address, pincode, state, rto, preferredDates,
      hasLL, llNumber, aadhaar
    } = customerData;

    const documentsNeeded = [
      "✅ Aadhaar Card — Original + 2 photocopies",
      "✅ 4 Passport size photographs (white background)",
      "✅ Form 4 — We will fill and email this to you within 2 hours",
      "✅ ₹200 RTO fee — Pay in cash at the RTO counter",
      hasLL ? `✅ Learner Licence (${llNumber}) — Original + 1 photocopy` : "✅ We will help you get your Learner Licence first",
    ].join("\n");

    // Email to customer
    await resend.emails.send({
      from: process.env.FROM_EMAIL || "LearnDrive <noreply@learndrive.in>",
      to: email,
      subject: "Your DL Assistance — Document Checklist & Next Steps | LearnDrive",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Georgia, serif; background: #fafaf8; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
            
            <div style="background: linear-gradient(135deg, #1a2540 0%, #2d3f6b 100%); padding: 32px; text-align: center;">
              <div style="font-size: 24px; font-weight: 900; color: white;">Learn<span style="color: #f59e0b;">Drive</span></div>
              <div style="color: #94a3b8; font-size: 14px; margin-top: 8px; font-family: system-ui;">DL Assistance Service</div>
            </div>

            <div style="padding: 32px;">
              <h1 style="font-size: 22px; color: #1a2540; margin-bottom: 8px;">Hi ${name}! 👋</h1>
              <p style="color: #64748b; font-size: 15px; line-height: 1.7; font-family: system-ui;">
                Thank you for choosing LearnDrive DL Assistance. We have received your details and our team is now processing your application. Here's everything you need to know.
              </p>

              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <h2 style="color: #166534; font-size: 16px; margin-bottom: 12px; font-family: system-ui;">📋 Documents to Bring to RTO</h2>
                <pre style="color: #166534; font-size: 14px; line-height: 1.8; font-family: system-ui; white-space: pre-wrap;">${documentsNeeded}</pre>
              </div>

              <div style="background: #fef9ec; border: 1px solid #fde68a; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <h2 style="color: #92400e; font-size: 16px; margin-bottom: 12px; font-family: system-ui;">📅 What Happens Next</h2>
                <div style="font-family: system-ui; font-size: 14px; color: #92400e; line-height: 2;">
                  <div>1️⃣ We fill your Sarathi Form 4 — <strong>within 2 hours</strong></div>
                  <div>2️⃣ We book your RTO slot at <strong>${rto || city + " RTO"}</strong></div>
                  <div>3️⃣ We email you the filled form + appointment details</div>
                  <div>4️⃣ We send reminders 3 days before and morning of your test</div>
                </div>
              </div>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <h2 style="color: #1a2540; font-size: 16px; margin-bottom: 12px; font-family: system-ui;">👤 Your Details (Order #${orderId})</h2>
                <table style="width: 100%; font-family: system-ui; font-size: 14px; border-collapse: collapse;">
                  ${[
                    ["Name", name],
                    ["Mobile", mobile],
                    ["City", city],
                    ["State", state],
                    ["Pincode", pincode],
                    ["Vehicle Type", vehicleType],
                    ["RTO", rto || city + " RTO"],
                    ["Preferred Dates", Array.isArray(preferredDates) ? preferredDates.join(", ") : preferredDates],
                  ].map(([label, value]) => `
                    <tr>
                      <td style="color: #64748b; padding: 6px 0; width: 40%;">${label}</td>
                      <td style="color: #1a2540; font-weight: 600; padding: 6px 0;">${value || "—"}</td>
                    </tr>
                  `).join("")}
                </table>
              </div>

              <div style="text-align: center; margin: 28px 0;">
                <p style="color: #64748b; font-size: 14px; font-family: system-ui;">Questions? Contact us:</p>
                <a href="https://wa.me/918700896528" style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; border-radius: 10px; font-weight: 700; text-decoration: none; font-family: system-ui; margin-top: 8px;">
                  💬 WhatsApp Support
                </a>
              </div>
            </div>

            <div style="background: #f8fafc; padding: 20px; text-align: center; font-family: system-ui; font-size: 12px; color: #94a3b8;">
              © 2025 LearnDrive · support@learndrive.in · +91 87008 96528
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Email to admin
    await resend.emails.send({
      from: process.env.FROM_EMAIL || "LearnDrive <noreply@learndrive.in>",
      to: process.env.ADMIN_EMAIL!,
      subject: `🆕 New DL Assistance — ${name} — ${city} — Order #${orderId}`,
      html: `
        <div style="font-family: system-ui; padding: 24px; max-width: 600px;">
          <h2 style="color: #1a2540;">New DL Assistance Order</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Mobile:</strong> ${mobile}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>City:</strong> ${city}, ${state} — ${pincode}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>Aadhaar:</strong> ${aadhaar}</p>
          <p><strong>Vehicle Type:</strong> ${vehicleType}</p>
          <p><strong>Has LL:</strong> ${hasLL ? "Yes — " + llNumber : "No"}</p>
          <p><strong>RTO:</strong> ${rto || city + " RTO"}</p>
          <p><strong>Preferred Dates:</strong> ${Array.isArray(preferredDates) ? preferredDates.join(", ") : preferredDates}</p>
          <hr/>
          <p style="color: #64748b; font-size: 13px;">Action needed: Fill Form 4 and book RTO slot within 2 hours.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 });
  }
}