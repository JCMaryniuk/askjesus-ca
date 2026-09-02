import express from "express";
import OpenAI from "openai";

const app = express();

const PORT =
  process.env.PORT || 3000;


/* =========================================================
   BASIC SERVER SETUP
   ========================================================= */

app.disable("x-powered-by");

app.use(
  express.json({
    limit: "20kb"
  })
);


/*
  Serve the website.

  maxAge is deliberately kept short while we are developing
  the site so new CSS / JS changes appear more quickly.
*/

app.use(
  express.static(".", {
    maxAge: "5m",
    etag: true
  })
);


/* =========================================================
   OPENAI
   ========================================================= */

const openai =
  process.env.OPENAI_API_KEY
    ? new OpenAI({
        apiKey:
          process.env.OPENAI_API_KEY
      })
    : null;


const MODEL =
  process.env.OPENAI_MODEL ||
  "gpt-5-mini";


/* =========================================================
   FALLBACK SCRIPTURE REFERENCES

   These are used if AI reference selection is unavailable.
   ========================================================= */

const FALLBACKS = {

  fear: [
    "Psalm 23:1-6",
    "Psalm 56:3-4",
    "Isaiah 41:10",
    "Matthew 6:25-34",
    "Philippians 4:6-7"
  ],

  afraid: [
    "Psalm 56:3-4",
    "Isaiah 41:10",
    "Psalm 27:1-5",
    "John 14:25-27",
    "2 Timothy 1:7"
  ],

  anxiety: [
    "Psalm 55:22",
    "Matthew 6:25-34",
    "Philippians 4:4-9",
    "1 Peter 5:6-7",
    "Psalm 94:18-19"
  ],

  anxious: [
    "Matthew 6:25-34",
    "Philippians 4:4-9",
    "1 Peter 5:6-7",
    "Psalm 94:18-19"
  ],

  worry: [
    "Matthew 6:25-34",
    "Philippians 4:4-9",
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

  husband: [
    "Ephesians 5:21-33",
    "Colossians 3:12-19",
    "1 Peter 3:1-7",
    "1 Corinthians 13:4-8"
  ],

  wife: [
    "Ephesians 5:21-33",
    "Colossians 3:12-19",
    "1 Peter 3:1-7",
    "1 Corinthians 13:4-8"
  ],

  divorce: [
    "Malachi 2:13-16",
    "Matthew 19:3-9",
    "Mark 10:2-12",
    "1 Corinthians 7:10-16"
  ],

  forgiveness: [
    "Matthew 6:12-15",
    "Matthew 18:21-35",
    "Luke 17:3-4",
    "Ephesians 4:31-32",
    "Colossians 3:12-13"
  ],

  forgive: [
    "Matthew 6:12-15",
    "Matthew 18:21-35",
    "Luke 17:3-4",
    "Ephesians 4:31-32"
  ],

  betrayal: [
    "Psalm 55:12-23",
    "Luke 17:3-4",
    "Matthew 18:15-17",
    "Romans 12:17-21",
    "Ephesians 4:31-32"
  ],

  betrayed: [
    "Psalm 55:12-23",
    "Luke 17:3-4",
    "Matthew 18:15-17",
    "Romans 12:17-21"
  ],

  trust: [
    "Psalm 118:8-9",
    "Proverbs 3:5-7",
    "Proverbs 14:15",
    "Proverbs 22:3",
    "John 2:23-25"
  ],

  lied: [
    "Proverbs 12:17-22",
    "Ephesians 4:25-32",
    "Colossians 3:8-10",
    "Matthew 18:15-17"
  ],

  lying: [
    "Proverbs 12:17-22",
    "Ephesians 4:25-32",
    "Colossians 3:8-10"
  ],

  anger: [
    "Proverbs 15:1",
    "Proverbs 29:11",
    "Ephesians 4:26-32",
    "James 1:19-20",
    "Colossians 3:8-14"
  ],

  angry: [
    "Proverbs 15:1",
    "Ephesians 4:26-32",
    "James 1:19-20",
    "Proverbs 29:11"
  ],

  conflict: [
    "Matthew 5:21-26",
    "Matthew 18:15-20",
    "Romans 12:14-21",
    "James 3:13-18",
    "James 4:1-10"
  ],

  friend: [
    "Proverbs 17:17",
    "Proverbs 18:24",
    "Proverbs 27:5-6",
    "Proverbs 27:9-17",
    "John 15:12-17"
  ],

  friendship: [
    "Proverbs 17:17",
    "Proverbs 18:24",
    "Proverbs 27:5-17",
    "John 15:12-17"
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

  debt: [
    "Proverbs 22:7",
    "Romans 13:7-8",
    "Luke 14:28-30",
    "Matthew 6:19-34"
  ],

  work: [
    "Proverbs 14:23",
    "Colossians 3:22-24",
    "2 Thessalonians 3:10-13",
    "Proverbs 22:29"
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

  wisdom: [
    "Proverbs 2:1-12",
    "Proverbs 3:5-7",
    "James 1:5-8",
    "James 3:13-18"
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
    "Hebrews 13:5-6"
  ],

  depressed: [
    "Psalm 42:5-11",
    "Psalm 43:5",
    "Psalm 34:17-18",
    "Lamentations 3:21-26",
    "2 Corinthians 4:7-18"
  ],

  sadness: [
    "Psalm 34:17-18",
    "Psalm 42:5-11",
    "Lamentations 3:21-26",
    "John 16:20-22"
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

  doubt: [
    "Mark 9:14-29",
    "John 20:24-31",
    "James 1:5-8",
    "Jude 1:20-23"
  ],

  sin: [
    "Psalm 51:1-17",
    "John 8:1-11",
    "Romans 6:1-14",
    "1 John 1:5-10",
    "1 John 2:1-6"
  ],

  guilt: [
    "Psalm 32:1-7",
    "Psalm 51:1-17",
    "Romans 8:1-4",
    "1 John 1:5-10"
  ],

  prayer: [
    "Matthew 6:5-13",
    "Matthew 7:7-11",
    "Luke 18:1-8",
    "Philippians 4:4-7",
    "1 John 5:14-15"
  ],

  pray: [
    "Matthew 6:5-13",
    "Matthew 7:7-11",
    "Luke 18:1-8",
    "Philippians 4:4-7"
  ],

  enemy: [
    "Matthew 5:43-48",
    "Romans 12:14-21",
    "Ephesians 6:10-18",
    "1 Peter 3:8-12"
  ],

  revenge: [
    "Leviticus 19:17-18",
    "Proverbs 20:22",
    "Matthew 5:38-48",
    "Romans 12:17-21"
  ],

  children: [
    "Deuteronomy 6:4-9",
    "Psalm 127:3-5",
    "Proverbs 22:6",
    "Ephesians 6:1-4"
  ],

  parenting: [
    "Deuteronomy 6:4-9",
    "Proverbs 22:6",
    "Ephesians 6:1-4",
    "Colossians 3:20-21"
  ],

  suffering: [
    "Psalm 34:17-19",
    "Romans 5:1-5",
    "Romans 8:18-39",
    "2 Corinthians 4:7-18",
    "1 Peter 4:12-19"
  ]

};


/* =========================================================
   DEFAULT REFERENCES
   ========================================================= */

const DEFAULT_REFERENCES = [

  "Psalm 119:105",
  "Proverbs 3:5-7",
  "Matthew 7:7-11",
  "Romans 12:1-2",
  "James 1:5-8"

];


/* =========================================================
   CLEAN AI REFERENCES
   ========================================================= */

function cleanReferences(references) {

  if (!Array.isArray(references)) {
    return [];
  }


  const cleaned =
    references

      .filter(
        reference =>
          typeof reference === "string"
      )

      .map(
        reference =>
          reference.trim()
      )

      .filter(Boolean);


  return [
    ...new Set(cleaned)
  ].slice(0, 8);

}


/* =========================================================
   FALLBACK MATCHER
   ========================================================= */

function fallbackReferences(question) {

  const text =
    question.toLowerCase();


  const matches = [];


  for (
    const [keyword, references]
    of Object.entries(FALLBACKS)
  ) {

    if (
      text.includes(keyword)
    ) {

      matches.push(
        ...references
      );

    }

  }


  if (!matches.length) {

    return DEFAULT_REFERENCES;

  }


  return [
    ...new Set(matches)
  ].slice(0, 8);

}


/* =========================================================
   AI SCRIPTURE REFERENCE SELECTION

   IMPORTANT:
   AI selects references ONLY.

   AI does not generate the Bible text.
   ========================================================= */

async function chooseReferences(question) {


  if (!openai) {

    console.log(
      "OpenAI unavailable. Using fallback Scripture references."
    );

    return fallbackReferences(
      question
    );

  }


  try {


    const response =
      await openai.chat.completions.create({

        model: MODEL,


        messages: [

          {

            role: "system",

            content: `
You are the Scripture-reference selection system for ASKJesus.ca.

Your ONLY task is to identify Bible passages that are genuinely relevant to the person's question, struggle, decision, relationship, belief, or situation.

You are NOT answering the person's question.

You are NOT writing a sermon.

You are NOT writing a devotional.

You are NOT giving personal advice.

You are NOT pretending to speak for God.

You are ONLY selecting Scripture references.

Before selecting references, silently analyze the question carefully.

Consider:

• What is the person's primary issue?
• Are there secondary issues?
• What relationships or responsibilities are involved?
• Is there a distinction between forgiveness, reconciliation, trust, wisdom, boundaries, justice, mercy, repentance, consequences, or restoration?
• Is the person asking about something Scripture addresses directly?
• Are there biblical principles that address the situation indirectly?
• Does Scripture contain warnings, commands, examples, wisdom, correction, comfort, or promises relevant to the issue?
• Would a passage that challenges the person's assumptions be important?
• Are there passages from different parts of Scripture that together provide a more complete biblical picture?

SEARCH PRINCIPLES:

1. Search conceptually across the whole Bible rather than merely matching words in the user's question.

2. Prefer passages that address the specific situation over famous verses that are only loosely related.

3. Meaning is more important than keyword similarity.

4. Prefer passages with enough surrounding verses to preserve context.

5. When an issue involves multiple biblical principles, select passages covering the different relevant principles.

6. Do not deliberately select verses merely because they will comfort the user.

7. Do not deliberately select verses merely because they agree with what the user appears to want.

8. Include correction, warning, responsibility, repentance, wisdom, mercy, forgiveness, justice, or caution when Scripture makes those relevant.

9. For difficult or disputed issues, select passages representing the major directly relevant biblical considerations rather than forcing Scripture into a simplistic yes/no answer.

10. Do not treat narrative descriptions as commands unless the passage itself supports that use.

11. Do not remove a passage from its literary context merely because one sentence sounds relevant.

12. Do not invent references.

13. Use only books in the standard Protestant 66-book Bible.

14. Normally return 5 to 8 references.

15. Use fewer only when Scripture has very limited direct material on the subject.

16. Avoid unnecessary duplication. Several references that all make exactly the same point are less useful than passages addressing different important aspects of the question.

17. Accuracy and relevance are more important than popularity.

18. Do not provide commentary, explanations, summaries, interpretations, advice, or conclusions.

19. Do not claim "God told me," "God is telling you," or anything similar.

20. Your response MUST be valid JSON and contain nothing except the required JSON object.

Return exactly this structure:

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

            content:
              question

          }

        ],


        response_format: {

          type:
            "json_object"

        }

      });


    const content =
      response
        .choices?.[0]
        ?.message?.content;


    if (!content) {

      return fallbackReferences(
        question
      );

    }


    const parsed =
      JSON.parse(content);


    const references =
      cleanReferences(
        parsed.references
      );


    if (!references.length) {

      return fallbackReferences(
        question
      );

    }


    return references;


  } catch (error) {


    console.error(
      "OpenAI reference selection failed:",
      error.message
    );


    return fallbackReferences(
      question
    );

  }

}


/* =========================================================
   CREATE FULL CHAPTER URL
   ========================================================= */

function createChapterUrl(reference) {


  const cleanedReference =
    String(reference || "")
      .replace(/[–—]/g, "-")
      .trim();


  /*
    Examples:

    Matthew 18:15-17
       -> Matthew 18

    John 3:16
       -> John 3

    1 Corinthians 13:4-8
       -> 1 Corinthians 13
  */


  const match =
    cleanedReference.match(

      /^((?:[1-3]\s+)?[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+)/

    );


  let chapterReference =
    cleanedReference;


  if (match) {

    chapterReference =
      `${match[1]} ${match[2]}`;

  }


  return (

    "https://www.biblegateway.com/passage/" +

    "?search=" +

    encodeURIComponent(
      chapterReference
    ) +

    "&version=WEB"

  );

}


/* =========================================================
   RETRIEVE ACTUAL SCRIPTURE TEXT

   Bible text comes from Bible API using
   World English Bible.
   ========================================================= */

async function fetchPassage(reference) {


  const controller =
    new AbortController();


  const timeout =
    setTimeout(
      () => {

        controller.abort();

      },
      12000
    );


  try {


    const url =

      `https://bible-api.com/${encodeURIComponent(reference)}` +

      "?translation=web";


    const response =
      await fetch(
        url,
        {

          signal:
            controller.signal,

          headers: {

            Accept:
              "application/json"

          }

        }
      );


    if (!response.ok) {

      throw new Error(

        `Bible API returned status ${response.status} for ${reference}`

      );

    }


    const data =
      await response.json();


    const text =
      String(
        data.text || ""
      )

        .replace(
          /\s+/g,
          " "
        )

        .trim();


    if (!text) {

      throw new Error(

        `No Scripture text returned for ${reference}`

      );

    }


    const finalReference =
      data.reference ||
      reference;


    return {

      reference:
        finalReference,

      text,

      translation:
        data.translation_name ||
        "World English Bible",

      chapterUrl:
        createChapterUrl(
          finalReference
        )

    };


  } finally {


    clearTimeout(
      timeout
    );

  }

}


/* =========================================================
   PROCESS QUESTION
   ========================================================= */

async function getScripturePassages(
  question
) {


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


  /*
    If one individual Bible passage fails,
    don't make the entire search fail.
  */

  const passages =
    results

      .filter(
        result =>
          result.status ===
          "fulfilled"
      )

      .map(
        result =>
          result.value
      )

      .filter(
        passage =>
          passage &&
          passage.text
      );


  return passages;

}


/* =========================================================
   VALIDATE QUESTION
   ========================================================= */

function getQuestion(req) {

  return String(

    req.body?.question ||

    req.body?.input ||

    ""

  ).trim();

}


function validateQuestion(
  question,
  res
) {


  if (!question) {

    res.status(400).json({

      error:
        "Please enter a question."

    });

    return false;

  }


  if (
    question.length > 2000
  ) {

    res.status(400).json({

      error:
        "Please keep your question under 2,000 characters."

    });

    return false;

  }


  return true;

}


/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get(
  "/api/health",
  (req, res) => {


    res.json({

      ok:
        true,

      service:
        "ASKJesus.ca",

      aiEnabled:
        Boolean(openai),

      model:
        MODEL

    });

  }
);


/* =========================================================
   MAIN API

   This is the endpoint used by the new app.js.
   ========================================================= */

app.post(
  "/api/ask",
  async (req, res) => {


    try {


      const question =
        getQuestion(req);


      if (
        !validateQuestion(
          question,
          res
        )
      ) {

        return;

      }


      const passages =
        await getScripturePassages(
          question
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
        "ASKJesus.ca /api/ask error:",
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


/* =========================================================
   LEGACY API

   Keep this because an older cached version of app.js
   may still call /api/scripture.
   ========================================================= */

app.post(
  "/api/scripture",
  async (req, res) => {


    try {


      const question =
        getQuestion(req);


      if (
        !validateQuestion(
          question,
          res
        )
      ) {

        return;

      }


      const passages =
        await getScripturePassages(
          question
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
        "ASKJesus.ca legacy route error:",
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


/* =========================================================
   API 404

   This makes missing API routes return JSON instead
   of an HTML page.

   That prevents the old:
   Unexpected token '<'
   error from being confusing.
   ========================================================= */

app.use(
  "/api",
  (req, res) => {


    res.status(404).json({

      error:
        "API route not found."

    });

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


    console.log(
      `AI Scripture selection: ${
        openai
          ? "enabled"
          : "fallback mode"
      }`
    );

  }
);
