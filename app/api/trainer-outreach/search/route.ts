// app/api/trainer-outreach/search/route.ts
// Searches Google Places (New) for driving schools in a given city

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { city } = await req.json();
    if (!city) return NextResponse.json({ error: "City is required" }, { status: 400 });

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Google Places API key not configured" }, { status: 500 });

    // Use Places API (New) Text Search
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
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
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Places API error:", err);
      return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 });
    }

    const data = await response.json();
    const places = data.places || [];

    // Normalize the response
    const results = places
      .filter((p: any) => p.businessStatus !== "CLOSED_PERMANENTLY")
      .map((p: any) => ({
        id: p.id,
        name: p.displayName?.text || "Unknown",
        address: p.formattedAddress || "",
        phone: p.nationalPhoneNumber || "",
        rating: p.rating || null,
        reviewCount: p.userRatingCount || 0,
        status: "not_contacted", // default outreach status
      }));

    return NextResponse.json({ results, city });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Search failed. Please try again." }, { status: 500 });
  }
}