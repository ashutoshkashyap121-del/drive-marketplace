export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { notifyAdminNewTrainer } from "@/lib/notifications";
import { smsAdminNewTrainer } from "@/lib/sms";

// 1. Matched the schema exactly to the frontend payload
const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  bio: z.string().optional().or(z.literal("")),
  city: z.string().min(1),
  pincode: z.string().regex(/^\d{6}$/),
  serviceArea: z.array(z.string().regex(/^\d{6}$/)).min(1).max(10),
  vehicleTypes: z.array(z.enum(["CAR", "BIKE", "BIKE_GEARED", "BIKE_NON_GEARED"])).min(1),
  experience: z.number().min(1), // Changed to min 1 to match frontend
  languages: z.array(z.string()).optional().default([]),
  basePrice: z.number().min(100).optional(), // Changed to min 100
  packagesJson: z.string().optional(),
  licenseNumber: z.string().optional().or(z.literal("")), // Made optional for driving schools
  trainerType: z.enum(["INDEPENDENT", "DRIVING_SCHOOL"]).optional(),
  adminNotes: z.string().optional(),
  documents: z.any().optional(), // Accepts the empty object sent by frontend
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
      console.log("Validation Issues:", issues); // Helpful for debugging in terminal
      return NextResponse.json({ error: "Validation failed", issues }, { status: 400 });
    }

    const data = parsed.data;

    // 2. Check for existing trainer (Mobile only, since email is optional)
    const existing = await prisma.trainer.findFirst({
      where: { mobile: data.mobile },
    });
    
    if (existing) {
      return NextResponse.json(
        { error: "Validation failed", issues: { mobile: "A trainer with this mobile already exists" } },
        { status: 409 }
      );
    }

    // 3. Create Trainer without requiring immediate Vehicle/Document records
    const trainer = await prisma.$transaction(async (tx) => {
      const newTrainer = await tx.trainer.create({
        data: {
          name: data.name,
          email: data.email || null, // Fallback to null so DB unique constraints don't trip on empty strings
          mobile: data.mobile,
          bio: data.bio || "",
          city: data.city,
          pincode: data.pincode,
          serviceArea: data.serviceArea,
          vehicleTypes: data.vehicleTypes as any,
          experience: data.experience,
          languages: data.languages,
          basePrice: data.basePrice || 0,
          licenseNumber: data.licenseNumber || null,
          trainerType: data.trainerType || "INDEPENDENT",
          status: "PENDING",
          rating: 0,
          // Note: If you have packagesJson or adminNotes columns in your Prisma schema, 
          // you can uncomment these lines below to save them directly:
          // packagesJson: data.packagesJson,
          // adminNotes: data.adminNotes,
        },
      });

      // We skip tx.vehicle.create() and tx.trainerDocument.createMany() 
      // because the frontend multi-step form doesn't provide this data yet.
      
      return newTrainer;
    });

    // ── Notify admin via SMS + email ───
    try {
      await smsAdminNewTrainer({
        name: trainer.name,
        mobile: trainer.mobile,
        city: trainer.city,
      });
    } catch (err) { console.error("[SMS_ADMIN_TRAINER_ERROR]", err); }

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