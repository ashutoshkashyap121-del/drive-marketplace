import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
 
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, mobile, email, city, tripType,
      startDate, endDate, days, pickupAddress,
      notes, estimatedPrice,
    } = body;
 
    if (!name || !mobile || !city || !tripType || !startDate || !pickupAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
 
    // Save to DB — uses a DriverRequest model (add to schema below)
    const request = await prisma.driverRequest.create({
      data: {
        customerName: name,
        mobile,
        email: email || null,
        city,
        tripType,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        days: Number(days) || 1,
        pickupAddress,
        notes: notes || null,
        estimatedPrice: Number(estimatedPrice) || 0,
        status: "PENDING",
      },
    });
 
    // TODO: Send WhatsApp/SMS notification to admin
    // await sendWhatsApp(`New driver request from ${name} (${mobile}) in ${city} for ${tripType} on ${startDate}`);
 
    return NextResponse.json({ success: true, id: request.id });
  } catch (err) {
    console.error("Driver request error:", err);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}