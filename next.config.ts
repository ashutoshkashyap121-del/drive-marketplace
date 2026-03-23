import type { NextConfig } from "next";

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://checkout.razorpay.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://www.facebook.com https://*.googleusercontent.com https://maps.gstatic.com https://maps.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://connect.facebook.net https://graph.facebook.com https://api.postalpincode.in https://checkout.razorpay.com https://api.razorpay.com",
  "frame-src 'self' https://checkout.razorpay.com",
  "media-src 'self' data: blob:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "Access-Control-Allow-Origin", value: "https://learndrive.in" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites({
  source: "/driving-schools-in-:area((?!delhi$|mumbai$|bangalore$|hyderabad$|chennai$|pune$|kolkata$|jaipur$|ahmedabad$|surat$|lucknow$|chandigarh$|bhopal$|indore$|nagpur$|patna$|coimbatore$|kochi$|visakhapatnam$|noida$|gurgaon$|vadodara$|rajkot$|faridabad$).*)",
  destination: "/locality-schools/:area",
},) {
    return [
      {
        source: "/driving-schools-in-:city",
        destination: "/city-driving-schools/:city",
      },
      {
  source: "/driving-school-fees-in-:city",
  destination: "/city-fees/:city",
},
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/admin/:path*",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/api/admin/:path*",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },
};

export default nextConfig;
