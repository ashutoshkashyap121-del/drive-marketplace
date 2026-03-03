import type { Metadata } from "next";
import { Suspense } from "react";
import TrainersClient from "./TrainersClient";

export const metadata: Metadata = {
  title: "Browse Driving Trainers Near You",
  description:
    "Search verified car and bike driving trainers by city and pincode. RTO-verified and background checked instructors in Delhi NCR, Mumbai & Bangalore.",
  alternates: { canonical: "/trainers" },
  openGraph: {
    title: "Browse Driving Trainers — LearnDrive",
    description:
      "Find verified car & bike trainers near you. Filter by city, vehicle type & price.",
    url: "/trainers",
  },
};

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F8F7F4" }} />}>
      <TrainersClient />
    </Suspense>
  );
}