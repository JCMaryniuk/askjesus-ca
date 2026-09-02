/* =========================================================
   ASKJESUS.CA — APP.JS
   Handles:
   - mobile menu
   - Find Scripture form
   - API request
   - result rendering
   - loading/error messages
   - Scripture result carousel
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const mainNavigation = document.getElementById("mainNavigation");

  const scriptureForm = document.getElementById("scriptureForm");
  const questionInput = document.getElementById("questionInput");
  const scriptureResults = document.getElementById("scriptureResults");

  const previousResults = document.getElementById("previousResults");
  const nextResults = document.getElementById("nextResults");

  const messageOverlay = document.getElementById("messageOverlay");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const messageTitle = document.getElementById("messageTitle");
  const messageText = document.getElementById("messageText");
  const messageClose = document.getElementById("messageClose");

  const dots = Array.from(document.querySelectorAll(".carousel-dots .dot"));

  let currentResultPage = 0;


  /* =========================================================
     MOBILE MENU
  ========================================================== */

  if (mobileMenuButton && mainNavigation) {
    mobileMenuButton.addEventListener("click", () => {
      const isOpen = mainNavigation.classList.toggle("open");

      mobileMenuButton.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );
    });

    mainNavigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNavigation.classList.remove("open");
        mobileMenuButton.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* =========================================================
     MESSAGE OVERLAY
  ========================================================== */

  function showLoading() {
    if (!messageOverlay) return;

    messageTitle.textContent = "Finding Scripture";

    messageText.textContent =
      "Searching Scripture for passages related to what you are facing.";

    loadingSpinner.style.display = "block";
    messageClose.style.display = "none";

    messageOverlay.classList.add("show");
    messageOverlay.setAttribute("aria-hidden", "false");
  }


  function showMessage(title, text) {
    if (!messageOverlay) return;

    messageTitle.textContent = title;
    messageText.textContent = text;

    loadingSpinner.style.display = "none";
    messageClose.style.display = "inline-block";

    messageOverlay.classList.add("show");
    messageOverlay.setAttribute("aria-hidden", "false");
  }


  function hideMessage() {
    if (!messageOverlay) return;

    messageOverlay.classList.remove("show");
    messageOverlay.setAttribute("aria-hidden", "true");
  }


  if (messageClose) {
    messageClose.addEventListener("click", hideMessage);
  }


  if (messageOverlay) {
    messageOverlay.addEventListener("click", (event) => {
      if (event.target === messageOverlay) {
        hideMessage();
      }
    });
  }


  /* =========================================================
     HTML SAFETY
  ========================================================== */

  function escapeHTML(value = "") {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  /* =========================================================
     NORMALIZE API RESULT
  ========================================================== */

  function normalizeResult(result) {
    return {
      reference:
        result.reference ||
        result.verse ||
        result.title ||
        result.passage ||
        "Scripture",

      text:
        result.text ||
        result.scripture ||
        result.content ||
        result.quote ||
        "",

      translation:
        result.translation ||
        result.version ||
        "World English Bible",

      chapterUrl:
        result.chapterUrl ||
        result.chapter_url ||
        result.url ||
        result.link ||
        ""
    };
  }


  /* =========================================================
     BUILD FULL CHAPTER LINK
  ========================================================== */

  function makeChapterLink(reference) {
    if (!reference) return "#";

    let chapterReference = reference;

    /*
      Examples:

      Matthew 18:15-17 -> Matthew 18
      Psalm 37:3-5     -> Psalm 37
      Proverbs 14:15   -> Proverbs 14
    */

    chapterReference = chapterReference
      .replace(/:\d+.*$/, "")
      .trim();

    return (
      "https://www.biblegateway.com/passage/?search=" +
      encodeURIComponent(chapterReference)
    );
  }


  /* =========================================================
     RENDER RESULTS
  ========================================================== */

  function renderResults(results) {
    if (!scriptureResults) return;

    scriptureResults.innerHTML = "";

    if (!Array.isArray(results) || results.length === 0) {
      scriptureResults.innerHTML = `
        <article class="scripture-card">
          <h3>No passages found</h3>
          <p>
            We could not find Scripture results for that request.
            Please try describing your situation in another way.
          </p>
          <div class="translation">
            ASKJesus.ca
          </div>
        </article>
      `;

      return;
    }


    results.forEach((rawResult) => {
      const result = normalizeResult(rawResult);

      const reference = escapeHTML(result.reference);
      const text = escapeHTML(result.text);
      const translation = escapeHTML(result.translation);

      const chapterUrl =
        result.chapterUrl || makeChapterLink(result.reference);

      const card = document.createElement("article");

      card.className = "scripture-card";

      card.innerHTML = `
        <h3>${reference}</h3>

        <p>${text}</p>

        <div class="translation">
          ${translation}
        </div>

        <a
          href="${escapeHTML(chapterUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          class="chapter-link"
        >
          READ FULL CHAPTER →
        </a>
      `;

      scriptureResults.appendChild(card);
    });


    currentResultPage = 0;

    updateCarouselDots();

    setTimeout(() => {
      const resultsSection =
        document.querySelector(".results-section");

      if (resultsSection) {
        resultsSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 100);
  }


  /* =========================================================
     GET RESULTS ARRAY FROM DIFFERENT SERVER FORMATS
  ========================================================== */

  function extractResults(data) {
    if (!data) return [];

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.results)) {
      return data.results;
    }

    if (Array.isArray(data.scriptures)) {
      return data.scriptures;
    }

    if (Array.isArray(data.passages)) {
      return data.passages;
    }

    if (Array.isArray(data.verses)) {
      return data.verses;
    }

    if (data.result && Array.isArray(data.result)) {
      return data.result;
    }

    return [];
  }


  /* =========================================================
     FIND SCRIPTURE
  ========================================================== */

  async function findScripture(question) {
    showLoading();

    try {
      /*
        This expects your server.js to have:

        POST /api/scripture

        Body:
        {
          "question": "..."
        }
      */

      const response = await fetch("/api/scripture", {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          question: question
        })
      });


      let data;

      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error(
          "The server returned an invalid response."
        );
      }


      if (!response.ok) {
        const serverMessage =
          data?.error ||
          data?.message ||
          "The Scripture search could not be completed.";

        throw new Error(serverMessage);
      }


      const results = extractResults(data);


      if (results.length === 0) {
        throw new Error(
          "No Scripture passages were returned. Please try your question again."
        );
      }


      hideMessage();

      renderResults(results);

    } catch (error) {
      console.error("ASKJesus Scripture error:", error);

      showMessage(
        "Unable to Find Scripture",
        error.message ||
          "Something went wrong while searching Scripture. Please try again."
      );
    }
  }


  /* =========================================================
     FORM SUBMIT
  ========================================================== */

  if (scriptureForm) {
    scriptureForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const question = questionInput.value.trim();


      if (!question) {
        showMessage(
          "Please Enter Your Question",
          "Describe the question, struggle, decision, or situation you are facing."
        );

        return;
      }


      if (question.length < 4) {
        showMessage(
          "Please Add More Detail",
          "Please describe what you are facing in a little more detail."
        );

        return;
      }


      await findScripture(question);
    });
  }


  /* =========================================================
     HERO FIND SCRIPTURE BUTTON
  ========================================================== */

  const heroButton = document.querySelector(".primary-cta");

  if (heroButton) {
    heroButton.addEventListener("click", (event) => {
      event.preventDefault();

      const questionSection =
        document.getElementById("question");

      if (questionSection) {
        questionSection.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        setTimeout(() => {
          questionInput?.focus();
        }, 600);
      }
    });
  }


  /* =========================================================
     RESULTS CAROUSEL
  ========================================================== */

  function updateCarouselDots() {
    if (!dots.length) return;

    dots.forEach((dot, index) => {
      dot.classList.toggle(
        "active",
        index === currentResultPage
      );
    });
  }


  function getCardWidth() {
    const firstCard =
      scriptureResults?.querySelector(".scripture-card");

    if (!firstCard) return 0;

    const computedStyle =
      window.getComputedStyle(scriptureResults);

    const gap =
      parseFloat(computedStyle.columnGap) ||
      parseFloat(computedStyle.gap) ||
      10;

    return firstCard.offsetWidth + gap;
  }


  function scrollResults(direction) {
    if (!scriptureResults) return;

    const cardWidth = getCardWidth();

    if (!cardWidth) return;


    scriptureResults.scrollBy({
      left: direction * cardWidth,
      behavior: "smooth"
    });


    if (direction > 0) {
      currentResultPage =
        Math.min(currentResultPage + 1, dots.length - 1);
    } else {
      currentResultPage =
        Math.max(currentResultPage - 1, 0);
    }


    updateCarouselDots();
  }


  if (previousResults) {
    previousResults.addEventListener("click", () => {
      scrollResults(-1);
    });
  }


  if (nextResults) {
    nextResults.addEventListener("click", () => {
      scrollResults(1);
    });
  }


  /* =========================================================
     MOBILE SCROLL DOT UPDATE
  ========================================================== */

  if (scriptureResults) {
    scriptureResults.addEventListener("scroll", () => {
      if (window.innerWidth > 760) return;

      const cardWidth = getCardWidth();

      if (!cardWidth) return;

      const index = Math.round(
        scriptureResults.scrollLeft / cardWidth
      );

      currentResultPage =
        Math.max(
          0,
          Math.min(index, dots.length - 1)
        );

      updateCarouselDots();
    });
  }


  /* =========================================================
     NAVIGATION ACTIVE STATE
  ========================================================== */

  const navLinks =
    document.querySelectorAll(".main-nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((item) => {
        item.classList.remove("active");
      });

      link.classList.add("active");
    });
  });


  /* =========================================================
     ESCAPE KEY CLOSES OVERLAY / MENU
  ========================================================== */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    hideMessage();

    if (mainNavigation) {
      mainNavigation.classList.remove("open");
    }

    if (mobileMenuButton) {
      mobileMenuButton.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  });

});
