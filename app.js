/* =========================================================
   ASKJESUS.CA
   APP.JS — INTELLIGENT SCRIPTURE STUDY FRONT END
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
  ======================================================= */

  const mobileMenuButton =
    document.getElementById("mobileMenuButton");

  const mainNavigation =
    document.getElementById("mainNavigation");

  const scriptureForm =
    document.getElementById("scriptureForm");

  const questionInput =
    document.getElementById("questionInput");

  const scriptureResults =
    document.getElementById("scriptureResults");

  const previousResults =
    document.getElementById("previousResults");

  const nextResults =
    document.getElementById("nextResults");

  const messageOverlay =
    document.getElementById("messageOverlay");

  const loadingSpinner =
    document.getElementById("loadingSpinner");

  const messageTitle =
    document.getElementById("messageTitle");

  const messageText =
    document.getElementById("messageText");

  const messageClose =
    document.getElementById("messageClose");


  /* =======================================================
     MOBILE MENU
  ======================================================= */

  if (mobileMenuButton && mainNavigation) {

    mobileMenuButton.addEventListener("click", () => {

      const open =
        mainNavigation.classList.toggle("open");

      mobileMenuButton.setAttribute(
        "aria-expanded",
        open ? "true" : "false"
      );

    });


    mainNavigation
      .querySelectorAll("a")
      .forEach((link) => {

        link.addEventListener("click", () => {

          mainNavigation.classList.remove("open");

          mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
          );

        });

      });

  }


  /* =======================================================
     SAFE HTML
  ======================================================= */

  function escapeHTML(value = "") {

    return String(value)

      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* =======================================================
     MESSAGE OVERLAY
  ======================================================= */

  function showLoading() {

    if (!messageOverlay) {
      return;
    }

    if (messageTitle) {
      messageTitle.textContent =
        "Preparing Your Scripture Study";
    }

    if (messageText) {
      messageText.textContent =
        "Finding the most relevant Bible passages and gathering Scripture in context.";
    }

    if (loadingSpinner) {
      loadingSpinner.style.display = "block";
    }

    if (messageClose) {
      messageClose.style.display = "none";
    }

    messageOverlay.classList.add("show");

    messageOverlay.setAttribute(
      "aria-hidden",
      "false"
    );

  }


  function showMessage(title, text) {

    if (!messageOverlay) {

      alert(text);

      return;

    }

    if (messageTitle) {
      messageTitle.textContent = title;
    }

    if (messageText) {
      messageText.textContent = text;
    }

    if (loadingSpinner) {
      loadingSpinner.style.display = "none";
    }

    if (messageClose) {
      messageClose.style.display = "inline-block";
    }

    messageOverlay.classList.add("show");

    messageOverlay.setAttribute(
      "aria-hidden",
      "false"
    );

  }


  function hideMessage() {

    if (!messageOverlay) {
      return;
    }

    messageOverlay.classList.remove("show");

    messageOverlay.setAttribute(
      "aria-hidden",
      "true"
    );

  }


  messageClose
    ?.addEventListener(
      "click",
      hideMessage
    );


  messageOverlay
    ?.addEventListener(
      "click",
      (event) => {

        if (
          event.target ===
          messageOverlay
        ) {
          hideMessage();
        }

      }
    );


  /* =======================================================
     CLEAN QUESTION TYPE LABEL
  ======================================================= */

  function formatQuestionType(value) {

    return String(value || "")

      .replace(/_/g, " ")

      .toLowerCase()

      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );

  }


  /* =======================================================
     RELEVANCE LABELS
  ======================================================= */

  function relevanceLabel(level) {

    if (level === "DIRECT") {
      return "DIRECT TEACHING";
    }

    if (level === "FOUNDATIONAL") {
      return "FOUNDATIONAL";
    }

    return "SUPPORTING";
  }


  function relevanceStyles(level) {

    if (level === "DIRECT") {

      return {
        background: "#05243d",
        color: "#ffffff",
        border: "#05243d"
      };

    }

    if (level === "FOUNDATIONAL") {

      return {
        background: "#d99a26",
        color: "#ffffff",
        border: "#d99a26"
      };

    }

    return {
      background: "#f5eee2",
      color: "#8f5a0c",
      border: "#d7a24c"
    };

  }


  /* =======================================================
     REMOVE OLD OVERVIEW
  ======================================================= */

  function removeOldStudyOverview() {

    const oldOverview =
      document.getElementById(
        "studyOverview"
      );

    if (oldOverview) {
      oldOverview.remove();
    }

  }


  /* =======================================================
     STUDY HEADER — SCRIPTURE FIRST
  ======================================================= */

  function renderStudyOverview(data) {

    const resultsSection =
      document.getElementById(
        "scripture-results"
      );

    if (!resultsSection) {
      return;
    }


    removeOldStudyOverview();


    const panel =
      document.createElement("div");


    panel.id =
      "studyOverview";


    panel.style.width =
      "min(90%, 1100px)";

    panel.style.margin =
      "18px auto 24px";

    panel.style.padding =
      "24px";

    panel.style.background =
      "#fffdf8";

    panel.style.border =
      "1px solid #d99a26";

    panel.style.borderRadius =
      "10px";

    panel.style.boxShadow =
      "0 8px 24px rgba(0,0,0,0.08)";

    panel.style.color =
      "#10283c";


    const topic =
      escapeHTML(
        data.topic ||
        "Scripture Study"
      );


    const questionTypes =
      Array.isArray(
        data.questionType
      )
        ? data.questionType
        : [];


    const questionTypeHTML =
      questionTypes

        .map((type) => {

          return `

            <span
              style="
                display:inline-block;
                margin:4px 5px 4px 0;
                padding:6px 9px;
                border:1px solid #d8a34a;
                border-radius:3px;
                background:#f7efe2;
                color:#7d5515;
                font-family:Arial,Helvetica,sans-serif;
                font-size:9px;
                font-weight:700;
                letter-spacing:1px;
              "
            >
              ${escapeHTML(formatQuestionType(type))}
            </span>

          `;

        })

        .join("");


    panel.innerHTML = `

      <div
        style="
          color:#a86b10;
          font-family:Arial,Helvetica,sans-serif;
          font-size:9px;
          font-weight:700;
          letter-spacing:3px;
          margin-bottom:7px;
        "
      >
        SCRIPTURE STUDY
      </div>


      <h2
        style="
          font-size:clamp(24px,3vw,34px);
          line-height:1.1;
          margin:0 0 12px;
          color:#10283c;
        "
      >
        ${topic}
      </h2>


      ${
        questionTypeHTML

          ? `

            <div
              style="
                margin-bottom:17px;
              "
            >
              ${questionTypeHTML}
            </div>

          `

          : ""
      }


      <div
        style="
          margin:0;
          padding:16px 17px;
          background:#05243d;
          color:#ffffff;
          border-left:4px solid #dda12e;
          border-radius:5px;
        "
      >

        <div
          style="
            margin-bottom:6px;
            color:#efb847;
            font-family:Arial,Helvetica,sans-serif;
            font-size:9px;
            font-weight:700;
            letter-spacing:2px;
          "
        >
          START WITH SCRIPTURE
        </div>

        <p
          style="
            margin:0;
            font-size:14px;
            line-height:1.55;
          "
        >
          Read the Bible passages below first. AskJesus.ca is designed to help you find and understand Scripture, not replace Scripture with an AI answer.
        </p>

      </div>

    `;


    const title =
      resultsSection.querySelector(
        ".results-title"
      );


    if (title) {

      title.insertAdjacentElement(
        "afterend",
        panel
      );

    } else {

      resultsSection.prepend(
        panel
      );

    }

  }


  /* =======================================================
     REMOVE OLD STUDY NOTES
  ======================================================= */

  function removeOldStudyNotes() {

    const oldNotes =
      document.getElementById(
        "studyNotes"
      );

    if (oldNotes) {
      oldNotes.remove();
    }

  }


  /* =======================================================
     STUDY NOTES — AFTER SCRIPTURE
  ======================================================= */

  function renderStudyNotes(data) {

    if (!scriptureResults) {
      return;
    }


    removeOldStudyNotes();


    const notes =
      document.createElement("div");


    notes.id =
      "studyNotes";


    notes.style.width =
      "min(90%, 1100px)";

    notes.style.margin =
      "28px auto 24px";

    notes.style.padding =
      "24px";

    notes.style.background =
      "#fffdf8";

    notes.style.border =
      "1px solid #d99a26";

    notes.style.borderRadius =
      "10px";

    notes.style.boxShadow =
      "0 8px 24px rgba(0,0,0,0.08)";

    notes.style.color =
      "#10283c";


    const shortAnswer =
      escapeHTML(
        data.shortAnswer ||
        ""
      );


    const overview =
      escapeHTML(
        data.overview ||
        ""
      );


    const principles =
      Array.isArray(
        data.keyPrinciples
      )
        ? data.keyPrinciples
        : [];


    const relatedReferences =
      Array.isArray(
        data.relatedReferences
      )
        ? data.relatedReferences
        : [];


    const safetyNote =
      escapeHTML(
        data.safetyNote ||
        ""
      );


    const principleHTML =
      principles

        .map((principle) => {

          return `

            <li
              style="
                margin:7px 0;
                line-height:1.45;
              "
            >
              ${escapeHTML(principle)}
            </li>

          `;

        })

        .join("");


    const relatedHTML =
      relatedReferences

        .map((reference) => {

          const cleanReference =
            String(reference).trim();


          const url =
            "https://www.biblegateway.com/passage/?search=" +
            encodeURIComponent(
              cleanReference
            );


          return `

            <a
              href="${escapeHTML(url)}"
              target="_blank"
              rel="noopener noreferrer"
              style="
                display:inline-block;
                margin:5px 5px 0 0;
                padding:8px 11px;
                border:1px solid #d49a32;
                border-radius:4px;
                background:#fff;
                color:#10283c;
                text-decoration:none;
                font-family:Arial,Helvetica,sans-serif;
                font-size:11px;
                letter-spacing:.4px;
              "
            >
              ${escapeHTML(cleanReference)}
            </a>

          `;

        })

        .join("");


    notes.innerHTML = `

      <div
        style="
          color:#a86b10;
          font-family:Arial,Helvetica,sans-serif;
          font-size:9px;
          font-weight:700;
          letter-spacing:3px;
          margin-bottom:7px;
        "
      >
        STUDY NOTES — AFTER READING THE PASSAGES
      </div>


      <p
        style="
          margin:0 0 18px;
          padding:12px 14px;
          background:#f6efe3;
          border-left:3px solid #d99a26;
          color:#4c5964;
          font-size:12px;
          line-height:1.5;
        "
      >
        These notes are a study aid and interpretation, not Scripture itself. Compare every conclusion with the biblical passages above and their surrounding context.
      </p>


      ${
        shortAnswer

          ? `

            <div
              style="
                margin:0 0 18px;
                padding:16px 17px;
                background:#05243d;
                color:#ffffff;
                border-left:4px solid #dda12e;
                border-radius:5px;
              "
            >

              <div
                style="
                  margin-bottom:6px;
                  color:#efb847;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:9px;
                  font-weight:700;
                  letter-spacing:2px;
                "
              >
                STUDY SYNTHESIS
              </div>

              <p
                style="
                  margin:0;
                  font-size:15px;
                  line-height:1.55;
                "
              >
                ${shortAnswer}
              </p>

            </div>

          `

          : ""
      }


      ${
        overview

          ? `

            <div
              style="
                margin-bottom:18px;
              "
            >

              <div
                style="
                  margin-bottom:6px;
                  color:#a86b10;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:9px;
                  font-weight:700;
                  letter-spacing:2px;
                "
              >
                WHAT THESE PASSAGES SHOW
              </div>

              <p
                style="
                  margin:0;
                  color:#30475a;
                  font-size:15px;
                  line-height:1.55;
                "
              >
                ${overview}
              </p>

            </div>

          `

          : ""
      }


      ${
        principleHTML

          ? `

            <div
              style="
                padding-top:14px;
                border-top:1px solid #eadac1;
              "
            >

              <div
                style="
                  margin-bottom:8px;
                  color:#a86b10;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:10px;
                  font-weight:700;
                  letter-spacing:2px;
                "
              >
                BIBLICAL PRINCIPLES & APPLICATION
              </div>

              <ul
                style="
                  margin:0;
                  padding-left:20px;
                  color:#30475a;
                  font-size:14px;
                "
              >
                ${principleHTML}
              </ul>

            </div>

          `

          : ""
      }


      ${
        relatedHTML

          ? `

            <div
              style="
                margin-top:17px;
                padding-top:14px;
                border-top:1px solid #eadac1;
              "
            >

              <div
                style="
                  margin-bottom:5px;
                  color:#a86b10;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:10px;
                  font-weight:700;
                  letter-spacing:2px;
                "
              >
                FURTHER SCRIPTURE STUDY
              </div>

              ${relatedHTML}

            </div>

          `

          : ""
      }


      ${
        safetyNote

          ? `

            <div
              style="
                margin-top:18px;
                padding:14px 15px;
                border:1px solid #bd7d1c;
                border-radius:5px;
                background:#fff7e8;
                color:#503c1a;
                font-family:Arial,Helvetica,sans-serif;
                font-size:12px;
                line-height:1.5;
              "
            >

              <strong>
                Important:
              </strong>

              ${safetyNote}

            </div>

          `

          : ""
      }

    `;


    scriptureResults.insertAdjacentElement(
      "afterend",
      notes
    );

  }


  /* =======================================================
     RENDER SCRIPTURE RESULTS
  ======================================================= */

  function renderResults(results) {

    if (!scriptureResults) {
      return;
    }


    scriptureResults.innerHTML = "";


    if (
      !Array.isArray(results) ||
      results.length === 0
    ) {

      scriptureResults.innerHTML = `

        <article class="scripture-card">

          <h3>
            No passages found
          </h3>

          <p>
            No Scripture passages were found.
            Try describing your question in another way.
          </p>

        </article>

      `;

      return;

    }


    results.forEach((result) => {

      const reference =
        escapeHTML(
          result.reference ||
          "Scripture"
        );


      const scriptureText =
        escapeHTML(
          result.text ||
          ""
        );


      const translation =
        escapeHTML(
          result.translation ||
          "World English Bible"
        );


      const purpose =
        escapeHTML(
          result.purpose ||
          "Study Passage"
        );


      const contextNote =
        escapeHTML(
          result.contextNote ||
          ""
        );


      const relevanceLevel =
        result.relevanceLevel ||
        "SUPPORTING";


      const relevance =
        relevanceStyles(
          relevanceLevel
        );


      const chapterUrl =
        escapeHTML(
          result.chapterUrl ||
          "#"
        );


      const card =
        document.createElement(
          "article"
        );


      card.className =
        "scripture-card";


      card.innerHTML = `

        <div
          style="
            display:inline-block;
            align-self:flex-start;

            margin-bottom:10px;

            padding:5px 8px;

            border:
              1px solid ${relevance.border};

            border-radius:3px;

            background:
              ${relevance.background};

            color:
              ${relevance.color};

            font-family:
              Arial,
              Helvetica,
              sans-serif;

            font-size:8px;

            font-weight:700;

            letter-spacing:1.4px;
          "
        >
          ${relevanceLabel(relevanceLevel)}
        </div>


        <div
          style="
            margin-bottom:6px;

            color:#ad7014;

            font-family:
              Arial,
              Helvetica,
              sans-serif;

            font-size:9px;

            font-weight:700;

            letter-spacing:2px;
          "
        >
          ${purpose}
        </div>


        <h3>
          ${reference}
        </h3>


        <p>
          ${scriptureText}
        </p>


        ${
          contextNote

            ? `

              <div
                style="
                  margin-top:14px;

                  padding:
                    11px 12px;

                  border-left:
                    3px solid #d89a2a;

                  background:
                    #f6efe3;

                  color:
                    #3c4b58;

                  font-size:
                    12px;

                  line-height:
                    1.45;
                "
              >

                <strong>
                  Study context:
                </strong>

                ${contextNote}

              </div>

            `

            : ""
        }


        <div class="translation">
          ${translation}
        </div>


        <a
          href="${chapterUrl}"

          target="_blank"

          rel="noopener noreferrer"

          class="chapter-link"
        >
          READ FULL CHAPTER →
        </a>

      `;


      scriptureResults.appendChild(
        card
      );

    });

  }


  /* =======================================================
     FIND SCRIPTURE
  ======================================================= */

  async function findScripture(question) {

    showLoading();


    try {

      const response =
        await fetch(
          "/api/scripture",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body:
              JSON.stringify({
                question
              })

          }
        );


      let data;


      try {

        data =
          await response.json();

      } catch {

        throw new Error(
          "The Scripture study service returned an invalid response."
        );

      }


      if (!response.ok) {

        throw new Error(

          data?.error ||

          "The Scripture study could not be completed."

        );

      }


      if (
        !Array.isArray(
          data.results
        ) ||
        data.results.length === 0
      ) {

        throw new Error(
          "No Scripture passages were returned."
        );

      }


      hideMessage();


      renderStudyOverview(
        data
      );


      renderResults(
        data.results
      );


      renderStudyNotes(
        data
      );


      const resultsSection =
        document.getElementById(
          "scripture-results"
        );


      setTimeout(
        () => {

          resultsSection
            ?.scrollIntoView({

              behavior:
                "smooth",

              block:
                "start"

            });

        },
        100
      );


    } catch (error) {

      console.error(
        "Scripture study error:",
        error
      );


      showMessage(

        "Unable to Complete Study",

        error.message ||

        "Something went wrong while preparing the Scripture study."

      );

    }

  }


  /* =======================================================
     FORM SUBMISSION
  ======================================================= */

  scriptureForm
    ?.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();


        const question =
          questionInput
            ?.value
            .trim() ||
          "";


        if (!question) {

          showMessage(

            "Enter a Study Question",

            "Describe the question, struggle, decision, topic, or situation you would like to study in Scripture."

          );

          return;

        }


        if (
          question.length < 4
        ) {

          showMessage(

            "Add More Detail",

            "Please describe your Scripture study question in a little more detail."

          );

          return;

        }


        await findScripture(
          question
        );

      }
    );


  /* =======================================================
     HERO BUTTON
  ======================================================= */

  document
    .querySelector(
      ".primary-cta"
    )
    ?.addEventListener(
      "click",
      (event) => {

        event.preventDefault();


        document
          .getElementById(
            "study"
          )
          ?.scrollIntoView({

            behavior:
              "smooth",

            block:
              "center"

          });


        setTimeout(
          () => {

            questionInput
              ?.focus();

          },
          600
        );

      }
    );


  /* =======================================================
     RESULT CAROUSEL
  ======================================================= */

  function getCardWidth() {

    const card =
      scriptureResults
        ?.querySelector(
          ".scripture-card"
        );


    if (!card) {
      return 0;
    }


    const style =
      window.getComputedStyle(
        scriptureResults
      );


    const gap =
      parseFloat(
        style.gap
      ) || 10;


    return (
      card.offsetWidth +
      gap
    );

  }


  function scrollResults(direction) {

    const width =
      getCardWidth();


    if (!width) {
      return;
    }


    scriptureResults
      ?.scrollBy({

        left:
          direction *
          width,

        behavior:
          "smooth"

      });

  }


  previousResults
    ?.addEventListener(
      "click",
      () =>
        scrollResults(-1)
    );


  nextResults
    ?.addEventListener(
      "click",
      () =>
        scrollResults(1)
    );


  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key !==
        "Escape"
      ) {
        return;
      }


      hideMessage();


      mainNavigation
        ?.classList
        .remove(
          "open"
        );


      mobileMenuButton
        ?.setAttribute(
          "aria-expanded",
          "false"
        );

    }
  );

});
