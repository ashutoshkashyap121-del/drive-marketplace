import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | LearnDrive",
  description: "Contact LearnDrive support for bookings, trainers, refunds, and technical help.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <div className="mb-10">
        <Link href="/" className="text-blue-600 text-sm hover:underline">Back to Home</Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">Contact Us</h1>
        <p className="text-gray-600">
          Reach out for support related to bookings, trainer registration, and refunds.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-900">Support</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Email: <a className="text-blue-600 hover:underline" href="mailto:support@learndrive.in">support@learndrive.in</a>
          </li>
          <li>
            Phone: <a className="text-blue-600 hover:underline" href="tel:+918700896528">+91 87008 96528</a>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-900">Business</h2>
        <p>
          For partnerships and business inquiries:{" "}
          <a className="text-blue-600 hover:underline" href="mailto:business@learndrive.in">
            business@learndrive.in
          </a>
        </p>
      </section>
    </main>
  );
}

