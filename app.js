const form = document.getElementById("questionForm");
const questionInput = document.getElementById("question");
const submitButton = document.getElementById("submitButton");

const resultsSection = document.getElementById("results");
const resultTitle = document.getElementById("resultTitle");
const categoryContainer = document.getElementById("categories");
const passagesContainer = document.getElementById("passages");

const errorMessage = document.getElementById("errorMessage");
const loadingMessage = document.getElementById("loadingMessage");


// --------------------------------------------------
// SAFELY SET TEXT
// --------------------------------------------------

function setText(element, text) {
  if (!element) return;

  element.textContent = text || "";
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
// CREATE SCRIPTURE PASSAGES
// --------------------------------------------------

function renderPassages(passages = []) {
  if (!passagesContainer) return;

  passagesContainer.innerHTML = "";

  passages.forEach((passage) => {
    if (!passage.reference || !passage.text) {
      return;
    }

    const scriptureCard = document.createElement("article");
    scriptureCard.className = "scripture-card";

    const reference = document.createElement("h3");
    reference.className = "scripture-reference";
    reference.textContent = passage.reference;

    const verseText = document.createElement("p");
    verseText.className = "scripture-text";
    verseText.textContent = passage.text;

    scriptureCard.appendChild(reference);
    scriptureCard.appendChild(verseText);

    passagesContainer.appendChild(scriptureCard);
  });
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
      message || "Something went wrong while finding Scripture.";

    errorMessage.style.display = "block";
  }
}


// --------------------------------------------------
// LOADING STATE
// --------------------------------------------------

function setLoading(isLoading) {
  if (submitButton) {
    submitButton.disabled = isLoading;

    submitButton.textContent = isLoading
      ? "Finding Scripture..."
      : "Find Scripture";
  }

  if (loadingMessage) {
    loadingMessage.style.display = isLoading
      ? "block"
      : "none";
  }
}


// --------------------------------------------------
// DISPLAY RESULTS
// --------------------------------------------------

function displayResults(data) {
  clearResults();

  setText(
    resultTitle,
    data.title || "What Scripture Says"
  );

  renderCategories(data.categories || []);
  renderPassages(data.passages || []);

  if (resultsSection) {
    resultsSection.style.display = "block";

    setTimeout(() => {
      resultsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }
}


// --------------------------------------------------
// SUBMIT QUESTION
// --------------------------------------------------

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = questionInput
      ? questionInput.value.trim()
      : "";

    if (!question) {
      showError("Please enter a question.");
      return;
    }

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
          question: question
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
