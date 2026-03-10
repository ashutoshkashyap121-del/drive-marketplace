"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
}

const WELCOME_MESSAGE = `Namaste! 🙏 I'm Priya, your personal DL Assistant from LearnDrive.

I'll help you get your Driving Licence without any RTO confusion. The whole process takes about 5 minutes — I'll ask you a few questions and handle everything else for you.

Let's start! What is your full name as it appears on your Aadhaar card?`;

function getTime() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ msg }: { msg: Message }) {
  const isAI = msg.role === "assistant";
  return (
    <div style={{
      display: "flex",
      flexDirection: isAI ? "row" : "row-reverse",
      gap: 10,
      marginBottom: 16,
      alignItems: "flex-end",
    }}>
      {isAI && (
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, flexShrink: 0, boxShadow: "0 2px 8px rgba(245,158,11,0.3)",
        }}>🤖</div>
      )}
      <div style={{ maxWidth: "75%" }}>
        <div style={{
          background: isAI ? "white" : "linear-gradient(135deg, #1a2540, #2d3f6b)",
          color: isAI ? "#1a2540" : "white",
          borderRadius: isAI ? "4px 18px 18px 18px" : "18px 4px 18px 18px",
          padding: "12px 16px",
          fontSize: 14,
          lineHeight: 1.7,
          boxShadow: isAI ? "0 2px 12px rgba(0,0,0,0.08)" : "0 2px 12px rgba(26,37,64,0.3)",
          whiteSpace: "pre-wrap",
          fontFamily: "system-ui",
          border: isAI ? "1px solid #f1f5f9" : "none",
        }}>
          {msg.content.replace(/DETAILS_CONFIRMED[\s\S]*/, "✅ All details confirmed! Sending your document checklist and booking your RTO slot now. Check your email in the next few minutes.")}
        </div>
        <div style={{
          fontSize: 11, color: "#94a3b8", marginTop: 4,
          textAlign: isAI ? "left" : "right",
          fontFamily: "system-ui",
        }}>{msg.time}</div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 16 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "linear-gradient(135deg, #f59e0b, #d97706)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
      }}>🤖</div>
      <div style={{
        background: "white", borderRadius: "4px 18px 18px 18px",
        padding: "14px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        border: "1px solid #f1f5f9", display: "flex", gap: 4, alignItems: "center",
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%", background: "#f59e0b",
            animation: "bounce 1.2s infinite",
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

export default function DLAssistanceChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME_MESSAGE, time: getTime() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderId(params.get("order") || "DL" + Date.now());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading || done) return;

    const userMsg: Message = { role: "user", content: text, time: getTime() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/dl-assistance/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          orderId,
        }),
      });

      const data = await res.json();
      const aiMsg: Message = {
        role: "assistant",
        content: data.message || "Sorry, something went wrong. Please try again.",
        time: getTime(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      if (data.message?.includes("DETAILS_CONFIRMED")) {
        setDone(true);
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Sorry, I had a connection issue. Please try again.",
        time: getTime(),
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const progress = Math.min(Math.round((messages.filter(m => m.role === "user").length / 13) * 100), 100);

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>

      <div style={{
        height: "100dvh", display: "flex", flexDirection: "column",
        background: "#f0f4f8", fontFamily: "system-ui",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #1a2540 0%, #2d3f6b 100%)",
          padding: "12px 16px", flexShrink: 0,
          boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
        }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13 }}>← Home</Link>
                <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.2)" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%",
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                  }}>🤖</div>
                  <div>
                    <div style={{ color: "white", fontWeight: 700, fontSize: 15 }}>Priya — DL Assistant</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                      <span style={{ color: "#94a3b8", fontSize: 12 }}>Online · Powered by AI</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700 }}>LEARNDRIVE</div>
                <div style={{ color: "#64748b", fontSize: 11 }}>DL Assistance ₹499</div>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#94a3b8", fontSize: 11 }}>Application progress</span>
                <span style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700 }}>{progress}%</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 4, height: 4, overflow: "hidden" }}>
                <div style={{
                  width: `${progress}%`, height: "100%",
                  background: "linear-gradient(90deg, #f59e0b, #fcd34d)",
                  borderRadius: 4, transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "20px 16px",
          maxWidth: 700, width: "100%", margin: "0 auto", alignSelf: "stretch",
        }}>
          {/* Info banner */}
          <div style={{
            background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 20,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>🔒</span>
            <span style={{ fontSize: 12, color: "#92400e" }}>
              Your information is encrypted and only used to process your DL application.
            </span>
          </div>

          {messages.map((msg, i) => (
            <div key={i} style={{ animation: "fadeIn 0.3s ease" }}>
              <MessageBubble msg={msg} />
            </div>
          ))}

          {loading && <TypingIndicator />}

          {done && (
            <div style={{
              background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
              border: "1px solid #86efac", borderRadius: 16, padding: 20,
              textAlign: "center", margin: "16px 0", animation: "fadeIn 0.3s ease",
            }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
              <div style={{ fontWeight: 800, color: "#166534", fontSize: 16, marginBottom: 4 }}>
                Application Complete!
              </div>
              <div style={{ color: "#166534", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                Check your email for your document checklist and next steps. We'll also send you reminders before your RTO appointment.
              </div>
              <a href="https://wa.me/918700896528"
                style={{
                  display: "inline-block", background: "#25d366", color: "white",
                  padding: "10px 20px", borderRadius: 10, fontWeight: 700,
                  fontSize: 13, textDecoration: "none",
                }}>
                💬 Questions? WhatsApp Us
              </a>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        {!done && (
          <div style={{
            background: "white", borderTop: "1px solid #e2e8f0",
            padding: "12px 16px", flexShrink: 0,
            boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
          }}>
            <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", gap: 10 }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type your answer here..."
                disabled={loading}
                style={{
                  flex: 1, padding: "12px 16px", borderRadius: 12,
                  border: "1.5px solid #e2e8f0", fontSize: 14,
                  outline: "none", color: "#1a2540",
                  background: loading ? "#f8fafc" : "white",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#f59e0b"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  background: loading || !input.trim()
                    ? "#e2e8f0"
                    : "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: loading || !input.trim() ? "#94a3b8" : "#1a2540",
                  border: "none", borderRadius: 12, width: 48, height: 48,
                  fontSize: 20, cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s", flexShrink: 0,
                  boxShadow: loading || !input.trim() ? "none" : "0 2px 8px rgba(245,158,11,0.4)",
                }}
              >
                {loading ? "⏳" : "➤"}
              </button>
            </div>
            <div style={{ maxWidth: 700, margin: "8px auto 0", textAlign: "center", fontSize: 11, color: "#94a3b8" }}>
              Press Enter to send · Supports English and Hindi
            </div>
          </div>
        )}
      </div>
    </>
  );
}