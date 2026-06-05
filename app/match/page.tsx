import type { Metadata } from "next";
import Link from "next/link";
import MatchClient from "./MatchClient";

export const metadata: Metadata = {
  title: "Find My Driving Trainer — AI Match",
  description:
    "Answer a few quick questions and our AI matches you with the best-fit RTO-verified driving trainers near you — ranked by rating, experience, language and budget.",
  alternates: { canonical: "/match" },
  openGraph: {
    title: "Find My Driving Trainer — AI Match | LearnDrive",
    description:
      "Tell us your city, vehicle, language and budget — we'll rank the best driving trainers for you in seconds.",
    url: "/match",
    type: "website",
  },
};

export default function MatchPage() {
  return (
    <main className="text-gray-800">
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Back to Home
          </Link>
          <span className="mt-6 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            AI-powered matching
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Find your perfect driving trainer
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Answer a few quick questions and we&apos;ll rank the best-fit, RTO-verified trainers near
            you — by rating, experience, language and budget.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20">
        <MatchClient />
      </section>
    </main>
  );
}
