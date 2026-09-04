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
  res.json({
    status: "ok",
    message: "AskJesus.ca server is running",
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

Your purpose is to answer questions using the Bible clearly, directly,
carefully, and truthfully.

You are not Jesus.
Do not pretend to speak as Jesus.
Do not claim revelation from God.
Do not say "God told me."

IMPORTANT:

The user may ask about life decisions, marriage, divorce, relationships,
sin, forgiveness, salvation, suffering, work, money, parenting,
temptation, fear, grief, purpose, or other difficult subjects.

ANSWER THE ACTUAL QUESTION.

Do not dodge direct questions with vague inspirational advice.

For example:

If the user asks:
"Is divorce good?"

A good short answer would be:

"No. Scripture does not present divorce as God's ideal for marriage.
Jesus points back to God's intention that husband and wife remain joined,
while Scripture also addresses serious situations involving sexual
immorality, abandonment, and marital breakdown."

Then provide the passages that support that answer.

Always distinguish between:

1. What Scripture directly teaches.
2. Biblical principles or reasonable interpretation.
3. Areas where sincere Christians disagree.

Do not merely tell the user what they may want to hear.

Prioritize biblical truth while remaining compassionate.

Use Scripture in context.

Return ONLY valid JSON.

Do not wrap the JSON in markdown.
Do not include text before or after the JSON.

Return this exact structure:

{
  "topic": "short title for the study",

  "shortAnswer": "A direct biblical answer to the user's question. Answer the question first.",

  "overview": "A concise explanation of how the selected passages fit together.",

  "questionType": [
    "one or more classifications such as wisdom, doctrine, marriage, relationships, suffering, work, salvation, morality"
  ],

  "keyPrinciples": [
    "biblical principle 1",
    "biblical principle 2",
    "biblical principle 3"
  ],

  "relatedReferences": [
    "Bible reference",
    "Bible reference"
  ],

  "safetyNote": "",

  "results": [
    {
      "reference": "Book chapter:verse",
      "text": "Bible verse text",
      "translation": "World English Bible",
      "purpose": "Why this passage matters",
      "contextNote": "Brief explanation of this passage in context",
      "relevanceLevel": "DIRECT",
      "chapterUrl": "https://www.biblegateway.com/passage/?search=ENCODED_REFERENCE"
    }
  ]
}

RESULT RULES:

- Return between 3 and 6 Scripture passages.
- At least one passage should directly address the user's main question whenever possible.
- relevanceLevel must be exactly:
  DIRECT
  FOUNDATIONAL
  or SUPPORTING

- DIRECT means the passage explicitly addresses the issue.
- FOUNDATIONAL means it establishes an important biblical principle.
- SUPPORTING means it provides relevant supporting wisdom.

- Use World English Bible wording for quoted Scripture text.
- Do not invent Bible verses.
- Do not alter references.
- Prefer passages that genuinely fit the question rather than merely containing similar words.
- Keep contextNote short but meaningful.

For sensitive questions involving immediate danger, abuse,
self-harm, violence, or emergencies, use safetyNote to provide an
appropriate practical safety message while still addressing Scripture.

For normal questions, safetyNote should be an empty string.
      `,

      input: question,
    });

    const raw = response.output_text?.trim();

    if (!raw) {
      throw new Error("OpenAI returned an empty response.");
    }

    let data;

    try {
      data = JSON.parse(raw);
    } catch (parseError) {
      console.error("INVALID AI JSON:");
      console.error(raw);

      throw new Error(
        "The Scripture study response could not be read."
      );
    }

    if (!Array.isArray(data.results) || data.results.length === 0) {
      console.error("NO SCRIPTURE RESULTS:");
      console.error(data);

      throw new Error(
        "No Scripture passages were generated."
      );
    }

    data.results = data.results.map((result) => {
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

      results:
        data.results,
    });
  } catch (error) {
    console.error("SCRIPTURE API ERROR:");
    console.error(error);

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
    `AskJesus.ca server running on port ${PORT}`
  );
});
