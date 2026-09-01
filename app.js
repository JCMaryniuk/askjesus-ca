const input = document.querySelector("#input");
const button = document.querySelector("#submit");
const status = document.querySelector("#status");
const results = document.querySelector("#results");

if (!input || !button || !results) {
  console.error("ASKJesus.ca: Required page elements were not found.");
} else {
  button.addEventListener("click", run);

  input.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      run();
    }
  });
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
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

async function run() {
  const question = input.value.trim();

  if (!question) {
    if (status) {
      status.textContent = "Please enter a question or situation first.";
    }

    input.focus();
    return;
  }

  button.disabled = true;
  button.textContent = "Finding Scripture...";

  if (status) {
    status.textContent = "Searching relevant Scripture…";
  }

  results.innerHTML = "";

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: question
      })
    });

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await response.text();

      console.error("Expected JSON but received:", text);

      throw new Error(
        `Server returned an unexpected response (${response.status}).`
      );
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `Request failed with status ${response.status}.`
      );
    }

    const passages = Array.isArray(data.passages)
      ? data.passages
      : [];

    if (!passages.length) {
      results.innerHTML = `
        <div class="error">
          No Scripture passages were returned. Please try another question.
        </div>
      `;

      if (status) {
        status.textContent = "";
      }

      return;
    }

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

        return `
          <article class="verse">
            <div class="ref">${escapeHtml(reference)}</div>
            <div class="text">${escapeHtml(text)}</div>
            <div class="translation">${escapeHtml(translation)}</div>
          </article>
        `;
      })
      .join("");

    if (status) {
      status.textContent =
        `${passages.length} Scripture passage${passages.length === 1 ? "" : "s"} found.`;
    }

    results.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  } catch (error) {
    console.error("ASKJesus.ca request error:", error);

    results.innerHTML = `
      <div class="error">
        ${escapeHtml(
          error.message ||
          "We couldn't retrieve Scripture right now. Please try again."
        )}
      </div>
    `;

    if (status) {
      status.textContent = "";
    }
  } finally {
    button.disabled = false;
    button.textContent = "Find Scripture";
  }
}
