// Google Places (v1) helper — fetch a Google/GMB rating for a trainer/school by name + city.
// Used on trainer approval to seed the profile with a real Google rating.

const PLACES_URL = "https://places.googleapis.com/v1/places:searchText";

type PlaceRating = { rating: number; reviewCount: number; matchedName: string };

// Generic words to ignore when matching a school name to a Google Place name, so that
// the *distinctive* part of the name (e.g. "Metro", "New India") drives the match.
// Only the most generic course words are stripped, so the distinctive part of a
// name (e.g. "Metro", "New India Motor") still drives the match. Words like
// "motor/india/new" are intentionally NOT stopwords — they're often distinctive.
const STOPWORDS = new Set([
  "driving", "school", "schools", "training", "academy", "institute",
  "centre", "center", "class", "classes", "the", "and",
  "pvt", "ltd", "private", "limited",
]);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/**
 * Look up a Google rating for a school by name + city. Returns null unless a
 * confident match is found (the Place name must share a distinctive word with the
 * trainer name) — this avoids stamping a wrong rating onto a profile.
 */
export async function fetchTrainerGoogleRating(
  name: string,
  city: string,
): Promise<PlaceRating | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || !name) return null;

  try {
    const res = await fetch(PLACES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.displayName,places.rating,places.userRatingCount,places.businessStatus",
      },
      body: JSON.stringify({
        textQuery: `${name} ${city}`,
        languageCode: "en",
        maxResultCount: 3,
        regionCode: "IN",
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const places: Array<{
      displayName?: { text?: string };
      rating?: number;
      userRatingCount?: number;
      businessStatus?: string;
    }> = data.places || [];

    const wanted = tokens(name);

    for (const place of places) {
      if (place.businessStatus === "CLOSED_PERMANENTLY") continue;
      if (typeof place.rating !== "number" || place.rating <= 0) continue;

      const placeName = place.displayName?.text ?? "";
      const got = tokens(placeName);
      const overlap = wanted.some((w) => got.includes(w));
      if (!overlap) continue;

      return {
        rating: place.rating,
        reviewCount: place.userRatingCount ?? 0,
        matchedName: placeName,
      };
    }

    return null;
  } catch {
    return null;
  }
}
