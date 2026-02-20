export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const trainers = await prisma.trainer.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(trainers);
}
