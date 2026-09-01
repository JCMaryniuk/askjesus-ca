import express from "express";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");

app.use(express.json({ limit: "20kb" }));

// Serve the website files
app.use(
  express.static(".", {
    maxAge: "1h",
    etag: true
  })
);

// ----------------------------------------------------
// OPENAI
// ----------------------------------------------------

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  : null;

const MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";

// ----------------------------------------------------
// FALLBACK SCRIPTURE REFERENCES
// Used if OpenAI is unavailable.
// ----------------------------------------------------

const FALLBACKS = {
  fear: [
    "Psalm 23:1-6",
    "Psalm 56:3-4",
    "Isaiah 41:10",
    "Matthew 6:25-34",
    "Philippians 4:6-7"
  ],

  anxiety: [
    "Psalm 55:22",
    "Matthew 6:25-34",
    "Philippians 4:6-9",
    "1 Peter 5:6-7",
    "Psalm 94:18-19"
  ],

  worry: [
    "Matthew 6:25-34",
    "Philippians 4:6-9",
    "1 Peter 5:6-7",
    "Psalm 55:22"
  ],

  marriage: [
    "Genesis 2:18-24",
    "Matthew 19:3-9",
    "Ephesians 5:21-33",
    "Colossians 3:12-19",
    "1 Corinthians 13:4-8"
  ],

  divorce: [
    "Malachi 2:13-16",
    "Matthew 19:3-9",
    "Mark 10:2-12",
    "1 Corinthians 7:10-16",
    "Ephesians 4:31-32"
  ],

  forgiveness: [
    "Matthew 6:12-15",
    "Matthew 18:21-35",
    "Ephesians 4:31-32",
    "Colossians 3:12-13",
    "Luke 17:3-4"
  ],

  anger: [
    "Proverbs 15:1",
    "Proverbs 29:11",
    "Ephesians 4:26-32",
    "James 1:19-20",
    "Colossians 3:8-14"
  ],

  grief: [
    "Psalm 34:17-18",
    "Psalm 147:3",
    "Matthew 5:4",
    "John 11:32-36",
    "Revelation 21:1-5"
  ],

  death: [
    "Psalm 23:1-6",
    "John 11:25-26",
    "1 Corinthians 15:50-58",
    "1 Thessalonians 4:13-18",
    "Revelation 21:1-5"
  ],

  temptation: [
    "Matthew 4:1-11",
    "1 Corinthians 10:12-13",
    "James 1:12-18",
    "James 4:7-10",
    "Hebrews 4:14-16"
  ],

  money: [
    "Matthew 6:19-34",
    "Luke 12:13-34",
    "1 Timothy 6:6-10",
    "1 Timothy 6:17-19",
    "Hebrews 13:5-6"
  ],

  guidance: [
    "Psalm 25:4-5",
    "Psalm 119:105",
    "Proverbs 3:5-7",
    "James 1:5-8",
    "Romans 12:1-2"
  ],

  decision: [
    "Proverbs 3:5-7",
    "Proverbs 16:1-9",
    "James 1:5-8",
    "Romans 12:1-2",
    "Colossians 3:15-17"
  ],

  lonely: [
    "Psalm 27:7-10",
    "Psalm 68:5-6",
    "Isaiah 41:10",
    "Matthew 28:18-20",
    "Hebrews 13:5-6"
  ],

  loneliness: [
    "Psalm 27:7-10",
    "Psalm 68:5-6",
    "Isaiah 41:10",
    "Matthew 28:18-20",
    "Hebrews 13:5-6"
  ],

  depressed: [
    "Psalm 42:5-11",
    "Psalm 43:5",
    "Psalm 34:17-18",
    "Lamentations 3:21-26",
    "2 Corinthians 4:7-18"
  ],

  hope: [
    "Psalm 42:5-11",
    "Lamentations 3:21-26",
    "Romans 5:1-5",
    "Romans 8:18-39",
    "1 Peter 1:3-9"
  ],

  faith: [
    "Proverbs 3:5-7",
    "Mark 9:14-29",
    "Hebrews 11:1-16",
    "James 1:2-8",
    "Romans 10:8-17"
  ],

  sin: [
    "Psalm 51:1-17",
    "John 8:1-11",
    "Romans 6:1-14",
    "1 John 1:5-10",
    "1 John 2:1-6"
  ],

  prayer: [
    "Matthew 6:5-13",
    "Matthew 7:7-11",
    "Luke 18:1-8",
    "Philippians 4:4-7",
    "1 John 5:14-15"
  ]
};

const DEFAULT_REFERENCES = [
  "Psalm 119:105",
  "Proverbs 3:5-7",
  "Matthew 7:7-11",
  "Romans 12:1-2",
  "James 1:5-8"
];

// ----------------------------------------------------
// CLEAN / VALIDATE REFERENCES
// ----------------------------------------------------

function cleanReferences(references) {
  if (!Array.isArray(references)) {
    return DEFAULT_REFERENCES;
  }

  const cleaned = references
    .filter((reference) => typeof reference === "string")
    .map((reference) => reference.trim())
    .filter(Boolean);

  return [...new Set(cleaned)].slice(0, 7);
}

// ----------------------------------------------------
// FALLBACK MATCHER
// ----------------------------------------------------

function fallbackReferences(question) {
  const text = question.toLowerCase();

  const matches = [];

  for (const [keyword, references] of Object.entries(FALLBACKS)) {
    if (text.includes(keyword)) {
      matches.push(...references);
    }
  }

  if (!matches.length) {
    return DEFAULT_REFERENCES;
  }

  return [...new Set(matches)].slice(0, 7);
}

// ----------------------------------------------------
// ASK OPENAI TO CHOOSE REFERENCES ONLY
// ----------------------------------------------------

async function chooseReferences(question) {
  if (!openai) {
    return fallbackReferences(question);
  }

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,

      messages: [
        {
          role: "system",
          content: `
You select Bible references for ASKJesus.ca.

Your job is NOT to answer the person's question.
Your job is NOT to preach.
Your job is NOT to write a devotional.
Your job is NOT to claim that God is directly speaking through you.

Analyze the user's question or situation and select the most relevant
Bible passages that help the person examine the issue through Scripture.

RULES:

1. Return ONLY valid JSON.
2. Return 4 to 7 Bible references.
3. Use books from the standard Protestant 66-book Bible.
4. Prefer passages with enough surrounding context rather than isolated verses.
5. Do not invent Bible references.
6. Do not provide commentary.
7. Do not provide advice.
8. Do not provide interpretation outside the references.
9. Do not say "God told me" or "God is telling you."
10. For difficult or disputed subjects, select passages representing the
most directly relevant biblical considerations rather than forcing a yes/no answer.

Return exactly this JSON structure:

{
  "references": [
    "Book chapter:verse-verse",
    "Book chapter:verse-verse"
  ]
}
          `.trim()
        },

        {
          role: "user",
          content: question
        }
      ],

      response_format: {
        type: "json_object"
      }
    });

    const content =
      response.choices?.[0]?.message?.content;

    if (!content) {
      return fallbackReferences(question);
    }

    const parsed = JSON.parse(content);

    const references = cleanReferences(parsed.references);

    if (!references.length) {
      return fallbackReferences(question);
    }

    return references;
  } catch (error) {
    console.error("OpenAI reference selection failed:", error.message);

    return fallbackReferences(question);
  }
}

// ----------------------------------------------------
// RETRIEVE ACTUAL WORLD ENGLISH BIBLE TEXT
// ----------------------------------------------------

async function fetchPassage(reference) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 12000);

  try {
    const url =
      `https://bible-api.com/${encodeURIComponent(reference)}` +
      `?translation=web`;

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(
        `Bible API returned status ${response.status}`
      );
    }

    const data = await response.json();

    const text = String(data.text || "")
      .replace(/\s+/g, " ")
      .trim();

    if (!text) {
      throw new Error(
        `No Scripture text returned for ${reference}`
      );
    }

    return {
      reference: data.reference || reference,
      text,
      translation:
        data.translation_name ||
        "World English Bible"
    };
  } finally {
    clearTimeout(timeout);
  }
}

// ----------------------------------------------------
// HEALTH CHECK
// ----------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "ASKJesus.ca",
    aiEnabled: Boolean(openai)
  });
});

// ----------------------------------------------------
// MAIN ASK ENDPOINT
// THIS MATCHES app.js
// ----------------------------------------------------

app.post("/api/ask", async (req, res) => {
  try {
    const question = String(
      req.body?.question || ""
    ).trim();

    if (!question) {
      return res.status(400).json({
        error: "Please enter a question."
      });
    }

    if (question.length > 2000) {
      return res.status(400).json({
        error:
          "Please keep your question under 2,000 characters."
      });
    }

    const references =
      await chooseReferences(question);

    const results =
      await Promise.allSettled(
        references.map(fetchPassage)
      );

    const passages = results
      .filter(
        (result) =>
          result.status === "fulfilled"
      )
      .map((result) => result.value)
      .filter(
        (passage) =>
          passage &&
          passage.text
      );

    if (!passages.length) {
      return res.status(502).json({
        error:
          "Scripture could not be retrieved right now. Please try again."
      });
    }

    return res.json({
      passages
    });
  } catch (error) {
    console.error(
      "ASKJesus.ca /api/ask error:",
      error
    );

    return res.status(500).json({
      error:
        "Something went wrong. Please try again."
    });
  }
});

// ----------------------------------------------------
// OPTIONAL OLD ROUTE REDIRECT
//
// This keeps older cached versions of app.js working.
// If someone's browser still calls /api/scripture,
// it will use the same handler instead of getting a 404.
// ----------------------------------------------------

app.post("/api/scripture", async (req, res) => {
  try {
    const question = String(
      req.body?.question ||
      req.body?.input ||
      ""
    ).trim();

    if (!question) {
      return res.status(400).json({
        error: "Please enter a question."
      });
    }

    const references =
      await chooseReferences(question);

    const results =
      await Promise.allSettled(
        references.map(fetchPassage)
      );

    const passages = results
      .filter(
        (result) =>
          result.status === "fulfilled"
      )
      .map((result) => result.value)
      .filter(
        (passage) =>
          passage &&
          passage.text
      );

    if (!passages.length) {
      return res.status(502).json({
        error:
          "Scripture could not be retrieved right now. Please try again."
      });
    }

    return res.json({
      passages
    });
  } catch (error) {
    console.error(
      "ASKJesus.ca legacy route error:",
      error
    );

    return res.status(500).json({
      error:
        "Something went wrong. Please try again."
    });
  }
});

// ----------------------------------------------------
// START SERVER
// ----------------------------------------------------

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `ASKJesus.ca running on port ${PORT}`
  );
});
