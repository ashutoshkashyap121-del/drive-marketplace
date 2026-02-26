import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://drive-marketplace.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // ── Default title (overridden per page) ────────────────────────────────────
  title: {
    default: "LearnDrive — Book Verified Driving Trainers Near You",
    template: "%s | LearnDrive",
  },

  description:
    "Book RTO-verified driving trainers in Delhi NCR, Mumbai & Bangalore. Car & bike training at home. Pay via UPI or EMI. Background-checked instructors. Book in 60 seconds.",

  keywords: [
    "driving lessons near me",
    "driving trainer Delhi",
    "car driving classes Mumbai",
    "bike training Bangalore",
    "RTO verified driving instructor",
    "driving school at home",
    "learn driving online booking",
    "driving lessons India",
    "car driving trainer near me",
    "bike riding classes",
  ],

  authors: [{ name: "LearnDrive", url: BASE_URL }],
  creator: "LearnDrive",
  publisher: "LearnDrive",

  // ── Open Graph (WhatsApp, Facebook previews) ───────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "LearnDrive",
    title: "LearnDrive — Book Verified Driving Trainers Near You",
    description:
      "RTO-verified car & bike trainers in Delhi NCR, Mumbai & Bangalore. Trainer comes to your home. Book in 60 seconds via UPI or EMI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LearnDrive — Book Verified Driving Trainers",
      },
    ],
  },

  // ── Twitter / X card ───────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "LearnDrive — Book Verified Driving Trainers Near You",
    description:
      "RTO-verified car & bike trainers in Delhi NCR, Mumbai & Bangalore. Trainer comes to your home. Book in 60 seconds.",
    images: ["/og-image.png"],
  },

  // ── Robots ─────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Canonical ──────────────────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
  },

  // ── Verification (add Google Search Console verify code here later) ─────────
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

// ── Structured Data (JSON-LD) for Google rich results ─────────────────────────
const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "LearnDrive",
  description:
    "Book RTO-verified driving trainers in Delhi NCR, Mumbai & Bangalore. Car & bike training at home.",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  image: `${BASE_URL}/og-image.png`,
  priceRange: "₹₹",
  areaServed: [
    { "@type": "City", name: "Delhi NCR" },
    { "@type": "City", name: "Mumbai" },
    { "@type": "City", name: "Bangalore" },
  ],
  serviceType: ["Car Driving Lessons", "Bike Riding Lessons", "Driving Training"],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "10000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}