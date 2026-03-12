import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

// ─── POST /api/remove-listing — school requests removal ───────────────────────
export async function POST(req: NextRequest) {
  const { name, mobile, city, reason } = await req.json();

  if (!name || !mobile) {
    return NextResponse.json({ error: "Name and mobile required" }, { status: 400 });
  }

  // Find the trainer listing
  const trainer = await prisma.trainer.findFirst({
    where: {
      mobile,
      adminNotes: { contains: "scraped_gmb" },
    },
  });

  if (trainer) {
    // Suspend the listing immediately
    await prisma.trainer.update({
      where: { id: trainer.id },
      data: {
        status: "SUSPENDED",
        adminNotes: JSON.stringify({
          ...JSON.parse(trainer.adminNotes ?? "{}"),
          removedAt:  new Date().toISOString(),
          removeReason: reason ?? "School requested removal",
        }),
      },
    });
  }

  // Log the removal request regardless (even if we didn't find by mobile)
  await prisma.adminAuditLog.create({
    data: {
      action:     "LISTING_REMOVAL_REQUEST",
      entityType: "Trainer",
      entityId:   trainer ? String(trainer.id) : null,
      metadata: {
        name,
        mobile,
        city: city ?? "",
        reason: reason ?? "Not provided",
        foundInDB: !!trainer,
      },
    },
  });

  // Email admin
  await resend.emails.send({
    from:    process.env.FROM_EMAIL!,
    to:      process.env.ADMIN_EMAIL!,
    subject: `📋 Listing removal request — ${name}`,
    html: `
      <div style="font-family:sans-serif;padding:24px;max-width:600px;">
        <h2 style="color:#1a1a2e;">Listing Removal Request</h2>
        <div style="background:#fff8ed;border:1px solid #f5d49a;border-radius:12px;padding:20px;margin:16px 0;">
          <p style="margin:4px 0;"><strong>School Name:</strong> ${name}</p>
          <p style="margin:4px 0;"><strong>Mobile:</strong> ${mobile}</p>
          <p style="margin:4px 0;"><strong>City:</strong> ${city ?? "Not provided"}</p>
          <p style="margin:4px 0;"><strong>Reason:</strong> ${reason ?? "Not provided"}</p>
          <p style="margin:4px 0;"><strong>Found in DB:</strong> ${trainer ? `Yes — ID ${trainer.id} — SUSPENDED` : "No"}</p>
        </div>
        <p style="color:#555;font-size:13px;">
          ${trainer ? "✅ Listing has been automatically suspended." : "⚠️ No listing found with this mobile — verify manually."}
        </p>
        <a href="https://learndrive.in/admin/scraped-listings" style="display:inline-block;margin-top:16px;background:#1a1a2e;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">
          Open Admin →
        </a>
      </div>
    `,
  });

  // Confirm to school via email (if they used the form with email)
  return NextResponse.json({
    ok: true,
    message: "Your removal request has been received. Your listing will be removed within 24 hours.",
    removed: !!trainer,
  });
}