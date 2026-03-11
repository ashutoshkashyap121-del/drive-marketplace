"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Car, 
  MapPin, 
  CheckCircle2, 
  Zap, 
  Flag 
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VehicleVariant {
  model: string;
  nonAcPrice: number;
  acPrice?: number;
}

interface Package {
  name: string;
  price: number;
  priceMax?: number;
  days?: number;
  sessionLengthMins?: number;
  distancePerDayKm?: number;
  includes?: string[];
  acSurcharge?: number;
  trackFee?: number;
  vehicleVariants?: VehicleVariant[];
}

interface TrainerDisplayData {
  id: number;
  name: string;
  city: string;
  experience: number;
  languages: any;
  vehicleTypes: any;
  rating?: number | null;
  reviewCount?: number | null;
  packagesJson: any;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(pkg: Package): string {
  if (pkg.priceMax && pkg.priceMax !== pkg.price) {
    return `₹${pkg.price.toLocaleString("en-IN")}–₹${pkg.priceMax.toLocaleString("en-IN")}`;
  }
  return `₹${pkg.price.toLocaleString("en-IN")}`;
}

function lowestPrice(packages: Package[]): number {
  if (packages.length === 0) return 0;
  return Math.min(...packages.map((p) => p.price));
}

// ─── Package Drawer Component ─────────────────────────────────────────────────

function PackageDrawer({ pkg, trainerId }: { pkg: Package; trainerId: number }) {
  const bookingHref = `/trainers/${String(trainerId)}/book?price=${pkg.price}&pkgName=${encodeURIComponent(pkg.name)}`;

  return (
    <div className="border border-[#e8e2d9] rounded-xl overflow-hidden bg-[#fdfcfb]">
      <div className="flex items-center justify-between px-4 py-3 bg-[#f5f0e8]">
        <span className="font-semibold text-[#1a1a2e] text-sm">{pkg.name}</span>
        <div className="text-right">
          <span className="text-[#e8821a] font-bold text-base">
            {formatPrice(pkg)}
          </span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          {pkg.days !== undefined && (
            <div className="bg-white border border-[#e8e2d9] rounded-lg py-2">
              <div className="text-[#1a1a2e] font-bold text-lg">{pkg.days}</div>
              <div className="text-[#888] text-xs">days</div>
            </div>
          )}
          {pkg.sessionLengthMins !== undefined && (
            <div className="bg-white border border-[#e8e2d9] rounded-lg py-2">
              <div className="text-[#1a1a2e] font-bold text-lg">{pkg.sessionLengthMins}</div>
              <div className="text-[#888] text-xs">min/session</div>
            </div>
          )}
          {pkg.distancePerDayKm !== undefined && (
            <div className="bg-white border border-[#e8e2d9] rounded-lg py-2">
              <div className="text-[#1a1a2e] font-bold text-lg">{pkg.distancePerDayKm}</div>
              <div className="text-[#888] text-xs">km/day</div>
            </div>
          )}
        </div>

        {pkg.includes && pkg.includes.length > 0 && (
          <ul className="space-y-1">
            {pkg.includes.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#333]">
                <CheckCircle2 size={14} className="text-[#e8821a] mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="space-y-1.5">
          {pkg.acSurcharge && (
            <div className="flex items-center gap-2 text-xs text-[#2a7a4b] bg-[#edf7f1] rounded-lg px-3 py-2">
              <Zap size={12} className="shrink-0" />
              AC vehicle: +₹{pkg.acSurcharge.toLocaleString("en-IN")} surcharge
            </div>
          )}
          {pkg.trackFee && (
            <div className="flex items-center gap-2 text-xs text-[#7a5a2a] bg-[#fff8ed] rounded-lg px-3 py-2">
              <Flag size={12} className="shrink-0" />
              Track fee ₹{pkg.trackFee.toLocaleString("en-IN")}
            </div>
          )}
        </div>

        <Link
          href={bookingHref}
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

  // Safety parsing for packagesJson from DB
  const packages: Package[] = (() => {
    if (Array.isArray(trainer.packagesJson)) return trainer.packagesJson;
    if (typeof trainer.packagesJson === "string") {
      try { return JSON.parse(trainer.packagesJson); } catch { return []; }
    }
    return [];
  })();

  const languages: string[] = Array.isArray(trainer.languages) ? trainer.languages : [];
  const vehicleTypes: string[] = Array.isArray(trainer.vehicleTypes) ? trainer.vehicleTypes : [];

  const startingPrice = lowestPrice(packages);
  const trainerIdStr = String(trainer.id);

  return (
    <div className="bg-white rounded-2xl border border-[#e8e2d9] shadow-sm overflow-hidden mb-4">
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#f5f0e8] flex items-center justify-center shrink-0">🚗</div>
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
            <div className="flex flex-wrap gap-1.5 mt-2">
              {vehicleTypes.map((v) => (
                <span key={v} className="inline-flex items-center gap-1 text-xs bg-[#edf7f1] text-[#2a7a4b] border border-[#c6e8d3] rounded-full px-2 py-0.5">
                  <Car size={10} /> {v}
                </span>
              ))}
              {languages.map((l) => (
                <span key={l} className="text-xs bg-[#f5f0e8] text-[#555] border border-[#e8e2d9] rounded-full px-2 py-0.5">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

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
            href={`/trainers/${trainerIdStr}`}
            className="mt-2 inline-block bg-[#e8821a] text-white text-xs font-semibold px-4 py-2 rounded-xl"
          >
            View &amp; Book
          </Link>
        </div>
      </div>

      {packages.length > 0 && (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="w-full text-xs font-semibold text-[#e8821a] border-t border-[#e8e2d9] py-2.5 hover:bg-[#fdf8f2] flex items-center justify-center gap-1"
          >
            {open ? "▲ Hide package details" : "▼ See what's included"}
          </button>
          {open && (
            <div className="border-t border-[#e8e2d9] bg-[#faf7f3] px-4 py-4 space-y-3">
              {packages.map((pkg, i) => (
                <PackageDrawer key={i} pkg={pkg} trainerId={trainer.id} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}