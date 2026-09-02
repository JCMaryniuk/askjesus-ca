/* =========================================================
   ASKJESUS.CA — SMARTER SCRIPTURE STUDY SERVER
   ES MODULE VERSION FOR RENDER

   What this version does:

   1. Understands the user's situation
   2. Identifies the main biblical themes
   3. Selects 6 primary Scripture passages
   4. Provides short study-context notes
   5. Fetches the ACTUAL Bible text
   6. Provides additional related references
   7. Keeps Scripture and study notes clearly separated
========================================================= */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";


/* =========================================================
   ES MODULE PATH SETUP
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
   HELPERS
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


function cleanText(value, maxLength = 700) {

  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}


/* =========================================================
   PARSE TEXT FROM RESPONSES API
========================================================= */

function extractResponseText(data) {

  if (!data) {
    return "";
  }


  /*
    Some API responses expose output_text directly.
  */

  if (
    typeof data.output_text === "string" &&
    data.output_text.trim()
  ) {

    return data.output_text.trim();

  }


  /*
    Otherwise inspect output message content.
  */

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
   SMART SCRIPTURE STUDY ANALYSIS
========================================================= */

async function createStudyPlan(question) {

  if (!process.env.OPENAI_API_KEY) {

    throw new Error(
      "Scripture study service is not configured."
    );

  }


  const systemPrompt = `
You are the biblical study-planning component for ASKJesus.ca.

ASKJesus.ca is a Scripture study tool.

Your job is to help identify Bible passages and organize them into a careful, balanced Scripture study.

DO NOT pretend that your commentary is Scripture.

The Bible passages themselves will be retrieved separately from a Bible text source.

Your responsibilities:

1. Understand the user's actual question or situation.
2. Identify the main biblical themes involved.
3. Select 6 primary Bible passages that directly address the issue.
4. Prefer meaningful passage ranges rather than isolated proof-texts when context matters.
5. Consider multiple biblical dimensions when appropriate.
6. Avoid simply repeating passages that all make the same point.
7. Include both encouragement and correction when Scripture contains both.
8. Distinguish forgiveness, reconciliation, trust, wisdom, consequences, responsibility, grace, repentance, justice, mercy, or other concepts when relevant.
9. Never invent Bible references.
10. Use the standard 66-book Protestant Bible.
11. Keep study notes concise and careful.
12. Do not tell the user that a study note is a Bible quotation.
13. Do not claim certainty where Scripture allows different reasonable applications.
14. Do not make the answer into general motivational advice.
15. Focus the study on Scripture.

For each primary passage, provide:

- reference
- purpose
- contextNote

contextNote should be 1 or 2 sentences explaining why the passage matters to this study and what the surrounding context is about.

Also provide:

- topic: short study title
- overview: 2 to 4 sentences describing the major biblical themes that the passages address
- keyPrinciples: 3 concise principles
- relatedReferences: 4 additional Bible references for further study

Return JSON only.

Required JSON structure:

{
  "topic": "Forgiveness, Trust, and Discernment",
  "overview": "Short Scripture-focused overview.",
  "keyPrinciples": [
    "Principle one",
    "Principle two",
    "Principle three"
  ],
  "passages": [
    {
      "reference": "Proverbs 14:15",
      "purpose": "Discernment",
      "contextNote": "Short context note."
    }
  ],
  "relatedReferences": [
    "Proverbs 22:3",
    "Luke 17:3-4",
    "Romans 12:18",
    "Psalm 1:1-3"
  ]
}

Exactly 6 primary passages whenever possible.
Exactly 3 key principles.
Exactly 4 related references whenever possible.
`;


  const response = await fetch(
    "https://api.openai.com/v1/responses",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },

      body: JSON.stringify({

        model:
          process.env.OPENAI_MODEL ||
          "gpt-5.6-terra",

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
                text: question
              }
            ]
          }
        ],

        text: {
          format: {
            type: "json_schema",

            name: "scripture_study",

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

    const details =
      await response.text().catch(() => "");

    console.error(
      "Study analysis service error:",
      response.status,
      details
    );

    throw new Error(
      "The Scripture study analysis is temporarily unavailable."
    );

  }


  const data = await response.json();

  const rawText =
    extractResponseText(data);


  if (!rawText) {

    throw new Error(
      "No Scripture study plan was returned."
    );

  }


  let parsed;


  try {

    parsed = JSON.parse(rawText);

  } catch (error) {

    console.error(
      "Study JSON parse error:",
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
              cleanReference(item.reference),

            purpose:
              cleanText(item.purpose, 80),

            contextNote:
              cleanText(item.contextNote, 500)
          }))
          .filter(
            (item) =>
              item.reference
          )
          .slice(0, 6)
      : [];


  if (passages.length === 0) {

    throw new Error(
      "No Bible passages were selected."
    );

  }


  return {

    topic:
      cleanText(
        parsed.topic,
        120
      ) ||
      "Scripture Study",

    overview:
      cleanText(
        parsed.overview,
        1000
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
                  300
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
   FALLBACK STUDY
========================================================= */

function getFallbackStudy(question) {

  const text =
    question.toLowerCase();


  if (
    text.includes("trust") ||
    text.includes("lie") ||
    text.includes("lying")
  ) {

    return {

      topic:
        "Trust, Forgiveness, and Discernment",

      overview:
        "Scripture teaches forgiveness while also calling believers to wisdom, truth, repentance, and discernment. Reconciliation and restored trust can involve honesty, changed behavior, and careful judgment.",

      keyPrinciples: [
        "Forgiveness does not require pretending wrongdoing did not occur.",
        "Biblical wisdom includes careful discernment rather than unquestioning trust.",
        "Reconciliation should pursue truth, repentance, peace, and restoration."
      ],

      passages: [

        {
          reference: "Proverbs 14:15-16",
          purpose: "Discernment",
          contextNote:
            "This section of Proverbs contrasts gullibility with careful judgment and wise awareness of danger."
        },

        {
          reference: "Matthew 18:15-17",
          purpose: "Addressing wrongdoing",
          contextNote:
            "Jesus describes a process for confronting sin directly and seeking restoration rather than ignoring the problem."
        },

        {
          reference: "Luke 17:3-4",
          purpose: "Forgiveness and repentance",
          contextNote:
            "Jesus connects rebuke, repentance, and repeated forgiveness in relationships."
        },

        {
          reference: "Ephesians 4:25-32",
          purpose: "Truth and forgiveness",
          contextNote:
            "Paul places forgiveness within a broader call to honesty, changed conduct, kindness, and Christlike relationships."
        },

        {
          reference: "Romans 12:17-21",
          purpose: "Responding to wrongdoing",
          contextNote:
            "Paul teaches believers not to repay evil with evil and to pursue peace while leaving final judgment to God."
        },

        {
          reference: "Proverbs 22:3",
          purpose: "Wise caution",
          contextNote:
            "Proverbs commends the prudent person who recognizes danger and responds wisely rather than ignoring it."
        }

      ],

      relatedReferences: [
        "Colossians 3:12-13",
        "Psalm 37:3-7",
        "1 Corinthians 13:4-7",
        "James 1:5"
      ]

    };

  }


  if (
    text.includes("fear") ||
    text.includes("anxious") ||
    text.includes("anxiety") ||
    text.includes("worry")
  ) {

    return {

      topic:
        "Fear, Anxiety, and Trust",

      overview:
        "Scripture repeatedly directs God's people to bring anxiety to Him, remember His presence, and place their confidence in His care. These passages combine prayer, trust, perspective, and God's promises.",

      keyPrinciples: [
        "Bring anxiety and requests to God in prayer.",
        "Remember God's presence and faithfulness.",
        "Focus on God's kingdom and today's responsibilities rather than being consumed by tomorrow."
      ],

      passages: [

        {
          reference: "Philippians 4:4-9",
          purpose: "Prayer and peace",
          contextNote:
            "Paul teaches prayer, thanksgiving, disciplined thought, and confidence in God's peace."
        },

        {
          reference: "Matthew 6:25-34",
          purpose: "Worry",
          contextNote:
            "Jesus addresses anxiety about everyday needs and directs His listeners toward trust in the Father's care."
        },

        {
          reference: "Isaiah 41:8-10",
          purpose: "God's presence",
          contextNote:
            "God reassures His people that they belong to Him and need not fear because He will strengthen and uphold them."
        },

        {
          reference: "Psalm 56:3-4",
          purpose: "Fear and trust",
          contextNote:
            "The psalmist responds to fear by deliberately placing trust in God."
        },

        {
          reference: "1 Peter 5:6-9",
          purpose: "Casting cares on God",
          contextNote:
            "Peter connects humility, handing anxieties to God, vigilance, and steadfast faith."
        },

        {
          reference: "Psalm 23:1-6",
          purpose: "God's care",
          contextNote:
            "David describes God's guidance, provision, presence, and protection through both peaceful and difficult circumstances."
        }

      ],

      relatedReferences: [
        "Psalm 46:1-3",
        "John 14:27",
        "Proverbs 3:5-6",
        "Psalm 34:4"
      ]

    };

  }


  return {

    topic:
      "Wisdom and Guidance",

    overview:
      "Scripture consistently directs people to seek God's wisdom, trust His direction, examine their ways carefully, and allow His Word to guide their decisions.",

    keyPrinciples: [
      "Ask God for wisdom.",
      "Trust God rather than relying only on personal understanding.",
      "Use Scripture as a guide for decisions and conduct."
    ],

    passages: [

      {
        reference: "James 1:5-8",
        purpose: "Seeking wisdom",
        contextNote:
          "James encourages believers who lack wisdom to ask God, who gives generously."
      },

      {
        reference: "Proverbs 3:5-7",
        purpose: "Trusting God's direction",
        contextNote:
          "This passage contrasts trusting God with depending entirely on one's own understanding."
      },

      {
        reference: "Psalm 119:105",
        purpose: "Guidance through Scripture",
        contextNote:
          "The psalmist describes God's Word as a source of direction for the path ahead."
      },

      {
        reference: "Psalm 32:8-9",
        purpose: "Instruction",
        contextNote:
          "This passage emphasizes receiving instruction and responding willingly rather than stubbornly."
      },

      {
        reference: "Proverbs 15:22",
        purpose: "Wise counsel",
        contextNote:
          "Proverbs highlights the value of receiving counsel when making plans."
      },

      {
        reference: "Romans 12:1-2",
        purpose: "Discernment",
        contextNote:
          "Paul connects transformed thinking with discerning what is good and pleasing to God."
      }

    ],

    relatedReferences: [
      "Proverbs 16:3",
      "Proverbs 16:9",
      "Psalm 25:4-5",
      "Colossians 3:16"
    ]

  };

}


/* =========================================================
   CHAPTER LINK
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
   FETCH ACTUAL SCRIPTURE
========================================================= */

async function fetchScripture(
  passage
) {

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
        "Bible lookup failed:",
        reference,
        response.status
      );

      return null;

    }


    const data =
      await response.json();


    if (!data?.text) {

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
      "Bible retrieval error:",
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
              "Please describe the question, topic, decision, struggle, or situation you would like to study."

          });

      }


      if (
        question.length < 4
      ) {

        return res
          .status(400)
          .json({

            error:
              "Please provide a little more detail for your Scripture study."

          });

      }


      let study;


      try {

        study =
          await createStudyPlan(
            question
          );

      } catch (error) {

        console.error(
          "Using backup Scripture study:",
          error.message
        );


        study =
          getFallbackStudy(
            question
          );

      }


      const passages =
        await Promise.all(

          study.passages.map(
            fetchScripture
          )

        );


      const validPassages =
        passages.filter(Boolean);


      if (
        validPassages.length === 0
      ) {

        return res
          .status(502)
          .json({

            error:
              "Scripture could not be retrieved right now. Please try again shortly."

          });

      }


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
        "Scripture study endpoint error:",
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
   HEALTH
========================================================= */

app.get(
  "/api/health",
  (req, res) => {

    res.json({

      status:
        "ok",

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
