import { cookies } from "next/headers";
import { verifyAccessToken } from "@/app/api/rto-test/verify/route";
import MockTestClient from "./MockTestClient";
import MockTestPaywall from "./MockTestPaywall";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RTO Full Mock Test — LearnDrive",
  description: "30-question timed RTO mock test. All 6 topics. Score report with topic-wise breakdown.",
};

export default async function MockTestPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("rto_access")?.value;
  const isAuthorized = token ? verifyAccessToken(token) : false;

  if (!isAuthorized) {
    return <MockTestPaywall />;
  }

  return <MockTestClient />;
}