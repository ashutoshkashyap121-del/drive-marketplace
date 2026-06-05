export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { buildTrainerWhereInput, searchTrainers } from "@/lib/trainer-search";

type Pkg = { name?: string; price?: number };

function startingPrice(t: { packagesJson: string | null; basePrice: number | null }): number | null {
  if (t.packagesJson) {
    try {
      const pkgs = JSON.parse(t.packagesJson) as Pkg[];
      if (Array.isArray(pkgs) && typeof pkgs[0]?.price === "number") return pkgs[0].price;
    } catch {
      /* ignore */
    }
  }
  return t.basePrice ?? null;
}

type AiInput = { city: string; vehicleType: string; language: string; budget: number; goal: string };
type AiTrainer = { id: number; name: string; rating: number | null; exp: number; langs: string[]; price: number | null; type: string };

// Optional AI personalization — one friendly line per match. Never blocks the
// response: missing key, error, or timeout all fall back to algorithmic reasons.
async function aiMatchReasons(prefs: AiInput, trainers: AiTrainer[]): Promise<Record<number, string>> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || trainers.length === 0) return {};

  const prompt = `A student in ${prefs.city} wants ${prefs.vehicleType || "driving"} lessons${
    prefs.language ? ` in ${prefs.language}` : ""
  }${prefs.budget ? `, budget ~Rs ${prefs.budget}` : ""}${prefs.goal ? `. Goal: ${prefs.goal}` : ""}.

Here are candidate trainers:
${trainers
  .map(
    (t) =>
      `{"id":${t.id},"name":${JSON.stringify(t.name)},"rating":${t.rating ?? 0},"experience":${t.exp},"languages":${JSON.stringify(
        t.langs,
      )},"price":${t.price ?? "null"},"type":"${t.type}"}`,
  )
  .join("\n")}

For each trainer, write ONE short, warm sentence (max 18 words) on why they're a good fit for THIS student. Return ONLY a JSON object mapping id to the sentence, no markdown. Example: {"12":"Great match — 8 years teaching car driving in Hindi, well within budget."}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });
    const data = await res.json();
    const text: string = data?.content?.[0]?.text ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return {};
    const parsed = JSON.parse(match[0]) as Record<string, string>;
    const out: Record<number, string> = {};
    for (const [k, v] of Object.entries(parsed)) if (typeof v === "string") out[Number(k)] = v;
    return out;
  } catch {
    return {};
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const city = String(body.city || "").trim();
    const vehicleType = String(body.vehicleType || "").trim(); // CAR | BIKE_GEARED | BIKE_NON_GEARED
    const language = String(body.language || "").trim();
    const pincode = String(body.pincode || "").trim();
    const budget = Number(body.budget) || 0;
    const goal = String(body.goal || "").trim().slice(0, 200);

    if (!city) return NextResponse.json({ error: "Please tell us your city." }, { status: 400 });

    const where = buildTrainerWhereInput({ city, vehicleType, pincode });
    const candidates = await searchTrainers({ where, take: 40 });

    if (candidates.length === 0) {
      return NextResponse.json({
        matches: [],
        message: `No trainers in ${city} match that yet — try widening your filters.`,
      });
    }

    const scored = candidates
      .map((t) => {
        const price = startingPrice(t);
        const reasons: string[] = [];
        let score = 0;

        const rating = t.rating ?? 0;
        if (rating > 0) {
          score += (rating / 5) * 40;
          reasons.push(`${rating.toFixed(1)}★ rating`);
        }
        score += (Math.min(t.experience, 15) / 15) * 20;
        if (t.experience >= 3) reasons.push(`${t.experience} yrs experience`);

        if (language && t.languages.map((l) => l.toLowerCase()).includes(language.toLowerCase())) {
          score += 15;
          reasons.push(`Speaks ${language}`);
        }
        if (budget > 0 && price != null) {
          if (price <= budget) {
            score += 15;
            reasons.push("Within your budget");
          } else if (price <= budget * 1.2) {
            score += 8;
          }
        }
        if (t.verifiedSchool) {
          score += 6;
          reasons.push("Verified school");
        }
        if (t.vehicles?.some((v) => v.dualControl)) {
          score += 4;
          reasons.push("Dual-control vehicle");
        }
        if (t.vehicles?.some((v) => v.insured)) score += 2;

        return { t, price, score: Math.min(100, Math.round(score)), reasons };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    const aiReasons = await aiMatchReasons(
      { city, vehicleType, language, budget, goal },
      scored.map((s) => ({
        id: s.t.id,
        name: s.t.name,
        rating: s.t.rating,
        exp: s.t.experience,
        langs: s.t.languages,
        price: s.price,
        type: s.t.trainerType,
      })),
    );

    const matches = scored.map((s) => ({
      id: s.t.id,
      name: s.t.name,
      city: s.t.city,
      rating: s.t.rating,
      experience: s.t.experience,
      trainerType: s.t.trainerType,
      price: s.price,
      languages: s.t.languages,
      vehicleTypes: s.t.vehicleTypes,
      verifiedSchool: s.t.verifiedSchool,
      matchScore: s.score,
      reasons: s.reasons,
      aiReason: aiReasons[s.t.id] ?? null,
    }));

    return NextResponse.json({ matches });
  } catch (err) {
    console.error("[MATCH_ERROR]", err);
    return NextResponse.json({ error: "Matching failed. Please try again." }, { status: 500 });
  }
}
