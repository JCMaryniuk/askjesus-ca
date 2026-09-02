import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

function getOpenAIKey() {
  return (
    process.env.OPENAI_API_KEY ||
    process.env.OPEN_API_KEY ||
    process.env.OPENAI_KEY ||
    ""
  );
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
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
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

async function createStudyPlan(question) {
  const OPENAI_KEY = getOpenAIKey();

  if (!OPENAI_KEY) {
    throw new Error(
      "No OpenAI API key was found. Checked OPENAI_API_KEY, OPEN_API_KEY, and OPENAI_KEY."
    );
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.6-sol";

  console.log("====================================");
  console.log("New Scripture study question:", question);
  console.log("OpenAI model:", model);
  console.log("API key detected: YES");
  console.log("====================================");

  const systemPrompt = `
You are assisting a Christian Bible study tool called ASKJesus.ca.

Your task is to understand the user's actual question and identify Bible
passages that most directly address it.

Important rules:

- Scripture is the authority.
- Never invent Bible quotations.
- Return Bible references only; actual Scripture text is fetched separately.
- Choose passages directly relevant to the real question.
- Avoid generic wisdom passages when Scripture speaks directly to the topic.
- Consider context, not isolated proof texts.
- Keep explanatory comments separate from Scripture.
- Select exactly 6 primary passages.
- Select exactly 4 related passages.
- Give exactly 3 key principles.

For marriage and divorce questions, consider direct biblical teaching
including Genesis 2, Malachi 2, Matthew 5, Matthew 19, Mark 10,
1 Corinthians 7, and Ephesians 5 where relevant.

Return ONLY valid JSON in this format:

{
  "topic": "short descriptive topic",
  "overview": "brief biblical study overview",
  "keyPrinciples": [
    "principle one",
    "principle two",
    "principle three"
  ],
  "passages": [
    {
      "reference": "Bible reference",
      "purpose": "why this passage matters",
      "contextNote": "brief contextual study note"
    }
  ],
  "relatedReferences": [
    "reference one",
    "reference two",
    "reference three",
    "reference four"
  ]
}
`;

  const response = await fetch("https://api.openai.com/v1/responses", {
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
  });

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
    throw new Error("OpenAI returned an unreadable response.");
  }

  const outputText = extractResponseText(data);

  if (!outputText) {
    throw new Error("OpenAI returned no readable study response.");
  }

  let cleaned = outputText
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

  if (!Array.isArray(study.passages) || study.passages.length === 0) {
    throw new Error("No Scripture references were returned.");
  }

  return {
    topic: cleanText(study.topic, 200),
    overview: cleanText(study.overview, 1500),

    keyPrinciples: Array.isArray(study.keyPrinciples)
      ? study.keyPrinciples
          .slice(0, 3)
          .map((item) => cleanText(item, 500))
      : [],

    passages: study.passages
      .slice(0, 6)
      .map((passage) => ({
        reference: cleanReference(passage.reference),
        purpose: cleanText(passage.purpose, 300),
        contextNote: cleanText(passage.contextNote, 800)
      }))
      .filter((passage) => passage.reference),

    relatedReferences: Array.isArray(study.relatedReferences)
      ? study.relatedReferences
          .slice(0, 4)
          .map((item) => cleanReference(item))
          .filter(Boolean)
      : []
  };
}

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
  const reference = cleanReference(passage.reference);

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
    reference: cleanText(data.reference || reference, 150),

    text: String(data.text)
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim(),

    translation:
      cleanText(data.translation_name, 100) ||
      "World English Bible",

    purpose: passage.purpose,

    contextNote: passage.contextNote,

    chapterLink: makeChapterLink(reference)
  };
}

app.post("/api/scripture", async (req, res) => {
  const question = cleanQuestion(req.body?.question);

  if (!question) {
    return res.status(400).json({
      success: false,
      error: "Please enter a question before searching Scripture."
    });
  }

  try {
    const study = await createStudyPlan(question);

    const results = await Promise.all(
      study.passages.map(fetchScripture)
    );

    return res.json({
      success: true,
      topic: study.topic,
      overview: study.overview,
      keyPrinciples: study.keyPrinciples,
      translation: "World English Bible",
      results,
      relatedReferences: study.relatedReferences
    });
  } catch (error) {
    console.error("SCRIPTURE STUDY ERROR:", error);

    return res.status(500).json({
      success: false,
      error: `DEBUG ERROR: ${error.message}`
    });
  }
});

app.get("/api/health", (req, res) => {
  const hasOpenAIAPIKey = Boolean(process.env.OPENAI_API_KEY);
  const hasOpenAPIKey = Boolean(process.env.OPEN_API_KEY);
  const hasOpenAIKey = Boolean(process.env.OPENAI_KEY);

  res.json({
    status: "ok",
    service: "ASKJesus.ca Scripture Study Tool",
    model: process.env.OPENAI_MODEL || "gpt-5.6-sol",

    apiKeyConfigured: Boolean(getOpenAIKey()),

    detectedVariables: {
      OPENAI_API_KEY: hasOpenAIAPIKey,
      OPEN_API_KEY: hasOpenAPIKey,
      OPENAI_KEY: hasOpenAIKey
    }
  });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ASKJesus.ca running on port ${PORT}`);
  console.log(
    `API key detected: ${getOpenAIKey() ? "YES" : "NO"}`
  );
  console.log(
    `Model: ${process.env.OPENAI_MODEL || "gpt-5.6-sol"}`
  );
});
