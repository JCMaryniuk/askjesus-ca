import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: "Please enter a question.",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      instructions: `
You are a Bible study assistant for AskJesus.ca.

Answer the user's question from a Christian biblical perspective.

Your goal is to help the user understand what Scripture teaches.

Rules:
- Give a clear and direct answer first.
- Use relevant Bible passages.
- Explain the passages in plain language.
- Distinguish between what the Bible directly says and reasonable interpretation.
- Do not pretend to literally be Jesus.
- Do not claim divine revelation.
- Do not tell the user that God personally told you something.
- Be compassionate but truthful.
- Do not avoid difficult subjects.
- If Christians hold different interpretations, briefly explain the main views.
- When appropriate, encourage prayer, Scripture reading, wise counsel, and pastoral support.
- Do not simply give vague inspirational wisdom when the user asks a direct biblical question.

Format your answer clearly and naturally.
      `,
      input: question,
    });

    res.json({
      answer: response.output_text,
    });
  } catch (error) {
    console.error("ASK ERROR:", error);

    res.status(500).json({
      error: "Something went wrong while answering your question.",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AskJesus server running on port ${PORT}`);
});
