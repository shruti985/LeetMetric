const API_BASE = "https://alfa-leetcode-api.onrender.com";

const input = document.getElementById("username");
const btn = document.getElementById("searchBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");

const els = {
  name: document.getElementById("displayName"),
  total: document.getElementById("totalSolved"),
  easy: document.getElementById("easySolved"),
  medium: document.getElementById("mediumSolved"),
  hard: document.getElementById("hardSolved"),
};

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.classList.toggle("error", isError);
}

async function fetchStats() {
  const username = input.value.trim();
  if (!username) return setStatus("Please enter a username.", true);

  btn.disabled = true;
  resultEl.classList.add("hidden");
  setStatus("Loading... (the free Render server can be slow on the first request)");

  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(username)}/solved`);
    const data = await res.json();

    if (!res.ok || data.errors || data.solvedProblem === undefined) {
      throw new Error("User not found");
    }

    els.name.textContent = `@${username}`;
    els.total.textContent = data.solvedProblem;
    els.easy.textContent = data.easySolved;
    els.medium.textContent = data.mediumSolved;
    els.hard.textContent = data.hardSolved;

    resultEl.classList.remove("hidden");
    setStatus("");
  } catch (err) {
    setStatus(err.message === "User not found"
      ? "User not found. Check the username."
      : "Something went wrong. Try again in a bit.", true);
  } finally {
    btn.disabled = false;
  }
}

btn.addEventListener("click", fetchStats);
input.addEventListener("keydown", (e) => { if (e.key === "Enter") fetchStats(); });