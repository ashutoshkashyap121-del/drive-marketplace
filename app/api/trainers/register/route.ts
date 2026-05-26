export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { notifyAdminNewTrainer } from "@/lib/notifications";
import { smsAdminNewTrainer, smsTrainerWelcome } from "@/lib/sms";

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  bio: z.string().optional().or(z.literal("")),
  city: z.string().min(1),
  pincode: z.string().regex(/^\d{6}$/),
  serviceArea: z.array(z.string().regex(/^\d{6}$/)).min(1).max(10),
  vehicleTypes: z.array(z.enum(["CAR", "BIKE", "BIKE_GEARED", "BIKE_NON_GEARED"])).min(1),
  experience: z.number().min(1),
  languages: z.array(z.string()).optional().default([]),
  basePrice: z.number().min(100).optional(),
  packagesJson: z.string().optional(),
  licenseNumber: z.string().optional().or(z.literal("")),
  trainerType: z.enum(["INDEPENDENT", "DRIVING_SCHOOL"]).optional(),
  adminNotes: z.string().optional(),
  documents: z.any().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      const issues: Record<string, string> = {};
      parsed.error.issues.forEach((e) => {
        const key = e.path[e.path.length - 1] as string;
        if (!issues[key]) issues[key] = e.message;
      });
      console.log("Validation Issues:", issues);
      return NextResponse.json({ error: "Validation failed", issues }, { status: 400 });
    }

    const data = parsed.data;

    const existing = await prisma.trainer.findFirst({
      where: { mobile: data.mobile },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Validation failed", issues: { mobile: "A trainer with this mobile already exists" } },
        { status: 409 }
      );
    }

    const trainer = await prisma.$transaction(async (tx) => {
      const newTrainer = await tx.trainer.create({
        data: {
          name: data.name,
          email: data.email || null,
          mobile: data.mobile,
          bio: data.bio || "",
          city: data.city,
          pincode: data.pincode,
          serviceArea: data.serviceArea,
          vehicleTypes: data.vehicleTypes as any,
          experience: data.experience,
          languages: data.languages,
          basePrice: data.basePrice || 0,
          licenseNumber: data.licenseNumber || "",
          trainerType: data.trainerType || "INDEPENDENT",
          status: "PENDING",
          rating: 0,
          packagesJson: data.packagesJson || null,  // ✅ FIXED: was commented out
          adminNotes: data.adminNotes || null,        // ✅ FIXED: was commented out
        },
      });

      return newTrainer;
    });

    // ── Notify admin + welcome trainer ───
    try {
      await smsAdminNewTrainer({
        name: trainer.name,
        mobile: trainer.mobile,
        city: trainer.city,
      });
    } catch (err) { console.error("[SMS_ADMIN_TRAINER_ERROR]", err); }

    try {
      await smsTrainerWelcome({
        name: trainer.name,
        mobile: trainer.mobile,
        city: trainer.city,
      });
    } catch (err) { console.error("[SMS_TRAINER_WELCOME_ERROR]", err); }

    try {
      await notifyAdminNewTrainer({
        id: trainer.id,
        name: trainer.name,
        mobile: trainer.mobile,
        email: trainer.email || "N/A",
        city: trainer.city,
        vehicleTypes: data.vehicleTypes,
        experience: data.experience,
        licenseNumber: data.licenseNumber || "N/A",
      });
    } catch (err) { console.error("[EMAIL_ADMIN_TRAINER_ERROR]", err); }

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully. Our team will review within 24-48 hours.",
        trainerId: trainer.id,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("[TRAINER_REGISTER_ERROR]", error);
    if (error?.code === "P2002") {
      const field = error?.meta?.target?.[0] || "field";
      return NextResponse.json(
        { error: "Validation failed", issues: { [field]: `This ${field} is already registered` } },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}