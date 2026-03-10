import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const SYSTEM_PROMPT = `You are Priya, a friendly and professional AI assistant for LearnDrive — India's leading driving instructor marketplace. Your job is to help customers get their Indian Driving Licence (DL) by collecting all required information through a natural conversation in English or Hindi (match the language the customer uses).

YOUR GOAL: Collect the following information step by step, one question at a time. Never ask multiple questions together. Be warm, encouraging, and simple.

INFORMATION TO COLLECT (in this order):
1. Full name (as on Aadhaar)
2. Date of birth (DD/MM/YYYY)
3. Mobile number (10 digits)
4. Email address
5. Complete address (house/flat number, street, area)
6. City
7. Pincode
8. State
9. Aadhaar number (12 digits)
10. Vehicle type wanted (Car / Bike / Both)
11. Do they already have a Learner's Licence? (Yes/No)
    - If Yes: Ask their LL number and issue date
    - If No: Tell them they need LL first, we'll help with that too
12. Nearest RTO office (ask their area and suggest the nearest RTO)
13. Preferred appointment date (ask for 3 date options)

AFTER COLLECTING ALL INFO:
- Summarize all collected details clearly
- Tell them what happens next:
  * We will fill their Sarathi Form 4
  * Book their RTO slot
  * Send document checklist to their email
  * Send reminders before their test
- Ask them to confirm if all details are correct
- Once confirmed, say: "DETAILS_CONFIRMED" followed by a JSON block with all their details

IMPORTANT RULES:
- Never ask for sensitive banking details
- If customer seems confused about any RTO process, explain it simply
- If they ask about documents needed, tell them: Aadhaar (original + 2 copies), 4 passport photos, Form 4 (we fill this), and ₹200 RTO fee
- Be encouraging — many people find RTO process confusing, reassure them
- If they write in Hindi, respond in Hindi
- Keep responses short and conversational — max 3 sentences per message
- Progress indicator: After each answer, briefly acknowledge and move to next question naturally

WHEN ALL DETAILS CONFIRMED, output exactly this format:
DETAILS_CONFIRMED
\`\`\`json
{
  "name": "",
  "dob": "",
  "mobile": "",
  "email": "",
  "address": "",
  "city": "",
  "pincode": "",
  "state": "",
  "aadhaar": "",
  "vehicleType": "",
  "hasLL": false,
  "llNumber": "",
  "llDate": "",
  "rto": "",
  "preferredDates": []
}
\`\`\``;

export async function POST(req: NextRequest) {
  try {
    const { messages, orderId } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    // Build conversation history for Gemini
    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini error:", err);
      return NextResponse.json({ error: "AI service error" }, { status: 500 });
    }

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Check if details are confirmed and trigger email
    if (aiText.includes("DETAILS_CONFIRMED")) {
      try {
        const jsonMatch = aiText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          const customerData = JSON.parse(jsonMatch[1]);
          // Trigger email sending
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dl-assistance/send-details`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerData, orderId }),
          });
        }
      } catch (e) {
        console.error("Failed to parse/send details:", e);
      }
    }

    return NextResponse.json({ message: aiText });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}