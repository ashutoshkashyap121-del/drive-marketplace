import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | LearnDrive",
  description: "LearnDrive mission, what we build, and how we help learners and trainers across India.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <div className="mb-10">
        <Link href="/" className="text-blue-600 text-sm hover:underline">Back to Home</Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">About LearnDrive</h1>
        <p className="text-gray-600">
          LearnDrive is a marketplace that helps learners find verified driving trainers and helps trainers grow their business.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-900">What We Do</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Connect learners with approved trainers by city, pincode, and vehicle type.</li>
          <li>Provide transparent booking and secure payment flow.</li>
          <li>Support trainers with profile visibility, lead generation, and operations tools.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-900">Why We Built It</h2>
        <p className="text-gray-700 leading-relaxed">
          Finding a trustworthy trainer is still difficult in many cities. We built LearnDrive to make this process faster,
          safer, and more transparent for both learners and trainers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-900">Contact</h2>
        <p>
          Email: <a className="text-blue-600 hover:underline" href="mailto:support@learndrive.in">support@learndrive.in</a>
        </p>
      </section>
    </main>
  );
}

