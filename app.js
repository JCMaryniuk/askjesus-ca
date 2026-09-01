const form = document.getElementById("askForm");
const questionInput = document.getElementById("question");
const results = document.getElementById("results");
const submitButton = form?.querySelector('button[type="submit"]');

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = questionInput?.value.trim();

    if (!question) {
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Finding Scripture...";
    }

    if (results) {
      results.innerHTML = "<p>Searching Scripture...</p>";
    }

    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to find Scripture.");
      }

      if (!results) return;

      results.innerHTML = "";

      const passages = data.passages || [];

      if (!passages.length) {
        results.innerHTML =
          "<p>No passages were returned. Please try another question.</p>";
        return;
      }

      passages.forEach((passage) => {
        const article = document.createElement("article");
        article.className = "scripture-result";

        const heading = document.createElement("h3");
        heading.textContent =
          passage.reference || passage.ref || "Scripture";

        const text = document.createElement("p");
        text.textContent =
          passage.text || "Scripture text could not be retrieved.";

        article.appendChild(heading);
        article.appendChild(text);
        results.appendChild(article);
      });
    } catch (error) {
      console.error(error);

      if (results) {
        results.innerHTML =
          "<p>We couldn't retrieve Scripture right now. Please try again.</p>";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Find Scripture";
      }
    }
  });
}
