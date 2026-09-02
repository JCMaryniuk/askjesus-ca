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
  // Responses API convenience field
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  // Otherwise inspect output items
  if (Array.isArray(data?.output)) {
    for (const item of data.output) {
      if (!Array.isArray(item?.content)) continue;

      for (const content of item.content) {
        if (
          (content?.type === "output_text" || content?.type === "text") &&
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
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is missing from the Render environment variables."
    );
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.6-sol";

  console.log("====================================");
  console.log("New Scripture study question:");
  console.log(question);
  console.log("Creating Scripture study with model:", model);
  console.log("====================================");

  const systemPrompt = `
You are assisting a Christian Bible study tool called ASKJesus.ca.

Your job is to understand the user's actual question and select Bible
passages that most directly address it.

IMPORTANT RULES:

1. Scripture is the authority. Do not invent Bible verses.
2. Return Bible REFERENCES, not fabricated quotations.
3. Choose passages directly relevant to the user's actual subject.
4. Do not default to generic wisdom passages when Scripture speaks
   specifically about the subject.
5. Consider the full biblical context, not isolated proof-texts.
6. Present biblical teaching fairly and carefully.
7. Distinguish Scripture from explanatory study notes.
8. Do not claim that your study notes are God's words.
9. Avoid pretending that every difficult question has a simplistic answer.
10. Select exactly 6 primary passages.
11. Select exactly 4 additional related references.
12. The overview should explain why these passages matter to the question.
13. Each contextNote should briefly explain the passage's relevance without
    replacing the reader's responsibility to read the chapter.

For marriage and divorce questions, prioritize direct biblical teaching
where relevant, including passages such as:
Genesis 2,
Malachi 2,
Matthew 5,
Matthew 19,
Mark 10,
1 Corinthians 7,
and Ephesians 5.

For other subjects, identify the actual biblical topic first and select
the strongest directly relevant passages.

Return ONLY valid JSON matching this exact structure:

{
  "topic": "short descriptive study topic",
  "overview": "brief explanation of what Scripture addresses concerning the question",
  "keyPrinciples": [
    "principle one",
    "principle two",
    "principle three"
  ],
  "passages": [
    {
      "reference": "Bible reference",
      "purpose": "short reason this passage matters",
      "contextNote": "brief study context"
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

  const requestBody = {
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
  };

  let response;

  try {
    response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
  } catch (networkError) {
    console.error("OPENAI NETWORK ERROR:", networkError);

    throw new Error(
      `OpenAI network request failed: ${networkError.message}`
    );
  }

  const rawBody = await response.text();

  console.log("OpenAI HTTP status:", response.status);

  if (!response.ok) {
    console.error("OPENAI REQUEST FAILED");
    console.error("Status:", response.status);
    console.error("Response:", rawBody);

    let apiMessage = rawBody;

    try {
      const parsedError = JSON.parse(rawBody);

      apiMessage =
        parsedError?.error?.message ||
        parsedError?.message ||
        rawBody;
    } catch {
      // Keep raw response
    }

    throw new Error(
      `OpenAI API error (${response.status}): ${apiMessage}`
    );
  }

  let data;

  try {
    data = JSON.parse(rawBody);
  } catch (error) {
    console.error("Could not parse OpenAI response JSON:");
    console.error(rawBody);

    throw new Error(
      `OpenAI returned an unreadable response: ${error.message}`
    );
  }

  const outputText = extractResponseText(data);

  if (!outputText) {
    console.error("NO OUTPUT TEXT FOUND");
    console.error(JSON.stringify(data, null, 2));

    throw new Error(
      "OpenAI returned a response but no readable study text was found."
    );
  }

  console.log("OpenAI returned study plan text.");

  let study;

  try {
    let cleanedOutput = outputText.trim();

    // Remove markdown code fences if they appear
    cleanedOutput = cleanedOutput
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    study = JSON.parse(cleanedOutput);
  } catch (error) {
    console.error("STUDY PLAN JSON PARSE FAILED");
    console.error("Model output:");
    console.error(outputText);

    throw new Error(
      `The study plan could not be read as JSON: ${error.message}`
    );
  }

  if (!study || typeof study !== "object") {
    throw new Error("The study plan was empty.");
  }

  if (!Array.isArray(study.passages) || study.passages.length === 0) {
    throw new Error(
      "The study plan did not contain any Scripture references."
    );
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
          .map(cleanReference)
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

  if (!reference) {
    throw new Error("A Scripture reference was empty.");
  }

  const bibleURL =
    `https://bible-api.com/${encodeURIComponent(reference)}` +
    "?translation=web";

  console.log("Fetching Scripture:", reference);

  const response = await fetch(bibleURL);

  if (!response.ok) {
    const errorBody = await response.text();

    console.error(
      "BIBLE API ERROR:",
      reference,
      response.status,
      errorBody
    );

    throw new Error(
      `Bible text lookup failed for ${reference} (${response.status}).`
    );
  }

  const data = await response.json();

  if (!data?.text) {
    throw new Error(
      `Bible text lookup returned no text for ${reference}.`
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
    console.log("");
    console.log("************************************");
    console.log("SCRIPTURE REQUEST RECEIVED");
    console.log("Question:", question);
    console.log("************************************");

    const study = await createStudyPlan(question);

    console.log("Study topic:", study.topic);
    console.log("Passages selected:", study.passages.length);

    const results = await Promise.all(
      study.passages.map(fetchScripture)
    );

    console.log(
      `Scripture study completed successfully with ${results.length} passages.`
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
    console.error("");
    console.error("!!!!!!!! SCRIPTURE STUDY ERROR !!!!!!!!");
    console.error(error);
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

    /*
      TEMPORARY DEBUGGING:
      This intentionally sends the real server error to the browser.
      After we identify the problem, we will replace this with the
      normal friendly message again.
    */

    return res.status(500).json({
      success: false,
      error: `DEBUG ERROR: ${error.message}`
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ASKJesus.ca Scripture Study Tool",
    model: process.env.OPENAI_MODEL || "gpt-5.6-sol",
    apiKeyConfigured: Boolean(process.env.OPENAI_API_KEY)
  });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ASKJesus.ca running on port ${PORT}`);
  console.log(
    `OpenAI model: ${process.env.OPENAI_MODEL || "gpt-5.6-sol"}`
  );
  console.log(
    `OpenAI API key configured: ${
      process.env.OPENAI_API_KEY ? "YES" : "NO"
    }`
  );
});
