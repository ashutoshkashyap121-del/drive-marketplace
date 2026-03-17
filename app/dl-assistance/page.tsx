import type { Metadata } from "next";
import DLAssistancePage from "./client";
import { LIVE_CITY_COUNT } from "@/lib/live-coverage";

export const metadata: Metadata = {
  title: "Driving Licence Assistance Service India - Get DL Without RTO Confusion | LearnDrive",
  description: `Get your driving licence without the RTO confusion. Our AI fills your Sarathi form, books your RTO slot, sends document checklist and reminders. Just Rs499. Available in Delhi, Mumbai, Bangalore and ${LIVE_CITY_COUNT} cities.`,
  keywords: [
    "driving licence assistance india",
    "get driving licence online india",
    "RTO appointment booking service",
    "driving licence agent delhi",
    "sarathi application help",
    "driving licence apply online help",
    "RTO slot booking service india",
    "driving licence documents checklist",
    "how to get driving licence india",
    "driving licence without RTO visit",
  ],
  openGraph: {
    title: "Get Your Driving Licence Without RTO Confusion - Rs499 | LearnDrive",
    description: `AI fills your forms, books RTO slot, sends document checklist and reminders. 96% success rate. ${LIVE_CITY_COUNT} cities.`,
    url: "https://learndrive.in/dl-assistance",
    type: "website",
  },
  alternates: {
    canonical: "https://learndrive.in/dl-assistance",
  },
};

export default function Page() {
  return <DLAssistancePage />;
}
