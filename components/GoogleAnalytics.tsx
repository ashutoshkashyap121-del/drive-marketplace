// components/GoogleAnalytics.tsx
"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const GA_ID = "G-4DLX47H9L6";

// ─── Core gtag helper ─────────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export function gtag(...args: any[]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

// ─── Track custom events ──────────────────────────────────────────────────────

export function trackEvent(
  eventName: string,
  params?: Record<string, any>
) {
  gtag("event", eventName, params);
}

// ─── Trainer registration funnel events ──────────────────────────────────────

export const TrainerEvents = {
  stepStarted: (step: number, stepName: string) =>
    trackEvent("trainer_reg_step", { step_number: step, step_name: stepName }),

  completed: (trainerType: string) =>
    trackEvent("trainer_reg_complete", {
      trainer_type: trainerType,
      // Google Ads conversion — mark this as conversion in GA4
      send_to: GA_ID,
    }),
};

// ─── Student booking funnel events ───────────────────────────────────────────

export const BookingEvents = {
  searchCity: (city: string) =>
    trackEvent("search_city", { city }),

  trainerViewed: (trainerId: number, trainerName: string, city: string) =>
    trackEvent("trainer_viewed", { trainer_id: trainerId, trainer_name: trainerName, city }),

  bookingStarted: (trainerId: number, packageName: string, price: number) =>
    trackEvent("booking_started", { trainer_id: trainerId, package_name: packageName, value: price, currency: "INR" }),

  bookingCompleted: (trainerId: number, packageName: string, price: number) =>
    trackEvent("purchase", {
      transaction_id: Date.now().toString(),
      value: price,
      currency: "INR",
      items: [{ item_name: packageName, price }],
    }),
};

// ─── Pageview tracker (fires on route change) ─────────────────────────────────

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    gtag("config", GA_ID, { page_path: url });
  }, [pathname, searchParams]);

  return null;
}

// ─── Main GA4 component — add to root layout ─────────────────────────────────

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            send_page_view: true
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
    </>
  );
}