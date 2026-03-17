import { NextRequest, NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin";

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeAdminRequest(req, { requireCsrf: true });
    if (!auth.ok) {
      return auth.response;
    }

    const { city } = await req.json();
    if (!city) {
      return NextResponse.json({ error: "City is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Google Places API key not configured" }, { status: 500 });
    }

    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.rating,places.userRatingCount,places.businessStatus,places.id",
      },
      body: JSON.stringify({
        textQuery: `driving school in ${city} India`,
        languageCode: "en",
        maxResultCount: 20,
        regionCode: "IN",
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Places API error:", err);
      return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 });
    }

    const data = await response.json();
    const places = data.places || [];
    const results = places
      .filter((place: { businessStatus?: string }) => place.businessStatus !== "CLOSED_PERMANENTLY")
      .map((place: {
        id: string;
        displayName?: { text?: string };
        formattedAddress?: string;
        nationalPhoneNumber?: string;
        rating?: number;
        userRatingCount?: number;
      }) => ({
        id: place.id,
        name: place.displayName?.text || "Unknown",
        address: place.formattedAddress || "",
        phone: place.nationalPhoneNumber || "",
        rating: place.rating || null,
        reviewCount: place.userRatingCount || 0,
        status: "not_contacted",
      }));

    return NextResponse.json({ results, city });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Search failed. Please try again." }, { status: 500 });
  }
}
