const form = document.getElementById("questionForm");
const questionInput = document.getElementById("question");
const submitButton = document.getElementById("submitButton");

const resultsSection = document.getElementById("results");
const resultTitle = document.getElementById("resultTitle");
const categoryContainer = document.getElementById("categories");
const passagesContainer = document.getElementById("passages");

const errorMessage = document.getElementById("errorMessage");
const loadingMessage = document.getElementById("loadingMessage");

let activeQuestion = "";
let shownReferences = [];
let moreButton = null;


// --------------------------------------------------
// SAFELY SET TEXT
// --------------------------------------------------

function setText(element, text) {
  if (!element) return;
  element.textContent = text || "";
}


// --------------------------------------------------
// CREATE BIBLE PASSAGE LINK
// --------------------------------------------------

function createBibleLink(reference) {
  if (!reference) return "#";

  return (
    "https://www.biblegateway.com/passage/?search=" +
    encodeURIComponent(reference)
  );
}


// --------------------------------------------------
// NORMALIZE A REFERENCE FOR DUPLICATE CHECKING
// --------------------------------------------------

function normalizeReference(reference) {
  return String(reference || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}


// --------------------------------------------------
// REMOVE "FIND MORE SCRIPTURE" BUTTON
// --------------------------------------------------

function removeMoreButton() {
  if (moreButton && moreButton.parentNode) {
    moreButton.parentNode.removeChild(moreButton);
  }

  moreButton = null;
}


// --------------------------------------------------
// CLEAR OLD RESULTS
// --------------------------------------------------

function clearResults() {
  if (resultTitle) {
    resultTitle.textContent = "";
  }

  if (categoryContainer) {
    categoryContainer.innerHTML = "";
  }

  if (passagesContainer) {
    passagesContainer.innerHTML = "";
  }

  if (errorMessage) {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  }

  removeMoreButton();

  shownReferences = [];
}


// --------------------------------------------------
// CREATE CATEGORY TAGS
// --------------------------------------------------

function renderCategories(categories = []) {
  if (!categoryContainer) return;

  categoryContainer.innerHTML = "";

  categories.forEach((category) => {
    const tag = document.createElement("span");

    tag.className = "category-tag";
    tag.textContent = category;

    categoryContainer.appendChild(tag);
  });
}


// --------------------------------------------------
// CREATE ONE SCRIPTURE CARD
// --------------------------------------------------

function createScriptureCard(passage) {
  if (!passage.reference || !passage.text) {
    return null;
  }

  const scriptureCard = document.createElement("article");
  scriptureCard.className = "scripture-card";

  const reference = document.createElement("h3");
  reference.className = "scripture-reference";
  reference.textContent = passage.reference;

  const verseText = document.createElement("p");
  verseText.className = "scripture-text";
  verseText.textContent = passage.text;

  const linksContainer = document.createElement("div");
  linksContainer.className = "scripture-links";

  const contextReference =
    passage.contextReference || passage.reference;

  const contextLink = document.createElement("a");
  contextLink.className = "scripture-context-link";
  contextLink.href = createBibleLink(contextReference);
  contextLink.target = "_blank";
  contextLink.rel = "noopener noreferrer";
  contextLink.textContent =
    `Read ${contextReference} in context →`;

  linksContainer.appendChild(contextLink);

  if (passage.chapterReference) {
    const chapterLink = document.createElement("a");

    chapterLink.className = "scripture-chapter-link";
    chapterLink.href = createBibleLink(passage.chapterReference);
    chapterLink.target = "_blank";
    chapterLink.rel = "noopener noreferrer";
    chapterLink.textContent =
      `Read full chapter: ${passage.chapterReference} →`;

    linksContainer.appendChild(chapterLink);
  }

  scriptureCard.appendChild(reference);
  scriptureCard.appendChild(verseText);
  scriptureCard.appendChild(linksContainer);

  return scriptureCard;
}


// --------------------------------------------------
// RENDER / APPEND SCRIPTURE PASSAGES
// --------------------------------------------------

function renderPassages(passages = [], append = false) {
  if (!passagesContainer) return 0;

  if (!append) {
    passagesContainer.innerHTML = "";
  }

  let addedCount = 0;

  passages.forEach((passage) => {
    const normalized = normalizeReference(passage.reference);

    if (!normalized) {
      return;
    }

    const alreadyShown = shownReferences.some(
      (reference) =>
        normalizeReference(reference) === normalized
    );

    if (alreadyShown) {
      return;
    }

    const card = createScriptureCard(passage);

    if (!card) {
      return;
    }

    passagesContainer.appendChild(card);
    shownReferences.push(passage.reference);
    addedCount += 1;
  });

  return addedCount;
}


// --------------------------------------------------
// SHOW ERROR
// --------------------------------------------------

function showError(message) {
  if (loadingMessage) {
    loadingMessage.style.display = "none";
  }

  if (errorMessage) {
    errorMessage.textContent =
      message ||
      "Something went wrong while finding Scripture.";

    errorMessage.style.display = "block";
  }
}


// --------------------------------------------------
// MAIN SEARCH LOADING STATE
// --------------------------------------------------

function setLoading(isLoading) {
  if (submitButton) {
    submitButton.disabled = isLoading;

    const buttonText =
      submitButton.querySelector("span:first-child");

    if (buttonText) {
      buttonText.textContent =
        isLoading
          ? "Searching Scripture..."
          : "Find Scripture";
    } else {
      submitButton.textContent =
        isLoading
          ? "Searching Scripture..."
          : "Find Scripture";
    }
  }

  if (loadingMessage) {
    loadingMessage.textContent =
      "Please wait — searching Scripture and gathering relevant passages...";

    loadingMessage.style.display =
      isLoading ? "block" : "none";
  }
}


// --------------------------------------------------
// CREATE "FIND MORE SCRIPTURE" BUTTON
// --------------------------------------------------

function createMoreButton() {
  removeMoreButton();

  if (!resultsSection) return;

  const wrapper = document.createElement("div");

  wrapper.style.display = "flex";
  wrapper.style.justifyContent = "center";
  wrapper.style.margin = "34px auto 10px";
  wrapper.style.padding = "0 20px";

  moreButton = document.createElement("button");
  moreButton.type = "button";
  moreButton.textContent = "Find More Scripture ↓";

  moreButton.style.border = "1px solid #0b4568";
  moreButton.style.borderRadius = "10px";
  moreButton.style.padding = "12px 22px";
  moreButton.style.background = "#0b4568";
  moreButton.style.color = "#ffffff";
  moreButton.style.fontSize = "15px";
  moreButton.style.fontWeight = "700";
  moreButton.style.cursor = "pointer";
  moreButton.style.minHeight = "44px";

  moreButton.addEventListener("click", loadMoreScripture);

  wrapper.appendChild(moreButton);

  const resultsInner =
    resultsSection.querySelector(".results-inner");

  if (resultsInner) {
    resultsInner.appendChild(wrapper);
  }
}


// --------------------------------------------------
// DISPLAY INITIAL RESULTS
// --------------------------------------------------

function displayResults(data) {
  clearResults();

  setText(
    resultTitle,
    data.title || "What Scripture Says"
  );

  renderCategories(data.categories || []);

  const addedCount =
    renderPassages(data.passages || [], false);

  if (resultsSection) {
    resultsSection.style.display = "block";

    if (addedCount > 0 && data.hasMore !== false) {
      createMoreButton();
    }

    setTimeout(() => {
      resultsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }
}


// --------------------------------------------------
// LOAD MORE SCRIPTURE
// --------------------------------------------------

async function loadMoreScripture() {
  if (!activeQuestion || !moreButton) {
    return;
  }

  moreButton.disabled = true;
  moreButton.textContent =
    "Please wait — finding more Scripture...";

  try {
    const response = await fetch("/ask", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        question: activeQuestion,
        more: true,
        excludeReferences: shownReferences
      })
    });

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        "The server returned an invalid response."
      );
    }

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Something went wrong while finding more Scripture."
      );
    }

    const addedCount =
      renderPassages(data.passages || [], true);

    if (addedCount === 0) {
      moreButton.textContent =
        "No more strong passages found";
      moreButton.disabled = true;
      return;
    }

    if (data.hasMore === false) {
      moreButton.textContent =
        "No more strong passages found";
      moreButton.disabled = true;
    } else {
      moreButton.disabled = false;
      moreButton.textContent =
        "Find More Scripture ↓";
    }

  } catch (error) {
    console.error("MORE SCRIPTURE ERROR:", error);

    moreButton.disabled = false;
    moreButton.textContent =
      "Try Finding More Scripture Again";
  }
}


// --------------------------------------------------
// SUBMIT QUESTION
// --------------------------------------------------

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question =
      questionInput
        ? questionInput.value.trim()
        : "";

    if (!question) {
      showError("Please enter a question.");
      return;
    }

    activeQuestion = question;

    clearResults();

    if (resultsSection) {
      resultsSection.style.display = "none";
    }

    setLoading(true);

    try {
      const response = await fetch("/ask", {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          question: question,
          more: false,
          excludeReferences: []
        })
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Something went wrong while finding Scripture."
        );
      }

      if (
        !data ||
        !Array.isArray(data.passages) ||
        data.passages.length === 0
      ) {
        throw new Error(
          "No Scripture passages were found."
        );
      }

      displayResults(data);

    } catch (error) {
      console.error("ASK ERROR:", error);

      showError(
        error.message ||
        "Something went wrong while finding Scripture."
      );

    } finally {
      setLoading(false);
    }
  });
}


// --------------------------------------------------
// OPTIONAL EXAMPLE QUESTION BUTTONS
// --------------------------------------------------

document
  .querySelectorAll("[data-question]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const exampleQuestion =
        button.getAttribute("data-question");

      if (!exampleQuestion || !questionInput) {
        return;
      }

      questionInput.value = exampleQuestion;
      questionInput.focus();

      if (form) {
        form.requestSubmit();
      }
    });
  });
