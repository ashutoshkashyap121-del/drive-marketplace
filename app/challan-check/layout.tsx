import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Traffic Challan Check — Check Pending Fines Online | LearnDrive",
  description:
    "Check pending traffic challans for any vehicle number instantly. Free e-challan check from the official Parivahan portal. Know your fines before you drive.",
  keywords:
    "traffic challan check, e-challan check online, pending challan vehicle number, check challan by vehicle number, traffic fine check india, parivahan challan check free",
  alternates: { canonical: "https://learndrive.in/challan-check" },
  openGraph: {
    title: "Free Traffic Challan Check India | LearnDrive",
    description: "Check pending traffic challans for any vehicle number. Free tool by LearnDrive.",
    url: "https://learndrive.in/challan-check",
    siteName: "LearnDrive",
  },
};

export default function ChallanCheckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
