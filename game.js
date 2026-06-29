// ===== 게임 상태 =====
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    isGameOver: false,
    totalCells: 12,
    usedQuestions: [],
    questionPool: []
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== 시작 화면 =====
function initStartScreen() {
    $('#player-count-select').addEventListener('change', () => {
        updatePlayerInputs(parseInt($('#player-count-select').value));
    });
    $('#start-btn').addEventListener('click', startGame);
}

function updatePlayerInputs(count) {
    const container = $('#player-names');
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'player-name-input';
        input.placeholder = `플레이어 ${i + 1} 이름`;
        container.appendChild(input);
    }
}

function startGame() {
    const inputs = $$('.player-name-input');
    const players = [];
    inputs.forEach((input, i) => {
        players.push({
            name: input.value.trim() || `플레이어 ${i + 1}`,
            position: 0,
            score: 0,
            choices: []
        });
    });
    if (players.length < 2) { alert('최소 2명이 필요합니다!'); return; }

    gameState.players = players;
    gameState.currentPlayerIndex = 0;
    gameState.isGameOver = false;
    gameState.usedQuestions = [];
    gameState.questionPool = [...QUESTION_POOL];
    shuffleArray(gameState.questionPool);

    showScreen('game-screen');
    initBoard();
    initPlayerPanel();
    updateTurnInfo();
    updateBoard();
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function showScreen(screenId) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    $(`#${screenId}`).classList.add('active');
}

// ===== 보드 =====
function initBoard() {
    const board = $('#board');
    board.innerHTML = '';
    for (let i = 0; i < gameState.totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'board-cell';
        cell.dataset.index = i;
        if (i === 0) {
            cell.classList.add('start-cell');
            cell.innerHTML = `<span class="cell-icon">🚀</span><span class="cell-name">출발</span>`;
        } else {
            cell.innerHTML = `<span class="cell-icon">🤔</span><span class="cell-name">선택</span>`;
        }
        const tokens = document.createElement('div');
        tokens.className = 'player-tokens';
        cell.appendChild(tokens);
        board.appendChild(cell);
    }
}

function initPlayerPanel() {
    const panel = $('#player-panel');
    panel.innerHTML = '';
    gameState.players.forEach((player, i) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
            <div><span class="player-dot p${i}"></span><span class="player-name">${player.name}</span></div>
            <div class="player-score">${player.score}점</div>
        `;
        panel.appendChild(card);
    });
}

function updateBoard() {
    $$('.player-tokens').forEach(t => t.innerHTML = '');
    $$('.board-cell').forEach(c => c.classList.remove('current-cell'));

    gameState.players.forEach((player, i) => {
        const cell = $(`.board-cell[data-index="${player.position}"]`);
        if (cell) {
            const token = document.createElement('div');
            token.className = `player-token p${i}`;
            cell.querySelector('.player-tokens').appendChild(token);
        }
    });

    const current = gameState.players[gameState.currentPlayerIndex];
    const currentCell = $(`.board-cell[data-index="${current.position}"]`);
    if (currentCell) currentCell.classList.add('current-cell');

    // 패널 업데이트
    const cards = $$('.player-card');
    cards.forEach((card, i) => {
        card.classList.toggle('active-player', i === gameState.currentPlayerIndex);
        card.querySelector('.player-score').textContent = `${gameState.players[i].score}점`;
    });
}

function updateTurnInfo() {
    const p = gameState.players[gameState.currentPlayerIndex];
    $('#turn-info').innerHTML = `<strong>${p.name}</strong>의 차례`;
}

// ===== 주사위 =====
function initDice() {
    $('#roll-dice-btn').addEventListener('click', rollDice);
}

function rollDice() {
    const btn = $('#roll-dice-btn');
    const resultEl = $('#dice-result');
    if (gameState.isGameOver) return;
    btn.disabled = true;

    let rollCount = 0;
    const emojis = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    const rollInterval = setInterval(() => {
        resultEl.textContent = emojis[Math.floor(Math.random() * 6) + 1];
        resultEl.classList.add('dice-rolling');
        rollCount++;
        if (rollCount >= 10) {
            clearInterval(rollInterval);
            const diceValue = Math.floor(Math.random() * 3) + 1;
            resultEl.textContent = emojis[diceValue];
            resultEl.classList.remove('dice-rolling');
            setTimeout(() => movePlayer(diceValue), 500);
        }
    }, 80);
}

// ===== 이동 (무한 루프) =====
function movePlayer(steps) {
    const player = gameState.players[gameState.currentPlayerIndex];
    // 무한 루프: 12칸을 넘으면 다시 처음으로
    player.position = (player.position + steps) % gameState.totalCells;
    updateBoard();

    // 출발칸(0)이 아니면 질문 표시
    if (player.position !== 0) {
        setTimeout(() => showQuestion(), 600);
    } else {
        // 출발칸 통과/도착 시 바로 다음 턴
        nextTurn();
    }
}

// ===== 질문 표시 =====
function showQuestion() {
    // 질문 풀에서 하나 뽑기
    if (gameState.questionPool.length === 0) {
        // 다 썼으면 다시 셔플
        gameState.questionPool = [...QUESTION_POOL];
        shuffleArray(gameState.questionPool);
    }
    const question = gameState.questionPool.pop();

    const modal = $('#card-modal');
    $('#card-category').textContent = question.category;
    $('#card-title').textContent = question.title;
    $('#card-situation').textContent = question.situation;

    const choicesEl = $('#card-choices');
    choicesEl.innerHTML = '';

    // 선택지 순서 랜덤화
    const shuffledChoices = [...question.choices];
    shuffleArray(shuffledChoices);

    shuffledChoices.forEach((choice) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `<span class="choice-score">${choice.score}점</span>${choice.text}`;
        btn.addEventListener('click', () => {
            selectChoice(question, choice);
        });
        choicesEl.appendChild(btn);
    });

    modal.classList.remove('hidden');
}

// ===== 선택 처리 =====
function selectChoice(question, choice) {
    const player = gameState.players[gameState.currentPlayerIndex];
    player.score += choice.score;
    player.choices.push({
        questionTitle: question.title,
        category: question.category,
        choiceText: choice.text,
        score: choice.score
    });

    $('#card-modal').classList.add('hidden');
    updateBoard();
    nextTurn();
}

// ===== 다음 턴 =====
function nextTurn() {
    if (gameState.isGameOver) return;
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    updateTurnInfo();
    updateBoard();
    $('#roll-dice-btn').disabled = false;
    $('#dice-result').textContent = '';
}

// ===== 종료 =====
function endGame() {
    gameState.isGameOver = true;
    showScreen('result-screen');
    generateResults();
}

function generateResults() {
    const container = $('#result-content');
    container.innerHTML = '';

    // 점수 순 정렬 (높은 순 = 육의 것을 많이 심은 순)
    const sorted = [...gameState.players].sort((a, b) => b.score - a.score);

    // === 게임 순위 (반전 전) ===
    const rankingEl = document.createElement('div');
    rankingEl.className = 'result-section ranking-section';
    rankingEl.innerHTML = `<h2>🏆 게임 결과</h2>`;
    sorted.forEach((p, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
        rankingEl.innerHTML += `<div class="rank-item"><span class="rank-medal">${medal}</span><span class="rank-name">${p.name}</span><span class="rank-score">${p.score}점</span></div>`;
    });
    container.appendChild(rankingEl);

    // === 반전 메시지 ===
    const twistEl = document.createElement('div');
    twistEl.className = 'result-section twist-section';
    twistEl.innerHTML = `
        <h2>🪞 그런데 잠깐...</h2>
        <p class="twist-message">당신이 모은 점수는<br><strong>"육의 것을 심은 점수"</strong>입니다.</p>
        <p class="twist-verse">"자기의 육체를 위하여 심는 자는 육체로부터 썩어진 것을 거두고<br>성령을 위하여 심는 자는 성령으로부터 영생을 거두리라"<br><em>— 갈라디아서 6:8</em></p>
    `;
    container.appendChild(twistEl);

    // === 육의 것 vs 영의 것 ===
    const comparisonEl = document.createElement('div');
    comparisonEl.className = 'result-section comparison-section';

    // 최대 가능 점수 계산 (질문 수 * 3)
    const maxPossible = sorted[0].choices.length * 3;

    comparisonEl.innerHTML = `<h3>📊 육의 것 (점수가 높을수록 세상에 마음을 둔 것)</h3>`;
    sorted.forEach(p => {
        const pct = maxPossible > 0 ? (p.score / maxPossible) * 100 : 0;
        comparisonEl.innerHTML += `
            <div class="result-bar-item">
                <span class="result-bar-label">${p.name}</span>
                <div class="result-bar-track"><div class="result-bar-fill bar-flesh" style="width:${pct}%"></div></div>
                <span class="result-bar-count">${p.score}점</span>
            </div>`;
    });

    // 영의 것: 낮은 점수 = 영에 많이 심은 것
    const sortedSpirit = [...gameState.players].sort((a, b) => a.score - b.score);
    comparisonEl.innerHTML += `<h3 style="margin-top:24px;">📊 영의 것 (점수가 낮을수록 하나님께 마음을 둔 것)</h3>`;
    sortedSpirit.forEach(p => {
        const spiritScore = (maxPossible > 0) ? maxPossible - p.score : 0;
        const pct = maxPossible > 0 ? (spiritScore / maxPossible) * 100 : 0;
        comparisonEl.innerHTML += `
            <div class="result-bar-item">
                <span class="result-bar-label">${p.name}</span>
                <div class="result-bar-track"><div class="result-bar-fill bar-spirit" style="width:${pct}%"></div></div>
                <span class="result-bar-count">${spiritScore}점</span>
            </div>`;
    });

    container.appendChild(comparisonEl);

    // === 마무리 메시지 ===
    const closingEl = document.createElement('div');
    closingEl.className = 'result-section closing-section';
    closingEl.innerHTML = `
        <p>우리는 이런 세상 속에서 살아가며<br>매 순간 선택의 갈림길에 서 있습니다.</p>
        <p>무엇이 옳은 선택인지, 혼란스러울 때가 많습니다.</p>
        <p class="closing-highlight">지금부터 목사님과 함께<br>라디오 나눔을 통해 더 깊이 나눠봅시다. 🎙️</p>
    `;
    container.appendChild(closingEl);
}

// ===== 리셋 & 종료 버튼 =====
function initControls() {
    $('#reset-btn').addEventListener('click', () => {
        if (confirm('게임을 처음부터 다시 시작할까요?')) {
            // 점수/위치 초기화, 같은 플레이어로 재시작
            gameState.players.forEach(p => {
                p.position = 0;
                p.score = 0;
                p.choices = [];
            });
            gameState.currentPlayerIndex = 0;
            gameState.isGameOver = false;
            gameState.questionPool = [...QUESTION_POOL];
            shuffleArray(gameState.questionPool);
            updateBoard();
            updateTurnInfo();
            $('#roll-dice-btn').disabled = false;
            $('#dice-result').textContent = '';
        }
    });

    $('#end-btn').addEventListener('click', () => {
        if (confirm('게임을 종료하고 결과를 볼까요?')) {
            endGame();
        }
    });

    $('#restart-btn').addEventListener('click', () => {
        gameState = {
            players: [],
            currentPlayerIndex: 0,
            isGameOver: false,
            totalCells: 12,
            usedQuestions: [],
            questionPool: []
        };
        showScreen('start-screen');
        updatePlayerInputs(2);
    });
}

// ===== 초기화 =====
function init() {
    initStartScreen();
    initDice();
    initControls();
}

document.addEventListener('DOMContentLoaded', init);
