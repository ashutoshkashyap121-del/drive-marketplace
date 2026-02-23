// app/privacy/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | LearnDrive",
  description:
    "Privacy Policy for LearnDrive — how we collect, use, and protect your personal data in accordance with Indian law.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      {/* Header */}
      <div className="mb-10">
        <Link href="/" className="text-blue-600 text-sm hover:underline">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500">
          Last updated: February 2026 &nbsp;|&nbsp; Effective immediately
        </p>
        <p className="mt-4 text-gray-600">
          LearnDrive is committed to protecting your personal information. This
          Privacy Policy explains what data we collect, how we use it, and your
          rights — in compliance with the{" "}
          <strong>
            Digital Personal Data Protection Act, 2023 (DPDPA)
          </strong>{" "}
          and other applicable Indian laws.
        </p>
      </div>

      <Section title="1. Who We Are">
        <p>
          LearnDrive is an online marketplace connecting learners with verified
          driving trainers across India. References to &quot;LearnDrive&quot;,
          &quot;we&quot;, &quot;us&quot;, or &quot;our&quot; in this policy
          refer to the platform and its operators.
        </p>
        <p className="mt-3">
          For privacy-related queries, contact us at:{" "}
          <a
            href="mailto:privacy@learndrive.in"
            className="text-blue-600 hover:underline"
          >
            privacy@learndrive.in
          </a>
        </p>
      </Section>

      <Section title="2. What Data We Collect">
        <p className="font-medium mb-2">A. From Learners (Users booking sessions):</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Full name, mobile number, city, address, and pincode</li>
          <li>Booking details (vehicle type, session date, package chosen)</li>
          <li>Payment information (processed securely by Razorpay — we do not store card details)</li>
          <li>Device and browser information for security purposes</li>
        </ul>

        <p className="font-medium mt-5 mb-2">B. From Trainers (those registering on the platform):</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Full name, mobile number, email address, city, and pincode</li>
          <li>Driving licence number and years of experience</li>
          <li>Aadhaar number (used for identity verification only — stored securely and never shared publicly)</li>
          <li>Vehicle details (type, registration, insurance status, dual control status)</li>
          <li>Bio, photo, and service area pincodes</li>
          <li>Languages spoken and vehicle types offered</li>
        </ul>

        <p className="font-medium mt-5 mb-2">C. Automatically collected data:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>IP address and location (city-level only)</li>
          <li>Browser type, device type, and operating system</li>
          <li>Pages visited and time spent on the platform</li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Data">
        <ul className="list-disc pl-5 space-y-2">
          <li>To match learners with suitable trainers based on city, pincode, and vehicle type</li>
          <li>To facilitate bookings and process payments</li>
          <li>To verify trainer identity and credentials before approval</li>
          <li>To send booking confirmations, session reminders, and updates via SMS/WhatsApp</li>
          <li>To enable admin review and approval of trainer registrations</li>
          <li>To detect fraud, resolve disputes, and enforce our Terms of Service</li>
          <li>To improve the platform using anonymised usage analytics</li>
        </ul>
        <p className="mt-3 text-sm text-gray-500">
          We will never sell your personal data to third parties for advertising purposes.
        </p>
      </Section>

      <Section title="4. Aadhaar Data Handling">
        <p>
          We collect Aadhaar numbers from trainers solely for the purpose of
          identity verification. In compliance with the{" "}
          <strong>Aadhaar (Targeted Delivery) Act, 2016</strong> and UIDAI
          guidelines:
        </p>
        <ul className="list-disc pl-5 mt-3 space-y-2">
          <li>Aadhaar numbers are <strong>never displayed publicly</strong> on trainer profiles.</li>
          <li>Aadhaar data is stored in encrypted form.</li>
          <li>We do not use Aadhaar for authentication — only for manual admin verification.</li>
          <li>Trainers may request deletion of their Aadhaar data after verification is complete.</li>
        </ul>
      </Section>

      <Section title="5. Data Sharing">
        <p>We share data only in the following limited circumstances:</p>
        <ul className="list-disc pl-5 mt-3 space-y-2">
          <li>
            <strong>With Trainers:</strong> We share learner name, mobile
            number, and address only for confirmed bookings.
          </li>
          <li>
            <strong>With Razorpay:</strong> Payment data is shared with
            Razorpay to process transactions. Razorpay&apos;s privacy policy
            applies to that data.
          </li>
          <li>
            <strong>With Legal Authorities:</strong> We may disclose data when
            required by Indian law, court order, or government authority.
          </li>
          <li>
            <strong>With Service Providers:</strong> We use trusted third-party
            services (e.g., Neon for database hosting, Vercel for deployment)
            who are bound by confidentiality agreements.
          </li>
        </ul>
        <p className="mt-3">We do <strong>not</strong> share data with advertisers or data brokers.</p>
      </Section>

      <Section title="6. Data Retention">
        <ul className="list-disc pl-5 space-y-2">
          <li>Booking records are retained for <strong>5 years</strong> for legal and financial compliance.</li>
          <li>Trainer profiles are retained while the account is active, and for 2 years after deletion.</li>
          <li>Learner booking data is retained for 2 years after the last booking.</li>
          <li>Aadhaar data may be deleted upon written request after verification.</li>
        </ul>
      </Section>

      <Section title="7. Your Rights (Under DPDPA 2023)">
        <p>As a data principal under the Digital Personal Data Protection Act, 2023, you have the right to:</p>
        <ul className="list-disc pl-5 mt-3 space-y-2">
          <li><strong>Access</strong> — Request a summary of personal data we hold about you.</li>
          <li><strong>Correction</strong> — Request correction of inaccurate data.</li>
          <li><strong>Erasure</strong> — Request deletion of your data (subject to legal retention obligations).</li>
          <li><strong>Grievance Redressal</strong> — Raise a complaint with our Data Protection Officer.</li>
          <li><strong>Nomination</strong> — Nominate another person to exercise rights on your behalf in case of death or incapacity.</li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, email us at{" "}
          <a
            href="mailto:privacy@learndrive.in"
            className="text-blue-600 hover:underline"
          >
            privacy@learndrive.in
          </a>
          . We will respond within <strong>30 days</strong>.
        </p>
      </Section>

      <Section title="8. Cookies & Tracking">
        <ul className="list-disc pl-5 space-y-2">
          <li>We use essential session cookies to keep you logged in securely.</li>
          <li>We use CSRF tokens to protect against cross-site request forgery attacks.</li>
          <li>We do <strong>not</strong> use third-party advertising cookies.</li>
          <li>We may use anonymised analytics to understand platform usage.</li>
        </ul>
      </Section>

      <Section title="9. Data Security">
        <p>We implement the following security measures to protect your data:</p>
        <ul className="list-disc pl-5 mt-3 space-y-2">
          <li>All data is transmitted over <strong>HTTPS (TLS encryption)</strong>.</li>
          <li>Admin sessions are protected with secure, httpOnly cookies.</li>
          <li>CSRF protection on all sensitive API endpoints.</li>
          <li>All admin actions are logged in an audit trail.</li>
          <li>Sensitive fields (Aadhaar) are stored encrypted in the database.</li>
        </ul>
        <p className="mt-3 text-sm text-gray-500">
          No system is 100% secure. In the event of a data breach, we will
          notify affected users and relevant authorities as required by law.
        </p>
      </Section>

      <Section title="10. Children's Privacy">
        <p>
          Our platform is intended for users <strong>18 years and above</strong>
          . We do not knowingly collect data from minors. If you believe a minor
          has registered, please contact us immediately at{" "}
          <a
            href="mailto:privacy@learndrive.in"
            className="text-blue-600 hover:underline"
          >
            privacy@learndrive.in
          </a>
          .
        </p>
      </Section>

      <Section title="11. Changes to This Policy">
        <p>
          We may update this Privacy Policy periodically. The &quot;Last
          Updated&quot; date at the top reflects the most recent revision.
          Continued use of the platform after changes constitutes acceptance of
          the updated policy.
        </p>
      </Section>

      <Section title="12. Grievance Officer">
        <p>
          In accordance with the Information Technology Act, 2000 and DPDPA
          2023, our Grievance Officer can be contacted at:
        </p>
        <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm">
          <p><strong>LearnDrive — Grievance Officer</strong></p>
          <p>Email: <a href="mailto:grievance@learndrive.in" className="text-blue-600 hover:underline">grievance@learndrive.in</a></p>
          <p>Response time: Within 30 days of receipt of complaint</p>
        </div>
      </Section>

      <div className="mt-10 pt-6 border-t text-sm text-gray-400 flex gap-4">
        <Link href="/terms" className="hover:underline">Terms of Service</Link>
        <Link href="/" className="hover:underline">Home</Link>
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