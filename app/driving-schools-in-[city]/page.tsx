// DEBUG VERSION — no Prisma, just confirms routing works
// If this page loads, we add the DB query back

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ city: string }>;
}

export default async function CityLandingPage({ params }: Props) {
  const { city } = await params;

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>✅ Page is working!</h1>
      <p>City: <strong>{city}</strong></p>
      <p>URL matched correctly.</p>
      <a href="/">← Home</a>
    </div>
  );
}