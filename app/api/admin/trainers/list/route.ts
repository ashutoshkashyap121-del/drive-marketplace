import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin";

export async function GET(req: Request) {
  try {
    const auth = await authorizeAdminRequest(req);
    if (!auth.ok) {
      return auth.response;
    }

    const trainers = await prisma.trainer.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        mobile: true,
        email: true,
        status: true,
        experience: true,
        basePrice: true,
        packagesJson: true,
        languages: true,
        vehicleTypes: true,
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(trainers);
  } catch (error) {
    console.error("Admin trainer list error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
