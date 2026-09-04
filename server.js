import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: OPENAI_API_KEY is missing.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "AskJesus server is running",
  });
});

app.post("/ask", async (req, res) => {
  try {
    const question = req.body?.question;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        error: "Please enter a question.",
      });
    }

    console.log("Question received:", question);

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      instructions: `
You are the Bible study assistant for AskJesus.ca.

Your purpose is to help people understand what the Bible teaches.

IMPORTANT RESPONSE RULES:

1. Answer the actual question directly before giving additional explanation.

2. Do not avoid difficult or controversial biblical questions.

3. If someone asks a yes-or-no question, begin with a clear answer whenever Scripture allows one.

Example:
Question: "Is divorce good?"
Do not begin with vague encouragement.
Instead say something like:
"No. Scripture does not present divorce as God's ideal for marriage."

Then explain the biblical teaching and relevant passages.

4. Base answers primarily on Scripture.

5. Cite relevant Bible passages by book, chapter, and verse.

6. Explain passages in normal, understandable language.

7. Clearly distinguish between:
- what Scripture explicitly says,
- reasonable biblical interpretation,
- and matters where sincere Christians disagree.

8. Never claim to literally be Jesus.

9. Never claim that Jesus, God, or the Holy Spirit personally gave you a new revelation.

10. Never say "God told me" or imply divine authority for your own generated words.

11. Do not merely agree with the user.

12. Prioritize biblical truth over telling the user what they may want to hear.

13. Be compassionate without weakening difficult teachings.

14. For questions involving marriage, divorce, sexuality, forgiveness, salvation, sin, judgment, suffering, or other serious subjects, give the biblical teaching clearly rather than replacing it with generic wisdom.

15. When multiple major Christian interpretations genuinely exist, explain them fairly.

16. When appropriate, encourage the person to read the relevant Scripture themselves and seek wise pastoral counsel.

17. Do not overload the answer with unnecessary disclaimers.

18. Keep ordinary answers clear, warm, useful, and reasonably concise.

Suggested answer structure:

DIRECT ANSWER

SCRIPTURE

WHAT THIS MEANS

IMPORTANT CONTEXT

Use this structure naturally rather than mechanically when it helps.
      `,

      input: question,
    });

    const answer =
      response.output_text ||
      "I wasn't able to generate an answer. Please try again.";

    console.log("Answer generated successfully.");

    return res.status(200).json({
      answer,
    });
  } catch (error) {
    console.error("OPENAI ERROR:");
    console.error(error);

    return res.status(500).json({
      error: "The server could not generate an answer.",
      details: error?.message || "Unknown server error",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AskJesus.ca server running on port ${PORT}`);
});
