/* =========================================================
   ASKJESUS.CA — INTELLIGENT SCRIPTURE STUDY SERVER
   FULL REPLACEMENT
   GPT-5.6 SOL + HIGH REASONING
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
   APP SETUP
========================================================= */

const app = express();

const PORT =
  process.env.PORT || 3000;


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
   CLEANING HELPERS
========================================================= */

function cleanQuestion(value) {

  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2500);
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


function cleanText(
  value,
  maxLength = 1200
) {

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
   MAIN SCRIPTURE STUDY ANALYSIS
========================================================= */

async function createStudyPlan(question) {

  if (!process.env.OPENAI_API_KEY) {

    throw new Error(
      "OPENAI_API_KEY is missing."
    );

  }


  const model =
    process.env.OPENAI_MODEL ||
    "gpt-5.6-sol";


  const systemPrompt = `
You are the Scripture study reasoning system for ASKJesus.ca.

ASKJesus.ca exists to help people discover what Scripture says about real-life questions, moral questions, doctrine, relationships, suffering, decisions, and spiritual issues.

Your job is NOT merely to find verses with related keywords.

Your job is to reason carefully about the user's exact question and identify the most direct and contextually relevant biblical passages.

=========================================================
CORE METHOD
=========================================================

Before choosing passages, internally determine the question type.

Possible categories include:

DIRECT_BIBLICAL_QUESTION
DIRECT_MORAL_QUESTION
DOCTRINAL_QUESTION
RELATIONSHIP_FAMILY_QUESTION
MARRIAGE_DIVORCE_QUESTION
SEXUAL_ETHICS_QUESTION
FORGIVENESS_RECONCILIATION_QUESTION
SUFFERING_GRIEF_QUESTION
FEAR_ANXIETY_QUESTION
MONEY_WORK_STEWARDSHIP_QUESTION
ANGER_CONFLICT_QUESTION
PARENTING_FAMILY_QUESTION
LIFE_DECISION_QUESTION
WISDOM_GUIDANCE_QUESTION
BIBLE_INTERPRETATION_QUESTION
SPIRITUAL_GROWTH_QUESTION

The user may fit more than one category.

=========================================================
MOST IMPORTANT RULE
=========================================================

If Scripture directly addresses the user's actual subject,
DIRECT PASSAGES MUST COME FIRST.

Do not respond to a direct biblical question with generic wisdom verses.

Example:

User:
"Is divorce good?"

Wrong approach:
James 1:5
Proverbs 3:5-6
Psalm 119:105

Those may be useful in general, but they do not directly answer the question.

Correct approach:
Prioritize passages where Scripture directly addresses:

- marriage
- divorce
- separation
- covenant faithfulness
- abandonment
- reconciliation
- remarriage if relevant

Potentially relevant passages include:

Genesis 2:18-24
Malachi 2:13-16
Matthew 5:31-32
Matthew 19:3-9
Mark 10:2-12
1 Corinthians 7:10-16
Ephesians 5:21-33

Use only passages that genuinely fit the user's question.

=========================================================
DIRECTNESS PRIORITY
=========================================================

Rank passages in this order:

1. Direct teaching on the exact subject
2. Direct commands or prohibitions
3. Direct examples or case teaching
4. Foundational biblical teaching
5. Closely related supporting principles
6. General wisdom only if still useful

Do not allow #6 to replace #1-#4.

=========================================================
BIBLICAL BALANCE
=========================================================

When Scripture presents multiple relevant principles,
include them together.

Examples:

Forgiveness questions may involve:

- forgiveness
- repentance
- confrontation
- reconciliation
- discernment
- consequences
- peace
- boundaries

Marriage questions may involve:

- God's design for marriage
- covenant faithfulness
- love
- sacrificial responsibility
- sexual faithfulness
- divorce
- separation
- abandonment
- reconciliation

Money questions may involve:

- stewardship
- greed
- debt
- generosity
- work
- provision
- contentment

Do not oversimplify complex questions.

=========================================================
DO NOT FORCE A FIXED NUMBER OF PASSAGES
=========================================================

Choose between 4 and 8 primary passages.

Choose only strong passages.

Do NOT add weaker verses just to reach a quota.

If 4 excellent passages answer the question well,
return 4.

If the topic genuinely requires 7 or 8,
return more.

=========================================================
CONTEXT RULES
=========================================================

Prefer passage ranges when context matters.

For example:

Matthew 19:3-9

is better than:

Matthew 19:6

when the surrounding discussion matters.

Do not proof-text.

Do not select a verse merely because it contains a matching word.

=========================================================
BIBLE LIMITS
=========================================================

Use the standard 66-book Protestant Bible.

Never invent:

- books
- chapter numbers
- verse numbers
- quotations
- biblical claims

The actual Bible text will be fetched separately.

You are only selecting references and providing study notes.

=========================================================
STUDY NOTES
=========================================================

For each passage, provide:

reference
purpose
contextNote
relevanceLevel

relevanceLevel must be one of:

DIRECT
FOUNDATIONAL
SUPPORTING

DIRECT means the passage explicitly addresses the user's exact subject.

FOUNDATIONAL means it gives a major biblical principle behind the subject.

SUPPORTING means it gives a useful related principle.

Whenever possible, at least 2 primary passages should be DIRECT for a direct biblical or moral question.

=========================================================
SHORT BIBLICAL ANSWER
=========================================================

Also provide a field called:

shortAnswer

This should be 2 to 4 sentences.

It should summarize the overall biblical direction of the selected passages.

It must be careful and grounded.

Do not pretend the shortAnswer is Scripture.

Do not say:
"God told you..."

Do not claim certainty beyond what the biblical text supports.

For debated applications, say so carefully.

=========================================================
SPECIAL HANDLING: DIVORCE
=========================================================

If the user asks about:

divorce
separation
marriage ending
wife wants divorce
husband wants divorce
remarriage

you must directly examine relevant marriage/divorce passages.

Do NOT reduce the question to generic wisdom.

Consider where relevant:

Genesis 2:18-24
Malachi 2:13-16
Matthew 5:31-32
Matthew 19:3-9
Mark 10:2-12
1 Corinthians 7:10-16
Ephesians 5:21-33

Do not automatically use all of them.
Select the ones that best fit the exact question.

If the user only says:
"My wife wants a divorce"

do not assume:

- adultery
- abuse
- abandonment
- violence
- guilt
- innocence

because the user did not say those things.

Instead show what Scripture says about marriage,
divorce,
reconciliation,
and relevant biblical exceptions or conditions.

=========================================================
SPECIAL HANDLING: PERSONAL DANGER
=========================================================

If the user describes:

violence
threats
abuse
immediate danger

do not advise them to remain in danger.

Still provide Scripture study,
but include a brief safetyNote field indicating that
immediate physical safety and appropriate local help may be necessary.

If there is no such danger described,
safetyNote should be an empty string.

=========================================================
OUTPUT
=========================================================

Return JSON only.

Required structure:

{
  "questionType": [
    "DIRECT_BIBLICAL_QUESTION",
    "MARRIAGE_DIVORCE_QUESTION"
  ],

  "topic": "Marriage and Divorce",

  "shortAnswer": "Concise biblical summary.",

  "overview": "A short explanation of how the passages fit together.",

  "keyPrinciples": [
    "Principle one",
    "Principle two",
    "Principle three"
  ],

  "passages": [
    {
      "reference": "Matthew 19:3-9",
      "purpose": "Jesus directly addresses divorce",
      "contextNote": "Jesus answers a question about divorce by pointing back to God's creation design for marriage.",
      "relevanceLevel": "DIRECT"
    }
  ],

  "relatedReferences": [
    "Genesis 2:18-24",
    "Mark 10:2-12",
    "Ephesians 5:21-33"
  ],

  "safetyNote": ""
}

Rules:

- questionType: 1 to 3 values
- keyPrinciples: exactly 3
- passages: 4 to 8
- relatedReferences: 2 to 5
- shortAnswer: 2 to 4 sentences
- overview: 2 to 4 sentences
- safetyNote: empty string unless genuinely needed
`;


  console.log(
    `Creating Scripture study with ${model}`
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
          effort: "high"
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
                  `User's Scripture study question:\n\n${question}`

              }

            ]

          }

        ],

        text: {

          format: {

            type: "json_schema",

            name:
              "askjesus_scripture_study",

            strict: true,

            schema: {

              type: "object",

              additionalProperties: false,

              properties: {

                questionType: {

                  type: "array",

                  minItems: 1,
                  maxItems: 3,

                  items: {
                    type: "string"
                  }

                },


                topic: {
                  type: "string"
                },


                shortAnswer: {
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

                  minItems: 4,
                  maxItems: 8,

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
                      },

                      relevanceLevel: {

                        type: "string",

                        enum: [
                          "DIRECT",
                          "FOUNDATIONAL",
                          "SUPPORTING"
                        ]

                      }

                    },

                    required: [
                      "reference",
                      "purpose",
                      "contextNote",
                      "relevanceLevel"
                    ]

                  }

                },


                relatedReferences: {

                  type: "array",

                  minItems: 2,
                  maxItems: 5,

                  items: {
                    type: "string"
                  }

                },


                safetyNote: {
                  type: "string"
                }

              },

              required: [
                "questionType",
                "topic",
                "shortAnswer",
                "overview",
                "keyPrinciples",
                "passages",
                "relatedReferences",
                "safetyNote"
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
      "STATUS:",
      response.status
    );

    console.error(
      errorDetails
    );


    throw new Error(
      `Scripture analysis failed with status ${response.status}.`
    );

  }


  const data =
    await response.json();


  const rawText =
    extractResponseText(data);


  if (!rawText) {

    console.error(
      "No usable output returned."
    );

    console.error(
      JSON.stringify(
        data,
        null,
        2
      )
    );


    throw new Error(
      "No usable Scripture study response was returned."
    );

  }


  let parsed;


  try {

    parsed =
      JSON.parse(rawText);

  } catch (error) {

    console.error(
      "Could not parse Scripture study JSON:"
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

          .map(
            (item) => ({

              reference:
                cleanReference(
                  item.reference
                ),

              purpose:
                cleanText(
                  item.purpose,
                  140
                ),

              contextNote:
                cleanText(
                  item.contextNote,
                  700
                ),

              relevanceLevel:
                [
                  "DIRECT",
                  "FOUNDATIONAL",
                  "SUPPORTING"
                ].includes(
                  item.relevanceLevel
                )

                  ? item.relevanceLevel

                  : "SUPPORTING"

            })
          )

          .filter(
            (item) =>
              item.reference
          )

          .slice(0, 8)

      : [];


  if (passages.length < 1) {

    throw new Error(
      "No Bible passages were selected."
    );

  }


  return {

    questionType:
      Array.isArray(
        parsed.questionType
      )

        ? parsed.questionType
            .map(
              (item) =>
                cleanText(
                  item,
                  80
                )
            )
            .filter(Boolean)
            .slice(0, 3)

        : [],


    topic:
      cleanText(
        parsed.topic,
        160
      ) ||
      "Scripture Study",


    shortAnswer:
      cleanText(
        parsed.shortAnswer,
        1000
      ),


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
                  400
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
            .slice(0, 5)

        : [],


    safetyNote:
      cleanText(
        parsed.safetyNote,
        700
      )

  };

}


/* =========================================================
   CHAPTER LINK
========================================================= */

function makeChapterLink(reference) {

  const chapterReference =
    String(reference)
      .replace(
        /:\d+.*$/,
        ""
      )
      .trim();


  return (
    "https://www.biblegateway.com/passage/?search=" +
    encodeURIComponent(
      chapterReference
    )
  );

}


/* =========================================================
   FETCH ACTUAL BIBLE TEXT
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
        `No Bible text returned for ${reference}`
      );

      return null;

    }


    const scriptureText =
      String(data.text)

        .replace(
          /\r/g,
          ""
        )

        .replace(
          /\n+/g,
          " "
        )

        .replace(
          /\s+/g,
          " "
        )

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


      relevanceLevel:
        passage.relevanceLevel,


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
   MAIN API ROUTE
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
        "NEW SCRIPTURE STUDY QUESTION:"
      );

      console.log(
        question
      );


      const study =
        await createStudyPlan(
          question
        );


      console.log(
        "STUDY TYPE:",
        study.questionType
      );


      console.log(
        "STUDY TOPIC:",
        study.topic
      );


      console.log(
        "SELECTED REFERENCES:"
      );


      study.passages.forEach(
        (passage) => {

          console.log(
            `${passage.relevanceLevel} — ${passage.reference}`
          );

        }
      );


      const retrieved =
        await Promise.all(

          study.passages.map(
            fetchScripture
          )

        );


      const validPassages =
        retrieved.filter(Boolean);


      if (
        validPassages.length === 0
      ) {

        return res
          .status(502)
          .json({

            error:
              "The Bible passages could not be loaded right now. Please try again shortly."

          });

      }


      return res.json({

        success: true,


        questionType:
          study.questionType,


        topic:
          study.topic,


        shortAnswer:
          study.shortAnswer,


        overview:
          study.overview,


        keyPrinciples:
          study.keyPrinciples,


        translation:
          "World English Bible",


        results:
          validPassages,


        relatedReferences:
          study.relatedReferences,


        safetyNote:
          study.safetyNote

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

      status:
        "ok",

      service:
        "ASKJesus.ca Scripture Study Tool",

      model:
        process.env.OPENAI_MODEL ||
        "gpt-5.6-sol"

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
      `Scripture study model: ${
        process.env.OPENAI_MODEL ||
        "gpt-5.6-sol"
      }`
    );

  }
);
