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


// --------------------------------------------------
// FULL CHAPTER FALLBACK
// --------------------------------------------------

function getChapterReference(reference) {
  if (!reference || typeof reference !== "string") {
    return "";
  }

  const match =
    reference.match(/^(.+?)\s+(\d+)(?::.*)?$/);

  if (!match) {
    return reference.trim();
  }

  return `${match[1].trim()} ${match[2]}`;
}


// --------------------------------------------------
// ASK SCRIPTURE
// --------------------------------------------------

app.post("/ask", async (req, res) => {
  try {
    const {
      question,
      more = false,
      excludeReferences = []
    } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: "Please enter a question.",
      });
    }

    const excluded = Array.isArray(excludeReferences)
      ? excludeReferences
          .filter((reference) =>
            typeof reference === "string"
          )
          .slice(0, 30)
      : [];

    const extraInstructions = more
      ? `
THIS IS A "FIND MORE SCRIPTURE" REQUEST.

The user has already been shown these references:
${excluded.length ? excluded.join(", ") : "None"}

Return 4 to 5 ADDITIONAL strong Scripture passages
that are relevant to the SAME original question.

IMPORTANT:
- Do NOT repeat any reference already shown.
- Do NOT return a passage that substantially duplicates
  the same verses already shown.
- Prefer genuinely useful additional passages.
- If there are not 4 strong additional passages,
  return only the strong ones that remain.
- Set "hasMore" to false if you believe there are no
  other important direct passages worth showing after these.
`
      : `
THIS IS THE FIRST SEARCH.

Return 4 to 5 of the strongest and most direct passages first.

Set "hasMore" to true when other meaningful relevant passages
could still be shown if the user asks for more.
`;

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      reasoning: {
        effort: "none",
      },

      text: {
        verbosity: "low",
      },

      instructions: `
You are the Scripture passage finder for AskJesus.ca.

Your job is ONLY to return Bible passages relevant to the user's question.

Do not give:
- commentary
- interpretation
- advice
- conclusions
- denominational doctrine
- a yes/no answer on behalf of Scripture

Let Scripture speak for itself.

GENERAL RULES:

- Preserve the user's important terminology.
- If the user says wife, use wife.
- If the user says husband, use husband.
- If the user says spouse, use spouse.
- Do not replace wife or husband with "partner"
  unless the user actually used the word partner.
- Prefer direct passages over loosely related passages.
- Keep displayed passage text concise.
- Do not quote an entire long chapter.
- Do not fabricate Bible verses.
- If unsure of exact wording, do not pretend certainty.

FOR EACH PASSAGE RETURN:

1. "reference"
   The specific verse or short passage shown on the page.

2. "text"
   The text of that specific reference.

3. "contextReference"
   The smallest meaningful surrounding paragraph or thought-unit
   that helps the reader understand the reference.

4. "chapterReference"
   The book and chapter only.

CONTEXT RULES:

- Usually contextReference should be about 3 to 8 verses.
- It must include the displayed reference.
- Do not automatically use the whole chapter.
- Prefer a natural paragraph, conversation, teaching unit,
  or immediate thought.
- It may be longer than 8 verses when the complete thought
  genuinely requires it.

EXAMPLES:

Proverbs 19:14
contextReference: "Proverbs 19:13-15"
chapterReference: "Proverbs 19"

Proverbs 12:4
contextReference: "Proverbs 12:2-5"
chapterReference: "Proverbs 12"

2 Corinthians 6:14
contextReference: "2 Corinthians 6:14-18"
chapterReference: "2 Corinthians 6"

Galatians 5:22-23
contextReference: "Galatians 5:16-26"
chapterReference: "Galatians 5"

${extraInstructions}

RETURN VALID JSON ONLY.

Use exactly this structure:

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
  ],
  "hasMore": true
}

RULES FOR TITLE:

- Make it short and neutral.
- Preserve the user's terminology.
- Do not put a conclusion in the title.

CATEGORIES:

- Return 1 to 3 short categories.

Do not use Markdown.
Do not use code fences.
`,

      input: question.trim(),
    });

    const rawText = response.output_text;

    if (!rawText) {
      throw new Error(
        "OpenAI returned an empty response."
      );
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
      console.error(
        "Could not parse AI response:",
        rawText
      );

      return res.status(500).json({
        error:
          "The Scripture results could not be formatted correctly.",
      });
    }

    if (
      !result ||
      !Array.isArray(result.passages)
    ) {
      console.error(
        "Unexpected response structure:",
        result
      );

      return res.status(500).json({
        error:
          "The Scripture results were incomplete.",
      });
    }

    if (!result.title) {
      result.title = "What Scripture Says";
    }

    if (!Array.isArray(result.categories)) {
      result.categories = [];
    }

    result.categories = result.categories
      .filter((category) =>
        typeof category === "string"
      )
      .slice(0, 3);

    const normalizedExcluded =
      excluded.map((reference) =>
        reference.toLowerCase().trim()
      );

    result.passages = result.passages
      .filter(
        (passage) =>
          passage &&
          typeof passage.reference === "string" &&
          typeof passage.text === "string"
      )
      .filter((passage) => {
        const normalized =
          passage.reference
            .toLowerCase()
            .trim();

        return !normalizedExcluded.includes(
          normalized
        );
      })
      .slice(0, 5)
      .map((passage) => {
        const reference =
          passage.reference.trim();

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

    if (
      result.passages.length === 0 &&
      !more
    ) {
      return res.status(500).json({
        error:
          "No Scripture passages were returned.",
      });
    }

    res.json({
      title: result.title,
      categories: result.categories,
      passages: result.passages,
      hasMore:
        result.hasMore !== false &&
        result.passages.length > 0,
    });

  } catch (error) {
    console.error(
      "ASK ERROR:",
      error
    );

    res.status(500).json({
      error:
        "Something went wrong while finding Scripture.",
    });
  }
});


const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `AskJesus.ca server running on port ${PORT}`
  );
});
