import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Driving Licence Expiry Date India | DL Validity Check 2025",
  description:
    "How to check your driving licence expiry date in India — Parivahan, DigiLocker, mParivahan app. What to do if your DL is expiring or expired.",
  keywords: [
    "driving licence expiry check India",
    "DL validity check",
    "check DL expiry date",
    "driving licence expired India",
    "Sarathi Parivahan DL check",
  ],
};

const steps = [
  {
    number: "01",
    title: "Go to Sarathi Parivahan",
    desc: "Visit sarathi.parivahan.gov.in — the official Government of India driving licence portal.",
    action: "Open Sarathi Parivahan",
    url: "https://sarathi.parivahan.gov.in/sarathiservice/stateSelection.do",
  },
  {
    number: "02",
    title: "Select Your State",
    desc: "Choose the state where your driving licence was originally issued — not your current state if you've moved.",
    action: null,
    url: null,
  },
  {
    number: "03",
    title: "Click 'DL Status'",
    desc: "On the state portal, find 'Driving Licence Related Services' → 'DL Status' or 'Know Your DL Details'.",
    action: null,
    url: null,
  },
  {
    number: "04",
    title: "Enter DL Number + DOB",
    desc: "Enter your 16-digit DL number (format: KA0120150001234) and your date of birth.",
    action: null,
    url: null,
  },
  {
    number: "05",
    title: "View Expiry Date",
    desc: "Your DL details appear including validity, vehicle classes, and issuing RTO. Note the expiry date.",
    action: null,
    url: null,
  },
];

const alternatives = [
  {
    icon: "📱",
    title: "mParivahan App",
    desc: "Download the official mParivahan app → My DL section shows your validity and all endorsements instantly.",
    tag: "Easiest",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: "🗂️",
    title: "DigiLocker",
    desc: "Link your Aadhaar on DigiLocker → your DL appears as an official document with full details including expiry.",
    tag: "Official",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    icon: "🏛️",
    title: "Visit Your RTO",
    desc: "Walk into the RTO that issued your licence with your Aadhaar — they can look up your DL record instantly.",
    tag: "Offline",
    tagColor: "bg-gray-100 text-gray-600",
  },
];

const scenarios = [
  {
    icon: "✅",
    title: "Valid for 6+ months",
    bg: "bg-emerald-50 border-emerald-100",
    titleColor: "text-emerald-700",
    action: "No action needed. Set a calendar reminder 60 days before expiry.",
    cta: null,
  },
  {
    icon: "⏳",
    title: "Expiring within 30–60 days",
    bg: "bg-amber-50 border-amber-100",
    titleColor: "text-amber-700",
    action: "Start renewal process now. Online renewal takes 7–21 days for the new DL card to arrive.",
    cta: { label: "Read Renewal Guide →", href: "/blog/driving-licence-renewal-india-2025" },
  },
  {
    icon: "⚠️",
    title: "Expired within last 5 years",
    bg: "bg-orange-50 border-orange-100",
    titleColor: "text-orange-700",
    action: "You can still renew but with a ₹1,000 penalty. Apply on Parivahan immediately.",
    cta: { label: "Read Renewal Guide →", href: "/blog/driving-licence-renewal-india-2025" },
  },
  {
    icon: "🚨",
    title: "Expired more than 5 years ago",
    bg: "bg-red-50 border-red-100",
    titleColor: "text-red-700",
    action: "In most states you must apply for a fresh DL — treated as a new applicant. Contact your RTO.",
    cta: { label: "Find Your RTO →", href: "/rto-finder" },
  },
  {
    icon: "❓",
    title: "Lost your DL and don't know expiry",
    bg: "bg-gray-50 border-gray-100",
    titleColor: "text-gray-700",
    action: "Log into Parivahan with Aadhaar — your DL record shows even without the physical card.",
    cta: { label: "How to Get Duplicate DL →", href: "/blog/lost-driving-licence-duplicate-dl-india" },
  },
];

const faqs = [
  {
    q: "How long is an Indian driving licence valid?",
    a: "A driving licence is valid for 20 years from the date of issue, or until you turn 50 — whichever comes first. After 50, you renew every 5 years.",
  },
  {
    q: "Can I drive after my DL expires?",
    a: "You have a 30-day grace period after expiry. After that, driving is illegal and carries a fine of ₹5,000. Your insurance may also refuse to cover accidents during this period.",
  },
  {
    q: "Is the digital DL on mParivahan valid?",
    a: "Yes. The Supreme Court and MoRTH have confirmed that digital documents on mParivahan and DigiLocker are legally valid for traffic police checks.",
  },
  {
    q: "Can I renew my DL online?",
    a: "Yes — visit parivahan.gov.in, select your state, and apply under 'Renewal of Driving Licence'. Most states process fully online; some require one RTO visit for biometric verification.",
  },
  {
    q: "What if I moved states — where do I renew?",
    a: "You can renew at your current state's RTO by submitting an address change along with the renewal application. Both are processed together.",
  },
  {
    q: "Does DL expiry affect my car insurance?",
    a: "Yes. Driving with an expired licence can void your motor insurance claim. Insurers can reject claims on grounds of unlicensed driving.",
  },
];

export default function DLExpiryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-sm font-medium mb-6">
            🏛️ Official Govt. Portal Guide
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            How to Check Your<br />
            <span className="text-yellow-300">Driving Licence Expiry</span>
          </h1>
          <p className="text-blue-100 mt-4 text-lg max-w-xl mx-auto">
            Step-by-step guide to check DL validity on Parivahan, mParivahan app, and DigiLocker — plus what to do if it's expiring.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a
              href="https://sarathi.parivahan.gov.in/sarathiservice/stateSelection.do"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors"
            >
              Check DL on Parivahan →
            </a>
            <Link
              href="/blog/driving-licence-renewal-india-2025"
              className="bg-white/10 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              DL Renewal Guide
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Quick warning banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-12 flex gap-4">
          <span className="text-3xl flex-shrink-0">⚡</span>
          <div>
            <p className="font-bold text-amber-800">Don't wait until it expires</p>
            <p className="text-amber-700 text-sm mt-1">
              DL renewal takes 7–30 days to arrive by post. Start the process 60 days before expiry. Driving with an expired licence risks a ₹5,000 fine and insurance rejection.
            </p>
          </div>
        </div>

        {/* Step by step */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check DL Expiry on Parivahan (Step by Step)
          </h2>
          <p className="text-gray-500 mb-8">The official government method — works for all Indian driving licences</p>

          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-5 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-700 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{step.title}</p>
                  <p className="text-gray-500 text-sm mt-1">{step.desc}</p>
                  {step.action && step.url && (
                    <a
                      href={step.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-blue-600 font-semibold text-sm hover:text-blue-700"
                    >
                      {step.action} ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Alternatives */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">3 Other Ways to Check</h2>
          <p className="text-gray-500 mb-8">Faster alternatives to the Parivahan website</p>
          <div className="grid md:grid-cols-3 gap-4">
            {alternatives.map((alt) => (
              <div key={alt.title} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{alt.icon}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${alt.tagColor}`}>
                    {alt.tag}
                  </span>
                </div>
                <p className="font-bold text-gray-900">{alt.title}</p>
                <p className="text-gray-500 text-sm mt-2">{alt.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What to do based on status */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What To Do Based on Your Status</h2>
          <p className="text-gray-500 mb-8">Find your situation below</p>
          <div className="space-y-3">
            {scenarios.map((s) => (
              <div key={s.title} className={`border rounded-2xl p-5 ${s.bg}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{s.icon}</span>
                  <div className="flex-1">
                    <p className={`font-bold ${s.titleColor}`}>{s.title}</p>
                    <p className="text-gray-600 text-sm mt-1">{s.action}</p>
                    {s.cta && (
                      <Link
                        href={s.cta.href}
                        className="inline-flex items-center mt-3 text-blue-600 font-semibold text-sm hover:text-blue-700"
                      >
                        {s.cta.label}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="border border-gray-100 rounded-2xl p-5">
                <p className="font-semibold text-gray-900">{faq.q}</p>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related links */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related Guides</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: "DL Renewal Guide 2025", href: "/blog/driving-licence-renewal-india-2025" },
              { label: "Lost DL — Get Duplicate", href: "/blog/lost-driving-licence-duplicate-dl-india" },
              { label: "Complete RTO Documents Checklist", href: "/blog/rto-documents-complete-checklist-2025" },
              { label: "How to Book RTO Slot Online", href: "/blog/how-to-book-rto-slot-online-india" },
              { label: "Find RTO Office Near You", href: "/rto-finder" },
              { label: "Free RTO Practice Test", href: "/rto-test/practice" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 font-medium text-sm hover:bg-blue-50 hover:border-blue-100 hover:text-blue-700 transition-colors"
              >
                <span className="text-blue-400">→</span>
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-8 text-white text-center">
          <p className="text-2xl font-bold">Ready to get your licence?</p>
          <p className="text-orange-100 mt-2">
            Find a certified driving trainer near you and book your first session today
          </p>
          <Link
            href="/trainers"
            className="mt-5 inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors"
          >
            Browse Trainers →
          </Link>
        </div>
      </div>
    </div>
  );
}