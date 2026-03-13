// app/api/hire-driver/onboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, mobile, email, city, pincode,
      licenseNo, licenseType, yearsExp,
      tripTypes, languages, availability,
      hasOwnCar, carModel, about,
    } = body;

    if (!name || !mobile || !city || !pincode || !licenseNo || !licenseType || !yearsExp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const driver = await prisma.driverApplication.create({
      data: {
        name,
        mobile,
        email: email || null,
        city,
        pincode,
        licenseNo,
        licenseType,
        yearsExp: Number(yearsExp),
        tripTypes: JSON.stringify(tripTypes || []),
        languages: JSON.stringify(languages || []),
        availability: JSON.stringify(availability || []),
        hasOwnCar: Boolean(hasOwnCar),
        carModel: carModel || null,
        about: about || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, id: driver.id });
  } catch (err) {
    console.error("Driver onboard error:", err);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}