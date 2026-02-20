// app/api/trainers/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const RegisterSchema = z.object({
  // Personal
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  bio: z.string().min(20, "Bio must be at least 20 characters").max(500),

  // Location
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  city: z.enum(["Delhi NCR", "Mumbai", "Bangalore"]),
  serviceArea: z
    .array(z.string().regex(/^\d{6}$/))
    .min(1, "Add at least one service pincode")
    .max(10, "Maximum 10 service pincodes"),

  // Expertise
  vehicleTypes: z
    .array(z.enum(["CAR", "BIKE_GEARED", "BIKE_NON_GEARED"]))
    .min(1, "Select at least one vehicle type"),
  yearsExp: z.number().min(1).max(40),
  languages: z.array(z.string()).min(1, "Select at least one language"),

  // Pricing
  pricePerHour: z.number().min(200).max(5000),

  // Credentials
  licenseNo: z.string().min(10, "Enter a valid driving licence number"),
  aadharNo: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),

  agreedToTerms: z.literal(true),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = RegisterSchema.parse(body);

    // Check duplicate mobile
    const existingMobile = await prisma.trainer.findUnique({
      where: { mobile: data.phone },
    });
    if (existingMobile) {
      return NextResponse.json(
        { error: "A trainer with this mobile number already exists." },
        { status: 409 }
      );
    }

    // Check duplicate email if provided
    if (data.email) {
      const existingEmail = await prisma.trainer.findUnique({
        where: { email: data.email },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "A trainer with this email already exists." },
          { status: 409 }
        );
      }
    }

    // Ensure home pincode is in serviceArea
    const fullServiceArea = Array.from(
      new Set([data.pincode, ...data.serviceArea])
    );

    // Map form fields → your exact Prisma schema field names
    const trainer = await prisma.trainer.create({
      data: {
        name:          data.name,
        mobile:        data.phone,          // schema uses "mobile" not "phone"
        email:         data.email,
        bio:           data.bio,
        city:          data.city,
        pincode:       data.pincode,
        serviceArea:   fullServiceArea,
        vehicleTypes:  data.vehicleTypes,
        experience:    data.yearsExp,       // schema uses "experience" not "yearsExp"
        languages:     data.languages,
        basePrice:     data.pricePerHour,   // schema uses "basePrice" not "pricePerHour"
        licenseNumber: data.licenseNo,      // schema uses "licenseNumber" not "licenseNo"
        aadharNo:      data.aadharNo,
        trainerType:   "INDEPENDENT",       // default for self-registration
        status:        "PENDING",           // schema uses "status" not "isApproved"
      },
    });

    return NextResponse.json(
      {
        success: true,
        trainerId: trainer.id,
        message:
          "Registration submitted! Our team will review and approve your profile within 24–48 hours.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.flatten().fieldErrors },
        { status: 422 }
      );
    }
    console.error("Trainer registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}