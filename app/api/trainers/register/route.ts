// app/api/trainers/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// ─── Validation Schema ────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();

const DocumentSchema = z.object({
  licensePhoto: z.string().min(1, "Licence photo is required"),
  licensePhotoName: z.string().min(1),
  insuranceDoc: z.string().min(1, "Insurance document is required"),
  insuranceDocName: z.string().min(1),
  rcDoc: z.string().min(1, "RC document is required"),
  rcDocName: z.string().min(1),
});

const RegisterSchema = z.object({
  // Personal
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Valid 10-digit Indian mobile required"),
  bio: z.string().min(20, "Bio must be at least 20 characters").max(500),

  // Location
  city: z.string().min(1, "City is required"),
  pincode: z.string().regex(/^\d{6}$/, "Valid 6-digit pincode required"),
  serviceArea: z
    .array(z.string().regex(/^\d{6}$/))
    .min(1, "At least one service pincode required")
    .max(10),

  // Expertise
  vehicleTypes: z
    .array(z.enum(["CAR", "BIKE", "BIKE_GEARED", "BIKE_NON_GEARED"]))
    .min(1, "Select at least one vehicle type"),
  experience: z.number().min(5, "Minimum 5 years experience required"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  basePrice: z.number().min(200).max(5000),

  // Vehicle details
  hasDualControl: z.boolean(),
  vehicleNumber: z.string().min(6, "Enter valid vehicle number"),
  vehicleYear: z
    .number()
    .min(CURRENT_YEAR - 8, `Vehicle must be ${CURRENT_YEAR - 8} or newer`)
    .max(CURRENT_YEAR, "Vehicle year cannot be in the future"),
  rcNumber: z.string().min(6, "Enter valid RC number"),
  insuranceValidUntil: z.string().min(1, "Insurance validity date required"),

  // Credentials
  licenseNumber: z.string().min(10, "Enter valid licence number"),
  aadharNo: z
    .string()
    .regex(/^\d{12}$/, "Aadhaar must be 12 digits"),

  // Documents
  documents: DocumentSchema,
});

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── Validate input ───────────────────────────────────────────────────────
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      const issues: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        const key = e.path[e.path.length - 1] as string;
        if (!issues[key]) issues[key] = e.message;
      });
      return NextResponse.json({ error: "Validation failed", issues }, { status: 400 });
    }

    const data = parsed.data;

    // ── Car trainers MUST have dual control ──────────────────────────────────
    if (data.vehicleTypes.includes("CAR") && !data.hasDualControl) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: {
            hasDualControl:
              "Car trainers must confirm dual control vehicle (Motor Vehicles Act requirement)",
          },
        },
        { status: 400 }
      );
    }

    // ── Insurance must be in the future ─────────────────────────────────────
    const insuranceDate = new Date(data.insuranceValidUntil);
    if (insuranceDate <= new Date()) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: { insuranceValidUntil: "Insurance must be currently valid" },
        },
        { status: 400 }
      );
    }

    // ── Check for duplicate mobile or email ──────────────────────────────────
    const existing = await prisma.trainer.findFirst({
      where: {
        OR: [
          { mobile: data.mobile },
          { email: data.email },
        ],
      },
    });

    if (existing) {
      const field = existing.mobile === data.mobile ? "mobile" : "email";
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: {
            [field]: `A trainer with this ${field === "mobile" ? "mobile number" : "email"} already exists`,
          },
        },
        { status: 409 }
      );
    }

    // ── Create trainer + vehicle + documents in a transaction ────────────────
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
          aadharNo: data.aadharNo, // ⚠️ hash this in production
          trainerType: "INDEPENDENT",
          status: "PENDING",
          rating: 0,
        },
      });

      // 2. Create vehicle record
      await tx.vehicle.create({
        data: {
          trainerId: newTrainer.id,
          type: data.vehicleTypes[0] as any, // primary vehicle type
          vehicleNumber: data.vehicleNumber,
          dualControl: data.hasDualControl,
          insured: true,
          rcNumber: data.rcNumber,
          vehicleYear: data.vehicleYear,
          insuranceValidUntil: insuranceDate,
        },
      });

      // 3. Store documents for admin review
      const docs = [
        {
          trainerId: newTrainer.id,
          docType: "LICENSE",
          fileName: data.documents.licensePhotoName,
          base64Data: data.documents.licensePhoto,
        },
        {
          trainerId: newTrainer.id,
          docType: "INSURANCE",
          fileName: data.documents.insuranceDocName,
          base64Data: data.documents.insuranceDoc,
        },
        {
          trainerId: newTrainer.id,
          docType: "RC",
          fileName: data.documents.rcDocName,
          base64Data: data.documents.rcDoc,
        },
      ];

      await tx.trainerDocument.createMany({ data: docs });

      return newTrainer;
    });

    // ── Success ──────────────────────────────────────────────────────────────
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

    // Prisma unique constraint error
    if (error?.code === "P2002") {
      const field = error?.meta?.target?.[0];
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: {
            [field]: `This ${field} is already registered`,
          },
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}