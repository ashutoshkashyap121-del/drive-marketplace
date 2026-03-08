"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { getMockTestQuestions, topicMeta, type Topic, type Question } from "@/lib/rto-questions";

type Screen = "quiz" | "result";

const MOCK_DURATION = 30 * 60; // 30 minutes

export default function MockTestClient() {
  const [screen, setScreen] = useState<Screen>("quiz");
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MOCK_DURATION);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialise questions once
  useEffect(() => {
    const qs = getMockTestQuestions(30);
    setQuizQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
  }, []);

  // Timer
  useEffect(() => {
    if (screen === "quiz" && quizQuestions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setScreen("result");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [screen, quizQuestions.length]);

  const retake = useCallback(() => {
    const qs = getMockTestQuestions(30);
    setQuizQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimeLeft(MOCK_DURATION);
    setScreen("quiz");
  }, []);

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    const newAnswers = [...answers];
    newAnswers[currentIdx] = idx;
    setAnswers(newAnswers);
  };

  const goTo = (i: number) => {
    setCurrentIdx(i);
    setSelectedAnswer(answers[i]);
    setShowExplanation(answers[i] !== null);
  };

  const nextQuestion = () => {
    if (currentIdx + 1 >= quizQuestions.length) {
      clearInterval(timerRef.current!);
      setScreen("result");
    } else {
      goTo(currentIdx + 1);
    }
  };

  const submitTest = () => {
    clearInterval(timerRef.current!);
    setScreen("result");
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Results
  const score = answers.filter((a, i) => a === quizQuestions[i]?.correct).length;
  const answeredCount = answers.filter((a) => a !== null).length;
  const percentage = quizQuestions.length ? Math.round((score / quizQuestions.length) * 100) : 0;
  const passed = percentage >= 60;

  const topicScores = Object.keys(topicMeta).reduce((acc, topic) => {
    const topicQs = quizQuestions.filter((q) => q.topic === topic);
    const correct = topicQs.filter((q) => answers[quizQuestions.indexOf(q)] === q.correct).length;
    acc[topic] = { total: topicQs.length, correct };
    return acc;
  }, {} as Record<string, { total: number; correct: number }>);

  if (quizQuestions.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <p style={{ color: "#64748b", fontSize: 16 }}>Loading questions...</p>
      </div>
    );
  }

  const q = quizQuestions[currentIdx];

  return (
    <main style={{ minHeight: "100vh", background: "#f0f4ff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .jk { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .option-btn { width: 100%; text-align: left; padding: 14px 18px; border-radius: 10px; border: 2px solid #e2e8f0; background: white; cursor: pointer; transition: all 0.15s; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 500; color: #1e293b; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
        .option-btn:hover:not(:disabled) { border-color: #1d4ed8; background: #eff6ff; }
        .option-btn.correct { border-color: #16a34a !important; background: #f0fdf4 !important; color: #166534 !important; }
        .option-btn.wrong { border-color: #dc2626 !important; background: #fef2f2 !important; color: #991b1b !important; }
        .q-nav-btn { width: 36px; height: 36px; border-radius: 8px; border: 2px solid #e2e8f0; background: white; cursor: pointer; font-weight: 700; font-size: 13px; transition: all 0.15s; font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; }
        .q-nav-btn.answered { background: #1d4ed8; border-color: #1d4ed8; color: white; }
        .q-nav-btn.current { background: #7c3aed; border-color: #7c3aed; color: white; }
      `}</style>

      {/* Header */}
      <header style={{ background: "#0f172a", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span className="jk" style={{ color: "white", fontSize: 18, fontWeight: 800 }}>LearnDrive</span>
          </Link>
          {screen === "quiz" && (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span className="jk" style={{ color: "#94a3b8", fontSize: 13 }}>{answeredCount}/{quizQuestions.length} answered</span>
              <span className="jk" style={{
                background: timeLeft < 300 ? "#dc2626" : "#1d4ed8",
                color: "white", padding: "6px 16px", borderRadius: 8,
                fontWeight: 800, fontSize: 18, fontVariantNumeric: "tabular-nums",
                transition: "background 0.3s",
              }}>
                ⏱ {formatTime(timeLeft)}
              </span>
            </div>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "32px 24px" }}>

        {/* QUIZ */}
        {screen === "quiz" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 24, alignItems: "start" }}>
            {/* Main */}
            <div>
              {/* Question nav grid */}
              <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                {quizQuestions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`q-nav-btn ${i === currentIdx ? "current" : answers[i] !== null ? "answered" : ""}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {/* Question card */}
              <div style={{ background: "white", borderRadius: 16, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span className="jk" style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>
                    {topicMeta[q.topic]?.icon} {topicMeta[q.topic]?.label}
                  </span>
                  <span className="jk" style={{
                    fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                    background: q.difficulty === "easy" ? "#dcfce7" : q.difficulty === "medium" ? "#fef3c7" : "#fee2e2",
                    color: q.difficulty === "easy" ? "#166534" : q.difficulty === "medium" ? "#92400e" : "#991b1b",
                  }}>
                    {q.difficulty}
                  </span>
                </div>

                {q.image && (
                  <div style={{ fontSize: 64, textAlign: "center", marginBottom: 20, padding: 16, background: "#f8fafc", borderRadius: 12 }}>
                    {q.image}
                  </div>
                )}

                <h2 className="jk" style={{ fontSize: 19, fontWeight: 700, color: "#0f172a", lineHeight: 1.5, marginBottom: 24 }}>
                  Q{currentIdx + 1}. {q.question}
                </h2>

                {q.options.map((option, idx) => {
                  let className = "option-btn";
                  if (selectedAnswer !== null) {
                    if (idx === q.correct) className += " correct";
                    else if (idx === selectedAnswer && idx !== q.correct) className += " wrong";
                  }
                  return (
                    <button key={idx} onClick={() => handleAnswer(idx)} disabled={selectedAnswer !== null} className={className}>
                      <span style={{
                        width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 800, flexShrink: 0,
                        background: selectedAnswer === null ? "#f1f5f9" : idx === q.correct ? "#dcfce7" : idx === selectedAnswer ? "#fee2e2" : "#f1f5f9",
                        color: selectedAnswer === null ? "#64748b" : idx === q.correct ? "#16a34a" : idx === selectedAnswer ? "#dc2626" : "#64748b",
                      }}>
                        {selectedAnswer !== null && idx === q.correct ? "✓" :
                         selectedAnswer !== null && idx === selectedAnswer && idx !== q.correct ? "✗" :
                         ["A", "B", "C", "D"][idx]}
                      </span>
                      {option}
                    </button>
                  );
                })}

                {showExplanation && (
                  <div style={{ background: "#f8fafc", borderLeft: "4px solid #1d4ed8", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginTop: 16 }}>
                    <p className="jk" style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>💡 Explanation</p>
                    <p className="jk" style={{ fontSize: 13, color: "#334155", lineHeight: 1.6 }}>{q.explanation}</p>
                  </div>
                )}
              </div>

              {/* Nav buttons */}
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => goTo(currentIdx - 1)} disabled={currentIdx === 0} className="jk"
                  style={{ flex: 1, padding: "12px", background: "#f1f5f9", border: "none", borderRadius: 10, fontWeight: 700, cursor: currentIdx === 0 ? "not-allowed" : "pointer", opacity: currentIdx === 0 ? 0.4 : 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  ← Prev
                </button>
                {currentIdx + 1 < quizQuestions.length ? (
                  <button onClick={nextQuestion} className="jk"
                    style={{ flex: 2, padding: "12px", background: "#1d4ed8", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Next →
                  </button>
                ) : (
                  <button onClick={submitTest} className="jk"
                    style={{ flex: 2, padding: "12px", background: "#16a34a", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Submit Test ✓
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ position: "sticky", top: 24 }}>
              <div style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 12 }}>
                <div className="jk" style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>Progress</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1, textAlign: "center", padding: "10px 8px", background: "#eff6ff", borderRadius: 8 }}>
                    <div className="jk" style={{ fontSize: 20, fontWeight: 900, color: "#1d4ed8" }}>{answeredCount}</div>
                    <div className="jk" style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>Done</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "center", padding: "10px 8px", background: "#fef3c7", borderRadius: 8 }}>
                    <div className="jk" style={{ fontSize: 20, fontWeight: 900, color: "#b45309" }}>{quizQuestions.length - answeredCount}</div>
                    <div className="jk" style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>Left</div>
                  </div>
                </div>
              </div>
              <button onClick={submitTest} className="jk"
                style={{ width: "100%", padding: "12px", background: "#dc2626", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Submit Early
              </button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {screen === "result" && (
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {/* Score banner */}
            <div style={{ background: passed ? "linear-gradient(135deg, #0f172a, #052e16)" : "linear-gradient(135deg, #0f172a, #450a0a)", borderRadius: 20, padding: 40, textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 64, marginBottom: 12 }}>{passed ? "🎉" : "📚"}</div>
              <div className="jk" style={{ fontSize: 64, fontWeight: 900, color: "white", lineHeight: 1 }}>
                {score}<span style={{ fontSize: 32, color: "#94a3b8" }}>/{quizQuestions.length}</span>
              </div>
              <div className="jk" style={{ fontSize: 22, fontWeight: 800, color: passed ? "#4ade80" : "#f87171", marginTop: 8, marginBottom: 4 }}>
                {passed ? "PASSED ✓" : "FAILED — Keep Practicing"}
              </div>
              <div className="jk" style={{ color: "#94a3b8", fontSize: 15 }}>
                {percentage}% · {passed ? "Above 60% passing threshold" : "Need 18/30 to pass"}
              </div>
            </div>

            {/* Topic breakdown */}
            <div style={{ background: "white", borderRadius: 16, padding: 28, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <h3 className="jk" style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>Topic-wise Breakdown</h3>
              {Object.entries(topicScores).filter(([, v]) => v.total > 0).map(([topic, { total, correct }]) => {
                const meta = topicMeta[topic as Topic];
                const pct = Math.round((correct / total) * 100);
                return (
                  <div key={topic} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span className="jk" style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{meta?.icon} {meta?.label}</span>
                      <span className="jk" style={{ fontSize: 13, fontWeight: 700, color: pct >= 60 ? "#16a34a" : "#dc2626" }}>{correct}/{total} — {pct}%</span>
                    </div>
                    <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: pct >= 60 ? "#16a34a" : "#dc2626", borderRadius: 4, transition: "width 0.8s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
              <button onClick={retake} className="jk" style={{ flex: 1, padding: "14px", background: "#1d4ed8", color: "white", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Retake Test →
              </button>
              <Link href="/rto-test/practice" className="jk" style={{ flex: 1, padding: "14px", background: "#f1f5f9", color: "#0f172a", borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: "none", textAlign: "center", display: "block" }}>
                Practice Weak Topics
              </Link>
            </div>

            <div style={{ textAlign: "center" }}>
              <Link href="/trainers" className="jk" style={{ color: "#1d4ed8", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
                Ready for the road? Book a certified trainer →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}