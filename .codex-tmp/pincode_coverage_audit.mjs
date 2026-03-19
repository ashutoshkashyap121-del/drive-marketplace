import fs from "fs";
import path from "path";
import { PrismaClient, TrainerStatus } from "@prisma/client";

const prisma = new PrismaClient();

function parseCityPincodes(filePath) {
  const src = fs.readFileSync(filePath, "utf8");
  const m = src.match(/const CITY_PINCODES:[^=]*=\s*(\{[\s\S]*?\});/);
  if (!m) throw new Error("CITY_PINCODES object not found");
  const objLiteral = m[1];
  return Function(`"use strict"; return (${objLiteral});`)();
}

function normalizeCity(city) {
  const c = (city || "").trim().toLowerCase();
  if (c === "gurugram") return "gurgaon";
  return c;
}

function nearestPin(target, coveredPins) {
  if (!coveredPins.length) return "";
  const targetNum = Number(target);
  let best = coveredPins[0];
  let bestDiff = Math.abs(Number(best) - targetNum);
  for (const p of coveredPins) {
    const diff = Math.abs(Number(p) - targetNum);
    if (diff < bestDiff) {
      best = p;
      bestDiff = diff;
    }
  }
  return best;
}

function csvEscape(v) {
  const s = String(v ?? "");
  if (s.includes(",") || s.includes("\n") || s.includes("\"")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

async function main() {
  const root = process.cwd();
  const cityMapPath = path.join(root, "scripts", "fix-scraped-meta.ts");
  const cityPincodesRaw = parseCityPincodes(cityMapPath);

  const cityPincodes = {};
  for (const [city, pins] of Object.entries(cityPincodesRaw)) {
    cityPincodes[normalizeCity(city)] = Array.from(new Set((pins || []).filter((p) => /^\d{6}$/.test(p))));
  }

  const trainers = await prisma.trainer.findMany({
    where: { status: TrainerStatus.APPROVED },
    select: { city: true, pincode: true, serviceArea: true },
  });

  const coveredByCity = new Map();
  for (const t of trainers) {
    const cityKey = normalizeCity(t.city);
    if (!coveredByCity.has(cityKey)) coveredByCity.set(cityKey, new Set());
    const set = coveredByCity.get(cityKey);
    if (typeof t.pincode === "string" && /^\d{6}$/.test(t.pincode)) set.add(t.pincode);
    for (const p of t.serviceArea || []) {
      if (/^\d{6}$/.test(p)) set.add(p);
    }
  }

  const outDir = path.join(root, "reports");
  fs.mkdirSync(outDir, { recursive: true });

  const detailRows = [];
  const summaryRows = [];

  for (const [city, livePins] of Object.entries(cityPincodes)) {
    const coveredSet = coveredByCity.get(city) || new Set();
    const coveredPins = Array.from(coveredSet).sort();

    let uncoveredCount = 0;
    for (const pin of livePins) {
      const covered = coveredSet.has(pin);
      if (!covered) uncoveredCount += 1;
      const nearest = covered ? pin : nearestPin(pin, coveredPins);
      detailRows.push({
        city,
        live_pincode: pin,
        has_trainer: covered ? "YES" : "NO",
        nearest_live_with_trainer: nearest,
      });
    }

    summaryRows.push({
      city,
      live_pincodes: livePins.length,
      covered_pincodes: livePins.length - uncoveredCount,
      uncovered_pincodes: uncoveredCount,
      approved_trainers_city_pin_pool: coveredPins.length,
    });
  }

  const detailHeader = ["city", "live_pincode", "has_trainer", "nearest_live_with_trainer"];
  const detailCsv = [
    detailHeader.join(","),
    ...detailRows.map((r) => detailHeader.map((h) => csvEscape(r[h])).join(",")),
  ].join("\n");

  const summaryHeader = ["city", "live_pincodes", "covered_pincodes", "uncovered_pincodes", "approved_trainers_city_pin_pool"];
  const summaryCsv = [
    summaryHeader.join(","),
    ...summaryRows.map((r) => summaryHeader.map((h) => csvEscape(r[h])).join(",")),
  ].join("\n");

  const detailPath = path.join(outDir, "live-pincode-nearest-map.csv");
  const summaryPath = path.join(outDir, "live-pincode-coverage-summary.csv");
  fs.writeFileSync(detailPath, detailCsv, "utf8");
  fs.writeFileSync(summaryPath, summaryCsv, "utf8");

  const totalLive = detailRows.length;
  const totalUncovered = detailRows.filter((r) => r.has_trainer === "NO").length;

  console.log(JSON.stringify({
    detailPath,
    summaryPath,
    cities: summaryRows.length,
    totalLivePincodes: totalLive,
    uncoveredLivePincodes: totalUncovered,
  }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
