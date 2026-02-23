// app/api/trainers/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encryptAadhar } from "@/lib/aadhar";
import { z } from "zod";
import { notifyAdminNewTrainer } from "@/lib/notifications";

const CURRENT_YEAR = new Date().getFullYear();

// ─── Validation Schema ────────────────────────────────────────────────────────
// Documents are now Cloudinary URLs — uploaded directly from browser

const DocumentSchema = z.object({
  licensePhotoUrl: z.string().url("Invalid licence photo URL"),
  licensePhotoName: z.string().min(1),
  insuranceDocUrl: z.string().url("Invalid insurance document URL"),
  insuranceDocName: z.string().min(1),
  rcDocUrl: z.string().url("Invalid RC document URL"),
  rcDocName: z.string().min(1),
});

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  bio: z.string().min(20).max(500),

  city: z.string().min(1),
  pincode: z.string().regex(/^\d{6}$/),
  serviceArea: z.array(z.string().regex(/^\d{6}$/)).min(1).max(10),

  vehicleTypes: z.array(
    z.enum(["CAR", "BIKE", "BIKE_GEARED", "BIKE_NON_GEARED"])
  ).min(1),

  experience: z.number().min(5),
  languages: z.array(z.string()).min(1),
  basePrice: z.number().min(200).max(5000),

  hasDualControl: z.boolean(),
  vehicleNumber: z.string().min(6),
  vehicleYear: z.number().min(CURRENT_YEAR - 8).max(CURRENT_YEAR),
  rcNumber: z.string().min(6),
  insuranceValidUntil: z.string(),

  licenseNumber: z.string().min(10),
  aadharNo: z.string().regex(/^\d{12}$/).optional(),

  documents: DocumentSchema,
});

// ─── POST Handler ─────────────────────────────────────────────────────────────

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
      return NextResponse.json({ error: "Validation failed", issues }, { status: 400 });
    }

    const data = parsed.data;

    // Dual control check
    if (data.vehicleTypes.includes("CAR") && !data.hasDualControl) {
      return NextResponse.json(
        { error: "Validation failed", issues: { hasDualControl: "Car trainers must confirm dual control vehicle" } },
        { status: 400 }
      );
    }

    // Insurance validity check
    const insuranceDate = new Date(data.insuranceValidUntil);
    if (insuranceDate <= new Date()) {
      return NextResponse.json(
        { error: "Validation failed", issues: { insuranceValidUntil: "Insurance must be currently valid" } },
        { status: 400 }
      );
    }

    // Duplicate check
    const existing = await prisma.trainer.findFirst({
      where: { OR: [{ mobile: data.mobile }, { email: data.email }] },
    });
    if (existing) {
      const field = existing.mobile === data.mobile ? "mobile" : "email";
      return NextResponse.json(
        { error: "Validation failed", issues: { [field]: `A trainer with this ${field} already exists` } },
        { status: 409 }
      );
    }

    // Encrypt Aadhaar if provided
    let encryptedAadhar: { encrypted: string; iv: string; authTag: string } | undefined;
    if (data.aadharNo) {
      encryptedAadhar = encryptAadhar(data.aadharNo);
    }

    // ── Transaction ───────────────────────────────────────────────────────────
    const trainer = await prisma.$transaction(async (tx) => {

      // 1. Create trainer
      const newTrainer = await tx.trainer.create({
        data: {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          bio: data.bio,
          city: data.city,
          pincode: data.pincode,
          serviceArea: data.serviceArea,
          vehicleTypes: data.vehicleTypes as any,
          experience: data.experience,
          languages: data.languages,
          basePrice: data.basePrice,
          licenseNumber: data.licenseNumber,
          aadharEncrypted: encryptedAadhar?.encrypted ?? null,
          aadharIV: encryptedAadhar?.iv ?? null,
          aadharAuthTag: encryptedAadhar?.authTag ?? null,
          trainerType: "INDEPENDENT",
          status: "PENDING",
          rating: 0,
        },
      });

      // 2. Create vehicle
      await tx.vehicle.create({
        data: {
          trainerId: newTrainer.id,
          type: data.vehicleTypes[0] as any,
          vehicleNumber: data.vehicleNumber,
          dualControl: data.hasDualControl,
          insured: true,
          rcNumber: data.rcNumber,
          vehicleYear: data.vehicleYear,
          insuranceValidUntil: insuranceDate,
        },
      });

      // 3. Save Cloudinary URLs — no server upload needed, browser already did it
      await tx.trainerDocument.createMany({
        data: [
          {
            trainerId: newTrainer.id,
            docType: "LICENSE",
            fileName: data.documents.licensePhotoName,
            fileUrl: data.documents.licensePhotoUrl,
          },
          {
            trainerId: newTrainer.id,
            docType: "INSURANCE",
            fileName: data.documents.insuranceDocName,
            fileUrl: data.documents.insuranceDocUrl,
          },
          {
            trainerId: newTrainer.id,
            docType: "RC",
            fileName: data.documents.rcDocName,
            fileUrl: data.documents.rcDocUrl,
          },
        ],
      });

      return newTrainer;
    });

    // ── Notify admin (non-blocking) ───────────────────────────────────────────
    notifyAdminNewTrainer({
      id: trainer.id,
      name: trainer.name,
      mobile: trainer.mobile,
      email: trainer.email,
      city: trainer.city,
      vehicleTypes: data.vehicleTypes,
      experience: data.experience,
      licenseNumber: data.licenseNumber,
    }).catch((err) => console.error("[NOTIFY_ADMIN_ERROR]", err));

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully. Our team will review within 24-48 hours.",
        trainerId: trainer.id,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("[TRAINER_REGISTER]", error);
    if (error?.code === "P2002") {
      const field = error?.meta?.target?.[0];
      return NextResponse.json(
        { error: "Validation failed", issues: { [field]: `This ${field} is already registered` } },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}