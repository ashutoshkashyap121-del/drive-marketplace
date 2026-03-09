import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://learndrive.in";
const META_PIXEL_ID = "1255996423299564";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

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

  twitter: {
    card: "summary_large_image",
    title: "LearnDrive — Book Verified Driving Trainers Near You",
    description:
      "RTO-verified car & bike trainers in Delhi NCR, Mumbai & Bangalore. Trainer comes to your home. Book in 60 seconds.",
    images: ["/og-image.png"],
  },

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

  alternates: {
    canonical: BASE_URL,
  },
};

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
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Meta Pixel — base code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}