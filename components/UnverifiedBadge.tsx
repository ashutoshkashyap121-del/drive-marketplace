// components/UnverifiedBadge.tsx
// Drop this on any scraped trainer card or profile page

export default function UnverifiedBadge() {
  return (
    <div style={{
      display:        "inline-flex",
      alignItems:     "center",
      gap:            6,
      background:     "#FFF7ED",
      border:         "1px solid #FED7AA",
      borderRadius:   100,
      padding:        "4px 10px",
      fontSize:       "0.72rem",
      fontWeight:     600,
      color:          "#C2410C",
    }}>
      <span style={{ fontSize: "0.8rem" }}>⏳</span>
      Listing not yet verified by LearnDrive
    </div>
  );
}

// Disclaimer block — use on trainer profile page for unverified schools
export function UnverifiedDisclaimer({ trainerName }: { trainerName: string }) {
  return (
    <div style={{
      background:   "#FFF7ED",
      border:       "1px solid #FED7AA",
      borderRadius: 14,
      padding:      "14px 16px",
      marginBottom: 16,
      fontSize:     "0.82rem",
      color:        "#92400E",
      lineHeight:   1.7,
    }}>
      <strong>⚠️ Unverified Listing:</strong> {trainerName} has not yet registered directly
      with LearnDrive. Pricing is estimated based on public information. Your booking will be
      confirmed within 2 hours or <strong>fully refunded automatically</strong>.{" "}
      <a href="/remove-listing" style={{ color: "#C2410C", fontWeight: 700 }}>
        Are you this school? Remove listing →
      </a>
    </div>
  );
}