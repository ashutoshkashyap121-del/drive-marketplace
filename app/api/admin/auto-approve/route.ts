// app/api/admin/auto-approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TrainerStatus } from "@prisma/client";

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY!;
const FAST2SMS_KEY = process.env.FAST2SMS_API_KEY!;
const WA_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "1025099124020438";

async function reviewTrainerWithAI(trainer: any): Promise<{
  decision: "APPROVE" | "REJECT" | "FLAG";
  reason: string;
  score: number;
}> {
  const prompt = `You are a trainer quality reviewer for LearnDrive, a driving instructor marketplace in India.

Review this trainer application and decide: APPROVE, REJECT, or FLAG for manual review.

TRAINER APPLICATION:
- Name: ${trainer.name}
- City: ${trainer.city}
- Experience: ${trainer.experience} years
- Vehicle Types: ${JSON.stringify(trainer.vehicleTypes)}
- Languages: ${JSON.stringify(trainer.languages)}
- Base Price: ₹${trainer.basePrice}/hr
- Licence Number: ${trainer.licenseNumber || "Not provided"}
- Service Pincodes: ${JSON.stringify(trainer.serviceArea || [])}
- Applied at: ${trainer.createdAt}

APPROVAL CRITERIA:
- APPROVE if: experience >= 3 years, licence number provided (10+ chars), at least 1 vehicle type, at least 1 pincode, price between ₹200-₹3000
- REJECT if: experience < 1 year, no licence number, price > ₹5000 or < ₹100, clearly fake data (e.g. name is "test", "asd")
- FLAG if: borderline (2 years exp, missing pincode, unusual price, incomplete info)

Respond ONLY in this JSON format (no markdown):
{"decision":"APPROVE","reason":"5 years experience, valid DL, covers 3 pincodes in Delhi NCR","score":85}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  const text = data.content?.[0]?.text || "{}";
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return { decision: "FLAG", reason: "AI parse error — needs manual review", score: 0 };
  }
}

async function sendApprovalWhatsApp(phone: string, name: string, approved: boolean) {
  const templateName = approved ? "trainer_approved" : "trainer_rejected";
  const mobile = phone.replace(/^\+91/, "").replace(/\D/g, "");
  try {
    await fetch("https://www.fast2sms.com/dev/whatsapp", {
      method: "POST",
      headers: {
        authorization: FAST2SMS_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number_id: WA_PHONE_ID,
        to: `91${mobile}`,
        type: "template",
        template: {
          name: templateName,
          language: { code: "en" },
          components: [
            { type: "body", parameters: [{ type: "text", text: name }] },
          ],
        },
      }),
    });
  } catch {}
}

export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret");
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { trainerId, runAll } = await req.json();

  // Single trainer review
  if (trainerId) {
    const trainer = await prisma.trainer.findUnique({ where: { id: trainerId } });
    if (!trainer) return NextResponse.json({ error: "Trainer not found" }, { status: 404 });

    const review = await reviewTrainerWithAI(trainer);

    let newStatus: TrainerStatus = TrainerStatus.PENDING;
    if (review.decision === "APPROVE") newStatus = TrainerStatus.APPROVED;
    if (review.decision === "REJECT") newStatus = TrainerStatus.REJECTED;

    await prisma.trainer.update({
      where: { id: trainerId },
      data: {
        status: newStatus,
        ...(review.decision !== "FLAG" && {
          adminNotes: `AI Review (score: ${review.score}): ${review.reason}`,
        }),
      },
    });

    // Send WhatsApp notification (only for approve/reject, not flag)
    if (review.decision !== "FLAG" && trainer.mobile) {
      await sendApprovalWhatsApp(trainer.mobile, trainer.name, review.decision === "APPROVE");
    }

    return NextResponse.json({ trainerId, ...review, status: newStatus });
  }

  // Run AI review on ALL pending trainers
  if (runAll) {
    const pending = await prisma.trainer.findMany({
      where: { status: TrainerStatus.PENDING },
    });

    const results = { approved: 0, rejected: 0, flagged: 0, details: [] as any[] };

    for (const trainer of pending) {
      const review = await reviewTrainerWithAI(trainer);

      let newStatus: TrainerStatus = TrainerStatus.PENDING;
      if (review.decision === "APPROVE") { newStatus = TrainerStatus.APPROVED; results.approved++; }
      if (review.decision === "REJECT") { newStatus = TrainerStatus.REJECTED; results.rejected++; }
      if (review.decision === "FLAG") results.flagged++;

      await prisma.trainer.update({
        where: { id: trainer.id },
        data: {
          status: newStatus,
          adminNotes: `AI Review (score: ${review.score}): ${review.reason}`,
        },
      });

      if (review.decision !== "FLAG" && trainer.mobile) {
        await sendApprovalWhatsApp(trainer.mobile, trainer.name, review.decision === "APPROVE");
      }

      results.details.push({
        id: trainer.id,
        name: trainer.name,
        ...review,
      });

      await new Promise((r) => setTimeout(r, 200));
    }

    return NextResponse.json({ total: pending.length, ...results });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}