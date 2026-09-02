/* =========================================================
   ASKJESUS.CA — SCRIPTURE STUDY SERVER
   FULL REPLACEMENT
========================================================= */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";


/* =========================================================
   PATH SETUP
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

app.use(
  express.static(__dirname)
);


/* =========================================================
   CLEAN INPUT
========================================================= */

function cleanQuestion(value) {

  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2000);
}


function cleanReference(value) {

  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\n\r\t]/g, " ")
    .replace(/[“”"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}


function cleanText(value, maxLength = 1000) {

  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}


/* =========================================================
   EXTRACT RESPONSES API TEXT
========================================================= */

function extractResponseText(data) {

  if (!data) {
    return "";
  }


  if (
    typeof data.output_text === "string" &&
    data.output_text.trim()
  ) {

    return data.output_text.trim();

  }


  if (Array.isArray(data.output)) {

    for (const item of data.output) {

      if (!Array.isArray(item?.content)) {
        continue;
      }


      for (const contentItem of item.content) {

        if (
          contentItem?.type === "output_text" &&
          typeof contentItem.text === "string"
        ) {

          return contentItem.text.trim();

        }

      }

    }

  }


  return "";
}


/* =========================================================
   SCRIPTURE STUDY PROMPT
========================================================= */

async function createStudyPlan(question) {

  if (!process.env.OPENAI_API_KEY) {

    throw new Error(
      "OPENAI_API_KEY is missing in Render."
    );

  }


  const systemPrompt = `
You are the Scripture study planning system for ASKJesus.ca.

ASKJesus.ca is a Bible Scripture study tool.

Your task is to understand the user's actual question and select Scripture that directly addresses that subject.

CRITICAL RULES:

1. Answer the actual subject the user asked about.
2. Do not default to generic wisdom verses unless the question is genuinely about wisdom or guidance.
3. If the user asks about marriage, divorce, separation, adultery, reconciliation, spouses, husbands, wives, abandonment, remarriage, or marital conflict, the primary passages MUST directly address marriage or those issues.
4. If the user asks about forgiveness, include passages specifically about forgiveness.
5. If the user asks about fear or anxiety, include passages specifically about fear, anxiety, trust, or God's peace.
6. If the user asks about money, debt, work, generosity, greed, stewardship, or provision, use passages directly related to those subjects.
7. If the question is morally difficult or the Bible contains multiple relevant principles, show those different biblical dimensions rather than forcing a simplistic answer.
8. Prefer passage ranges rather than isolated verses where surrounding context matters.
9. Never invent Bible references.
10. Use only books contained in the standard 66-book Protestant Bible.
11. Scripture quotations will be retrieved separately. Do not fabricate Bible text.
12. Your overview and context notes are study aids, not Scripture.
13. Do not present personal opinion as biblical teaching.
14. Do not promise outcomes that Scripture does not promise.
15. Avoid proof-texting. Choose passages that genuinely fit their surrounding biblical context.
16. Where Christians reasonably differ about application, acknowledge the biblical principles without pretending every interpretive question is settled.
17. For sensitive relationship questions, do not assume facts the user did not state.
18. For divorce questions specifically, consider passages such as Genesis 2, Malachi 2, Matthew 5, Matthew 19, Mark 10, 1 Corinthians 7, Ephesians 5, and related passages where actually relevant.
19. Do not select passages merely because they contain one matching keyword.
20. The six primary passages should collectively give a balanced biblical study of the question.

Return:

- a short study topic
- a 2 to 4 sentence overview
- exactly 3 key biblical themes
- exactly 6 primary Bible passages
- a purpose label for each passage
- a concise context note for each passage
- exactly 4 additional related references

Example structure:

{
  "topic": "Marriage, Divorce, and Reconciliation",
  "overview": "A concise Scripture-focused overview.",
  "keyPrinciples": [
    "Biblical principle one",
    "Biblical principle two",
    "Biblical principle three"
  ],
  "passages": [
    {
      "reference": "Matthew 19:3-9",
      "purpose": "Jesus on marriage and divorce",
      "contextNote": "Jesus responds to a question about divorce by pointing back to God's design for marriage in creation."
    }
  ],
  "relatedReferences": [
    "Genesis 2:18-24",
    "Mark 10:2-12",
    "Ephesians 5:21-33",
    "Romans 12:18"
  ]
}

Return JSON only.
`;


  const model =
    process.env.OPENAI_MODEL ||
    "gpt-5.6-terra";


  console.log(
    `Creating Scripture study with model: ${model}`
  );


  const response = await fetch(
    "https://api.openai.com/v1/responses",
    {
      method: "POST",

      headers: {

        "Content-Type":
          "application/json",

        "Authorization":
          `Bearer ${process.env.OPENAI_API_KEY}`

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

                text:
                  `Prepare a Scripture study for this question:\n\n${question}`
              }

            ]
          }

        ],

        text: {

          format: {

            type: "json_schema",

            name:
              "scripture_study",

            strict: true,

            schema: {

              type: "object",

              additionalProperties: false,

              properties: {

                topic: {
                  type: "string"
                },

                overview: {
                  type: "string"
                },

                keyPrinciples: {

                  type: "array",

                  minItems: 3,
                  maxItems: 3,

                  items: {
                    type: "string"
                  }

                },

                passages: {

                  type: "array",

                  minItems: 6,
                  maxItems: 6,

                  items: {

                    type: "object",

                    additionalProperties: false,

                    properties: {

                      reference: {
                        type: "string"
                      },

                      purpose: {
                        type: "string"
                      },

                      contextNote: {
                        type: "string"
                      }

                    },

                    required: [
                      "reference",
                      "purpose",
                      "contextNote"
                    ]

                  }

                },

                relatedReferences: {

                  type: "array",

                  minItems: 4,
                  maxItems: 4,

                  items: {
                    type: "string"
                  }

                }

              },

              required: [
                "topic",
                "overview",
                "keyPrinciples",
                "passages",
                "relatedReferences"
              ]

            }

          }

        }

      })

    }
  );


  if (!response.ok) {

    const errorDetails =
      await response
        .text()
        .catch(() => "");


    console.error(
      "OPENAI REQUEST FAILED"
    );

    console.error(
      "Status:",
      response.status
    );

    console.error(
      errorDetails
    );


    throw new Error(
      `Study analysis failed with status ${response.status}.`
    );

  }


  const data =
    await response.json();


  const rawText =
    extractResponseText(data);


  if (!rawText) {

    console.error(
      "No output text returned from study analysis."
    );

    console.error(
      JSON.stringify(data, null, 2)
    );


    throw new Error(
      "The Scripture study analysis returned no usable response."
    );

  }


  let parsed;


  try {

    parsed =
      JSON.parse(rawText);

  } catch (error) {

    console.error(
      "Could not parse Scripture study JSON."
    );

    console.error(
      rawText
    );


    throw new Error(
      "The Scripture study response could not be read."
    );

  }


  const passages =
    Array.isArray(parsed.passages)

      ? parsed.passages

          .map((item) => ({

            reference:
              cleanReference(
                item.reference
              ),

            purpose:
              cleanText(
                item.purpose,
                100
              ),

            contextNote:
              cleanText(
                item.contextNote,
                600
              )

          }))

          .filter(
            (item) =>
              item.reference
          )

          .slice(0, 6)

      : [];


  if (passages.length < 1) {

    throw new Error(
      "No Scripture passages were selected."
    );

  }


  return {

    topic:
      cleanText(
        parsed.topic,
        150
      ) ||
      "Scripture Study",

    overview:
      cleanText(
        parsed.overview,
        1200
      ),

    keyPrinciples:
      Array.isArray(
        parsed.keyPrinciples
      )

        ? parsed.keyPrinciples
            .map(
              (item) =>
                cleanText(
                  item,
                  350
                )
            )
            .filter(Boolean)
            .slice(0, 3)

        : [],

    passages,

    relatedReferences:
      Array.isArray(
        parsed.relatedReferences
      )

        ? parsed.relatedReferences
            .map(cleanReference)
            .filter(Boolean)
            .slice(0, 4)

        : []

  };

}


/* =========================================================
   BIBLEGATEWAY FULL CHAPTER LINK
========================================================= */

function makeChapterLink(reference) {

  const chapterReference =
    String(reference)
      .replace(/:\d+.*$/, "")
      .trim();


  return (
    "https://www.biblegateway.com/passage/?search=" +
    encodeURIComponent(
      chapterReference
    )
  );

}


/* =========================================================
   FETCH ACTUAL SCRIPTURE TEXT
========================================================= */

async function fetchScripture(passage) {

  const reference =
    passage.reference;


  const encodedReference =
    encodeURIComponent(
      reference
    );


  const url =
    `https://bible-api.com/${encodedReference}?translation=web`;


  try {

    const response =
      await fetch(
        url,
        {
          headers: {
            Accept:
              "application/json"
          }
        }
      );


    if (!response.ok) {

      console.error(
        `Bible lookup failed for ${reference}:`,
        response.status
      );

      return null;

    }


    const data =
      await response.json();


    if (!data?.text) {

      console.error(
        `Bible lookup returned no text for ${reference}.`
      );

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
        data.reference ||
        reference,

      text:
        scriptureText,

      translation:
        data.translation_name ||
        "World English Bible",

      purpose:
        passage.purpose,

      contextNote:
        passage.contextNote,

      chapterUrl:
        makeChapterLink(
          data.reference ||
          reference
        )

    };


  } catch (error) {

    console.error(
      `Bible retrieval error for ${reference}:`,
      error.message
    );


    return null;

  }

}


/* =========================================================
   MAIN SCRIPTURE ENDPOINT
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
              "Please describe the question, struggle, decision, topic, or situation you would like to study."

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


      console.log(
        "New Scripture study question:",
        question
      );


      /*
        IMPORTANT:

        There is intentionally NO generic fallback here.

        If the study analysis fails, we tell the visitor that
        the service is unavailable instead of showing unrelated
        Scripture.
      */

      const study =
        await createStudyPlan(
          question
        );


      const passages =
        await Promise.all(

          study.passages.map(
            fetchScripture
          )

        );


      const validPassages =
        passages.filter(Boolean);


      if (validPassages.length === 0) {

        console.error(
          "No Scripture text could be retrieved."
        );


        return res
          .status(502)
          .json({

            error:
              "The Bible passages could not be loaded right now. Please try again shortly."

          });

      }


      console.log(
        `Returning ${validPassages.length} Scripture passages for study: ${study.topic}`
      );


      return res.json({

        success: true,

        topic:
          study.topic,

        overview:
          study.overview,

        keyPrinciples:
          study.keyPrinciples,

        translation:
          "World English Bible",

        results:
          validPassages,

        relatedReferences:
          study.relatedReferences

      });


    } catch (error) {

      console.error(
        "SCRIPTURE STUDY ERROR:"
      );

      console.error(
        error
      );


      return res
        .status(500)
        .json({

          error:
            "The Scripture study service is temporarily unavailable. Please try again shortly."

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
        "ASKJesus.ca Scripture Study Tool",

      model:
        process.env.OPENAI_MODEL ||
        "gpt-5.6-terra"

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

    console.log(
      `Study model: ${
        process.env.OPENAI_MODEL ||
        "gpt-5.6-terra"
      }`
    );

  }
);
