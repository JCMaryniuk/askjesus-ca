const input = document.querySelector("#input");
const button = document.querySelector("#submit");
const status = document.querySelector("#status");
const results = document.querySelector("#results");

button.addEventListener("click", run);

input.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    run();
  }
});

function esc(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));import express from "express";
import OpenAI from "openai";

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));
app.use(express.static(".", { maxAge: "1h" }));

const PORT = process.env.PORT || 3000;

const FALLBACK = {
  fear: [
    "Philippians 4:6-7",
    "Isaiah 41:10",
    "1 Peter 5:7",
    "Psalm 56:3-4",
    "Matthew 6:31-34"
  ],

  anxiety: [
    "Philippians 4:6-7",
    "1 Peter 5:7",
    "Matthew 6:25-34",
    "Psalm 94:19",
    "John 14:27"
  ],

  forgiveness: [
    "Ephesians 4:31-32",
    "Colossians 3:12-13",
    "Matthew 6:14-15",
    "Romans 12:17-21",
    "Luke 17:3-4"
  ],

  anger: [
    "James 1:19-20",
    "Ephesians 4:26-27",
    "Proverbs 15:1",
    "Romans 12:17-21",
    "Colossians 3:8"
  ],

  grief: [
    "Psalm 34:18",
    "Matthew 5:4",
    "Revelation 21:4",
    "Psalm 147:3",
    "2 Corinthians 1:3-4"
  ],

  wisdom: [
    "James 1:5",
    "Proverbs 3:5-6",
    "Proverbs 16:9",
    "Psalm 119:105",
    "Colossians 3:15-17"
  ],

  temptation: [
    "1 Corinthians 10:13",
    "James 1:12-16",
    "Matthew 26:41",
    "Hebrews 4:15-16",
    "Psalm 119:9-11"
  ],

  money: [
    "Matthew 6:19-34",
    "1 Timothy 6:6-10",
    "Proverbs 3:9-10",
    "Hebrews 13:5",
    "Philippians 4:11-13"
  ],

  marriage: [
    "Matthew 19:3-9",
    "1 Corinthians 7:10-16",
    "Ephesians 5:21-33",
    "1 Corinthians 13:4-7",
    "Colossians 3:12-14"
  ],

  parenting: [
    "Deuteronomy 6:6-7",
    "Proverbs 22:6",
    "Ephesians 6:4",
    "Colossians 3:21",
    "Psalm 127:3-5"
  ],

  identity: [
    "Genesis 1:27",
    "Psalm 139:13-14",
    "2 Corinthians 5:17",
    "Ephesians 2:10",
    "1 Peter 2:9"
  ],

  work: [
    "Colossians 3:23-24",
    "Proverbs 16:3",
    "Proverbs 22:29",
    "Ecclesiastes 9:10",
    "1 Thessalonians 4:11-12"
  ],

  loneliness: [
    "Psalm 27:10",
    "Isaiah 41:10",
    "Hebrews 13:5-6",
    "Psalm 68:5-6",
    "Matthew 28:20"
  ],

  hope: [
    "Romans 15:13",
    "Lamentations 3:21-24",
    "Romans 8:28",
    "Psalm 42:11",
    "Hebrews 6:19"
  ]
};

function fallbackReferences(question) {
  const text = question.toLowerCase();

  const synonyms = {
    fear: ["afraid", "scared", "worry", "worried"],
    anxiety: ["anxious", "stress", "stressed", "panic"],
    forgiveness: ["forgive", "betrayed", "betrayal", "hurt me"],
    anger: ["angry", "mad", "rage"],
    grief: ["grieving", "death", "died", "loss", "mourning"],
    wisdom: [
      "decision",
      "choose",
      "choice",
      "guidance",
      "what should i do"
    ],
    temptation: ["tempted", "sin", "addiction"],
    money: ["financial", "finances", "provide", "debt"],
    marriage: ["wife", "husband", "spouse", "divorce", "marriage"],
    parenting: ["child", "children", "kids", "son", "daughter"],
    identity: ["worthless", "purpose", "who am i", "value"],
    work: ["business", "career", "job"],
    loneliness: ["alone", "lonely", "abandoned"],
    hope: ["hopeless", "future", "despair"]
  };

  const scored = Object.entries(FALLBACK)
    .map(([key, refs]) => {
      let score = text.includes(key) ? 3 : 0;

      for (const synonym of synonyms[key] || []) {
        if (text.includes(synonym)) {
          score += 1;
        }
      }

      return {
        refs,
        score
      };
    })
    .sort((a, b) => b.score - a.score);

  if (scored[0]?.score > 0) {
    return scored[0].refs;
  }

  return [
    "Proverbs 3:5-6",
    "James 1:5",
    "Psalm 119:105",
    "Philippians 4:6-7",
    "Romans 12:2"
  ];
}

async function chooseReferences(question) {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackReferences(question);
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",

      input: [
        {
          role: "system",

          content: `
You are a Bible passage selector.

You do not counsel, preach, interpret, or claim revelation.

Return ONLY valid JSON in this exact form:

{"references":["Book 1:1-3","Book 2:4"]}

Rules:

- Return 4 to 7 passages.
- Select passages that genuinely address the user's subject or situation.
- Prefer complete, contextual passage ranges over isolated proof-texts.
- Never provide explanations, advice, prayers, commentary, summaries, or a personal message from God.
- Use only references from the standard Protestant 66-book canon.
- Never invent a reference.
- For disputed or complex subjects, include relevant passages representing the major biblical considerations rather than forcing a yes/no conclusion.
- Do not choose passages merely because a keyword appears.
- Prioritize meaning and context.
`
        },

        {
          role: "user",
          content: question
        }
      ]
    });

    const parsed = JSON.parse(
      response.output_text.trim()
    );

    if (
      Array.isArray(parsed.references) &&
      parsed.references.length
    ) {
      return [
        ...new Set(
          parsed.references.map(String)
        )
      ].slice(0, 7);
    }

  } catch (error) {
    console.error(
      "OpenAI reference selection failed; using fallback.",
      error
    );
  }

  return fallbackReferences(question);
}

async function fetchPassage(reference) {
  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    8000
  );

  try {
    const url =
      `https://bible-api.com/${encodeURIComponent(reference)}?translation=web`;

    const response = await fetch(url, {
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(
        `Bible text unavailable for ${reference}`
      );
    }

    const data = await response.json();

    return {
      reference:
        data.reference || reference,

      text:
        (data.text || "").trim(),

      translation:
        data.translation_name ||
        "World English Bible"
    };

  } finally {
    clearTimeout(timeout);
  }
}

app.get(
  "/api/health",
  (_req, res) => {

    res.json({
      ok: true,

      service:
        "ASKJesus.ca",

      aiEnabled:
        Boolean(
          process.env.OPENAI_API_KEY
        )
    });

  }
);

app.post(
  "/api/ask",

  async (req, res) => {

    try {

      const question =
        String(
          req.body?.question || ""
        ).trim();

      if (!question) {

        return res
          .status(400)
          .json({
            error:
              "Please enter a question."
          });

      }

      if (
        question.length > 2000
      ) {

        return res
          .status(400)
          .json({
            error:
              "Please keep your question under 2,000 characters."
          });

      }

      const references =
        await chooseReferences(
          question
        );

      const results =
        await Promise.allSettled(
          references.map(
            fetchPassage
          )
        );

      const passages =
        results

          .filter(
            (result) =>
              result.status ===
              "fulfilled"
          )

          .map(
            (result) =>
              result.value
          )

          .filter(
            (passage) =>
              passage.text
          );

      if (!passages.length) {

        return res
          .status(502)
          .json({
            error:
              "Scripture could not be retrieved right now. Please try again."
          });

      }

      return res.json({
        passages
      });

    } catch (error) {

      console.error(
        "Ask route error:",
        error
      );

      return res
        .status(500)
        .json({
          error:
            "Something went wrong. Please try again."
        });

    }
  }
);

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `ASKJesus.ca running on port ${PORT}`
    );

  }
);
}

async function run() {
  const question = input.value.trim();

  if (!question) {
    status.textContent = "Please enter a question or situation first.";
    input.focus();
    return;
  }

  button.disabled = true;
  button.textContent = "Finding Scripture...";
  status.textContent = "Searching relevant Scripture…";
  results.innerHTML = "";

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: question
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Unable to retrieve Scripture.");
    }

    const passages = data.passages || [];

    if (!passages.length) {
      results.innerHTML =
        '<div class="error">No passages were returned. Please try another question.</div>';
      status.textContent = "";
      return;
    }

    results.innerHTML = passages.map((p) => `
      <article class="verse">
        <div class="ref">${esc(p.reference || "")}</div>
        <div class="text">${esc(p.text || "")}</div>
        ${p.translation ? `<div class="translation">${esc(p.translation)}</div>` : ""}
      </article>
    `).join("");

    status.textContent = `${passages.length} Scripture passages found.`;

    results.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  } catch (error) {
    console.error(error);

    results.innerHTML =
      `<div class="error">${esc(error.message)}</div>`;
    status.textContent = "";

  } finally {
    button.disabled = false;
    button.textContent = "Find Scripture";
  }
}
