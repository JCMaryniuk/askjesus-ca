/* =========================================================
   ASKJESUS.CA — SERVER.JS
   ---------------------------------------------------------
   What this server does:

   1. Receives the user's question
   2. Uses OpenAI ONLY to select relevant Bible references
   3. Fetches the actual Scripture text from Bible API
   4. Returns Scripture passages to the website

   The AI does NOT write the Bible answer itself.
========================================================= */

require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;


/* =========================================================
   BASIC MIDDLEWARE
========================================================= */

app.use(express.json({ limit: "50kb" }));

app.use(express.urlencoded({
  extended: true
}));


/* =========================================================
   SERVE WEBSITE FILES
========================================================= */

app.use(express.static(path.join(__dirname)));


/* =========================================================
   HELPERS
========================================================= */

function cleanQuestion(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1500);
}


function cleanReference(reference) {
  if (typeof reference !== "string") {
    return "";
  }

  return reference
    .replace(/[\n\r\t]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[“”"]/g, "")
    .trim();
}


/* =========================================================
   OPENAI — FIND RELEVANT SCRIPTURE REFERENCES
========================================================= */

async function findReferencesWithOpenAI(question) {

  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is missing from the server environment."
    );
  }


  const systemPrompt = `
You are a Bible reference selection system for ASKJesus.ca.

Your ONLY job is to identify Bible passages relevant to the user's
question, struggle, decision, temptation, relationship issue,
spiritual concern, or situation.

IMPORTANT RULES:

1. Return exactly 3 Bible references whenever possible.
2. Return Bible REFERENCES ONLY.
3. Do not write advice.
4. Do not write commentary.
5. Do not explain the verses.
6. Do not paraphrase Scripture.
7. Do not invent verses.
8. Prefer passages that directly address the issue.
9. Include context when appropriate rather than isolated fragments.
10. References must exist in the standard 66-book Protestant Bible.

Return valid JSON in exactly this format:

{
  "references": [
    "Proverbs 14:15",
    "Psalm 37:3-5",
    "Matthew 18:15-17"
  ]
}

Do not include markdown.
Do not include any other text.
`;


  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },

      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",

        temperature: 0.2,

        response_format: {
          type: "json_object"
        },

        messages: [
          {
            role: "system",
            content: systemPrompt
          },

          {
            role: "user",
            content: question
          }
        ]
      })
    }
  );


  if (!response.ok) {

    let errorText = "";

    try {
      errorText = await response.text();
    } catch (error) {
      errorText = "";
    }

    console.error(
      "OpenAI API error:",
      response.status,
      errorText
    );

    throw new Error(
      "The Scripture reference search service is temporarily unavailable."
    );
  }


  const data = await response.json();


  const rawContent =
    data?.choices?.[0]?.message?.content;


  if (!rawContent) {
    throw new Error(
      "No Bible references were returned."
    );
  }


  let parsed;

  try {
    parsed = JSON.parse(rawContent);
  } catch (error) {
    console.error(
      "Could not parse OpenAI JSON:",
      rawContent
    );

    throw new Error(
      "The Bible reference response was invalid."
    );
  }


  if (!Array.isArray(parsed.references)) {
    throw new Error(
      "No valid Bible reference list was returned."
    );
  }


  const references = parsed.references
    .map(cleanReference)
    .filter(Boolean)
    .slice(0, 3);


  if (references.length === 0) {
    throw new Error(
      "No relevant Bible passages were found."
    );
  }


  return references;
}


/* =========================================================
   FETCH ACTUAL SCRIPTURE FROM BIBLE API
========================================================= */

async function fetchScripture(reference) {

  const encodedReference =
    encodeURIComponent(reference);


  /*
    World English Bible

    Example:
    https://bible-api.com/John%203%3A16?translation=web
  */

  const url =
    `https://bible-api.com/${encodedReference}?translation=web`;


  const response = await fetch(url, {
    headers: {
      "Accept": "application/json"
    }
  });


  if (!response.ok) {

    console.error(
      "Bible API lookup failed:",
      reference,
      response.status
    );

    return null;
  }


  const data = await response.json();


  if (!data || !data.text) {
    return null;
  }


  const scriptureText =
    String(data.text)
      .replace(/\r/g, "")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();


  return {

    reference:
      data.reference || reference,

    text:
      scriptureText,

    translation:
      data.translation_name ||
      "World English Bible",

    chapterUrl:
      makeBibleGatewayLink(
        data.reference || reference
      )

  };
}


/* =========================================================
   FULL CHAPTER LINK
========================================================= */

function makeBibleGatewayLink(reference) {

  const chapterReference =
    String(reference)
      .replace(/:\d+.*$/, "")
      .trim();


  return (
    "https://www.biblegateway.com/passage/?search=" +
    encodeURIComponent(chapterReference)
  );
}


/* =========================================================
   FALLBACK SCRIPTURES
   Used only if the AI reference service fails
========================================================= */

function getFallbackReferences(question) {

  const text = question.toLowerCase();


  if (
    text.includes("fear") ||
    text.includes("afraid") ||
    text.includes("scared") ||
    text.includes("anxiety") ||
    text.includes("anxious") ||
    text.includes("worry")
  ) {
    return [
      "Philippians 4:6-7",
      "Isaiah 41:10",
      "Psalm 56:3-4"
    ];
  }


  if (
    text.includes("forgive") ||
    text.includes("forgiveness")
  ) {
    return [
      "Ephesians 4:31-32",
      "Colossians 3:12-13",
      "Matthew 18:21-22"
    ];
  }


  if (
    text.includes("lied") ||
    text.includes("lying") ||
    text.includes("trust")
  ) {
    return [
      "Proverbs 14:15",
      "Psalm 37:3-5",
      "Matthew 18:15-17"
    ];
  }


  if (
    text.includes("anger") ||
    text.includes("angry")
  ) {
    return [
      "James 1:19-20",
      "Ephesians 4:26-27",
      "Proverbs 15:1"
    ];
  }


  if (
    text.includes("wisdom") ||
    text.includes("decision") ||
    text.includes("choose") ||
    text.includes("choice")
  ) {
    return [
      "James 1:5",
      "Proverbs 3:5-6",
      "Psalm 32:8"
    ];
  }


  if (
    text.includes("tempt") ||
    text.includes("temptation") ||
    text.includes("sin")
  ) {
    return [
      "1 Corinthians 10:13",
      "James 1:12-15",
      "Psalm 119:9-11"
    ];
  }


  if (
    text.includes("marriage") ||
    text.includes("husband") ||
    text.includes("wife")
  ) {
    return [
      "Ephesians 5:25-33",
      "Colossians 3:12-14",
      "1 Corinthians 13:4-7"
    ];
  }


  if (
    text.includes("money") ||
    text.includes("financial") ||
    text.includes("finances")
  ) {
    return [
      "Matthew 6:31-34",
      "Philippians 4:19",
      "Proverbs 3:9-10"
    ];
  }


  if (
    text.includes("lonely") ||
    text.includes("alone")
  ) {
    return [
      "Deuteronomy 31:8",
      "Psalm 27:10",
      "Matthew 28:20"
    ];
  }


  if (
    text.includes("grief") ||
    text.includes("death") ||
    text.includes("died") ||
    text.includes("loss")
  ) {
    return [
      "Psalm 34:18",
      "Matthew 5:4",
      "Revelation 21:4"
    ];
  }


  /*
    General guidance fallback
  */

  return [
    "Proverbs 3:5-6",
    "James 1:5",
    "Psalm 119:105"
  ];
}


/* =========================================================
   MAIN SCRIPTURE ENDPOINT
========================================================= */

app.post(
  "/api/scripture",
  async (req, res) => {

    try {

      const question =
        cleanQuestion(req.body?.question);


      if (!question) {

        return res.status(400).json({
          error:
            "Please describe the question, struggle, decision, or situation you are facing."
        });

      }


      if (question.length < 4) {

        return res.status(400).json({
          error:
            "Please provide a little more detail."
        });

      }


      let references;


      /* -----------------------------------------------------
         TRY AI REFERENCE SELECTION
      ------------------------------------------------------ */

      try {

        references =
          await findReferencesWithOpenAI(
            question
          );

      } catch (aiError) {

        console.error(
          "Reference selection error:",
          aiError.message
        );


        /*
          Site continues working if OpenAI temporarily fails.
        */

        references =
          getFallbackReferences(
            question
          );

      }


      console.log(
        "Selected Scripture references:",
        references
      );


      /* -----------------------------------------------------
         FETCH REAL SCRIPTURE TEXT
      ------------------------------------------------------ */

      const scriptureRequests =
        references.map(
          reference =>
            fetchScripture(reference)
        );


      const fetched =
        await Promise.all(
          scriptureRequests
        );


      const results =
        fetched.filter(Boolean);


      if (results.length === 0) {

        return res.status(502).json({
          error:
            "Scripture could not be retrieved right now. Please try again shortly."
        });

      }


      return res.json({

        success: true,

        question: question,

        translation:
          "World English Bible",

        results: results

      });


    } catch (error) {

      console.error(
        "Scripture endpoint error:",
        error
      );


      return res.status(500).json({
        error:
          "Something went wrong while finding Scripture. Please try again."
      });

    }

  }
);


/* =========================================================
   HEALTH CHECK
========================================================= */

app.get(
  "/api/health",
  (req, res) => {

    res.json({
      status: "ok",
      site: "ASKJesus.ca"
    });

  }
);


/* =========================================================
   HOME PAGE FALLBACK
========================================================= */

app.get(
  "*",
  (req, res) => {

    res.sendFile(
      path.join(
        __dirname,
        "index.html"
      )
    );

  }
);


/* =========================================================
   START SERVER
========================================================= */

app.listen(
  PORT,
  () => {

    console.log(
      `ASKJesus.ca server running on port ${PORT}`
    );

  }
);
