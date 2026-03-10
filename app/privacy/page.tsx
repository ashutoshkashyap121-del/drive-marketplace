import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | LearnDrive",
  description:
    "Privacy Policy for LearnDrive — how we collect, use, and protect your personal data in accordance with Indian law.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <div className="mb-10">
        <Link href="/" className="text-blue-600 text-sm hover:underline">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500">
          Last updated: March 2026 &nbsp;|&nbsp; Effective immediately
        </p>
        <p className="mt-4 text-gray-600">
          LearnDrive is committed to protecting your personal information. This
          Privacy Policy explains what data we collect, how we use it, and your
          rights — in compliance with the{" "}
          <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong>,
          the <strong>Aadhaar (Targeted Delivery) Act, 2016</strong>, and other
          applicable Indian laws.
        </p>
      </div>

      <Section title="1. Who We Are">
        <p>
          LearnDrive is an online marketplace connecting learners with verified
          driving trainers across India. We also offer a DL Assistance service
          that helps customers obtain their Indian Driving Licence through an
          AI-powered guided process. References to &quot;LearnDrive&quot;,
          &quot;we&quot;, &quot;us&quot;, or &quot;our&quot; refer to the
          platform and its operators.
        </p>
        <p className="mt-3">
          For privacy-related queries, contact us at:{" "}
          <a href="mailto:privacy@learndrive.in" className="text-blue-600 hover:underline">
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
          <li>Aadhaar number (used for identity verification only — stored encrypted, never shared publicly)</li>
          <li>Vehicle details (type, registration, insurance status, dual control status)</li>
          <li>Bio, photo, and service area pincodes</li>
          <li>Languages spoken and vehicle types offered</li>
        </ul>

        <p className="font-medium mt-5 mb-2">C. From DL Assistance Customers:</p>
        <p className="mb-2 text-gray-600">
          When you use our paid DL Assistance service, we collect the following
          to process your driving licence application:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Full name, date of birth, mobile number, and email address</li>
          <li>Complete residential address, city, pincode, and state</li>
          <li>Aadhaar number (used solely to fill your Sarathi Form 4 — stored encrypted and deleted within 90 days of service completion)</li>
          <li>Vehicle type preference (Car / Bike / Both)</li>
          <li>Learner Licence number and issue date (if applicable)</li>
          <li>Preferred RTO office and appointment dates</li>
          <li>Conversation history with our AI assistant Priya (used only to complete your application — not used for marketing)</li>
        </ul>
        <p className="mt-3 text-sm text-gray-500">
          DL Assistance data is used exclusively to complete your driving licence
          application and is never used for marketing or shared with third parties
          except as described in Section 5.
        </p>

        <p className="font-medium mt-5 mb-2">D. Automatically Collected Data:</p>
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
          <li>To send booking confirmations, session reminders, and updates via SMS / WhatsApp / email</li>
          <li>To process DL Assistance applications — filling Sarathi forms, booking RTO slots, sending document checklists and reminders</li>
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
          We collect Aadhaar numbers from two sources: trainers (for identity
          verification) and DL Assistance customers (to fill Sarathi Form 4).
          In compliance with the{" "}
          <strong>Aadhaar (Targeted Delivery) Act, 2016</strong> and UIDAI guidelines:
        </p>
        <ul className="list-disc pl-5 mt-3 space-y-2">
          <li>Aadhaar numbers are <strong>never displayed publicly</strong> on any profile or page.</li>
          <li>All Aadhaar data is stored in <strong>encrypted form</strong> in our database.</li>
          <li>We do not use Aadhaar for authentication — only for manual verification (trainers) and government form filling (DL Assistance).</li>
          <li>Trainer Aadhaar data may be deleted upon written request after verification is complete.</li>
          <li>DL Assistance customer Aadhaar data is <strong>automatically deleted within 90 days</strong> of service completion.</li>
          <li>Aadhaar numbers are <strong>never sent to any AI system</strong> — they are collected separately and stored encrypted only.</li>
          <li>We do not share Aadhaar numbers with any third party except where required by law.</li>
        </ul>
      </Section>

      <Section title="5. Data Sharing">
        <p>We share data only in the following limited circumstances:</p>
        <ul className="list-disc pl-5 mt-3 space-y-2">
          <li>
            <strong>With Trainers:</strong> We share learner name, mobile number,
            and address only for confirmed bookings.
          </li>
          <li>
            <strong>With Razorpay:</strong> Payment data is shared with Razorpay
            to process transactions. Razorpay&apos;s privacy policy applies to that data.
          </li>
          <li>
            <strong>With Google (Gemini AI):</strong> When you use our DL Assistance
            chat service, your conversation data is processed by Google Gemini AI to
            provide automated guidance. This includes your name, city, vehicle type,
            and application details — but <strong>not</strong> your Aadhaar number.
            Google&apos;s privacy policy applies:{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              policies.google.com/privacy
            </a>.
          </li>
          <li>
            <strong>With Resend (Email Service):</strong> We use Resend to send
            email confirmations, document checklists, and reminders. Your name and
            email address are shared with Resend for delivery only.
          </li>
          <li>
            <strong>With Fast2SMS:</strong> We use Fast2SMS to send WhatsApp and
            SMS notifications. Your mobile number is shared with Fast2SMS for
            message delivery only.
          </li>
          <li>
            <strong>With Legal Authorities:</strong> We may disclose data when
            required by Indian law, court order, or government authority.
          </li>
          <li>
            <strong>With Infrastructure Providers:</strong> We use Neon (database
            hosting) and Vercel (deployment). Both are bound by confidentiality
            agreements and process data only on our instructions.
          </li>
        </ul>
        <p className="mt-3">
          We do <strong>not</strong> share data with advertisers or data brokers.
        </p>
      </Section>

      <Section title="6. AI Processing Disclosure">
        <p>LearnDrive uses artificial intelligence to provide certain services:</p>
        <ul className="list-disc pl-5 mt-3 space-y-2">
          <li>
            <strong>Trainer Approval AI:</strong> Trainer registration applications
            are reviewed by an AI system (powered by Anthropic Claude) to check
            completeness and compliance before human review. No fully automated
            rejection occurs — a human administrator makes the final decision.
          </li>
          <li>
            <strong>DL Assistance Chat (Priya):</strong> Our AI assistant Priya is
            powered by Google Gemini. Conversations are used solely to collect your
            application details and guide you through the process. Aadhaar numbers
            are <strong>never</strong> sent to the AI — they are collected separately
            and stored encrypted only on our servers.
          </li>
          <li>
            <strong>Trainer Outreach AI:</strong> We use AI to identify and contact
            potential driving instructors using publicly available business information
            (business names, phone numbers listed on Google Maps).
          </li>
        </ul>
        <p className="mt-3 text-sm text-gray-500">
          No fully automated decision-making with legal or significant consequences
          is made about individuals without human oversight.
        </p>
      </Section>

      <Section title="7. Data Retention">
        <ul className="list-disc pl-5 space-y-2">
          <li>Booking records are retained for <strong>5 years</strong> for legal and financial compliance.</li>
          <li>Trainer profiles are retained while the account is active and for 2 years after deletion.</li>
          <li>Learner booking data is retained for 2 years after the last booking.</li>
          <li>DL Assistance personal data (including Aadhaar) is deleted within <strong>90 days</strong> of service completion.</li>
          <li>AI conversation logs from DL Assistance are deleted within <strong>30 days</strong>.</li>
          <li>Trainer Aadhaar data may be deleted upon written request after verification.</li>
        </ul>
      </Section>

      <Section title="8. Your Rights (Under DPDPA 2023)">
        <p>As a data principal under the Digital Personal Data Protection Act, 2023, you have the right to:</p>
        <ul className="list-disc pl-5 mt-3 space-y-2">
          <li><strong>Access</strong> — Request a summary of personal data we hold about you.</li>
          <li><strong>Correction</strong> — Request correction of inaccurate data.</li>
          <li><strong>Erasure</strong> — Request deletion of your data (subject to legal retention obligations).</li>
          <li><strong>Grievance Redressal</strong> — Raise a complaint with our Data Protection Officer.</li>
          <li><strong>Nomination</strong> — Nominate another person to exercise rights on your behalf in case of death or incapacity.</li>
          <li><strong>Withdraw Consent</strong> — Withdraw consent for data processing at any time (this may affect our ability to provide services to you).</li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, email us at{" "}
          <a href="mailto:privacy@learndrive.in" className="text-blue-600 hover:underline">
            privacy@learndrive.in
          </a>. We will respond within <strong>30 days</strong>.
        </p>
      </Section>

      <Section title="9. Cookies & Tracking">
        <ul className="list-disc pl-5 space-y-2">
          <li>We use essential session cookies to keep you logged in securely.</li>
          <li>We use CSRF tokens to protect against cross-site request forgery.</li>
          <li>We use the <strong>Meta Pixel</strong> for advertising performance measurement on Facebook and Instagram. This may set cookies on your device.</li>
          <li>We may use anonymised analytics to understand platform usage.</li>
          <li>We do <strong>not</strong> use third-party advertising cookies beyond those listed above.</li>
        </ul>
      </Section>

      <Section title="10. Data Security">
        <p>We implement the following security measures:</p>
        <ul className="list-disc pl-5 mt-3 space-y-2">
          <li>All data transmitted over <strong>HTTPS (TLS encryption)</strong>.</li>
          <li>Admin sessions protected with secure, httpOnly cookies.</li>
          <li>CSRF protection on all sensitive API endpoints.</li>
          <li>All admin actions logged in an audit trail.</li>
          <li>Sensitive fields (Aadhaar) stored encrypted in the database.</li>
          <li>Access to personal data restricted to authorised personnel only.</li>
        </ul>
        <p className="mt-3 text-sm text-gray-500">
          In the event of a data breach, we will notify affected users and relevant
          authorities as required by law within 72 hours of becoming aware.
        </p>
      </Section>

      <Section title="11. Children's Privacy">
        <p>
          Our platform is intended for users <strong>18 years and above</strong>.
          We do not knowingly collect data from minors. If you believe a minor has
          registered, contact us immediately at{" "}
          <a href="mailto:privacy@learndrive.in" className="text-blue-600 hover:underline">
            privacy@learndrive.in
          </a>.
        </p>
      </Section>

      <Section title="12. International Users">
        <p>
          LearnDrive is currently operated from India and our services are primarily
          directed at Indian residents. If you access our platform from outside India,
          your data will be processed in India under Indian law. Cross-border data
          processing occurs only via our service providers listed in Section 5
          (Google Gemini, Resend, and Vercel infrastructure).
        </p>
      </Section>

      <Section title="13. Changes to This Policy">
        <p>
          We may update this Privacy Policy periodically. The &quot;Last Updated&quot;
          date at the top reflects the most recent revision. For material changes, we
          will notify registered users via email or WhatsApp. Continued use of the
          platform after changes constitutes acceptance of the updated policy.
        </p>
      </Section>

      <Section title="14. Grievance Officer">
        <p>
          In accordance with the Information Technology Act, 2000 and DPDPA 2023,
          our Grievance Officer can be contacted at:
        </p>
        <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm space-y-1">
          <p><strong>LearnDrive — Grievance Officer</strong></p>
          <p>Email: <a href="mailto:grievance@learndrive.in" className="text-blue-600 hover:underline">grievance@learndrive.in</a></p>
          <p>Support: <a href="mailto:support@learndrive.in" className="text-blue-600 hover:underline">support@learndrive.in</a></p>
          <p>Phone: +91 87008 96528</p>
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