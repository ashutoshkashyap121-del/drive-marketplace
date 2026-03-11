"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronDown, 
  ChevronUp, 
  Car, 
  Clock, 
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

interface Trainer {
  id: string;
  name: string;
  city: string;
  experience: number; // Updated from yearsExperience to match backend
  languages: string[];
  vehicleTypes: string[];
  rating?: number;
  reviewCount?: number;
  packagesJson: Package[];
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

// ─── Package Drawer ───────────────────────────────────────────────────────────

function PackageDrawer({ pkg, trainerId }: { pkg: Package; trainerId: string }) {
  const dailyRate = pkg.days && pkg.price ? Math.round(pkg.price / pkg.days) : null;

  return (
    <div className="border border-[#e8e2d9] rounded-xl overflow-hidden bg-[#fdfcfb]">
      <div className="flex items-center justify-between px-4 py-3 bg-[#f5f0e8]">
        <span className="font-semibold text-[#1a1a2e] text-sm">{pkg.name}</span>
        <div className="text-right">
          <span className="text-[#e8821a] font-bold text-base">
            {formatPrice(pkg)}
          </span>
          {pkg.priceMax && <span className="text-[#888] text-xs block">range</span>}
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* Stats row */}
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

        {/* What's included */}
        {pkg.includes && pkg.includes.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[#555] uppercase tracking-wide mb-1.5">
              What's included
            </p>
            <ul className="space-y-1">
              {pkg.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#333]">
                  <CheckCircle2 size={14} className="text-[#e8821a] mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Vehicle variants */}
        {pkg.vehicleVariants && pkg.vehicleVariants.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[#555] uppercase tracking-wide mb-1.5">
              Price by model
            </p>
            <div className="space-y-1">
              {pkg.vehicleVariants.map((v, i) => (
                <div key={i} className="flex justify-between text-sm bg-white border border-[#e8e2d9] rounded-lg px-3 py-1.5">
                  <span className="text-[#333] font-medium">{v.model}</span>
                  <div className="flex gap-3 text-xs text-[#666]">
                    <span>Non-AC ₹{v.nonAcPrice.toLocaleString("en-IN")}</span>
                    {v.acPrice && (
                      <span className="text-[#2a7a4b]">AC ₹{v.acPrice.toLocaleString("en-IN")}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notices */}
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
              Track fee ₹{pkg.trackFee.toLocaleString("en-IN")} — paid on test day only
            </div>
          )}
          {dailyRate && (
            <div className="flex items-center gap-2 text-xs text-[#555] bg-[#f5f0e8] rounded-lg px-3 py-2">
              <Clock size={12} className="shrink-0" />
              Approx. ₹{dailyRate.toLocaleString("en-IN")}/day
            </div>
          )}
        </div>

        <Link
          href={`/trainers/${trainerId}/book?price=${pkg.price}&pkgName=${encodeURIComponent(pkg.name)}`}
          className="block w-full text-center bg-[#e8821a] hover:bg-[#d4741a] text-white font-semibold text-sm rounded-xl py-2.5 transition-colors"
        >
          Book this →
        </Link>
      </div>
    </div>
  );
}

// ─── Main Card ────────────────────────────────────────────────────────────────

export default function TrainerCard({ trainer }: { trainer: Trainer }) {
  const [open, setOpen] = useState(false);
  const packages = trainer.packagesJson ?? [];
  const hasMultiple = packages.length > 1;
  const startingPrice = lowestPrice(packages);

  return (
    <div className="bg-white rounded-2xl border border-[#e8e2d9] shadow-sm overflow-hidden">
      <div className="p-5 flex items-start justify-between gap-4">
        
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#f5f0e8] flex items-center justify-center shrink-0 text-lg">
            🚗
          </div>

          <div>
            <h3 className="font-bold text-[#1a1a2e] text-[15px] leading-snug">
              {trainer.name}
            </h3>
            <div className="flex items-center gap-1 text-[#888] text-xs mt-0.5">
              <MapPin size={11} />
              <span>{trainer.city}</span>
              <span>·</span>
              <span>{trainer.experience} yrs exp</span> {/* Updated variable name */}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {trainer.vehicleTypes.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 text-xs bg-[#edf7f1] text-[#2a7a4b] border border-[#c6e8d3] rounded-full px-2 py-0.5"
                >
                  <Car size={10} /> {v}
                </span>
              ))}
              {trainer.languages.map((l) => (
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

        <div className="text-right shrink-0">
          <div className="text-[#e8821a] font-bold text-xl leading-none">
            ₹{startingPrice.toLocaleString("en-IN")}
          </div>
          <div className="text-[#aaa] text-xs mt-0.5">
            {hasMultiple ? "starting from" : packages[0]?.name ?? "Package"}
          </div>
          <Link
            href={`/trainers/${trainer.id}`}
            className="mt-2 inline-block bg-[#e8821a] hover:bg-[#d4741a] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            View & Book →
          </Link>
        </div>
      </div>

      {packages.length > 0 && (
        <>
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[#e8821a] border-t border-[#e8e2d9] py-2.5 hover:bg-[#fdf8f2] transition-colors"
          >
            {open ? (
              <>
                <ChevronUp size={14} /> Hide package details
              </>
            ) : (
              <>
                <ChevronDown size={14} /> See what's included in this package
              </>
            )}
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