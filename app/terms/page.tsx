// app/terms/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | LearnDrive",
  description:
    "Terms of Service for LearnDrive — India's trusted platform for finding verified driving trainers.",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      {/* Header */}
      <div className="mb-10">
        <Link href="/" className="text-blue-600 text-sm hover:underline">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500">
          Last updated: February 2026 &nbsp;|&nbsp; Effective immediately
        </p>
        <p className="mt-4 text-gray-600">
          Please read these Terms of Service carefully before using the
          LearnDrive platform. By accessing or using our website or services,
          you agree to be bound by these terms.
        </p>
      </div>

      <Section title="1. About LearnDrive">
        <p>
          LearnDrive (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or
          &quot;our&quot;) is an online marketplace that connects individuals
          seeking driving training (&quot;Learners&quot;) with independent
          driving trainers and driving schools (&quot;Trainers&quot;) across
          India.
        </p>
        <p className="mt-3">
          LearnDrive is <strong>not</strong> a Regional Transport Office (RTO)
          recognised driving school. We do not directly employ trainers. All
          trainers are independent service providers who have agreed to our
          Trainer Terms and verification process.
        </p>
      </Section>

      <Section title="2. Eligibility">
        <ul className="list-disc pl-5 space-y-2">
          <li>You must be at least <strong>18 years of age</strong> to register or book on this platform.</li>
          <li>
            Learners booking <strong>car or motorcycle training</strong> must
            hold a valid <strong>Learner&apos;s Licence (LL)</strong> issued by
            a competent RTO under the Motor Vehicles Act, 1988, before
            commencing sessions on public roads.
          </li>
          <li>
            By using this platform, you confirm that the information you provide
            is accurate, complete, and up to date.
          </li>
        </ul>
      </Section>

      <Section title="3. Trainer Eligibility & Verification">
        <p>All trainers listed on LearnDrive must meet the following minimum requirements before approval:</p>
        <ul className="list-disc pl-5 mt-3 space-y-2">
          <li>Hold a valid <strong>driving licence</strong> issued by an Indian RTO.</li>
          <li>Have a minimum of <strong>5 years of driving experience</strong>.</li>
          <li>Be at least <strong>18 years of age</strong>.</li>
          <li>Have passed at least <strong>Class 10 (SSC)</strong> or equivalent education.</li>
          <li>Provide a valid <strong>Aadhaar number</strong> for identity verification.</li>
          <li>
            Car trainers must confirm that their training vehicle has{" "}
            <strong>dual control (dual brake/clutch pedals)</strong> installed,
            as required under the Motor Vehicles Act, 1988 and MoRTH
            guidelines.
          </li>
          <li>Training vehicles must carry <strong>valid motor insurance</strong>.</li>
          <li>Training vehicles must not be older than <strong>8 years</strong>.</li>
          <li>
            All training vehicles must display a{" "}
            <strong>&quot;For Driver Training&quot;</strong> or{" "}
            <strong>&quot;L&quot; board</strong> during sessions as required by
            law.
          </li>
        </ul>
        <p className="mt-3 text-sm text-gray-500">
          LearnDrive reserves the right to reject, suspend, or remove any
          trainer at its sole discretion if the above requirements are not met
          or if misrepresentation is discovered.
        </p>
      </Section>

      <Section title="4. Dual Control Vehicle Requirement">
        <p>
          Under the <strong>Motor Vehicles Act, 1988</strong> and rules framed
          thereunder by the Ministry of Road Transport and Highways (MoRTH),
          any motor vehicle (excluding motorcycles) used for imparting driving
          training must be fitted with{" "}
          <strong>dual control facilities</strong> — i.e., a secondary set of
          brake and clutch pedals accessible to the trainer.
        </p>
        <p className="mt-3">
          LearnDrive strictly enforces this requirement for all car trainers.
          Trainers who misrepresent their vehicle&apos;s dual control status
          will be permanently banned from the platform and may be reported to
          the relevant RTO authority.
        </p>
      </Section>

      <Section title="5. Bookings & Payments">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            All bookings are between the Learner and the Trainer. LearnDrive
            acts as an intermediary facilitating the connection.
          </li>
          <li>
            Payments are processed securely via Razorpay. LearnDrive collects a
            platform fee from each booking.
          </li>
          <li>
            Trainer payout is released after the session is marked as completed.
          </li>
          <li>
            Cancellation and refund policies are subject to the terms agreed at
            the time of booking.
          </li>
        </ul>
      </Section>

      <Section title="6. Cancellations & Refunds">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Cancellations made <strong>24+ hours</strong> before the session:
            Full refund.
          </li>
          <li>
            Cancellations made <strong>less than 24 hours</strong> before: 50%
            refund.
          </li>
          <li>Cancellations made after session time: No refund.</li>
          <li>
            If a trainer cancels, the Learner will receive a full refund and
            LearnDrive will attempt to find a replacement trainer.
          </li>
          <li>Refunds are credited within 5–7 business days.</li>
        </ul>
      </Section>

      <Section title="7. Liability Disclaimer">
        <p>
          LearnDrive is a technology marketplace. We are{" "}
          <strong>not liable</strong> for:
        </p>
        <ul className="list-disc pl-5 mt-3 space-y-2">
          <li>Any accidents, injuries, or damage occurring during training sessions.</li>
          <li>Trainer misconduct, negligence, or misrepresentation.</li>
          <li>Failure of a Learner to pass an RTO driving test.</li>
          <li>Disputes between Learners and Trainers.</li>
        </ul>
        <p className="mt-3">
          Learners use this platform and book sessions entirely at their own
          risk. We strongly recommend verifying trainer credentials independently
          before commencing any session.
        </p>
      </Section>

      <Section title="8. User Conduct">
        <p>Users must not:</p>
        <ul className="list-disc pl-5 mt-3 space-y-2">
          <li>Provide false or misleading information during registration or booking.</li>
          <li>Harass, abuse, or threaten other users or trainers.</li>
          <li>Circumvent the platform by arranging direct payments to avoid fees.</li>
          <li>Post fake reviews or ratings.</li>
        </ul>
        <p className="mt-3">
          Violation of these rules may result in permanent account suspension.
        </p>
      </Section>

      <Section title="9. Intellectual Property">
        <p>
          All content on the LearnDrive platform — including logos, design,
          text, and software — is the property of LearnDrive and is protected
          under applicable Indian intellectual property laws. Unauthorised use
          is prohibited.
        </p>
      </Section>

      <Section title="10. Governing Law & Disputes">
        <p>
          These Terms are governed by the laws of India. Any disputes arising
          from use of the platform shall be subject to the exclusive jurisdiction
          of courts in <strong>New Delhi, India</strong>.
        </p>
      </Section>

      <Section title="11. Changes to Terms">
        <p>
          LearnDrive reserves the right to update these Terms at any time.
          Continued use of the platform after changes constitutes acceptance of
          the new Terms. We will notify users of significant changes via email
          or a notice on the website.
        </p>
      </Section>

      <Section title="12. Contact Us">
        <p>
          For any questions about these Terms, contact us at:{" "}
          <a
            href="mailto:support@learndrive.in"
            className="text-blue-600 hover:underline"
          >
            support@learndrive.in
          </a>
        </p>
      </Section>

<div className="mt-10 pt-6 border-t text-sm text-gray-400 flex gap-4">
  <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
  <Link href="/refund" className="hover:underline">Refund Policy</Link>
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