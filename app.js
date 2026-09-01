const input = document.querySelector("#input");
const button = document.querySelector("#submit");
const status = document.querySelector("#status");
const results = document.querySelector("#results");

button.addEventListener("click", run);

input.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    run();
  }
});

function esc(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

async function run() {
  const question = input.value.trim();

  if (!question) {
    status.textContent = "Please enter a question or situation first.";
    input.focus();
    return;
  }

  button.disabled = true;
  button.textContent = "Finding Scripture...";
  status.textContent = "Searching relevant Scripture…";
  results.innerHTML = "";

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: question
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Unable to retrieve Scripture.");
    }

    const passages = data.passages || [];

    if (!passages.length) {
      results.innerHTML =
        '<div class="error">No passages were returned. Please try another question.</div>';
      status.textContent = "";
      return;
    }

    results.innerHTML = passages.map((p) => `
      <article class="verse">
        <div class="ref">${esc(p.reference || "")}</div>
        <div class="text">${esc(p.text || "")}</div>
        ${p.translation ? `<div class="translation">${esc(p.translation)}</div>` : ""}
      </article>
    `).join("");

    status.textContent = `${passages.length} Scripture passages found.`;

    results.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  } catch (error) {
    console.error(error);

    results.innerHTML =
      `<div class="error">${esc(error.message)}</div>`;
    status.textContent = "";

  } finally {
    button.disabled = false;
    button.textContent = "Find Scripture";
  }
}
