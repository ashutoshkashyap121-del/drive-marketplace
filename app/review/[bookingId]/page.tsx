"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ReviewPage() {
  const { bookingId } = useParams();
  const searchParams = useSearchParams();
  const trainerName = searchParams.get("trainer") || "your trainer";

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  useEffect(() => {
    // Check if already reviewed
    fetch(`/api/reviews?bookingId=${bookingId}`)
      .then(r => r.json())
      .then(d => { if (d.exists) setAlreadyReviewed(true); })
      .catch(() => {});
  }, [bookingId]);

  const handleSubmit = async () => {
    if (rating === 0) { setError("Please select a star rating"); return; }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to submit"); setSubmitting(false); return; }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const labels = ["", "Poor", "Below average", "Good", "Very good", "Excellent!"];
  const colors = ["", "#EF4444", "#F97316", "#EAB308", "#22C55E", "#16A34A"];

  if (alreadyReviewed) return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4", padding: 20 }}>
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
          Already Reviewed
        </h1>
        <p style={{ color: "#64748B", marginBottom: 24 }}>You've already submitted a review for this session. Thank you!</p>
        <Link href="/" style={{ color: "#F59E0B", fontWeight: 700 }}>Back to LearnDrive →</Link>
      </div>
    </main>
  );

  if (submitted) return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4", padding: 20 }}>
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🙏</div>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 10 }}>
          Thank You!
        </h1>
        <p style={{ color: "#64748B", lineHeight: 1.6, marginBottom: 24 }}>
          Your review helps other learners find great trainers. We appreciate your feedback!
        </p>
        {rating >= 4 && (
          <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <p style={{ fontWeight: 700, color: "#92400E", marginBottom: 8 }}>Enjoying LearnDrive?</p>
            <p style={{ fontSize: 13, color: "#92400E", marginBottom: 12 }}>Help a friend get their driving licence too</p>
            <a
              href={`https://wa.me/?text=${encodeURIComponent("I just booked a driving lesson on LearnDrive — really easy to use. Check it out: https://learndrive.in")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block", background: "#25D366", color: "white", padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}
            >
              Share on WhatsApp →
            </a>
          </div>
        )}
        <Link href="/" style={{ color: "#F59E0B", fontWeight: 700, fontSize: 14 }}>Back to Home</Link>
      </div>
    </main>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
            How was your session?
          </h1>
          <p style={{ color: "#64748B", fontSize: 15 }}>
            Rate your experience with <strong>{trainerName}</strong>
          </p>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: 24, border: "1px solid #E2E8F0", padding: 28 }}>
          {/* Star rating */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 10 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  style={{
                    fontSize: 40,
                    cursor: "pointer",
                    border: "none",
                    background: "none",
                    padding: 4,
                    opacity: star <= (hover || rating) ? 1 : 0.3,
                    transform: star <= (hover || rating) ? "scale(1.1)" : "scale(1)",
                    transition: "all 0.1s",
                    filter: star <= (hover || rating) ? "none" : "grayscale(1)",
                  }}
                >
                  ⭐
                </button>
              ))}
            </div>
            {(hover || rating) > 0 && (
              <p style={{ fontWeight: 700, fontSize: 16, color: colors[hover || rating] }}>
                {labels[hover || rating]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>
              Tell us more <span style={{ color: "#CBD5E1", fontWeight: 400, textTransform: "none" }}>(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={rating >= 4 ? "What did you love about the session?" : rating > 0 ? "What could have been better?" : "Share your experience..."}
              rows={3}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #E2E8F0",
                borderRadius: 12,
                fontSize: 14,
                fontFamily: "inherit",
                color: "#0F172A",
                background: "#F8FAFC",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#F59E0B")}
              onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
            />
          </div>

          {error && (
            <p style={{ color: "#EF4444", fontSize: 13, marginBottom: 12 }}>⚠ {error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            style={{
              width: "100%",
              padding: "14px",
              background: rating === 0 ? "#E2E8F0" : "linear-gradient(135deg, #F59E0B, #D97706)",
              color: rating === 0 ? "#94A3B8" : "#fff",
              fontFamily: "'Sora', sans-serif",
              fontSize: "1rem",
              fontWeight: 700,
              border: "none",
              borderRadius: 12,
              cursor: rating === 0 ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {submitting ? "Submitting..." : "Submit Review →"}
          </button>
        </div>

        <p style={{ color: "#94A3B8", fontSize: 12, textAlign: "center", marginTop: 16 }}>
          Your review helps other learners choose great trainers
        </p>
      </div>
    </main>
  );
}