// app/api/reviews/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/reviews?bookingId=123 — check if already reviewed
export async function GET(req: NextRequest) {
  const bookingId = parseInt(req.nextUrl.searchParams.get("bookingId") || "0");
  if (!bookingId) return NextResponse.json({ exists: false });

  const review = await prisma.review.findUnique({ where: { bookingId } });
  return NextResponse.json({ exists: !!review });
}

// POST /api/reviews — submit a review
export async function POST(req: NextRequest) {
  try {
    const { bookingId, rating, comment } = await req.json();

    if (!bookingId || !rating) {
      return NextResponse.json({ error: "bookingId and rating required" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
    }

    // Check booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: { trainer: { select: { id: true, name: true } } },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check not already reviewed
    const existing = await prisma.review.findUnique({ where: { bookingId: parseInt(bookingId) } });
    if (existing) {
      return NextResponse.json({ error: "Already reviewed" }, { status: 409 });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        bookingId: parseInt(bookingId),
        trainerId: booking.trainerId,
        rating,
        comment: comment || null,
        customerName: booking.customerName,
      },
    });

    // Update trainer's average rating
    const allReviews = await prisma.review.findMany({
      where: { trainerId: booking.trainerId },
      select: { rating: true },
    });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.trainer.update({
      where: { id: booking.trainerId },
      data: { rating: Math.round(avgRating * 10) / 10 },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Review submit error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}