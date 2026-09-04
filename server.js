import express from "express";
import OpenAI from "openai";

const app = express();

app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    version: "SCRIPTURE-API-2",
  });
});

app.post("/api/scripture", async (req, res) => {
  try {
    const question = req.body?.question?.trim();

    if (!question) {
      return res.status(400).json({
        error: "Please enter a question.",
      });
    }

    console.log("SCRIPTURE QUESTION:", question);

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      instructions: `
You are the Scripture study engine for AskJesus.ca.

Your purpose is to help users understand what Scripture teaches.

IMPORTANT:

Answer the user's actual question directly.

Do not begin with vague encouragement when Scripture allows a clear answer.

For example:

If asked:
"Is divorce good?"

A good short answer begins clearly:

"No. Scripture does not present divorce as God's ideal for marriage."

Then explain the relevant passages and important biblical context.

Always distinguish between:

1. What Scripture explicitly teaches.
2. Biblical principles.
3. Reasonable interpretation.
4. Areas where sincere Christians disagree.

Do not pretend to be Jesus.

Do not claim that God personally gave you new revelation.

Do not say:
"God told me..."
"Jesus is telling you..."

Instead say:
"Scripture teaches..."
"Jesus says in..."
"A biblical principle is..."

Be compassionate without weakening biblical teaching.

Use Scripture in context.

Return ONLY valid JSON.

Do not use markdown code fences.
Do not write anything outside the JSON.

Return this structure:

{
  "topic": "Short study title",
  "shortAnswer": "Direct biblical answer to the user's question",
  "overview": "Brief explanation of how the passages fit together",
  "questionType": [
    "wisdom"
  ],
  "keyPrinciples": [
    "Biblical principle",
    "Biblical principle",
    "Biblical principle"
  ],
  "relatedReferences": [
    "Book 1:1",
    "Book 2:2"
  ],
  "safetyNote": "",
  "results": [
    {
      "reference": "Book chapter:verse",
      "text": "Scripture text",
      "translation": "World English Bible",
      "purpose": "Why this passage matters",
      "contextNote": "Short explanation of the passage in context",
      "relevanceLevel": "DIRECT",
      "chapterUrl": ""
    }
  ]
}

RULES FOR RESULTS:

Return 3 to 6 Bible passages.

At least one should directly address the user's question whenever possible.

relevanceLevel must be exactly one of:

DIRECT
FOUNDATIONAL
SUPPORTING

DIRECT:
The passage directly addresses the issue.

FOUNDATIONAL:
The passage establishes an important biblical principle.

SUPPORTING:
The passage gives relevant supporting wisdom.

Use World English Bible wording for quoted Scripture text.

Do not invent Bible verses.

Do not invent Bible references.

Prefer passages that genuinely address the user's situation.

Keep context notes concise and useful.

For questions involving immediate danger, abuse, self-harm, violence,
or emergencies, include an appropriate practical safety message in
"safetyNote".

Otherwise set "safetyNote" to an empty string.
      `,

      input: question,
    });

    const raw = response.output_text?.trim();

    if (!raw) {
      throw new Error("The AI returned an empty response.");
    }

    let data;

    try {
      data = JSON.parse(raw);
    } catch (error) {
      console.error("INVALID JSON FROM OPENAI:");
      console.error(raw);

      throw new Error(
        "The Scripture study response could not be read."
      );
    }

    if (!Array.isArray(data.results) || data.results.length === 0) {
      console.error("NO RESULTS RETURNED:");
      console.error(data);

      throw new Error(
        "No Scripture passages were generated."
      );
    }

    const results = data.results.map((result) => {
      const reference =
        result.reference || "Scripture";

      return {
        reference,

        text:
          result.text || "",

        translation:
          result.translation || "World English Bible",

        purpose:
          result.purpose || "Study Passage",

        contextNote:
          result.contextNote || "",

        relevanceLevel:
          ["DIRECT", "FOUNDATIONAL", "SUPPORTING"].includes(
            result.relevanceLevel
          )
            ? result.relevanceLevel
            : "SUPPORTING",

        chapterUrl:
          result.chapterUrl ||
          `https://www.biblegateway.com/passage/?search=${encodeURIComponent(
            reference
          )}`,
      };
    });

    return res.status(200).json({
      topic:
        data.topic || "Scripture Study",

      shortAnswer:
        data.shortAnswer || "",

      overview:
        data.overview || "",

      questionType:
        Array.isArray(data.questionType)
          ? data.questionType
          : [],

      keyPrinciples:
        Array.isArray(data.keyPrinciples)
          ? data.keyPrinciples
          : [],

      relatedReferences:
        Array.isArray(data.relatedReferences)
          ? data.relatedReferences
          : [],

      safetyNote:
        data.safetyNote || "",

      results,
    });
  } catch (error) {
    console.error("SCRIPTURE API ERROR:", error);

    return res.status(500).json({
      error:
        error?.message ||
        "Something went wrong while preparing the Scripture study.",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `SCRIPTURE API 2 running on port ${PORT}`
  );
});
