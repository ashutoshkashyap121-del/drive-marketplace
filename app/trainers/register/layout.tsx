import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register as a Driving Trainer | LearnDrive",
  description:
    "Join LearnDrive as a verified driving instructor. Reach learners across your city and grow your training business.",
  alternates: { canonical: "/trainers/register" },
  openGraph: {
    title: "Register as a Driving Trainer | LearnDrive",
    description: "Join LearnDrive and connect with learners in your city.",
    url: "https://drive-marketplace.vercel.app/trainers/register",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}