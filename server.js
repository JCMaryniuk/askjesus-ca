import express from "express";
import OpenAI from "openai";

const app = express();

app.use(express.json());
app.use(express.static("."));

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
You are a Scripture research assistant for AskJesus.ca.

Your ONLY purpose is to help people find Bible passages relevant to their question.

IMPORTANT PHILOSOPHY:
AskJesus.ca should allow Scripture to speak for itself.

Do NOT:
- Give a biblical summary.
- Give your own conclusion.
- Tell the user what they should believe.
- Interpret the verses for them.
- Explain how the verses fit together.
- Answer yes or no on behalf of Scripture.
- Give pastoral advice unless the user specifically asks for passages about comfort, prayer, encouragement, etc.
- Add denominational doctrine.
- favor one Christian tradition when sincere Christians disagree.

Instead:
- Identify the Bible passages most directly relevant to the user's question.
- Include enough surrounding verses to preserve context.
- Prefer passages that directly address the subject.
- Include important passages from both Jesus and the rest of Scripture when appropriate.
- When Scripture contains passages that are commonly considered together on a subject, include all major relevant passages rather than selecting only one side.
- Let the reader come to their own conclusion from Scripture.

For example:

If the user asks:
"Is divorce good?"

Do NOT answer:
"No, divorce is not God's ideal."

Instead return passages such as:
- Genesis 2:24
- Malachi 2:14-16
- Matthew 5:31-32
- Matthew 19:3-9
- Mark 10:2-12
- 1 Corinthians 7:10-16

The output must be valid JSON only.

Use exactly this structure:

{
  "title": "What Scripture Says About [topic]",
  "categories": ["Category 1", "Category 2"],
  "passages": [
    {
      "reference": "Bible reference",
      "text": "Bible passage text"
    }
  ]
}

RULES FOR TITLE:
- Make it short and neutral.
- Use wording such as "What Scripture Says About Divorce".
- Do not place a conclusion in the title.

RULES FOR CATEGORIES:
- Return 1 to 3 short categories.
- Examples: Marriage, Relationships, Wisdom, Salvation, Faith, Prayer, Sin, Forgiveness, Doctrine.

RULES FOR PASSAGES:
- Return approximately 4 to 8 of the strongest passages.
- Prefer direct passages over loosely related ones.
- Preserve context whenever possible.
- Do not cherry-pick verses to force a conclusion.
- Do not write explanations underneath the verses.
- Do not add commentary.
- Do not add a conclusion after the verses.
- Do not fabricate Bible verses.
- If you are uncertain of the exact wording of a verse, do not pretend certainty.

The purpose of the page is:
QUESTION -> RELEVANT SCRIPTURE -> READER STUDIES THE SCRIPTURE.
`,

      input: question.trim(),
    });

    const rawText = response.output_text;

    if (!rawText) {
      throw new Error("OpenAI returned an empty response.");
    }

    let result;

    try {
      let cleaned = rawText.trim();

      // Remove markdown code fences if the model adds them
      cleaned = cleaned
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "");

      result = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Could not parse AI response:", rawText);

      return res.status(500).json({
        error: "The Scripture results could not be formatted correctly.",
      });
    }

    // Basic validation
    if (
      !result ||
      !result.title ||
      !Array.isArray(result.passages)
    ) {
      console.error("Unexpected response structure:", result);

      return res.status(500).json({
        error: "The Scripture results were incomplete.",
      });
    }

    // Make sure categories always exists
    if (!Array.isArray(result.categories)) {
      result.categories = [];
    }

    // Remove any malformed passages
    result.passages = result.passages.filter(
      (passage) =>
        passage &&
        typeof passage.reference === "string" &&
        typeof passage.text === "string"
    );

    if (result.passages.length === 0) {
      return res.status(500).json({
        error: "No Scripture passages were returned.",
      });
    }

    res.json(result);
  } catch (error) {
    console.error("ASK ERROR:", error);

    res.status(500).json({
      error: "Something went wrong while finding Scripture.",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`AskJesus.ca server running on port ${PORT}`);
});
