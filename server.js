import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

/* =========================================================
   OPENAI KEY
   First try environment variables.
   If Render does not expose them, use the Render secret file.
========================================================= */

function getOpenAIKey() {
  // 1. Normal environment variable
  if (
    process.env.OPENAI_API_KEY &&
    process.env.OPENAI_API_KEY.trim()
  ) {
    return process.env.OPENAI_API_KEY.trim();
  }

  // 2. Older variable names, just in case
  if (
    process.env.OPEN_API_KEY &&
    process.env.OPEN_API_KEY.trim()
  ) {
    return process.env.OPEN_API_KEY.trim();
  }

  if (
    process.env.OPENAI_KEY &&
    process.env.OPENAI_KEY.trim()
  ) {
    return process.env.OPENAI_KEY.trim();
  }

  // 3. Render Secret File
  const secretPaths = [
    "/etc/secrets/openai_key",
    path.join(__dirname, "openai_key")
  ];

  for (const secretPath of secretPaths) {
    try {
      if (fs.existsSync(secretPath)) {
        const key = fs.readFileSync(secretPath, "utf8").trim();

        if (key) {
          return key;
        }
      }
    } catch (error) {
      console.error(
        "Could not read OpenAI secret file:",
        error.message
      );
    }
  }

  return "";
}

function getKeySource() {
  if (process.env.OPENAI_API_KEY?.trim()) {
    return "OPENAI_API_KEY";
  }

  if (process.env.OPEN_API_KEY?.trim()) {
    return "OPEN_API_KEY";
  }

  if (process.env.OPENAI_KEY?.trim()) {
    return "OPENAI_KEY";
  }

  try {
    if (
      fs.existsSync("/etc/secrets/openai_key") &&
      fs.readFileSync(
        "/etc/secrets/openai_key",
        "utf8"
      ).trim()
    ) {
      return "Render Secret File";
    }
  } catch {}

  try {
    const localSecret = path.join(__dirname, "openai_key");

    if (
      fs.existsSync(localSecret) &&
      fs.readFileSync(localSecret, "utf8").trim()
    ) {
      return "Render Secret File";
    }
  } catch {}

  return "NONE";
}

function cleanQuestion(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1500);
}

function cleanReference(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

function cleanText(value, maxLength = 1000) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function extractResponseText(data) {
  if (
    typeof data?.output_text === "string" &&
    data.output_text.trim()
  ) {
    return data.output_text.trim();
  }

  if (Array.isArray(data?.output)) {
    for (const item of data.output) {
      if (!Array.isArray(item?.content)) continue;

      for (const content of item.content) {
        if (
          (content?.type === "output_text" ||
            content?.type === "text") &&
          typeof content?.text === "string"
        ) {
          return content.text.trim();
        }
      }
    }
  }

  return "";
}

/* =========================================================
   CREATE SCRIPTURE STUDY PLAN
========================================================= */

async function createStudyPlan(question) {
  const OPENAI_KEY = getOpenAIKey();

  if (!OPENAI_KEY) {
    throw new Error(
      "OpenAI key could not be found in environment variables or Render secret file."
    );
  }

  const model =
    process.env.OPENAI_MODEL || "gpt-5.6-sol";

  console.log("====================================");
  console.log("New Scripture question:", question);
  console.log("Model:", model);
  console.log("API key detected: YES");
  console.log("Key source:", getKeySource());
  console.log("====================================");

  const systemPrompt = `
You are assisting a Christian Bible study website called ASKJesus.ca.

Your job is to understand the user's actual question and identify Bible
passages that directly address it.

SCRIPTURE STUDY RULES:

1. Scripture is the authority.

2. Never invent or paraphrase Bible quotations.
   Return Bible references only.
   Actual Bible text will be fetched separately.

3. Understand the user's REAL question.
   Do not simply match keywords.

4. Prefer passages that directly address the subject.

5. Do not default to generic wisdom passages when the Bible contains
   specific teaching about the subject.

6. Consider biblical context and the teaching of Scripture as a whole.

7. Explanatory notes must remain clearly separate from Scripture.

8. Select exactly 6 primary Scripture passages.

9. Give exactly 3 key biblical principles.

10. Give exactly 4 additional related passages.

For questions concerning marriage, separation, adultery, reconciliation,
or divorce, carefully consider relevant passages including:

Genesis 2
Malachi 2
Matthew 5
Matthew 19
Mark 10
1 Corinthians 7
Ephesians 5

Use only passages that genuinely apply to the user's specific question.

Return ONLY valid JSON.

Use this exact structure:

{
  "topic": "Short descriptive Bible study topic",
  "overview": "Brief overview explaining what Scripture teaches about this question",
  "keyPrinciples": [
    "First biblical principle",
    "Second biblical principle",
    "Third biblical principle"
  ],
  "passages": [
    {
      "reference": "Bible reference",
      "purpose": "Why this passage is relevant",
      "contextNote": "Brief study context"
    }
  ],
  "relatedReferences": [
    "Bible reference",
    "Bible reference",
    "Bible reference",
    "Bible reference"
  ]
}
`;

  const response = await fetch(
    "https://api.openai.com/v1/responses",
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        model,

        reasoning: {
          effort: "medium"
        },

        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: systemPrompt
              }
            ]
          },

          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Bible study question: ${question}`
              }
            ]
          }
        ]
      })
    }
  );

  const rawBody = await response.text();

  if (!response.ok) {
    let message = rawBody;

    try {
      const parsed = JSON.parse(rawBody);

      message =
        parsed?.error?.message ||
        parsed?.message ||
        rawBody;
    } catch {}

    throw new Error(
      `OpenAI API error (${response.status}): ${message}`
    );
  }

  let data;

  try {
    data = JSON.parse(rawBody);
  } catch {
    throw new Error(
      "OpenAI returned an unreadable response."
    );
  }

  const outputText = extractResponseText(data);

  if (!outputText) {
    throw new Error(
      "OpenAI returned no readable study response."
    );
  }

  const cleaned = outputText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let study;

  try {
    study = JSON.parse(cleaned);
  } catch (error) {
    throw new Error(
      `Study response JSON could not be read: ${error.message}`
    );
  }

  if (
    !Array.isArray(study.passages) ||
    study.passages.length === 0
  ) {
    throw new Error(
      "No Scripture references were returned."
    );
  }

  return {
    topic: cleanText(study.topic, 200),

    overview: cleanText(
      study.overview,
      1500
    ),

    keyPrinciples: Array.isArray(
      study.keyPrinciples
    )
      ? study.keyPrinciples
          .slice(0, 3)
          .map((item) =>
            cleanText(item, 500)
          )
      : [],

    passages: study.passages
      .slice(0, 6)
      .map((passage) => ({
        reference: cleanReference(
          passage.reference
        ),

        purpose: cleanText(
          passage.purpose,
          300
        ),

        contextNote: cleanText(
          passage.contextNote,
          800
        )
      }))
      .filter(
        (passage) => passage.reference
      ),

    relatedReferences: Array.isArray(
      study.relatedReferences
    )
      ? study.relatedReferences
          .slice(0, 4)
          .map((item) =>
            cleanReference(item)
          )
          .filter(Boolean)
      : []
  };
}

/* =========================================================
   BIBLE TEXT
========================================================= */

function makeChapterLink(reference) {
  const match = reference.match(
    /^((?:[1-3]\s*)?[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+)/
  );

  const chapterReference = match
    ? `${match[1]} ${match[2]}`
    : reference;

  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(
    chapterReference
  )}`;
}

async function fetchScripture(passage) {
  const reference =
    cleanReference(passage.reference);

  const response = await fetch(
    `https://bible-api.com/${encodeURIComponent(
      reference
    )}?translation=web`
  );

  if (!response.ok) {
    throw new Error(
      `Bible lookup failed for ${reference} (${response.status}).`
    );
  }

  const data = await response.json();

  if (!data?.text) {
    throw new Error(
      `Bible lookup returned no text for ${reference}.`
    );
  }

  return {
    reference: cleanText(
      data.reference || reference,
      150
    ),

    text: String(data.text)
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim(),

    translation:
      cleanText(
        data.translation_name,
        100
      ) || "World English Bible",

    purpose: passage.purpose,

    contextNote:
      passage.contextNote,

    chapterLink:
      makeChapterLink(reference)
  };
}

/* =========================================================
   SCRIPTURE API
========================================================= */

app.post(
  "/api/scripture",
  async (req, res) => {
    const question =
      cleanQuestion(req.body?.question);

    if (!question) {
      return res.status(400).json({
        success: false,
        error:
          "Please enter a question before searching Scripture."
      });
    }

    try {
      const study =
        await createStudyPlan(question);

      const results =
        await Promise.all(
          study.passages.map(
            fetchScripture
          )
        );

      return res.json({
        success: true,

        topic: study.topic,

        overview: study.overview,

        keyPrinciples:
          study.keyPrinciples,

        translation:
          "World English Bible",

        results,

        relatedReferences:
          study.relatedReferences
      });
    } catch (error) {
      console.error(
        "SCRIPTURE STUDY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        // Keep debug temporarily
        error: `DEBUG ERROR: ${error.message}`
      });
    }
  }
);

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",

    service:
      "ASKJesus.ca Scripture Study Tool",

    model:
      process.env.OPENAI_MODEL ||
      "gpt-5.6-sol",

    apiKeyConfigured:
      Boolean(getOpenAIKey()),

    keySource:
      getKeySource(),

    secretFileExists:
      fs.existsSync(
        "/etc/secrets/openai_key"
      )
  });
});

/* =========================================================
   WEBSITE
========================================================= */

app.use((req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "index.html"
    )
  );
});

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `ASKJesus.ca running on port ${PORT}`
    );

    console.log(
      `API key detected: ${
        getOpenAIKey()
          ? "YES"
          : "NO"
      }`
    );

    console.log(
      `Key source: ${getKeySource()}`
    );
  }
);
