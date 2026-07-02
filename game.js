let gameState = { players: [], currentPlayerIndex: 0, isGameOver: false, totalCells: 14, questionPool: [], eventPool: [] };
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const CELL_TYPES = ["start", "choice", "choice", "choice", "event", "choice", "choice", "choice", "event", "choice", "choice", "choice", "event", "choice"];

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
function showScreen(screenId) {
  $$(".screen").forEach((screen) => screen.classList.remove("active"));
  $("#" + screenId).classList.add("active");
}
function initStartScreen() {
  $("#player-count-select").addEventListener("change", () => updatePlayerInputs(parseInt($("#player-count-select").value, 10)));
  $("#start-btn").addEventListener("click", startGame);
}
function updatePlayerInputs(count) {
  const container = $("#player-names");
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "player-name-input";
    input.placeholder = `플레이어 ${i + 1} 이름`;
    container.appendChild(input);
  }
}
function startGame() {
  const players = [...$$(".player-name-input")].map((input, i) => ({ name: input.value.trim() || `플레이어 ${i + 1}`, position: 0, score: 0, choices: [] }));
  if (players.length < 2) { alert("최소 2명이 필요합니다!"); return; }
  gameState.players = players;
  gameState.currentPlayerIndex = 0;
  gameState.isGameOver = false;
  gameState.questionPool = [...QUESTION_POOL];
  gameState.eventPool = [...EVENT_POOL];
  shuffleArray(gameState.questionPool);
  shuffleArray(gameState.eventPool);
  showScreen("game-screen");
  initBoard();
  initPlayerPanel();
  updateTurnInfo();
  updateBoard();
}
function initBoard() {
  const board = $("#board");
  board.innerHTML = "";
  CELL_TYPES.forEach((type, i) => {
    const cell = document.createElement("div");
    cell.className = "board-cell";
    cell.dataset.index = i;
    if (type === "start") {
      cell.classList.add("start-cell");
      cell.innerHTML = '<span class="cell-icon">START</span><span class="cell-name">출발</span>';
    } else if (type === "event") {
      cell.classList.add("cell-event");
      cell.innerHTML = '<span class="cell-icon">A/B</span><span class="cell-name">이벤트</span>';
    } else {
      cell.classList.add("cell-choice");
      cell.innerHTML = '<span class="cell-icon">Q</span><span class="cell-name">선택</span>';
    }
    const tokens = document.createElement("div");
    tokens.className = "player-tokens";
    cell.appendChild(tokens);
    board.appendChild(cell);
  });
}
function initPlayerPanel() {
  const panel = $("#player-panel");
  panel.innerHTML = "";
  gameState.players.forEach((player, i) => {
    const card = document.createElement("div");
    card.className = "player-card";
    card.innerHTML = `<div><span class="player-dot p${i}"></span><span class="player-name">${player.name}</span></div><div class="player-score">${player.score}점</div>`;
    panel.appendChild(card);
  });
}
function updateBoard() {
  $$(".player-tokens").forEach((area) => area.innerHTML = "");
  $$(".board-cell").forEach((cell) => cell.classList.remove("current-cell"));
  gameState.players.forEach((player, i) => {
    const cell = $(`.board-cell[data-index="${player.position}"]`);
    if (!cell) return;
    const token = document.createElement("div");
    token.className = `player-token p${i}`;
    cell.querySelector(".player-tokens").appendChild(token);
  });
  const current = gameState.players[gameState.currentPlayerIndex];
  const currentCell = $(`.board-cell[data-index="${current.position}"]`);
  if (currentCell) currentCell.classList.add("current-cell");
  $$(".player-card").forEach((card, i) => {
    card.classList.toggle("active-player", i === gameState.currentPlayerIndex);
    card.querySelector(".player-score").textContent = `${gameState.players[i].score}점`;
  });
}
function updateTurnInfo() {
  const player = gameState.players[gameState.currentPlayerIndex];
  $("#turn-info").innerHTML = `<strong>${player.name}</strong>의 차례`;
}
function initDice() { $("#roll-dice-btn").addEventListener("click", rollDice); }
function rollDice() {
  if (gameState.isGameOver) return;
  const button = $("#roll-dice-btn");
  const resultEl = $("#dice-result");
  button.disabled = true;
  let rollCount = 0;
  const interval = setInterval(() => {
    resultEl.textContent = String(Math.floor(Math.random() * 3) + 1);
    resultEl.classList.add("dice-rolling");
    rollCount++;
    if (rollCount >= 10) {
      clearInterval(interval);
      const value = Math.floor(Math.random() * 3) + 1;
      resultEl.textContent = value;
      resultEl.classList.remove("dice-rolling");
      setTimeout(() => movePlayer(value), 500);
    }
  }, 80);
}
function movePlayer(steps) {
  const player = gameState.players[gameState.currentPlayerIndex];
  player.position = (player.position + steps) % gameState.totalCells;
  updateBoard();
  const type = CELL_TYPES[player.position];
  setTimeout(() => {
    if (type === "choice") showQuestion();
    else if (type === "event") showEvent();
    else nextTurn();
  }, 500);
}
function showQuestion() {
  if (gameState.questionPool.length === 0) { gameState.questionPool = [...QUESTION_POOL]; shuffleArray(gameState.questionPool); }
  const question = gameState.questionPool.pop();
  const modal = $("#card-modal");
  $("#card-category").textContent = question.category;
  $("#card-title").textContent = question.title;
  $("#card-situation").textContent = question.situation;
  const choicesEl = $("#card-choices");
  choicesEl.innerHTML = "";
  question.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice-btn";
    button.innerHTML = `<span class="choice-score">${choice.score}점</span><span>${choice.text}</span>`;
    button.addEventListener("click", () => {
      const player = gameState.players[gameState.currentPlayerIndex];
      player.score += choice.score;
      player.choices.push({ title: question.title, text: choice.text, score: choice.score });
      modal.classList.add("hidden");
      updateBoard();
      nextTurn();
    });
    choicesEl.appendChild(button);
  });
  modal.classList.remove("hidden");
}
function showEvent() {
  if (gameState.eventPool.length === 0) { gameState.eventPool = [...EVENT_POOL]; shuffleArray(gameState.eventPool); }
  const event = gameState.eventPool.pop();
  const modal = $("#card-modal");
  $("#card-category").textContent = "전체 나눔 이벤트";
  $("#card-title").textContent = event.title;
  $("#card-situation").textContent = event.situation;
  $("#card-choices").innerHTML = `<div class="event-options"><button class="event-btn event-a" type="button"><span class="event-label">A</span><span>${event.optionA}</span></button><button class="event-btn event-b" type="button"><span class="event-label">B</span><span>${event.optionB}</span></button></div><button class="choice-btn event-done-btn" id="event-done-btn" type="button">나눔을 마쳤습니다</button>`;
  $("#event-done-btn").addEventListener("click", () => { modal.classList.add("hidden"); nextTurn(); });
  modal.classList.remove("hidden");
}
function nextTurn() {
  if (gameState.isGameOver) return;
  gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
  updateTurnInfo();
  updateBoard();
  $("#roll-dice-btn").disabled = false;
  $("#dice-result").textContent = "";
}
function endGame() { gameState.isGameOver = true; showScreen("result-screen"); generateResults(); }
function generateResults() {
  const container = $("#result-content");
  container.innerHTML = "";
  const sorted = [...gameState.players].sort((a, b) => b.score - a.score);
  const maxAnswered = Math.max(...gameState.players.map((player) => player.choices.length), 1);
  const maxScore = maxAnswered * 3;
  const rankEl = document.createElement("div");
  rankEl.className = "result-section ranking-section";
  rankEl.innerHTML = "<h2>게임 결과</h2>";
  sorted.forEach((player, i) => { rankEl.innerHTML += `<div class="rank-item"><span class="rank-medal">${i + 1}위</span><span class="rank-name">${player.name}</span><span class="rank-score">${player.score}점</span></div>`; });
  container.appendChild(rankEl);
  const twistEl = document.createElement("div");
  twistEl.className = "result-section twist-section";
  twistEl.innerHTML = `<h2>그런데 잠깐...</h2><p class="twist-message">당신이 모은 점수는<br><strong>"육의 것을 심은 점수"</strong>입니다.</p><p class="twist-verse">"자기의 육체를 위하여 심는 자는 육체로부터 썩어진 것을 거두고<br>성령을 위하여 심는 자는 성령으로부터 영생을 거두리라"<br><em>갈라디아서 6:8</em></p>`;
  container.appendChild(twistEl);
  const compEl = document.createElement("div");
  compEl.className = "result-section comparison-section";
  compEl.innerHTML = "<h3>육의 것: 높을수록 세상에 마음을 둔 것</h3>";
  sorted.forEach((player) => {
    const pct = Math.min((player.score / maxScore) * 100, 100);
    compEl.innerHTML += `<div class="result-bar-item"><span class="result-bar-label">${player.name}</span><div class="result-bar-track"><div class="result-bar-fill bar-flesh" style="width:${pct}%"></div></div><span class="result-bar-count">${player.score}점</span></div>`;
  });
  compEl.innerHTML += '<h3 style="margin-top:24px;">영의 것: 낮은 선택 점수일수록 하나님께 마음을 둔 것</h3>';
  [...gameState.players].sort((a, b) => a.score - b.score).forEach((player) => {
    const spirit = Math.max(maxScore - player.score, 0);
    const pct = Math.min((spirit / maxScore) * 100, 100);
    compEl.innerHTML += `<div class="result-bar-item"><span class="result-bar-label">${player.name}</span><div class="result-bar-track"><div class="result-bar-fill bar-spirit" style="width:${pct}%"></div></div><span class="result-bar-count">${spirit}점</span></div>`;
  });
  container.appendChild(compEl);
  const closeEl = document.createElement("div");
  closeEl.className = "result-section closing-section";
  closeEl.innerHTML = `<p>우리는 매 순간 선택의 갈림길에 서 있습니다.</p><p class="closing-highlight">이제 목사님과 보이는 라디오를 통해 더 깊이 나눠봅시다.</p>`;
  container.appendChild(closeEl);
}
function initControls() {
  $("#reset-btn").addEventListener("click", () => {
    if (!confirm("게임을 처음부터 다시 시작할까요?")) return;
    gameState.players.forEach((player) => { player.position = 0; player.score = 0; player.choices = []; });
    gameState.currentPlayerIndex = 0;
    gameState.isGameOver = false;
    gameState.questionPool = [...QUESTION_POOL];
    gameState.eventPool = [...EVENT_POOL];
    shuffleArray(gameState.questionPool);
    shuffleArray(gameState.eventPool);
    updateBoard();
    updateTurnInfo();
    $("#roll-dice-btn").disabled = false;
    $("#dice-result").textContent = "";
  });
  $("#end-btn").addEventListener("click", () => { if (confirm("게임을 종료하고 결과를 볼까요?")) endGame(); });
  $("#restart-btn").addEventListener("click", () => {
    gameState = { players: [], currentPlayerIndex: 0, isGameOver: false, totalCells: 14, questionPool: [], eventPool: [] };
    showScreen("start-screen");
    updatePlayerInputs(2);
  });
}
function init() { initStartScreen(); initDice(); initControls(); }
document.addEventListener("DOMContentLoaded", init);
