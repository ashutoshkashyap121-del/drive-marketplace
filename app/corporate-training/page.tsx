import type { Metadata } from "next";
import Link from "next/link";
import CorporateForm from "./CorporateForm";

export const metadata: Metadata = {
  title: "Corporate Driving Training for Teams & Fleets",
  description:
    "On-site corporate driving and road-safety training for companies, delivery fleets and cab partners. RTO-verified instructors, all vehicle types, bulk pricing and GST invoice. Get a quote.",
  alternates: { canonical: "/corporate-training" },
  openGraph: {
    title: "Corporate Driving Training for Teams & Fleets | LearnDrive",
    description:
      "Train your drivers on-site across India. Fewer accidents, lower insurance costs, faster onboarding. RTO-verified instructors, bulk pricing, GST invoice.",
    url: "/corporate-training",
    type: "website",
  },
};

const AUDIENCES = [
  {
    icon: "🛵",
    title: "Delivery & logistics fleets",
    body: "Defensive riding and safe-driving programs for riders and drivers — cut accidents, downtime and insurance claims.",
  },
  {
    icon: "🚕",
    title: "Cab & mobility partners",
    body: "Onboard and certify new drivers fast with consistent, RTO-aligned training across cities.",
  },
  {
    icon: "🏢",
    title: "Corporates & factories",
    body: "Offer driving as an employee benefit, or train staff who operate company vehicles and forklifts.",
  },
  {
    icon: "🎓",
    title: "Campuses & institutions",
    body: "Bulk driving lessons for students and staff with attendance and progress reporting.",
  },
];

const BENEFITS = [
  ["RTO-verified instructors", "Background-checked, experienced trainers vetted on the LearnDrive platform."],
  ["Trained on-site", "We come to your office, depot or campus — across Delhi NCR, Mumbai, Bangalore and more."],
  ["All vehicle types", "Car (manual & automatic), 2-wheeler, 3-wheeler and commercial LMV training."],
  ["Bulk pricing & GST invoice", "Volume rates for teams, a single point of contact, and proper GST billing."],
  ["Progress reporting", "Attendance and completion reports for every batch, so you can track outcomes."],
  ["Flexible scheduling", "Weekday, weekend or shift-friendly slots that fit your operations."],
];

const STEPS = [
  ["Tell us your need", "Share team size, city and goals using the form below."],
  ["Get a tailored plan", "We design a program and bulk quote within 1 business day."],
  ["We train your team", "RTO-verified instructors run sessions on-site, on your schedule."],
  ["Track & certify", "Receive attendance and completion reports for each batch."],
];

export default function CorporateTrainingPage() {
  return (
    <main className="text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Back to Home
          </Link>
          <span className="mt-6 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            For businesses &amp; fleets
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Corporate driving training for your team
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-gray-600">
            Upskill drivers, cut accidents and insurance costs, and onboard new hires faster — with
            RTO-verified instructors who train your people on-site, across India.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#quote" className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              Request a quote
            </a>
            <a
              href="tel:+918700896528"
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Call +91 87008 96528
            </a>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900">Who it&apos;s for</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="text-3xl">{a.icon}</div>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">{a.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-2xl font-bold text-gray-900">Why companies choose LearnDrive</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(([title, body]) => (
              <div key={title}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    ✓
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-600">{body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900">How it works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([title, body], i) => (
            <div key={title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {i + 1}
              </div>
              <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-gray-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote form */}
      <section id="quote" className="bg-gradient-to-b from-white to-blue-50">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg sm:p-10">
            <h2 className="text-2xl font-bold text-gray-900">Request a corporate quote</h2>
            <p className="mt-2 text-sm text-gray-600">
              Tell us about your team and we&apos;ll come back with a tailored plan and bulk pricing
              within 1 business day.
            </p>
            <div className="mt-8">
              <CorporateForm />
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-gray-500">
            Prefer email?{" "}
            <a href="mailto:business@learndrive.in" className="text-blue-600 hover:underline">
              business@learndrive.in
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
