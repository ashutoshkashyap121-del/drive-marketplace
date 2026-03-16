import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy | LearnDrive",
  description: "Refund rules, timelines, and eligibility for LearnDrive bookings.",
  alternates: { canonical: "/refund" },
};

export default function RefundPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <div className="mb-10">
        <Link href="/" className="text-blue-600 text-sm hover:underline">
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">Refund Policy</h1>
        <p className="text-sm text-gray-500">Last updated: March 16, 2026</p>
        <p className="mt-4 text-gray-600">
          This policy explains when a booking is eligible for refund and how long refunds take.
        </p>
      </div>

      <Section title="1. Cancellation by Learner">
        <ul className="list-disc pl-5 space-y-2">
          <li>Cancel 24+ hours before session start: 100% refund.</li>
          <li>Cancel less than 24 hours before session start: 50% refund.</li>
          <li>Cancel after session time or no-show: no refund.</li>
        </ul>
      </Section>

      <Section title="2. Cancellation by Trainer">
        <ul className="list-disc pl-5 space-y-2">
          <li>If a trainer cancels, learner is eligible for 100% refund.</li>
          <li>If a booking is not confirmed within SLA, full refund may be auto-processed per platform rules.</li>
        </ul>
      </Section>

      <Section title="3. Refund Timeline">
        <ul className="list-disc pl-5 space-y-2">
          <li>UPI refunds usually reflect within 24 hours.</li>
          <li>Cards/net banking can take 5-7 business days depending on your bank.</li>
          <li>In rare cases, bank settlement delays can extend beyond this window.</li>
        </ul>
      </Section>

      <Section title="4. How to Request or Track a Refund">
        <p>
          Use the track page:{" "}
          <Link href="/track-refund" className="text-blue-600 hover:underline">
            /track-refund
          </Link>
        </p>
        <p className="mt-2">
          Keep your Booking ID and registered mobile number ready.
        </p>
      </Section>

      <Section title="5. Contact">
        <p>
          For help, email{" "}
          <a href="mailto:support@learndrive.in" className="text-blue-600 hover:underline">
            support@learndrive.in
          </a>{" "}
          or call +91 87008 96528.
        </p>
      </Section>

      <div className="mt-10 pt-6 border-t text-sm text-gray-400 flex gap-4">
        <Link href="/terms" className="hover:underline">Terms of Service</Link>
        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
        <Link href="/track-refund" className="hover:underline">Track Refund</Link>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3 text-gray-900">{title}</h2>
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </section>
  );
}

