import { leaderboardData } from "./leaderboardData.js";

export function renderLeaderboard() {
  const body = document.getElementById("leaderboardBody");
  if (!body) return;

  const sorted = [...leaderboardData].sort((a, b) => b.score - a.score);

  body.innerHTML = "";

  sorted.forEach((entry, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${entry.wave}</td>
      <td>${entry.score}</td>
    `;

    body.appendChild(row);
  });
}

export function setupBackButton() {
  const btn = document.getElementById("backToGameBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
}