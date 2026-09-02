/* =========================================================
   ASKJESUS.CA
   APP.JS — SCRIPTURE STUDY FRONT END
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

      const isOpen =
        mainNavigation.classList.toggle("open");

      mobileMenuButton.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
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
     MESSAGE / LOADING OVERLAY
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
        "Finding relevant Bible passages and gathering Scripture in context.";
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


  if (messageClose) {

    messageClose.addEventListener(
      "click",
      hideMessage
    );

  }


  if (messageOverlay) {

    messageOverlay.addEventListener(
      "click",
      (event) => {

        if (event.target === messageOverlay) {
          hideMessage();
        }

      }
    );

  }


  /* =======================================================
     REMOVE OLD STUDY OVERVIEW
  ======================================================= */

  function removeOldStudyOverview() {

    const oldOverview =
      document.getElementById("studyOverview");

    if (oldOverview) {
      oldOverview.remove();
    }

  }


  /* =======================================================
     STUDY OVERVIEW
  ======================================================= */

  function renderStudyOverview(data) {

    const resultsSection =
      document.getElementById("scripture-results");

    if (!resultsSection) {
      return;
    }


    removeOldStudyOverview();


    const panel =
      document.createElement("div");

    panel.id = "studyOverview";

    panel.className = "study-overview";


    /*
      Inline styling is intentional here so the new
      study feature works even before we add its final
      CSS styling.
    */

    panel.style.width =
      "min(90%, 1100px)";

    panel.style.margin =
      "18px auto 24px";

    panel.style.padding =
      "22px";

    panel.style.background =
      "#fffdf8";

    panel.style.border =
      "1px solid #d9a044";

    panel.style.borderRadius =
      "8px";

    panel.style.boxShadow =
      "0 6px 20px rgba(0,0,0,0.08)";

    panel.style.color =
      "#10283c";


    const topic =
      escapeHTML(
        data.topic ||
        "Scripture Study"
      );


    const overview =
      escapeHTML(
        data.overview ||
        ""
      );


    const principles =
      Array.isArray(data.keyPrinciples)
        ? data.keyPrinciples
        : [];


    const relatedReferences =
      Array.isArray(data.relatedReferences)
        ? data.relatedReferences
        : [];


    /* =====================================================
       PRINCIPLES
    ===================================================== */

    const principleHTML =
      principles

        .map((principle) => {

          return `

            <li
              style="
                margin:6px 0;
                line-height:1.45;
              "
            >
              ${escapeHTML(principle)}
            </li>

          `;

        })

        .join("");


    /* =====================================================
       RELATED SCRIPTURES
    ===================================================== */

    const relatedHTML =
      relatedReferences

        .map((reference) => {

          const cleanReference =
            String(reference).trim();


          /*
            Link to the passage itself rather than
            only the chapter.
          */

          const url =
            "https://www.biblegateway.com/passage/?search=" +
            encodeURIComponent(cleanReference);


          return `

            <a
              href="${escapeHTML(url)}"
              target="_blank"
              rel="noopener noreferrer"

              style="
                display:inline-block;
                margin:5px 5px 0 0;
                padding:7px 10px;

                border:1px solid #d49a32;
                border-radius:4px;

                color:#10283c;
                background:#fff;

                text-decoration:none;

                font-family:
                  Arial,
                  Helvetica,
                  sans-serif;

                font-size:11px;
                letter-spacing:.5px;
              "
            >

              ${escapeHTML(cleanReference)}

            </a>

          `;

        })

        .join("");


    /* =====================================================
       BUILD OVERVIEW
    ===================================================== */

    panel.innerHTML = `

      <div
        style="
          color:#ae7117;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size:9px;
          font-weight:700;

          letter-spacing:3px;

          margin-bottom:6px;
        "
      >
        SCRIPTURE STUDY
      </div>


      <h2
        style="
          font-size:
            clamp(
              22px,
              3vw,
              31px
            );

          margin:0 0 10px;

          letter-spacing:1px;

          color:#10283c;
        "
      >
        ${topic}
      </h2>


      ${
        overview

          ? `

            <p
              style="
                font-size:15px;
                line-height:1.55;
                margin:0 0 16px;
                color:#263e52;
              "
            >
              ${overview}
            </p>

          `

          : ""
      }


      ${
        principleHTML

          ? `

            <div
              style="
                padding-top:12px;

                border-top:
                  1px solid #eadac1;
              "
            >

              <div
                style="
                  font-family:
                    Arial,
                    Helvetica,
                    sans-serif;

                  font-size:10px;

                  color:#a86c10;

                  font-weight:700;

                  letter-spacing:2px;

                  margin-bottom:7px;
                "
              >
                KEY THEMES TO CONSIDER
              </div>


              <ul
                style="
                  padding-left:20px;

                  margin:0;

                  font-size:14px;

                  color:#263e52;
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
                margin-top:16px;

                padding-top:13px;

                border-top:
                  1px solid #eadac1;
              "
            >

              <div
                style="
                  font-family:
                    Arial,
                    Helvetica,
                    sans-serif;

                  font-size:10px;

                  color:#a86c10;

                  font-weight:700;

                  letter-spacing:2px;

                  margin-bottom:5px;
                "
              >
                RELATED PASSAGES FOR FURTHER STUDY
              </div>

              ${relatedHTML}

            </div>

          `

          : ""
      }


      <p
        style="
          margin:16px 0 0;

          padding-top:12px;

          border-top:
            1px solid #eadac1;

          font-size:11px;

          line-height:1.45;

          color:#68737d;

          font-style:italic;
        "
      >
        Study notes help organize the passages by theme.
        Read each passage and its surrounding chapter
        carefully for full biblical context.
      </p>

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

      resultsSection.prepend(panel);

    }

  }


  /* =======================================================
     SCRIPTURE RESULTS
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
            Try describing your question in
            another way.
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
            color:#b47716;

            font-family:
              Arial,
              Helvetica,
              sans-serif;

            font-size:9px;

            letter-spacing:2px;

            font-weight:700;

            margin-bottom:7px;
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
                class="scripture-context"

                style="
                  margin-top:14px;

                  padding:
                    11px 12px;

                  background:
                    #f6efe3;

                  border-left:
                    3px solid #d89a2a;

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

      } catch (error) {

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
        !Array.isArray(data.results) ||
        data.results.length === 0
      ) {

        throw new Error(
          "No Scripture passages were returned."
        );

      }


      hideMessage();


      /*
        Study summary
      */

      renderStudyOverview(data);


      /*
        Actual Scripture
      */

      renderResults(
        data.results
      );


      /*
        Scroll to results
      */

      const resultsSection =
        document.getElementById(
          "scripture-results"
        );


      setTimeout(() => {

        if (resultsSection) {

          resultsSection.scrollIntoView({

            behavior: "smooth",

            block: "start"

          });

        }

      }, 100);


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
     FORM
  ======================================================= */

  if (scriptureForm) {

    scriptureForm.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();


        const question =
          questionInput
            ? questionInput.value.trim()
            : "";


        if (!question) {

          showMessage(

            "Enter a Study Question",

            "Describe the question, struggle, decision, topic, or situation you would like to study in Scripture."

          );

          return;

        }


        if (question.length < 4) {

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

  }


  /* =======================================================
     HERO FIND SCRIPTURE BUTTON
  ======================================================= */

  const heroButton =
    document.querySelector(
      ".primary-cta"
    );


  if (heroButton) {

    heroButton.addEventListener(
      "click",
      (event) => {

        event.preventDefault();


        const studySection =
          document.getElementById(
            "study"
          );


        if (studySection) {

          studySection.scrollIntoView({

            behavior: "smooth",

            block: "center"

          });

        }


        setTimeout(() => {

          if (questionInput) {

            questionInput.focus();

          }

        }, 600);

      }
    );

  }


  /* =======================================================
     RESULT CAROUSEL
  ======================================================= */

  function getCardWidth() {

    if (!scriptureResults) {
      return 0;
    }


    const card =
      scriptureResults.querySelector(
        ".scripture-card"
      );


    if (!card) {
      return 0;
    }


    const styles =
      window.getComputedStyle(
        scriptureResults
      );


    const gap =
      parseFloat(styles.gap) || 10;


    return (
      card.offsetWidth +
      gap
    );

  }


  function scrollResults(direction) {

    if (!scriptureResults) {
      return;
    }


    const width =
      getCardWidth();


    if (!width) {
      return;
    }


    scriptureResults.scrollBy({

      left:
        direction *
        width,

      behavior:
        "smooth"

    });

  }


  if (previousResults) {

    previousResults.addEventListener(
      "click",
      () => {

        scrollResults(-1);

      }
    );

  }


  if (nextResults) {

    nextResults.addEventListener(
      "click",
      () => {

        scrollResults(1);

      }
    );

  }


  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key !== "Escape") {
        return;
      }


      hideMessage();


      if (mainNavigation) {

        mainNavigation
          .classList
          .remove("open");

      }


      if (mobileMenuButton) {

        mobileMenuButton
          .setAttribute(
            "aria-expanded",
            "false"
          );

      }

    }
  );

});
