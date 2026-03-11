"use client";

import { useState } from "react";
import Link from "next/link";
import { Car, MapPin, CheckCircle2, Zap, Flag } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VehicleVariant {
  model: string;
  price: number;
  priceAC?: number;
}

interface Package {
  id?: string;                  // optional — may not exist in DB JSON
  name: string;
  price: number;
  priceMax?: number;
  days?: number;
  sessionLength?: string;       // matches trainer detail page
  sessionLengthMins?: number;
  distancePerDay?: string;      // matches trainer detail page
  distancePerDayKm?: number;
  includes?: string | string[]; // DB stores string, TrainerCard expects string[]
  acSurcharge?: number;
  trackFee?: number;
  trackFeePerVehicle?: number;
  vehicleVariants?: VehicleVariant[];
}

interface TrainerDisplayData {
  id: number;
  name: string;
  city: string;
  experience: number;
  basePrice?: number | null;
  languages: any;
  vehicleTypes: any;
  rating?: number | null;
  reviewCount?: number | null;
  packagesJson: any;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parsePackages(raw: any): Package[] {
  try {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse packagesJson:", e);
  }
  return [];
}

// Normalize includes — DB may store as string or string[]
function getIncludes(includes?: string | string[]): string[] {
  if (!includes) return [];
  if (Array.isArray(includes)) return includes;
  return [includes]; // wrap plain string in array
}

function formatPrice(pkg: Package): string {
  if (pkg.priceMax && pkg.priceMax !== pkg.price) {
    return `₹${pkg.price.toLocaleString("en-IN")}–₹${pkg.priceMax.toLocaleString("en-IN")}`;
  }
  return `₹${pkg.price.toLocaleString("en-IN")}`;
}

function lowestPrice(packages: Package[], basePrice?: number | null): number {
  if (packages.length > 0) return Math.min(...packages.map((p) => p.price));
  if (basePrice) return basePrice;
  return 0;
}

// ─── Package Drawer Component ─────────────────────────────────────────────────

function PackageDrawer({ pkg, trainerId }: { pkg: Package; trainerId: number }) {
  const includes = getIncludes(pkg.includes);
  const days = pkg.days;
  const sessionMins = pkg.sessionLengthMins ?? (pkg.sessionLength ? parseInt(pkg.sessionLength) : undefined);
  const distanceKm = pkg.distancePerDayKm ?? (pkg.distancePerDay ? parseInt(pkg.distancePerDay) : undefined);
  const trackFee = pkg.trackFee ?? pkg.trackFeePerVehicle;

  return (
    <div className="border border-[#e8e2d9] rounded-xl overflow-hidden bg-[#fdfcfb]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#f5f0e8]">
        <span className="font-semibold text-[#1a1a2e] text-sm">{pkg.name}</span>
        <span className="text-[#e8821a] font-bold text-base">{formatPrice(pkg)}</span>
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* Stats grid */}
        {(days !== undefined || sessionMins !== undefined || distanceKm !== undefined) && (
          <div className="grid grid-cols-3 gap-2 text-center">
            {days !== undefined && (
              <div className="bg-white border border-[#e8e2d9] rounded-lg py-2">
                <div className="text-[#1a1a2e] font-bold text-lg">{days}</div>
                <div className="text-[#888] text-xs">days</div>
              </div>
            )}
            {sessionMins !== undefined && (
              <div className="bg-white border border-[#e8e2d9] rounded-lg py-2">
                <div className="text-[#1a1a2e] font-bold text-lg">{sessionMins}</div>
                <div className="text-[#888] text-xs">min/session</div>
              </div>
            )}
            {distanceKm !== undefined && (
              <div className="bg-white border border-[#e8e2d9] rounded-lg py-2">
                <div className="text-[#1a1a2e] font-bold text-lg">{distanceKm}</div>
                <div className="text-[#888] text-xs">km/day</div>
              </div>
            )}
          </div>
        )}

        {/* Includes */}
        {includes.length > 0 && (
          <ul className="space-y-1">
            {includes.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#333]">
                <CheckCircle2 size={14} className="text-[#e8821a] mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* Surcharges */}
        <div className="space-y-1.5">
          {pkg.acSurcharge ? (
            <div className="flex items-center gap-2 text-xs text-[#2a7a4b] bg-[#edf7f1] rounded-lg px-3 py-2">
              <Zap size={12} className="shrink-0" />
              AC vehicle: +₹{pkg.acSurcharge.toLocaleString("en-IN")} surcharge
            </div>
          ) : null}
          {trackFee ? (
            <div className="flex items-center gap-2 text-xs text-[#7a5a2a] bg-[#fff8ed] rounded-lg px-3 py-2">
              <Flag size={12} className="shrink-0" />
              Track fee ₹{trackFee.toLocaleString("en-IN")}
            </div>
          ) : null}
        </div>

        {/* Book button */}
        <Link
          href={`/trainers/${String(trainerId)}/book?price=${pkg.price}&pkgName=${encodeURIComponent(pkg.name)}`}
          className="block w-full text-center bg-[#e8821a] hover:bg-[#d4741a] text-white font-semibold text-sm rounded-xl py-2.5 transition-colors"
        >
          Book this →
        </Link>
      </div>
    </div>
  );
}

// ─── Main Trainer Card ────────────────────────────────────────────────────────

export default function TrainerCard({ trainer }: { trainer: TrainerDisplayData }) {
  const [open, setOpen] = useState(false);

  const packages = parsePackages(trainer.packagesJson);
  const languages: string[] = Array.isArray(trainer.languages) ? trainer.languages : [];
  const vehicleTypes: string[] = Array.isArray(trainer.vehicleTypes) ? trainer.vehicleTypes : [];
  const startingPrice = lowestPrice(packages, trainer.basePrice);
  const hasPackages = packages.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-[#e8e2d9] shadow-sm overflow-hidden mb-4">
      {/* ── Card Header ── */}
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-11 h-11 rounded-xl bg-[#f5f0e8] flex items-center justify-center shrink-0 text-xl">
            🚗
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-[#1a1a2e] text-[15px]">{trainer.name}</h3>

            <div className="flex items-center gap-1 text-[#888] text-xs mt-0.5">
              <MapPin size={11} />
              <span>{trainer.city}</span>
              <span>·</span>
              <span>{trainer.experience} yrs exp</span>
            </div>

            {(trainer.rating ?? 0) > 0 && (
              <div className="flex items-center gap-1 text-xs text-[#f59e0b] mt-0.5">
                ★ {trainer.rating?.toFixed(1)}
                {trainer.reviewCount ? (
                  <span className="text-[#888]">({trainer.reviewCount})</span>
                ) : null}
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {vehicleTypes.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 text-xs bg-[#edf7f1] text-[#2a7a4b] border border-[#c6e8d3] rounded-full px-2 py-0.5"
                >
                  <Car size={10} /> {v}
                </span>
              ))}
              {languages.map((l) => (
                <span
                  key={l}
                  className="text-xs bg-[#f5f0e8] text-[#555] border border-[#e8e2d9] rounded-full px-2 py-0.5"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="text-right shrink-0">
          {startingPrice > 0 && (
            <>
              <div className="text-[#888] text-xs">Starting from</div>
              <div className="text-[#e8821a] font-bold text-xl">
                ₹{startingPrice.toLocaleString("en-IN")}
              </div>
            </>
          )}
          <Link
            href={`/trainers/${String(trainer.id)}`}
            className="mt-2 inline-block bg-[#e8821a] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#d4741a] transition-colors"
          >
            View &amp; Book
          </Link>
        </div>
      </div>

      {/* ── Expand Packages Toggle ── */}
      {hasPackages && (
        <>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="w-full text-xs font-semibold text-[#e8821a] border-t border-[#e8e2d9] py-2.5 hover:bg-[#fdf8f2] transition-colors flex items-center justify-center gap-1"
          >
            {open ? "▲ Hide package details" : "▼ See what's included"}
          </button>

          {open && (
            <div className="border-t border-[#e8e2d9] bg-[#faf7f3] px-4 py-4 space-y-3">
              {packages.map((pkg, i) => (
                <PackageDrawer key={pkg.id ?? i} pkg={pkg} trainerId={trainer.id} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Fallback: no packages ── */}
      {!hasPackages && (
        <div className="border-t border-[#e8e2d9] px-5 py-3">
          <Link
            href={`/trainers/${String(trainer.id)}`}
            className="block w-full text-center bg-[#e8821a] hover:bg-[#d4741a] text-white font-semibold text-sm rounded-xl py-2.5 transition-colors"
          >
            View packages &amp; Book →
          </Link>
        </div>
      )}
    </div>
  );
}