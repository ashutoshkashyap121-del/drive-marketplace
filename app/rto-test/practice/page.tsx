"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { questions, topicMeta, type Topic, getQuestionsByTopic } from "@/lib/rto-questions";

type Screen = "home" | "quiz" | "result";

export default function PracticePage() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [quizQuestions, setQuizQuestions] = useState(questions.slice(0, 5));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [stickyDismissed, setStickyDismissed] = useState(false);

  const startTopic = useCallback((topic: Topic) => {
    const topicQs = getQuestionsByTopic(topic);
    const shuffled = [...topicQs].sort(() => Math.random() - 0.5).slice(0, 5);
    setActiveTopic(topic);
    setQuizQuestions(shuffled);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers([]);
    setScreen("quiz");
  }, []);

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === quizQuestions[currentIdx].correct) {
      setScore((s) => s + 1);
    }
    setAnswers((prev) => [...prev, idx]);
  };

  const nextQuestion = () => {
    if (currentIdx + 1 >= quizQuestions.length) {
      setScreen("result");
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const topics = Object.entries(topicMeta) as [Topic, typeof topicMeta[Topic]][];
  const currentQ = quizQuestions[currentIdx];
  const progress = ((currentIdx + (selectedAnswer !== null ? 1 : 0)) / quizQuestions.length) * 100;

  // Show inline CTA after Q5 is answered (last question answered)
  const showInlineCTA = screen === "quiz" && currentIdx === quizQuestions.length - 1 && selectedAnswer !== null;

  return (
    <main style={{ minHeight: "100vh", background: "#f0f4ff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .jk { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .topic-card { background: white; border-radius: 14px; padding: 24px; border: 2px solid #e2e8f0; cursor: pointer; transition: all 0.2s; }
        .topic-card:hover { border-color: #1d4ed8; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(29,78,216,0.15); }
        .option-btn { width: 100%; text-align: left; padding: 16px 20px; border-radius: 12px; border: 2px solid #e2e8f0; background: white; cursor: pointer; transition: all 0.15s; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 500; color: #1e293b; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; }
        .option-btn:hover:not(:disabled) { border-color: #1d4ed8; background: #eff6ff; }
        .option-btn.correct { border-color: #16a34a; background: #f0fdf4; color: #166534; }
        .option-btn.wrong { border-color: #dc2626; background: #fef2f2; color: #991b1b; }
        .option-btn.missed { border-color: #16a34a; background: #f0fdf4; color: #166534; opacity: 0.7; }
        .progress-bar { height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(to right, #1d4ed8, #7c3aed); border-radius: 3px; transition: width 0.4s ease; }
        .explanation-box { background: #f8fafc; border-left: 4px solid #1d4ed8; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-top: 16px; }
        .sticky-cta { position: fixed; top: 60px; left: 0; right: 0; z-index: 100; background: linear-gradient(90deg, #0f172a 0%, #1e1b4b 100%); border-bottom: 2px solid rgba(245,158,11,0.4); padding: 10px 20px; display: flex; align-items: center; justify-content: center; gap: 16px; animation: slideDown 0.3s ease; }
        @keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .sticky-cta-btn { background: linear-gradient(135deg, #b45309, #dc2626); color: white; padding: 8px 20px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif; white-space: nowrap; transition: opacity 0.2s; }
        .sticky-cta-btn:hover { opacity: 0.9; }
        .inline-cta { background: linear-gradient(135deg, #0f172a, #1e1b4b); border-radius: 14px; padding: 22px 24px; margin: 20px 0; border: 1px solid rgba(245,158,11,0.3); display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ── STICKY BAR ── */}
      {!stickyDismissed && (
        <div className="sticky-cta">
          <p className="jk" style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>
            🎯 <strong style={{ color: "white" }}>30-question timed mock test</strong> — just like the real RTO exam
          </p>
          <Link href="/rto-test/mock" className="sticky-cta-btn">
            Unlock for ₹49 →
          </Link>
          <button onClick={() => setStickyDismissed(true)}
            style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 4px", flexShrink: 0 }}>
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <header style={{ background: "#0f172a", padding: "0 24px", marginTop: stickyDismissed ? 0 : 44 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span className="jk" style={{ color: "white", fontSize: 18, fontWeight: 800 }}>LearnDrive</span>
          </Link>
          <Link href="/rto-test" className="jk" style={{ color: "#94a3b8", fontSize: 14, textDecoration: "none" }}>← Back to RTO Test</Link>
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>

        {/* HOME SCREEN */}
        {screen === "home" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="jk" style={{ display: "inline-block", background: "#dbeafe", color: "#1d4ed8", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}>Free Practice Mode</span>
              <h1 className="jk" style={{ fontSize: 38, fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", marginBottom: 12 }}>Choose a Topic to Practice</h1>
              <p className="jk" style={{ fontSize: 16, color: "#64748b" }}>5 questions per topic • Instant explanations • Unlimited retries</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {topics.map(([topicKey, meta]) => {
                const count = getQuestionsByTopic(topicKey).length;
                return (
                  <button key={topicKey} onClick={() => startTopic(topicKey)} className="topic-card jk"
                    style={{ all: "unset", display: "block", background: "white", borderRadius: 14, padding: 24, border: "2px solid #e2e8f0", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = meta.color; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${meta.color}30`; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontSize: 36, marginBottom: 12 }}>{meta.icon}</div>
                      <span className="jk" style={{ background: "#f1f5f9", color: "#64748b", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{count} Qs</span>
                    </div>
                    <h3 className="jk" style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{meta.label}</h3>
                    <p className="jk" style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{meta.description}</p>
                    <div className="jk" style={{ marginTop: 16, color: meta.color, fontWeight: 700, fontSize: 14 }}>Practice 5 Questions →</div>
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 32, textAlign: "center", padding: 24, background: "linear-gradient(135deg, #0f172a, #1e1b4b)", borderRadius: 16 }}>
              <p className="jk" style={{ color: "#94a3b8", fontSize: 15, marginBottom: 16 }}>
                Want the full <strong style={{ color: "white" }}>30-question timed mock test</strong> — just like the real RTO exam?
              </p>
              <Link href="/rto-test/mock" className="jk" style={{ background: "linear-gradient(135deg, #b45309, #dc2626)", color: "white", padding: "12px 28px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                Unlock Full Mock Test — ₹49 →
              </Link>
            </div>
          </>
        )}

        {/* QUIZ SCREEN */}
        {screen === "quiz" && currentQ && (
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            {/* Progress */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span className="jk" style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>
                  {activeTopic && topicMeta[activeTopic].icon} {activeTopic && topicMeta[activeTopic].label}
                </span>
                <span className="jk" style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                  {currentIdx + 1} / {quizQuestions.length}
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Question Card */}
            <div style={{ background: "white", borderRadius: 16, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", marginBottom: 20 }}>
              <span className="jk" style={{
                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "1px",
                textTransform: "uppercase", marginBottom: 16, display: "inline-block",
                background: currentQ.difficulty === "easy" ? "#dcfce7" : currentQ.difficulty === "medium" ? "#fef3c7" : "#fee2e2",
                color: currentQ.difficulty === "easy" ? "#166534" : currentQ.difficulty === "medium" ? "#92400e" : "#991b1b",
              }}>
                {currentQ.difficulty}
              </span>

              {currentQ.image && (
                <div style={{ fontSize: 64, textAlign: "center", marginBottom: 20, padding: "20px", background: "#f8fafc", borderRadius: 12 }}>
                  {currentQ.image}
                </div>
              )}

              <h2 className="jk" style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", lineHeight: 1.4, marginBottom: 24 }}>
                {currentQ.question}
              </h2>

              {currentQ.options.map((option, idx) => {
                let className = "option-btn";
                if (selectedAnswer !== null) {
                  if (idx === currentQ.correct) className += " correct";
                  else if (idx === selectedAnswer && idx !== currentQ.correct) className += " wrong";
                }
                return (
                  <button key={idx} onClick={() => handleAnswer(idx)} disabled={selectedAnswer !== null} className={className}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800, flexShrink: 0,
                      background: selectedAnswer === null ? "#f1f5f9" : idx === currentQ.correct ? "#dcfce7" : idx === selectedAnswer ? "#fee2e2" : "#f1f5f9",
                      color: selectedAnswer === null ? "#64748b" : idx === currentQ.correct ? "#16a34a" : idx === selectedAnswer ? "#dc2626" : "#64748b",
                    }}>
                      {selectedAnswer !== null && idx === currentQ.correct ? "✓" : selectedAnswer !== null && idx === selectedAnswer && idx !== currentQ.correct ? "✗" : ["A", "B", "C", "D"][idx]}
                    </span>
                    {option}
                  </button>
                );
              })}

              {showExplanation && (
                <div className="explanation-box">
                  <p className="jk" style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    💡 Explanation
                  </p>
                  <p className="jk" style={{ fontSize: 14, color: "#334155", lineHeight: 1.6 }}>
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* ── INLINE CTA after last question ── */}
            {showInlineCTA && (
              <div className="inline-cta">
                <div>
                  <p className="jk" style={{ color: "white", fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>
                    🎯 You've done 5 practice questions!
                  </p>
                  <p className="jk" style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>
                    The real RTO exam has 30 questions. Try the full timed mock test.
                  </p>
                </div>
                <Link href="/rto-test/mock" className="jk"
                  style={{ background: "linear-gradient(135deg, #b45309, #dc2626)", color: "white", padding: "11px 22px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", flexShrink: 0 }}>
                  Unlock Mock — ₹49 →
                </Link>
              </div>
            )}

            {/* Next Button */}
            {selectedAnswer !== null && (
              <button onClick={nextQuestion} className="jk" style={{
                width: "100%", padding: "16px", background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
                color: "white", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                {currentIdx + 1 >= quizQuestions.length ? "See Results →" : "Next Question →"}
              </button>
            )}
          </div>
        )}

        {/* RESULT SCREEN */}
        {screen === "result" && (
          <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
            <div style={{ background: "white", borderRadius: 20, padding: 40, boxShadow: "0 8px 40px rgba(0,0,0,0.1)", marginBottom: 24 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>
                {score >= 4 ? "🏆" : score >= 3 ? "👍" : "📚"}
              </div>
              <h2 className="jk" style={{ fontSize: 32, fontWeight: 900, color: "#0f172a", marginBottom: 8 }}>
                {score}/{quizQuestions.length} Correct
              </h2>
              <p className="jk" style={{ fontSize: 16, color: "#64748b", marginBottom: 24 }}>
                {score >= 4 ? "Excellent! You're well prepared for this topic." : score >= 3 ? "Good effort! A bit more practice and you'll ace it." : "Keep practicing — review the explanations and try again."}
              </p>

              <div style={{ background: "#f1f5f9", borderRadius: 20, height: 12, marginBottom: 32 }}>
                <div style={{ height: 12, borderRadius: 20, background: score >= 4 ? "#16a34a" : score >= 3 ? "#f59e0b" : "#dc2626", width: `${(score / quizQuestions.length) * 100}%`, transition: "width 0.8s ease" }} />
              </div>

              <div style={{ textAlign: "left", marginBottom: 28 }}>
                {quizQuestions.map((q, i) => (
                  <div key={q.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>{answers[i] === q.correct ? "✅" : "❌"}</span>
                    <div>
                      <p className="jk" style={{ fontSize: 13, color: "#1e293b", fontWeight: 500 }}>{q.question}</p>
                      {answers[i] !== q.correct && (
                        <p className="jk" style={{ fontSize: 12, color: "#16a34a", marginTop: 2 }}>Correct: {q.options[q.correct]}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                <button onClick={() => activeTopic && startTopic(activeTopic)} className="jk"
                  style={{ padding: "12px 24px", background: "#1d4ed8", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Try Again
                </button>
                <button onClick={() => setScreen("home")} className="jk"
                  style={{ padding: "12px 24px", background: "#f1f5f9", color: "#0f172a", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Choose Topic
                </button>
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)", borderRadius: 16, padding: 28 }}>
              <p className="jk" style={{ color: "white", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Ready for the full 30-question exam simulation?</p>
              <p className="jk" style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>Timed, scored, with a full performance report</p>
              <Link href="/rto-test/mock" className="jk"
                style={{ background: "linear-gradient(135deg, #b45309, #dc2626)", color: "white", padding: "12px 28px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                Unlock Full Mock Test — ₹49 →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}