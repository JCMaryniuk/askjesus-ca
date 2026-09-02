/* =========================================================
   ASKJESUS.CA — SERVER.JS
   ES MODULE VERSION FOR RENDER
========================================================= */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();


/* =========================================================
   __dirname FOR ES MODULES
========================================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/* =========================================================
   APP
========================================================= */

const app = express();

const PORT = process.env.PORT || 3000;


/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  express.json({
    limit: "50kb"
  })
);

app.use(
  express.urlencoded({
    extended: true
  })
);


/* =========================================================
   STATIC WEBSITE
========================================================= */

app.use(
  express.static(__dirname)
);


/* =========================================================
   CLEAN USER QUESTION
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


/* =========================================================
   CLEAN BIBLE REFERENCE
========================================================= */

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
   SELECT RELEVANT BIBLE REFERENCES
========================================================= */

async function selectBibleReferences(question) {

  if (!process.env.OPENAI_API_KEY) {

    throw new Error(
      "Reference selection service is not configured."
    );

  }


  const instructions = `
You are the reference-selection component of a Bible Scripture study tool.

Your only job is to choose Bible passages that are relevant to the user's question, struggle, decision, topic, relationship issue, spiritual concern, or situation.

RULES:

1. Return exactly 3 Bible references whenever possible.
2. Return Bible references only in JSON.
3. Do not give advice.
4. Do not give commentary.
5. Do not explain the passages.
6. Do not paraphrase Scripture.
7. Do not invent Bible verses.
8. Prefer passages that directly address the user's topic.
9. Use an appropriate verse range when context is important.
10. Use references from the standard 66-book Protestant Bible.

Return exactly this JSON structure:

{
  "references": [
    "Proverbs 14:15",
    "Psalm 37:3-5",
    "Matthew 18:15-17"
  ]
}

Return nothing outside the JSON object.
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

        model:
          process.env.OPENAI_MODEL ||
          "gpt-4o-mini",

        temperature: 0.1,

        response_format: {
          type: "json_object"
        },

        messages: [
          {
            role: "system",
            content: instructions
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

    const details = await response
      .text()
      .catch(() => "");

    console.error(
      "Reference-selection service error:",
      response.status,
      details
    );

    throw new Error(
      "Reference selection is temporarily unavailable."
    );

  }


  const data = await response.json();

  const content =
    data?.choices?.[0]?.message?.content;


  if (!content) {

    throw new Error(
      "No Bible references were returned."
    );

  }


  let parsed;


  try {

    parsed = JSON.parse(content);

  } catch {

    throw new Error(
      "Bible reference response was invalid."
    );

  }


  if (!Array.isArray(parsed.references)) {

    throw new Error(
      "No Bible reference list was returned."
    );

  }


  const references = parsed.references
    .map(cleanReference)
    .filter(Boolean)
    .slice(0, 3);


  if (references.length === 0) {

    throw new Error(
      "No Bible references were found."
    );

  }


  return references;
}


/* =========================================================
   FALLBACK SCRIPTURE REFERENCES
========================================================= */

function getFallbackReferences(question) {

  const text = question.toLowerCase();


  /* FEAR / WORRY */

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


  /* FORGIVENESS */

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


  /* TRUST / LYING */

  if (
    text.includes("lied") ||
    text.includes("lying") ||
    text.includes("liar") ||
    text.includes("trust")
  ) {

    return [
      "Proverbs 14:15",
      "Psalm 37:3-5",
      "Matthew 18:15-17"
    ];

  }


  /* ANGER */

  if (
    text.includes("anger") ||
    text.includes("angry") ||
    text.includes("mad")
  ) {

    return [
      "James 1:19-20",
      "Ephesians 4:26-27",
      "Proverbs 15:1"
    ];

  }


  /* WISDOM / DECISIONS */

  if (
    text.includes("wisdom") ||
    text.includes("decision") ||
    text.includes("choice") ||
    text.includes("choose") ||
    text.includes("guidance") ||
    text.includes("direction")
  ) {

    return [
      "James 1:5",
      "Proverbs 3:5-6",
      "Psalm 32:8"
    ];

  }


  /* TEMPTATION / SIN */

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


  /* MARRIAGE */

  if (
    text.includes("marriage") ||
    text.includes("married") ||
    text.includes("husband") ||
    text.includes("wife")
  ) {

    return [
      "Ephesians 5:25-33",
      "Colossians 3:12-14",
      "1 Corinthians 13:4-7"
    ];

  }


  /* MONEY */

  if (
    text.includes("money") ||
    text.includes("financial") ||
    text.includes("finances") ||
    text.includes("debt")
  ) {

    return [
      "Matthew 6:31-34",
      "Philippians 4:19",
      "Proverbs 3:9-10"
    ];

  }


  /* LONELINESS */

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


  /* GRIEF */

  if (
    text.includes("grief") ||
    text.includes("death") ||
    text.includes("died") ||
    text.includes("loss") ||
    text.includes("mourning")
  ) {

    return [
      "Psalm 34:18",
      "Matthew 5:4",
      "Revelation 21:4"
    ];

  }


  /* LOVE / RELATIONSHIPS */

  if (
    text.includes("love") ||
    text.includes("relationship")
  ) {

    return [
      "1 Corinthians 13:4-7",
      "John 13:34-35",
      "1 John 4:7-8"
    ];

  }


  /* PURPOSE */

  if (
    text.includes("purpose") ||
    text.includes("calling")
  ) {

    return [
      "Ephesians 2:10",
      "Romans 8:28",
      "Proverbs 16:9"
    ];

  }


  /* FAITH */

  if (
    text.includes("faith") ||
    text.includes("believe") ||
    text.includes("doubt")
  ) {

    return [
      "Hebrews 11:1",
      "Mark 9:23-24",
      "James 1:5-8"
    ];

  }


  /* PRAYER */

  if (
    text.includes("pray") ||
    text.includes("prayer")
  ) {

    return [
      "Matthew 6:6-13",
      "Philippians 4:6-7",
      "1 Thessalonians 5:16-18"
    ];

  }


  /* GENERAL */

  return [
    "Proverbs 3:5-6",
    "James 1:5",
    "Psalm 119:105"
  ];
}


/* =========================================================
   FULL CHAPTER LINK
========================================================= */

function makeChapterLink(reference) {

  const chapterReference = String(reference)
    .replace(/:\d+.*$/, "")
    .trim();


  return (
    "https://www.biblegateway.com/passage/?search=" +
    encodeURIComponent(chapterReference)
  );
}


/* =========================================================
   FETCH ACTUAL SCRIPTURE
========================================================= */

async function fetchScripture(reference) {

  const encodedReference =
    encodeURIComponent(reference);


  const url =
    `https://bible-api.com/${encodedReference}?translation=web`;


  try {

    const response = await fetch(url, {

      headers: {
        Accept: "application/json"
      }

    });


    if (!response.ok) {

      console.error(
        "Scripture lookup failed:",
        reference,
        response.status
      );

      return null;

    }


    const data = await response.json();


    if (!data || !data.text) {

      return null;

    }


    const scriptureText = String(data.text)

      .replace(/\r/g, "")

      .replace(/\n+/g, " ")

      .replace(/\s+/g, " ")

      .trim();


    return {

      reference:
        data.reference ||
        reference,

      text:
        scriptureText,

      translation:
        data.translation_name ||
        "World English Bible",

      chapterUrl:
        makeChapterLink(
          data.reference ||
          reference
        )

    };


  } catch (error) {

    console.error(
      "Scripture retrieval error:",
      reference,
      error.message
    );

    return null;

  }

}


/* =========================================================
   SCRIPTURE STUDY ENDPOINT
========================================================= */

app.post(
  "/api/scripture",
  async (req, res) => {

    try {

      const question =
        cleanQuestion(
          req.body?.question
        );


      if (!question) {

        return res
          .status(400)
          .json({

            error:
              "Please enter a question, topic, decision, struggle, or situation you would like to study."

          });

      }


      if (question.length < 4) {

        return res
          .status(400)
          .json({

            error:
              "Please provide a little more detail for your Scripture study."

          });

      }


      let references;


      try {

        references =
          await selectBibleReferences(
            question
          );

      } catch (error) {

        console.log(
          "Using backup Scripture references."
        );

        references =
          getFallbackReferences(
            question
          );

      }


      console.log(
        "Scripture references:",
        references
      );


      const passages =
        await Promise.all(

          references.map(
            (reference) =>
              fetchScripture(reference)
          )

        );


      const results =
        passages.filter(Boolean);


      if (results.length === 0) {

        return res
          .status(502)
          .json({

            error:
              "Scripture could not be retrieved right now. Please try again shortly."

          });

      }


      return res.json({

        success: true,

        translation:
          "World English Bible",

        results

      });


    } catch (error) {

      console.error(
        "Scripture study error:",
        error
      );


      return res
        .status(500)
        .json({

          error:
            "The Scripture study could not be completed. Please try again."

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

      service:
        "ASKJesus.ca Scripture Study Tool"

    });

  }
);


/* =========================================================
   WEBSITE FALLBACK
========================================================= */

app.use(
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
  "0.0.0.0",
  () => {

    console.log(
      `ASKJesus.ca running on port ${PORT}`
    );

  }
);
