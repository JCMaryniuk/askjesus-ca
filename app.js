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
  const value = input.value.trim();

  if (!value) {
    status.textContent = "Please enter a question or situation first.";
    input.focus();
    return;
  }

  button.disabled = true;
  status.textContent = "Finding relevant Scripture…";
  results.innerHTML = "";

  try {
    const res = await fetch("/api/scripture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: value
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Request failed");
    }

    results.innerHTML = data.passages.map((p) => `
      <article class="verse">
        <div class="ref">${esc(p.reference)}</div>
        <div class="text">${esc(p.text)}</div>
        <div class="translation">${esc(p.translation)}</div>
      </article>
    `).join("");

    status.textContent = `${data.passages.length} passages found`;

    results.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  } catch (e) {
    results.innerHTML = `<div class="error">${esc(e.message)}</div>`;
    status.textContent = "";
  } finally {
    button.disabled = false;
  }
}
