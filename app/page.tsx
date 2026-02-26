import type { Metadata } from "next";
import HomePage from "./HomeClient";

export const metadata: Metadata = {
  title: "Book Verified Driving Trainers Near You — LearnDrive",
  description:
    "Find RTO-verified car & bike driving trainers in Delhi NCR, Mumbai & Bangalore. Trainer comes to your home. Book in 60 seconds. Pay via UPI or EMI.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LearnDrive — Book Verified Driving Trainers Near You",
    description:
      "RTO-verified car & bike trainers. Home pickup. Delhi NCR, Mumbai & Bangalore. Book in 60 seconds.",
    url: "/",
  },
};

export default function Page() {
  return <HomePage />;
}