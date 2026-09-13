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
  res.json({
    status: "ok",
  });
});


/* =========================================================
   HELPER:
   CREATE FULL-CHAPTER REFERENCE IF MODEL MISSES IT
========================================================= */

function getChapterReference(reference) {
  if (!reference || typeof reference !== "string") {
    return "";
  }

  const match = reference.match(/^(.+?)\s+(\d+)(?::.*)?$/);

  if (!match) {
    return reference;
  }

  const book = match[1].trim();
  const chapter = match[2];

  return `${book} ${chapter}`;
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
        Faster, lower-cost GPT-5.6 model.
      */
      model: "gpt-5.6-luna",

      /*
        This task is structured Scripture retrieval,
        so we prioritize low latency over deeper reasoning.
      */
      reasoning: {
        effort: "none",
      },

      /*
        Keep non-essential wording concise.
      */
      text: {
        verbosity: "low",
      },

      instructions: `
You are a Scripture research assistant for AskJesus.ca.

Your ONLY purpose is to help people find Bible passages relevant to their question.

AskJesus.ca exists to point people back to Scripture and encourage them to read Bible passages in their proper context.

IMPORTANT PHILOSOPHY:

AskJesus.ca should allow Scripture to speak for itself.

Do NOT:

- Give a biblical summary.
- Give your own conclusion.
- Tell the user what they should believe.
- Interpret the verses for them.
- Explain how the verses fit together.
- Answer yes or no on behalf of Scripture.
- Add denominational doctrine.
- Favor one Christian tradition when sincere Christians disagree.
- Cherry-pick isolated verses when surrounding context changes or clarifies their meaning.
- Return an entire long chapter when a shorter directly relevant passage is sufficient.

Instead:

- Identify the Bible passages most directly relevant to the user's actual question.
- Prefer passages that directly address the subject.
- Return 4 to 6 of the strongest passages.
- Keep quoted passage text concise while preserving enough context to understand it.
- Prefer shorter directly relevant passages over very long sections.
- Include important passages from Jesus and the rest of Scripture when appropriate.
- When Scripture contains passages commonly considered together on a subject, include the major relevant passages rather than selecting only one side.
- Let the reader come to their own conclusion from Scripture.
- For EVERY result, identify the most useful surrounding paragraph or passage that should be read with the quoted verse.
- Also identify the chapter containing that passage.

CONTEXT RULE:

For every Scripture result, provide:

1. "reference"
   The verse or short passage being shown.

2. "contextReference"
   The surrounding paragraph, teaching section, conversation, or group of verses that gives the reference its proper context.

3. "chapterReference"
   The chapter containing the passage.

The contextReference should normally be more than a single verse.

Examples:

If the main reference is:

"2 Corinthians 6:14"

A useful contextReference could be:

"2 Corinthians 6:14-18"

And the chapterReference would be:

"2 Corinthians 6"


If the main reference is:

"Ephesians 5:25"

A useful contextReference could be:

"Ephesians 5:21-33"

And the chapterReference would be:

"Ephesians 5"


If the main reference is:

"Matthew 19:6"

A useful contextReference could be:

"Matthew 19:3-9"

And the chapterReference would be:

"Matthew 19"


IMPORTANT:

Choose the context range based on the actual literary or teaching context.

Do NOT mechanically add a fixed number of verses before and after.

For example, if Jesus is answering a question from verse 3 through verse 9, return that meaningful section rather than simply returning verses 4-8.


EXAMPLE QUESTION:

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

Allow the passages themselves to address the question.


OUTPUT FORMAT:

The output MUST be valid JSON only.

Do not use Markdown.

Do not use code fences.

Use exactly this structure:

{
  "title": "What Scripture Says About [topic]",
  "categories": [
    "Category 1",
    "Category 2"
  ],
  "passages": [
    {
      "reference": "Bible reference",
      "text": "Bible passage text",
      "contextReference": "Surrounding passage reference",
      "chapterReference": "Book and chapter"
    }
  ]
}


RULES FOR TITLE:

- Make it short and neutral.
- Use wording such as:
  "What Scripture Says About Divorce"
- Do not place a conclusion in the title.


RULES FOR CATEGORIES:

- Return 1 to 3 short categories.

Examples:

Marriage
Relationships
Wisdom
Salvation
Faith
Prayer
Sin
Forgiveness
Doctrine


RULES FOR PASSAGES:

- Return 4 to 6 of the strongest passages.
- Prefer direct passages over loosely related passages.
- Keep quoted text reasonably concise.
- Preserve enough context to avoid misleading isolated quotations.
- Use contextReference for the larger surrounding section instead of quoting that entire larger section in the result.
- Do not cherry-pick verses to force a conclusion.
- Do not write explanations underneath the verses.
- Do not add commentary.
- Do not add a conclusion after the verses.
- Do not fabricate Bible verses.
- If you are uncertain of the exact wording of a verse, do not pretend certainty.
- Every passage MUST include contextReference.
- Every passage MUST include chapterReference.


The purpose of AskJesus.ca is:

QUESTION
↓
RELEVANT SCRIPTURE
↓
READ THE PASSAGE IN CONTEXT
↓
READER STUDIES SCRIPTURE
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
      !result.title ||
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

    if (!Array.isArray(result.categories)) {
      result.categories = [];
    }

    result.passages = result.passages
      .filter(
        (passage) =>
          passage &&
          typeof passage.reference === "string" &&
          typeof passage.text === "string"
      )
      .slice(0, 6)
      .map((passage) => {
        const contextReference =
          typeof passage.contextReference === "string" &&
          passage.contextReference.trim()
            ? passage.contextReference.trim()
            : passage.reference.trim();

        const chapterReference =
          typeof passage.chapterReference === "string" &&
          passage.chapterReference.trim()
            ? passage.chapterReference.trim()
            : getChapterReference(
                passage.reference.trim()
              );

        return {
          reference:
            passage.reference.trim(),

          text:
            passage.text.trim(),

          contextReference,

          chapterReference,
        };
      });

    if (result.passages.length === 0) {
      return res.status(500).json({
        error:
          "No Scripture passages were returned.",
      });
    }

    res.json(result);

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


/* =========================================================
   START SERVER
========================================================= */

const PORT =
  process.env.PORT || 3000;

app.listen(
  PORT,
  () => {
    console.log(
      `AskJesus.ca server running on port ${PORT}`
    );
  }
);
