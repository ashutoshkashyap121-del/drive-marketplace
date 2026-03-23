import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Driving Licence Check — DL Validity & Status India | LearnDrive",
  description:
    "Check your driving licence validity, expiry date and authorised vehicle classes instantly. Free DL status check from the official government Sarathi database.",
  keywords:
    "driving licence check India, DL validity check, driving licence status, DL expiry date check, driving licence number check online, sarathi DL check free",
  alternates: { canonical: "https://learndrive.in/dl-check" },
  openGraph: {
    title: "Free Driving Licence Check — DL Validity India | LearnDrive",
    description: "Check your DL validity, expiry and vehicle classes instantly. Free tool by LearnDrive.",
    url: "https://learndrive.in/dl-check",
    siteName: "LearnDrive",
  },
};

export default function DLCheckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
