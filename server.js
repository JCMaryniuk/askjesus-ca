import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


/* =========================================================
   HELPERS
========================================================= */

function getChapterReference(reference) {
  if (!reference || typeof reference !== "string") {
    return "";
  }

  const match = reference.match(/^(.+?)\s+(\d+)(?::.*)?$/);

  if (!match) {
    return reference.trim();
  }

  return `${match[1].trim()} ${match[2]}`;
}


/* =========================================================
   ASK SCRIPTURE
========================================================= */

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: "Please enter a question.",
      });
    }

    const response = await openai.responses.create({
      /*
        Fast, lower-cost model.
      */
      model: "gpt-5.6-luna",

      /*
        This task is mostly passage selection + JSON formatting.
        Turning reasoning off helps reduce latency.
      */
      reasoning: {
        effort: "none",
      },

      text: {
        verbosity: "low",
      },

      instructions: `
You are the Scripture passage finder for AskJesus.ca.

Your job is ONLY to return Bible passages relevant to the user's question.
Do not give commentary, interpretation, advice, conclusions, doctrine, or a yes/no answer.
Let Scripture speak for itself.

Return 4 to 5 of the strongest, most direct passages.

IMPORTANT:
- Preserve the user's wording in the title.
- If the user says wife, use wife.
- If the user says husband, use husband.
- If the user says spouse, use spouse.
- Do not replace wife or husband with partner unless the user used partner.
- Prefer direct passages over loosely related passages.
- Keep displayed passage text concise.
- Do not quote an entire long chapter.
- Do not fabricate Bible text.

For EACH passage return:
- reference: the specific verse or short passage shown on the page.
- text: the text of that specific reference only.
- contextReference: the smallest meaningful surrounding paragraph or thought-unit that helps the reader understand the reference.
- chapterReference: book and chapter only.

CONTEXT RULES:
- Usually contextReference should be about 3 to 8 verses.
- It must include the displayed reference.
- Do not use the whole chapter unless the entire chapter is genuinely the necessary context.
- Prefer a natural paragraph, teaching unit, or immediate thought.
- It is okay to use more than 8 verses when a complete paragraph or teaching unit requires it.

Examples:
- Proverbs 19:14 -> contextReference "Proverbs 19:13-15", chapterReference "Proverbs 19"
- Proverbs 12:4 -> contextReference "Proverbs 12:2-5", chapterReference "Proverbs 12"
- 2 Corinthians 6:14 -> contextReference "2 Corinthians 6:14-18", chapterReference "2 Corinthians 6"
- Galatians 5:22-23 -> contextReference "Galatians 5:16-26", chapterReference "Galatians 5"

Return VALID JSON ONLY in exactly this shape:

{
  "title": "What Scripture Says About [topic]",
  "categories": ["Category 1", "Category 2"],
  "passages": [
    {
      "reference": "Bible reference",
      "text": "Bible passage text",
      "contextReference": "Surrounding passage reference",
      "chapterReference": "Book and chapter"
    }
  ]
}

Categories:
- Return 1 to 3 short categories.

Do not include markdown.
Do not include code fences.
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

    if (!Array.isArray(result.categories)) {
      result.categories = [];
    }

    result.categories = result.categories
      .filter((category) => typeof category === "string")
      .slice(0, 3);

    result.passages = result.passages
      .filter(
        (passage) =>
          passage &&
          typeof passage.reference === "string" &&
          typeof passage.text === "string"
      )
      .slice(0, 5)
      .map((passage) => {
        const reference = passage.reference.trim();

        const contextReference =
          typeof passage.contextReference === "string" &&
          passage.contextReference.trim()
            ? passage.contextReference.trim()
            : reference;

        const chapterReference =
          typeof passage.chapterReference === "string" &&
          passage.chapterReference.trim()
            ? passage.chapterReference.trim()
            : getChapterReference(reference);

        return {
          reference,
          text: passage.text.trim(),
          contextReference,
          chapterReference,
        };
      });

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


/* =========================================================
   START SERVER
========================================================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`AskJesus.ca server running on port ${PORT}`);
});
