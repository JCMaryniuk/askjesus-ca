import express from "express";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------------------------------------
// BASIC SERVER SETTINGS
// ----------------------------------------------------

app.disable("x-powered-by");

app.use(
  express.json({
    limit: "20kb"
  })
);

// Serve website files from this project folder
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

const MODEL =
  process.env.OPENAI_MODEL || "gpt-5-mini";

// ----------------------------------------------------
// FALLBACK SCRIPTURE REFERENCES
//
// These are only used if OpenAI is unavailable,
// errors, or cannot return usable references.
//
// OpenAI should normally make the specific selections.
// ----------------------------------------------------

const FALLBACKS = {
  fear: [
    "Psalm 27:1-5",
    "Psalm 56:3-4",
    "Isaiah 41:8-13",
    "Matthew 10:26-31",
    "Hebrews 13:5-6"
  ],

  anxiety: [
    "Psalm 94:18-19",
    "Matthew 6:25-34",
    "Philippians 4:4-9",
    "1 Peter 5:6-9",
    "Psalm 55:16-23"
  ],

  worry: [
    "Matthew 6:25-34",
    "Luke 12:22-32",
    "Philippians 4:4-9",
    "1 Peter 5:6-9",
    "Psalm 37:1-7"
  ],

  marriage: [
    "Genesis 2:18-24",
    "Matthew 19:4-6",
    "Ephesians 5:21-33",
    "Colossians 3:12-19",
    "1 Peter 3:1-9"
  ],

  husband: [
    "Ephesians 5:25-33",
    "Colossians 3:19",
    "1 Peter 3:7",
    "1 Corinthians 7:3-5",
    "Genesis 2:24"
  ],

  wife: [
    "Ephesians 5:22-33",
    "Colossians 3:18-19",
    "1 Peter 3:1-6",
    "Proverbs 31:10-31",
    "1 Corinthians 7:3-5"
  ],

  divorce: [
    "Malachi 2:13-16",
    "Matthew 19:3-9",
    "Mark 10:2-12",
    "1 Corinthians 7:10-16",
    "Romans 12:17-21"
  ],

  forgiveness: [
    "Matthew 6:12-15",
    "Matthew 18:21-35",
    "Luke 17:3-4",
    "Ephesians 4:31-32",
    "Colossians 3:12-13"
  ],

  betrayed: [
    "Psalm 55:12-23",
    "Luke 22:47-62",
    "Romans 12:17-21",
    "Ephesians 4:31-32",
    "Proverbs 25:9-10"
  ],

  betrayal: [
    "Psalm 55:12-23",
    "Matthew 26:20-25",
    "Luke 22:47-62",
    "Romans 12:17-21",
    "1 Peter 2:21-23"
  ],

  trust: [
    "Psalm 37:3-7",
    "Proverbs 14:15",
    "Proverbs 22:3",
    "Jeremiah 17:5-8",
    "John 2:23-25"
  ],

  anger: [
    "Proverbs 15:1",
    "Proverbs 19:11",
    "Proverbs 29:11",
    "Ephesians 4:26-32",
    "James 1:19-20"
  ],

  bitterness: [
    "Ephesians 4:31-32",
    "Hebrews 12:14-15",
    "Romans 12:17-21",
    "Colossians 3:12-15",
    "Matthew 18:21-35"
  ],

  grief: [
    "Psalm 34:17-18",
    "Psalm 42:1-11",
    "John 11:32-36",
    "1 Thessalonians 4:13-18",
    "Revelation 21:1-5"
  ],

  death: [
    "Psalm 23:1-6",
    "John 11:21-27",
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

  lust: [
    "Matthew 5:27-30",
    "1 Corinthians 6:12-20",
    "2 Timothy 2:22",
    "1 Thessalonians 4:3-8",
    "Job 31:1"
  ],

  money: [
    "Matthew 6:19-34",
    "Luke 12:13-34",
    "1 Timothy 6:6-10",
    "1 Timothy 6:17-19",
    "Hebrews 13:5-6"
  ],

  debt: [
    "Proverbs 6:1-5",
    "Proverbs 22:7",
    "Romans 13:7-8",
    "Luke 14:28-30",
    "Psalm 37:21"
  ],

  work: [
    "Proverbs 11:1-3",
    "Proverbs 16:8",
    "Colossians 3:22-24",
    "Ephesians 6:5-9",
    "1 Thessalonians 4:11-12"
  ],

  job: [
    "Colossians 3:22-24",
    "Ephesians 6:5-9",
    "Proverbs 11:1-3",
    "Daniel 6:1-10",
    "Acts 5:27-29"
  ],

  lie: [
    "Proverbs 12:17-22",
    "Proverbs 19:5",
    "Ephesians 4:25",
    "Colossians 3:9-10",
    "Acts 5:1-11"
  ],

  lying: [
    "Proverbs 12:17-22",
    "Proverbs 19:5",
    "Ephesians 4:25",
    "Colossians 3:9-10",
    "John 8:42-47"
  ],

  guidance: [
    "Psalm 25:4-12",
    "Psalm 119:97-105",
    "Proverbs 16:1-9",
    "Romans 12:1-2",
    "James 1:5-8"
  ],

  decision: [
    "Proverbs 11:14",
    "Proverbs 15:22",
    "Proverbs 16:1-9",
    "Luke 14:28-33",
    "James 1:5-8"
  ],

  wisdom: [
    "Proverbs 2:1-15",
    "Proverbs 4:5-13",
    "James 1:5-8",
    "James 3:13-18",
    "Colossians 1:9-12"
  ],

  lonely: [
    "Psalm 27:7-10",
    "Psalm 68:4-6",
    "Isaiah 49:14-16",
    "John 14:15-23",
    "Hebrews 13:5-6"
  ],

  loneliness: [
    "Psalm 27:7-10",
    "Psalm 68:4-6",
    "Isaiah 49:14-16",
    "John 14:15-23",
    "Hebrews 13:5-6"
  ],

  depressed: [
    "Psalm 42:1-11",
    "Psalm 43:1-5",
    "Lamentations 3:19-26",
    "2 Corinthians 4:7-18",
    "1 Kings 19:1-18"
  ],

  discouraged: [
    "Joshua 1:1-9",
    "Psalm 42:1-11",
    "Galatians 6:7-10",
    "Hebrews 12:1-13",
    "2 Corinthians 4:7-18"
  ],

  hope: [
    "Lamentations 3:19-26",
    "Romans 5:1-5",
    "Romans 8:18-39",
    "1 Peter 1:3-9",
    "Hebrews 6:13-20"
  ],

  faith: [
    "Mark 9:14-29",
    "Romans 10:8-17",
    "Hebrews 11:1-16",
    "James 1:2-8",
    "1 Peter 1:6-9"
  ],

  doubt: [
    "Mark 9:14-29",
    "John 20:24-31",
    "James 1:5-8",
    "Jude 1:20-23",
    "Psalm 73:1-28"
  ],

  sin: [
    "Psalm 51:1-17",
    "Romans 6:1-14",
    "Romans 8:1-14",
    "1 John 1:5-10",
    "1 John 2:1-6"
  ],

  repentance: [
    "Psalm 51:1-17",
    "Isaiah 55:6-7",
    "Luke 15:11-32",
    "Acts 3:19-21",
    "2 Corinthians 7:8-11"
  ],

  guilt: [
    "Psalm 32:1-7",
    "Psalm 51:1-17",
    "Romans 8:1-4",
    "Hebrews 9:11-14",
    "1 John 1:5-10"
  ],

  shame: [
    "Psalm 34:4-5",
    "Isaiah 54:4-8",
    "Romans 8:1-4",
    "Hebrews 12:1-3",
    "1 John 2:28"
  ],

  prayer: [
    "Matthew 6:5-13",
    "Matthew 7:7-11",
    "Luke 18:1-8",
    "Philippians 4:4-7",
    "1 John 5:14-15"
  ],

  parenting: [
    "Deuteronomy 6:4-9",
    "Proverbs 22:6",
    "Ephesians 6:1-4",
    "Colossians 3:20-21",
    "Hebrews 12:5-11"
  ],

  children: [
    "Deuteronomy 6:4-9",
    "Psalm 127:3-5",
    "Proverbs 22:6",
    "Ephesians 6:1-4",
    "Colossians 3:20-21"
  ],

  enemy: [
    "Matthew 5:43-48",
    "Luke 6:27-36",
    "Romans 12:17-21",
    "1 Peter 3:8-12",
    "Proverbs 25:21-22"
  ],

  enemies: [
    "Matthew 5:43-48",
    "Luke 6:27-36",
    "Romans 12:17-21",
    "1 Peter 3:8-12",
    "Proverbs 25:21-22"
  ],

  suffering: [
    "Job 1:20-22",
    "Romans 5:1-5",
    "Romans 8:18-39",
    "2 Corinthians 4:7-18",
    "1 Peter 4:12-19"
  ],

  persecution: [
    "Matthew 5:10-12",
    "John 15:18-25",
    "Acts 5:27-42",
    "2 Timothy 3:10-17",
    "1 Peter 4:12-19"
  ]
};

// ----------------------------------------------------
// DEFAULT REFERENCES
//
// Only used as a last resort.
// ----------------------------------------------------

const DEFAULT_REFERENCES = [
  "Psalm 25:4-12",
  "Proverbs 2:1-15",
  "Matthew 7:7-11",
  "Romans 12:1-2",
  "James 1:5-8"
];

// ----------------------------------------------------
// CLEAN / VALIDATE REFERENCES
// ----------------------------------------------------

function cleanReferences(references) {
  if (!Array.isArray(references)) {
    return [];
  }

  const cleaned = references
    .filter(
      (reference) =>
        typeof reference === "string"
    )
    .map((reference) => reference.trim())
    .filter(Boolean)
    .filter(
      (reference) =>
        reference.length <= 100
    );

  return [...new Set(cleaned)].slice(0, 8);
}

// ----------------------------------------------------
// FALLBACK MATCHER
// ----------------------------------------------------

function fallbackReferences(question) {
  const text = String(question || "")
    .toLowerCase();

  const matches = [];

  for (
    const [keyword, references]
    of Object.entries(FALLBACKS)
  ) {
    if (text.includes(keyword)) {
      matches.push(...references);
    }
  }

  if (!matches.length) {
    return DEFAULT_REFERENCES;
  }

  return [...new Set(matches)].slice(0, 8);
}

// ----------------------------------------------------
// ASK OPENAI TO CHOOSE SCRIPTURE REFERENCES
// ----------------------------------------------------

async function chooseReferences(question) {
  if (!openai) {
    return fallbackReferences(question);
  }

  try {
    const response =
      await openai.chat.completions.create({
        model: MODEL,

        messages: [
          {
            role: "system",

            content: `
You are the Scripture research and reference-selection engine for ASKJesus.ca.

PURPOSE

Your job is to help the user locate Bible passages that most directly address the exact question, circumstance, struggle, decision, relationship, temptation, belief, or life situation they entered.

Scripture is the authority.

You are only selecting passages for the reader to examine.

DO NOT:

- answer the user's question
- write a sermon
- write a devotional
- give personal advice
- pretend to speak for Jesus
- say God personally told the user something
- provide commentary
- provide interpretation in the output

Your final output must contain Bible references only.

----------------------------------------
DEEP ANALYSIS BEFORE SELECTION
----------------------------------------

Before choosing references, SILENTLY analyze the user's question.

Do not output this analysis.

Determine all of the following:

1. PRIMARY ISSUE

Identify what the person is actually asking.

Do not merely match keywords.

2. SECONDARY ISSUES

Identify additional biblical themes that materially affect the question.

For example:

"My friend betrayed me and apologized, but I still do not trust him."

This is NOT merely a question about forgiveness.

It may involve:

- betrayal
- forgiveness
- repentance
- reconciliation
- restored trust
- wisdom
- discernment
- boundaries
- love
- bitterness

Another example:

"My boss wants me to lie so I can keep my job."

This is NOT merely a question about work.

It may involve:

- truthfulness
- integrity
- obedience to God
- human authority
- fear
- provision
- consequences
- courage
- faith

Another example:

"I keep losing my temper with my children."

This involves more than anger.

It may involve:

- anger
- parenting
- self-control
- patience
- speech
- discipline
- gentleness
- repentance
- responsibility

3. SPECIFIC CONTEXT

Identify the details that make THIS question different from a general question about the same subject.

The more specific the user's situation is, the more specific the Scripture selection should be.

4. THE PERSON'S ROLE

When relevant, identify relationships and roles such as:

- husband
- wife
- parent
- child
- friend
- employer
- employee
- church leader
- church member
- authority
- victim
- offender
- believer
- unbeliever

Use passages appropriate to the actual role and relationship involved.

----------------------------------------
IMPORTANT BIBLICAL DISTINCTIONS
----------------------------------------

Do NOT treat these concepts as interchangeable:

- fear vs anxiety vs ordinary concern
- grief vs loneliness vs discouragement
- temptation vs deliberate ongoing sin
- guilt vs shame vs conviction
- forgiveness vs reconciliation
- reconciliation vs restored trust
- marriage conflict vs adultery
- marriage conflict vs abuse
- anger vs bitterness
- anger vs righteous anger
- discipline vs uncontrolled anger
- wisdom vs a direct biblical command
- poverty vs debt
- debt vs greed
- greed vs ordinary financial concern
- generosity vs irresponsible spending
- suffering vs persecution
- doubt vs unbelief
- submission vs participating in wrongdoing
- respecting authority vs obeying sinful commands
- repentance vs merely feeling regret
- consequences vs condemnation
- boundaries vs revenge
- patience vs enabling wrongdoing

The passages selected should reflect the actual distinction present in the user's question.

----------------------------------------
SEARCH THE WHOLE BIBLE
----------------------------------------

Consider relevant passages from across the entire standard Protestant 66-book Bible.

Do not limit yourself to famous verses.

Consider:

- teachings of Jesus
- Torah
- historical narratives
- Psalms
- Proverbs and wisdom literature
- prophets
- Acts
- New Testament letters
- biblical examples
- direct commands
- warnings
- promises
- correction
- repentance
- restoration
- consequences
- encouragement
- Christian character
- wisdom
- justice
- mercy
- holiness
- faith
- obedience

A biblical narrative may sometimes address a situation more specifically than a commonly quoted inspirational verse.

----------------------------------------
SPECIFICITY OVER POPULARITY
----------------------------------------

Prefer a less-famous passage that DIRECTLY addresses the details of the question over a famous verse that only loosely relates.

Do NOT automatically select:

- Proverbs 3:5-6
- Jeremiah 29:11
- Philippians 4:6-7
- Romans 8:28
- Psalm 23
- Matthew 6:25-34

These passages may absolutely be selected when they genuinely fit the question.

However, do not use them simply because they are familiar or broadly encouraging.

The objective is not to provide the most famous verses.

The objective is to provide the most relevant passages.

----------------------------------------
MEANING OVER KEYWORDS
----------------------------------------

Do not select a passage merely because it contains a word also used by the user.

Select passages based on biblical meaning and context.

For example:

A person asking whether they should trust someone again after repeated deception should not receive only verses containing the word "trust."

Consider passages relating to:

- discernment
- fruit
- wisdom
- repentance
- truthfulness
- reconciliation
- prudence

----------------------------------------
BALANCED BIBLICAL RESEARCH
----------------------------------------

When appropriate, return passages addressing different dimensions of the issue.

For example, if another person has sinned against the user, passages might address:

- how the user should respond
- forgiveness
- justice
- wisdom
- the offender's responsibility
- repentance
- reconciliation
- peace
- protection from bitterness

Do not return 8 passages that all say essentially the same thing.

----------------------------------------
DO NOT FORCE COMFORT
----------------------------------------

Not every biblical answer is primarily comforting.

When genuinely relevant, include Scripture involving:

- correction
- warning
- responsibility
- repentance
- consequences
- discipline
- holiness
- obedience
- difficult truth

Do not soften Scripture simply to make the results emotionally pleasing.

At the same time, do not select harsh passages merely for shock value.

Select what is actually relevant.

----------------------------------------
CONTEXT
----------------------------------------

Prefer passages that can be responsibly understood within their surrounding chapter.

Avoid proof-texting.

Where the biblical teaching requires several verses, return an appropriate verse range.

A single verse is acceptable when it expresses the point clearly in context.

Do not intentionally remove a verse from a surrounding argument in a way that changes its meaning.

----------------------------------------
DIFFICULT OR DISPUTED SUBJECTS
----------------------------------------

Some biblical questions involve multiple passages or legitimate interpretive disagreements.

Do not force a yes/no result when Scripture requires consideration of several passages.

Instead, select the passages that a careful Bible reader should examine.

Allow Scripture to provide the material for study.

----------------------------------------
ACCURACY
----------------------------------------

Use ONLY books contained in the standard Protestant 66-book Bible.

Never invent:

- Bible books
- chapters
- verses
- verse ranges

If uncertain whether a reference exists, do not use it.

----------------------------------------
NUMBER OF RESULTS
----------------------------------------

Return between 5 and 8 references.

Aim for 6 or 7 when enough directly relevant passages exist.

Do not add weak references merely to reach 8.

----------------------------------------
OUTPUT FORMAT
----------------------------------------

Return ONLY valid JSON.

No markdown.

No explanation.

No commentary.

No headings.

No analysis.

No advice.

Return exactly this structure:

{
  "references": [
    "Book chapter:verse-verse",
    "Book chapter:verse-verse",
    "Book chapter:verse-verse"
  ]
}
            `.trim()
          },

          {
            role: "user",
            content: `
Find the Bible passages that most specifically and responsibly address this question or situation:

${question}
            `.trim()
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

    const references =
      cleanReferences(parsed.references);

    if (!references.length) {
      return fallbackReferences(question);
    }

    return references;
  } catch (error) {
    console.error(
      "OpenAI Scripture selection failed:",
      error?.message || error
    );

    return fallbackReferences(question);
  }
}

// ----------------------------------------------------
// CREATE FULL-CHAPTER LINK
// ----------------------------------------------------

function createChapterUrl(reference) {
  const value =
    String(reference || "").trim();

  /*
    Examples:

    "John 3:16-18"
       becomes chapter reference "John 3"

    "1 Corinthians 13:4-8"
       becomes "1 Corinthians 13"
  */

  const match =
    value.match(
      /^(.+?)\s+(\d+)(?::\d+(?:-\d+)?)?$/
    );

  if (!match) {
    return null;
  }

  const book = match[1].trim();
  const chapter = match[2];

  const chapterReference =
    `${book} ${chapter}`;

  const params =
    new URLSearchParams({
      search: chapterReference,
      version: "WEB"
    });

  return (
    `https://www.biblegateway.com/passage/?${params.toString()}`
  );
}

// ----------------------------------------------------
// RETRIEVE ACTUAL WORLD ENGLISH BIBLE TEXT
// ----------------------------------------------------

async function fetchPassage(reference) {
  const controller =
    new AbortController();

  const timeout =
    setTimeout(() => {
      controller.abort();
    }, 12000);

  try {
    const url =
      `https://bible-api.com/` +
      `${encodeURIComponent(reference)}` +
      `?translation=web`;

    const response =
      await fetch(url, {
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

    const data =
      await response.json();

    const text =
      String(data.text || "")
        .replace(/\s+/g, " ")
        .trim();

    if (!text) {
      throw new Error(
        `No Scripture text returned for ${reference}`
      );
    }

    const returnedReference =
      data.reference || reference;

    return {
      reference: returnedReference,

      text,

      translation:
        data.translation_name ||
        "World English Bible",

      chapterUrl:
        createChapterUrl(
          returnedReference
        )
    };
  } finally {
    clearTimeout(timeout);
  }
}

// ----------------------------------------------------
// GET PASSAGES FOR A QUESTION
//
// Shared by /api/ask and /api/scripture so both routes
// always behave the same.
// ----------------------------------------------------

async function getScripturePassages(
  question
) {
  const references =
    await chooseReferences(question);

  const results =
    await Promise.allSettled(
      references.map(fetchPassage)
    );

  const passages =
    results
      .filter(
        (result) =>
          result.status === "fulfilled"
      )
      .map(
        (result) =>
          result.value
      )
      .filter(
        (passage) =>
          passage &&
          passage.text
      );

  return passages;
}

// ----------------------------------------------------
// VALIDATE QUESTION
// ----------------------------------------------------

function validateQuestion(req, res) {
  const question =
    String(
      req.body?.question ||
      req.body?.input ||
      ""
    ).trim();

  if (!question) {
    res.status(400).json({
      error:
        "Please enter a question."
    });

    return null;
  }

  if (question.length > 2000) {
    res.status(400).json({
      error:
        "Please keep your question under 2,000 characters."
    });

    return null;
  }

  return question;
}

// ----------------------------------------------------
// HEALTH CHECK
// ----------------------------------------------------

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      ok: true,

      service:
        "ASKJesus.ca",

      aiEnabled:
        Boolean(openai),

      model:
        openai ? MODEL : null
    });
  }
);

// ----------------------------------------------------
// MAIN ASK ENDPOINT
// ----------------------------------------------------

app.post(
  "/api/ask",
  async (req, res) => {
    try {
      const question =
        validateQuestion(req, res);

      if (!question) {
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

// ----------------------------------------------------
// LEGACY /API/SCRIPTURE ROUTE
//
// Keep this route.
//
// Some browsers may have an older cached copy of
// app.js that still calls /api/scripture.
// Keeping this endpoint prevents another 404.
// ----------------------------------------------------

app.post(
  "/api/scripture",
  async (req, res) => {
    try {
      const question =
        validateQuestion(req, res);

      if (!question) {
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
        "ASKJesus.ca /api/scripture error:",
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

// ----------------------------------------------------
// START SERVER
// ----------------------------------------------------

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `ASKJesus.ca running on port ${PORT}`
    );
  }
);
