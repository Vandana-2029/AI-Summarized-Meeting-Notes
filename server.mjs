

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import fetch from "node-fetch";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(express.static(path.join(__dirname, "public")));

// --- Healthcheck
app.get("/health", (_, res) => res.json({ ok: true }));

// --- AI Summarization route
app.post("/api/summarize", async (req, res) => {
  try {
    const { transcript = "", prompt = "Summarize the notes with key bullets and action items." } = req.body || {};
    if (!transcript.trim()) return res.status(400).json({ error: "Transcript is required" });

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const system = `You write crisp, structured summaries of meeting transcripts. Always include sections if applicable: Executive Summary, Key Decisions, Action Items (who/what/when), Risks/Dependencies, Next Steps. Keep it concise.`;

    const user = `Custom instruction: ${prompt}\n\nTranscript:\n${transcript}`;

    const chat = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      temperature: 0.3,
      max_tokens: 1200
    });

    const summary = chat.choices?.[0]?.message?.content?.trim() || "";
    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Summarization failed" });
  }
});

// --- Email sending route (Resend)
app.post("/api/send-email", async (req, res) => {
  try {
    const { to = [], subject = "Meeting Summary", html = "" } = req.body || {};
    if (!Array.isArray(to) || to.length === 0) return res.status(400).json({ error: "Recipient emails required" });
    if (!process.env.RESEND_API_KEY) return res.status(400).json({ error: "Missing RESEND_API_KEY" });

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || "noreply@example.com",
        to,
        subject,
        html
      })
    });

    if (!resp.ok) {
      const t = await resp.text();
      return res.status(500).json({ error: "Email failed", details: t });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email failed" });
  }
});

// --- Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`▶ Server running on http://localhost:${PORT}`));

