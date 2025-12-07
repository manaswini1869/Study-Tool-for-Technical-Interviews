import express from "express";
import Question from "../models/Question.js";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper: call OpenAI and return structured JSON
async function generateAnswer(prompt) {
  const systemPrompt = `
You are a study assistant for technical interviews.

Always respond in STRICT JSON with this shape (no extra text):

{
  "explanation": "string",
  "steps": ["step 1", "step 2"],
  "codeExample": "string (code in a single language)",
  "diagram": "string (ASCII or markdown-style visual, optional but nice)",
  "quiz": {
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "correctIndex": 0,
    "explanation": "string"
  }
}
  `.trim();

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.4,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Explain this technical interview concept or problem:\n\n${prompt}\n\nFollow the JSON format exactly.`
      }
    ]
  });

  const raw = completion.choices[0].message.content || "{}";

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse JSON from OpenAI:", err);
    // Fallback simple shape
    parsed = {
      explanation: raw,
      steps: [],
      codeExample: "",
      diagram: "",
      quiz: {
        question: "What was the key idea of the explanation?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctIndex: 0,
        explanation: "Review the explanation text again."
      }
    };
  }

  return parsed;
}

// POST /api/questions  -> generate & store
router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const answer = await generateAnswer(prompt);

    const questionDoc = await Question.create({ prompt, answer });

    res.status(201).json(questionDoc);
  } catch (err) {
    console.error("Error generating answer:", err);
    res.status(500).json({ error: "Failed to generate answer" });
  }
});

// GET /api/questions -> list latest questions
router.get("/", async (_req, res) => {
  try {
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(questions);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

export default router;
