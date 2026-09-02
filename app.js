/* =========================================================
   ASKJesus.ca
   Scripture Finder
   ========================================================= */

const input = document.querySelector("#input");
const button = document.querySelector("#submit");
const status = document.querySelector("#status");
const results = document.querySelector("#results");


/* =========================================================
   STARTUP
   ========================================================= */

if (!input || !button || !results) {

  console.error(
    "ASKJesus.ca: Required page elements were not found."
  );

} else {

  button.addEventListener("click", run);

  /*
    On computers:
    Ctrl + Enter
    or
    Command + Enter

    will submit the question.
  */

  input.addEventListener("keydown", (event) => {

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key === "Enter"
    ) {

      event.preventDefault();

      run();

    }

  });

}


/* =========================================================
   SAFELY DISPLAY TEXT
   ========================================================= */

function escapeHtml(value) {

  return String(value ?? "")
    .replace(
      /[&<>"']/g,
      (character) => {

        const entities = {

          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;"

        };

        return entities[character];

      }
    );

}


/* =========================================================
   CREATE FULL CHAPTER LINK
   ========================================================= */

function getChapterLink(reference) {

  if (!reference) {
    return "https://www.biblegateway.com/";
  }

  /*
    Examples:

    John 3:16
       becomes
    John 3

    Matthew 18:15-17
       becomes
    Matthew 18

    1 Corinthians 13:4-7
       becomes
    1 Corinthians 13
  */

  const cleanedReference =
    String(reference)
      .replace(/[–—]/g, "-")
      .trim();


  const match =
    cleanedReference.match(
      /^((?:[1-3]\s+)?[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+)/
    );


  let chapterReference = cleanedReference;


  if (match) {

    const book = match[1];
    const chapter = match[2];

    chapterReference =
      `${book} ${chapter}`;

  }


  return (
    "https://www.biblegateway.com/passage/" +
    "?search=" +
    encodeURIComponent(chapterReference) +
    "&version=WEB"
  );

}


/* =========================================================
   FIND SCRIPTURE
   ========================================================= */

async function run() {

  const question =
    input.value.trim();


  /* -------------------------------------------------------
     NO QUESTION
     ------------------------------------------------------- */

  if (!question) {

    if (status) {

      status.textContent =
        "Please enter a question or situation first.";

    }

    input.focus();

    return;

  }


  /* -------------------------------------------------------
     LOADING STATE
     ------------------------------------------------------- */

  button.disabled = true;

  button.innerHTML = `
    <span
      class="search-icon"
      aria-hidden="true"
    >
      ⌕
    </span>

    SEARCHING...
  `;


  if (status) {

    status.textContent =
      "Searching Scripture for passages relevant to your question…";

  }


  results.innerHTML = "";


  try {


    /* =====================================================
       SEND QUESTION TO SERVER
       ===================================================== */

    const response =
      await fetch(
        "/api/ask",
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              question: question

            })

        }
      );


    /* =====================================================
       MAKE SURE SERVER RETURNED JSON
       ===================================================== */

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";


    if (
      !contentType.includes(
        "application/json"
      )
    ) {

      const text =
        await response.text();


      console.error(
        "Expected JSON but received:",
        text
      );


      throw new Error(
        `Server returned an unexpected response (${response.status}).`
      );

    }


    /* =====================================================
       READ RESPONSE
       ===================================================== */

    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(

        data.error ||

        `Request failed with status ${response.status}.`

      );

    }


    const passages =
      Array.isArray(data.passages)
        ? data.passages
        : [];


    /* =====================================================
       NOTHING FOUND
       ===================================================== */

    if (!passages.length) {

      results.innerHTML = `

        <div class="error">

          No Scripture passages were returned.

          Please try asking your question
          another way.

        </div>

      `;


      if (status) {

        status.textContent = "";

      }


      return;

    }


    /* =====================================================
       CREATE SCRIPTURE CARDS
       ===================================================== */

    results.innerHTML =
      passages
        .map(
          (passage) => {


            const reference =

              passage.reference ||

              passage.ref ||

              "Scripture";


            const text =

              passage.text ||

              "Scripture text could not be retrieved.";


            const translation =

              passage.translation ||

              "World English Bible";


            /*
              If server.js already provides chapterUrl,
              use it.

              Otherwise app.js creates one.
            */

            const chapterUrl =

              passage.chapterUrl ||

              getChapterLink(reference);


            return `

              <article class="verse">


                <div class="ref">

                  ${escapeHtml(reference)}

                </div>


                <div class="text">

                  ${escapeHtml(text)}

                </div>


                <div class="translation">

                  ${escapeHtml(translation)}

                </div>


                <div class="chapter-link-wrap">

                  <a
                    class="chapter-link"
                    href="${escapeHtml(chapterUrl)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Read the full chapter containing ${escapeHtml(reference)}"
                  >

                    READ FULL CHAPTER →

                  </a>

                </div>


              </article>

            `;

          }
        )
        .join("");


    /* =====================================================
       SUCCESS MESSAGE
       ===================================================== */

    if (status) {

      status.textContent =

        `${passages.length} Scripture passage${
          passages.length === 1
            ? ""
            : "s"
        } found.`;

    }


    /* =====================================================
       SCROLL TO RESULTS
       ===================================================== */

    setTimeout(
      () => {

        const resultsArea =
          document.querySelector(
            ".results-area"
          );


        if (resultsArea) {

          resultsArea.scrollIntoView({

            behavior: "smooth",

            block: "start"

          });

        } else {

          results.scrollIntoView({

            behavior: "smooth",

            block: "start"

          });

        }

      },

      100
    );


  } catch (error) {


    /* =====================================================
       ERROR
       ===================================================== */

    console.error(
      "ASKJesus.ca request error:",
      error
    );


    results.innerHTML = `

      <div class="error">

        ${escapeHtml(

          error.message ||

          "We couldn't retrieve Scripture right now. Please try again."

        )}

      </div>

    `;


    if (status) {

      status.textContent =
        "Something went wrong. Please try again.";

    }


  } finally {


    /* =====================================================
       RESTORE BUTTON
       ===================================================== */

    button.disabled = false;


    button.innerHTML = `

      <span
        class="search-icon"
        aria-hidden="true"
      >
        ⌕
      </span>

      FIND SCRIPTURE

    `;

  }

}
