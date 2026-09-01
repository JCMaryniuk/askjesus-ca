import express from "express";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));
app.use(express.static(".", { maxAge: "1h" }));

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";

const fallbackTopics = [
  {
    words: ["fear", "afraid", "scared", "anxiety", "anxious", "worry", "worried"],
    refs: [
      "Philippians 4:6-7",
      "Matthew 6:25-34",
      "Psalm 56:3-4",
      "Isaiah 41:10",
      "1 Peter 5:6-7"
    ]
  },
  {
    words: ["forgive", "forgiveness", "unforgiving"],
    refs: [
      "Matthew 6:14-15",
      "Matthew 18:21-35",
      "Ephesians 4:31-32",
      "Colossians 3:12-13",
      "1 John 1:9"
    ]
  },
  {
    words: ["anger", "angry", "rage", "temper"],
    refs: [
      "James 1:19-20",
      "Ephesians 4:26-27",
      "Proverbs 15:1",
      "Colossians 3:8-10"
    ]
  },
  {
    words: ["wisdom", "decision", "decide", "guidance", "direction"],
    refs: [
      "James 1:5",
      "Proverbs 3:5-7",
      "Psalm 119:105",
      "Romans 12:1-2",
      "James 3:13-18"
    ]
  },
  {
    words: ["temptation", "tempted", "sin", "struggling"],
    refs: [
      "1 Corinthians 10:12-13",
      "James 1:12-16",
      "Hebrews 4:14-16",
      "Romans 6:11-14"
    ]
  }
];

function fallbackReferences(question) {
  const text = question.toLowerCase();

  for (const topic of fallbackTopics) {
    if (topic.words.some((word) => text.includes(word))) {
      return topic.refs;
    }
  }

  return [
    "Matthew 7:7-11",
    "James 1:5",
    "Psalm 119:105",
    "2 Timothy 3:14-17",
    "Hebrews 4:12-13"
  ];
}

function normalizeReferences(refs) {
  if (!Array.isArray(refs)) return [];

  return [...new Set(
    refs
      .filter((ref) => typeof ref === "string")
      .map((ref) => ref.trim())
      .filter(Boolean)
  )].slice(0, 7);
}

async function chooseReferences(question) {
  if (!openai) {
    return fallbackReferences(question);
  }

  const prompt = `
You select Bible references for ASKJesus.ca.

The user will ask a question or describe a situation.

Your task is ONLY to select relevant Bible passages.

Rules:
- Return 4 to 7 Bible references.
- Use standard Protestant 66-book Bible references.
- Prefer passages that preserve context rather than isolated proof-texts.
- Include balanced biblical considerations for difficult or disputed questions.
- Do not write advice.
- Do not write commentary.
- Do not write a prayer.
- Do not claim that God is directly telling the user something.
- Do not quote or generate Bible verse text.
- Return JSON only in this exact shape:
{"references":["Matthew 7:7-11","James 1:5"]}

User question:
${question}
`;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a Bible-reference selection tool. Return only valid JSON containing Bible references."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content || "{}");
    const refs = normalizeReferences(parsed.references);

    if (refs.length >= 4) return refs;

    return fallbackReferences(question);
  } catch (error) {
    console.error("Reference selection failed:", error.message);
    return fallbackReferences(question);
  }
}

async function fetchPassage(reference) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const url =
      "https://bible-api.com/" +
      encodeURIComponent(reference) +
      "?translation=web";

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Bible API returned ${response.status}`);
    }

    const data = await response.json();

    return {
      reference: data.reference || reference,
      text: String(data.text || "").trim(),
      translation: "WEB"
    };
  } finally {
    clearTimeout(timeout);
  }
}

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "ASKJesus.ca",
    aiEnabled: Boolean(openai)
  });
});

app.post("/api/ask", async (req, res) => {
  try {
    const question = String(req.body?.question || "").trim();

    if (!question) {
      return res.status(400).json({
        error: "Please enter a question."
      });
    }

    if (question.length > 2000) {
      return res.status(400).json({
        error: "Please keep your question under 2,000 characters."
      });
    }

    const references = await chooseReferences(question);

    const results = await Promise.allSettled(
      references.map(fetchPassage)
    );

    const passages = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value)
      .filter((passage) => passage.text);

    if (!passages.length) {
      return res.status(502).json({
        error: "Scripture could not be retrieved right now. Please try again."
      });
    }

    res.json({ passages });
  } catch (error) {
    console.error("Ask route error:", error);
    res.status(500).json({
      error: "Something went wrong. Please try again."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ASKJesus.ca running on port ${PORT}`);
});
