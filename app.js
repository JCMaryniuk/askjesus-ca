/* =========================================================
   ASKJesus.ca
   Final Scripture Finder
   ========================================================= */

const input = document.querySelector("#input");
const button = document.querySelector("#submit");
const status = document.querySelector("#status");
const results = document.querySelector("#results");


/* =========================================================
   BASIC CHECK
   ========================================================= */

if (!input || !button || !results) {
  console.error("ASKJesus.ca: Required page elements are missing.");
} else {
  button.addEventListener("click", run);

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
   SAFE HTML
   ========================================================= */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      return entities[character];
    });
}


/* =========================================================
   FULL CHAPTER LINK
   ========================================================= */

function getChapterLink(reference) {
  if (!reference) {
    return "https://www.biblegateway.com/";
  }

  const cleanedReference = String(reference)
    .replace(/[–—]/g, "-")
    .trim();

  const match = cleanedReference.match(
    /^((?:[1-3]\s+)?[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+)/
  );

  let chapterReference = cleanedReference;

  if (match) {
    const book = match[1];
    const chapter = match[2];

    chapterReference = `${book} ${chapter}`;
  }

  return (
    "https://www.biblegateway.com/passage/" +
    "?search=" +
    encodeURIComponent(chapterReference) +
    "&version=WEB"
  );
}


/* =========================================================
   UPDATE BUTTON
   ========================================================= */

function setButtonLoading(isLoading) {
  if (isLoading) {
    button.disabled = true;

    button.innerHTML = `
      <span class="search-icon" aria-hidden="true">⌕</span>
      SEARCHING...
    `;
  } else {
    button.disabled = false;

    button.innerHTML = `
      <span class="search-icon" aria-hidden="true">⌕</span>
      FIND SCRIPTURE
    `;
  }
}


/* =========================================================
   SHOW ERROR
   ========================================================= */

function showError(message) {
  results.innerHTML = `
    <div class="error">
      ${escapeHtml(message)}
    </div>
  `;
}


/* =========================================================
   RENDER SCRIPTURE RESULTS
   ========================================================= */

function renderPassages(passages) {
  results.innerHTML = passages
    .map((passage) => {
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
    })
    .join("");
}


/* =========================================================
   SCROLL TO RESULTS
   ========================================================= */

function scrollToResults() {
  const resultsArea =
    document.querySelector(".results-area");

  if (!resultsArea) {
    return;
  }

  setTimeout(() => {
    resultsArea.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 100);
}


/* =========================================================
   MAIN SEARCH
   ========================================================= */

async function run() {
  const question = input.value.trim();

  if (!question) {
    if (status) {
      status.textContent =
        "Please enter a question or situation first.";
    }

    input.focus();
    return;
  }

  if (question.length > 2000) {
    if (status) {
      status.textContent =
        "Please keep your question under 2,000 characters.";
    }

    return;
  }

  setButtonLoading(true);

  results.innerHTML = "";

  if (status) {
    status.textContent =
      "Searching Scripture for passages relevant to your question…";
  }

  try {
    const response = await fetch("/api/ask", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        question
      })
    });


    /* -----------------------------------------------------
       VERIFY JSON
       ----------------------------------------------------- */

    const contentType =
      response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const body = await response.text();

      console.error(
        "ASKJesus.ca expected JSON but received:",
        body
      );

      throw new Error(
        `The server returned an unexpected response (${response.status}).`
      );
    }


    /* -----------------------------------------------------
       READ SERVER RESPONSE
       ----------------------------------------------------- */

    const data = await response.json();

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


    /* -----------------------------------------------------
       NO RESULTS
       ----------------------------------------------------- */

    if (!passages.length) {
      showError(
        "No Scripture passages were returned. Please try asking your question another way."
      );

      if (status) {
        status.textContent = "";
      }

      scrollToResults();
      return;
    }


    /* -----------------------------------------------------
       DISPLAY RESULTS
       ----------------------------------------------------- */

    renderPassages(passages);

    if (status) {
      status.textContent =
        `${passages.length} Scripture passage${
          passages.length === 1 ? "" : "s"
        } found.`;
    }

    scrollToResults();

  } catch (error) {
    console.error(
      "ASKJesus.ca Scripture search error:",
      error
    );

    showError(
      error.message ||
      "We couldn't retrieve Scripture right now. Please try again."
    );

    if (status) {
      status.textContent =
        "Something went wrong. Please try again.";
    }

    scrollToResults();

  } finally {
    setButtonLoading(false);
  }
}
