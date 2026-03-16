import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers | LearnDrive",
  description: "Careers at LearnDrive. Join us to improve driver training access across India.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <div className="mb-10">
        <Link href="/" className="text-blue-600 text-sm hover:underline">Back to Home</Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">Careers</h1>
        <p className="text-gray-600">
          We are building practical products for learners, trainers, and driving schools.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-900">Current Status</h2>
        <p className="text-gray-700 leading-relaxed">
          We are not actively hiring for full-time roles at the moment.
          If you want to work with us in future openings, share your profile.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-900">How to Apply</h2>
        <p>
          Send your resume and portfolio to{" "}
          <a className="text-blue-600 hover:underline" href="mailto:careers@learndrive.in">
            careers@learndrive.in
          </a>
          .
        </p>
      </section>
    </main>
  );
}

