// ===== 게임 상태 =====
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    isGameOver: false,
    totalCells: 14,
    questionPool: [],
    eventPool: []
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

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
            position: 0, score: 0, choices: []
        });
    });
    if (players.length < 2) { alert('최소 2명이 필요합니다!'); return; }

    gameState.players = players;
    gameState.currentPlayerIndex = 0;
    gameState.isGameOver = false;
    gameState.questionPool = [...QUESTION_POOL];
    shuffleArray(gameState.questionPool);
    gameState.eventPool = [...EVENT_POOL];
    shuffleArray(gameState.eventPool);

    showScreen('game-screen');
    initBoard();
    initPlayerPanel();
    updateTurnInfo();
    updateBoard();
}


// ===== 보드 (14칸: 출발1 + 선택10 + 이벤트3) =====
// 칸 배치: 이벤트는 5번째, 9번째, 13번째 칸
const CELL_TYPES = [
    'start','choice','choice','choice',
    'event','choice','choice','choice',
    'event','choice','choice','choice',
    'event','choice'
];

function initBoard() {
    const board = $('#board');
    board.innerHTML = '';
    for (let i = 0; i < gameState.totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'board-cell';
        cell.dataset.index = i;
        const type = CELL_TYPES[i];
        if (type === 'start') {
            cell.classList.add('start-cell');
            cell.innerHTML = `<span class="cell-icon">🚀</span><span class="cell-name">출발</span>`;
        } else if (type === 'event') {
            cell.classList.add('cell-event');
            cell.innerHTML = `<span class="cell-icon">⚡</span><span class="cell-name">이벤트</span>`;
        } else {
            cell.classList.add('cell-choice');
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
            <div class="player-score">${player.score}점</div>`;
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
    const cc = $(`.board-cell[data-index="${current.position}"]`);
    if (cc) cc.classList.add('current-cell');

    $$('.player-card').forEach((card, i) => {
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
    const emojis = ['','⚀','⚁','⚂','⚃','⚄','⚅'];
    const interval = setInterval(() => {
        resultEl.textContent = emojis[Math.floor(Math.random()*6)+1];
        resultEl.classList.add('dice-rolling');
        rollCount++;
        if (rollCount >= 10) {
            clearInterval(interval);
            const val = Math.floor(Math.random()*3)+1;
            resultEl.textContent = emojis[val];
            resultEl.classList.remove('dice-rolling');
            setTimeout(() => movePlayer(val), 500);
        }
    }, 80);
}


// ===== 이동 (무한 루프) =====
function movePlayer(steps) {
    const player = gameState.players[gameState.currentPlayerIndex];
    player.position = (player.position + steps) % gameState.totalCells;
    updateBoard();

    const type = CELL_TYPES[player.position];
    setTimeout(() => {
        if (type === 'choice') showQuestion();
        else if (type === 'event') showEvent();
        else nextTurn();
    }, 600);
}

// ===== 선택 질문 =====
function showQuestion() {
    if (gameState.questionPool.length === 0) {
        gameState.questionPool = [...QUESTION_POOL];
        shuffleArray(gameState.questionPool);
    }
    const q = gameState.questionPool.pop();
    const modal = $('#card-modal');
    $('#card-category').textContent = q.category;
    $('#card-title').textContent = q.title;
    $('#card-situation').textContent = q.situation;
    const choicesEl = $('#card-choices');
    choicesEl.innerHTML = '';

    q.choices.forEach((choice) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `<span class="choice-score">${choice.score}점</span><span>${choice.text}</span>`;
        btn.addEventListener('click', () => {
            const player = gameState.players[gameState.currentPlayerIndex];
            player.score += choice.score;
            player.choices.push({ title: q.title, text: choice.text, score: choice.score });
            modal.classList.add('hidden');
            updateBoard();
            nextTurn();
        });
        choicesEl.appendChild(btn);
    });
    modal.classList.remove('hidden');
}


// ===== 이벤트 (A vs B) =====
function showEvent() {
    if (gameState.eventPool.length === 0) {
        gameState.eventPool = [...EVENT_POOL];
        shuffleArray(gameState.eventPool);
    }
    const ev = gameState.eventPool.pop();
    const modal = $('#card-modal');
    $('#card-category').textContent = '⚡ 이벤트';
    $('#card-title').textContent = ev.title;
    $('#card-situation').textContent = '전체 참여자가 함께 선택해보세요!';
    const choicesEl = $('#card-choices');
    choicesEl.innerHTML = `
        <div class="event-options">
            <button class="event-btn event-a" id="event-a-btn">
                <span class="event-label">🅰️</span>
                <span>${ev.optionA}</span>
            </button>
            <button class="event-btn event-b" id="event-b-btn">
                <span class="event-label">🅱️</span>
                <span>${ev.optionB}</span>
            </button>
        </div>
        <button class="choice-btn event-done-btn" id="event-done-btn" style="margin-top:16px; text-align:center; justify-content:center;">
            나눔을 마쳤습니다 ✓
        </button>
    `;
    $('#event-done-btn').addEventListener('click', () => {
        modal.classList.add('hidden');
        nextTurn();
    });
    modal.classList.remove('hidden');
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


// ===== 종료 & 결과 =====
function endGame() {
    gameState.isGameOver = true;
    showScreen('result-screen');
    generateResults();
}

function generateResults() {
    const container = $('#result-content');
    container.innerHTML = '';
    const sorted = [...gameState.players].sort((a, b) => b.score - a.score);

    // 순위
    const rankEl = document.createElement('div');
    rankEl.className = 'result-section ranking-section';
    rankEl.innerHTML = '<h2>🏆 게임 결과</h2>';
    sorted.forEach((p, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
        rankEl.innerHTML += `<div class="rank-item"><span class="rank-medal">${medal}</span><span class="rank-name">${p.name}</span><span class="rank-score">${p.score}점</span></div>`;
    });
    container.appendChild(rankEl);

    // 반전
    const twistEl = document.createElement('div');
    twistEl.className = 'result-section twist-section';
    twistEl.innerHTML = `
        <h2>🪞 그런데 잠깐...</h2>
        <p class="twist-message">당신이 모은 점수는<br><strong>"육의 것을 심은 점수"</strong>입니다.</p>
        <p class="twist-verse">"자기의 육체를 위하여 심는 자는 육체로부터 썩어진 것을 거두고<br>성령을 위하여 심는 자는 성령으로부터 영생을 거두리라"<br><em>— 갈라디아서 6:8</em></p>`;
    container.appendChild(twistEl);

    // 비교 차트
    const maxScore = sorted[0].choices.length * 3 || 1;
    const compEl = document.createElement('div');
    compEl.className = 'result-section comparison-section';
    compEl.innerHTML = '<h3>📊 육의 것 (높을수록 세상에 마음을 둔 것)</h3>';
    sorted.forEach(p => {
        const pct = (p.score / maxScore) * 100;
        compEl.innerHTML += `<div class="result-bar-item"><span class="result-bar-label">${p.name}</span><div class="result-bar-track"><div class="result-bar-fill bar-flesh" style="width:${pct}%"></div></div><span class="result-bar-count">${p.score}점</span></div>`;
    });

    const sortedSpirit = [...gameState.players].sort((a, b) => a.score - b.score);
    compEl.innerHTML += '<h3 style="margin-top:24px;">📊 영의 것 (낮을수록 하나님께 마음을 둔 것)</h3>';
    sortedSpirit.forEach(p => {
        const spirit = maxScore - p.score;
        const pct = (spirit / maxScore) * 100;
        compEl.innerHTML += `<div class="result-bar-item"><span class="result-bar-label">${p.name}</span><div class="result-bar-track"><div class="result-bar-fill bar-spirit" style="width:${pct}%"></div></div><span class="result-bar-count">${spirit}점</span></div>`;
    });
    container.appendChild(compEl);

    // 마무리
    const closeEl = document.createElement('div');
    closeEl.className = 'result-section closing-section';
    closeEl.innerHTML = `
        <p>우리는 이런 세상 속에서 살아가며<br>매 순간 선택의 갈림길에 서 있습니다.</p>
        <p>무엇이 옳은 선택인지, 혼란스러울 때가 많습니다.</p>
        <p class="closing-highlight">지금부터 목사님과 함께<br>라디오 나눔을 통해 더 깊이 나눠봅시다. 🎙️</p>`;
    container.appendChild(closeEl);
}


// ===== 리셋 & 종료 & 다시하기 =====
function initControls() {
    $('#reset-btn').addEventListener('click', () => {
        if (confirm('게임을 처음부터 다시 시작할까요?')) {
            gameState.players.forEach(p => { p.position = 0; p.score = 0; p.choices = []; });
            gameState.currentPlayerIndex = 0;
            gameState.isGameOver = false;
            gameState.questionPool = [...QUESTION_POOL];
            shuffleArray(gameState.questionPool);
            gameState.eventPool = [...EVENT_POOL];
            shuffleArray(gameState.eventPool);
            updateBoard();
            updateTurnInfo();
            $('#roll-dice-btn').disabled = false;
            $('#dice-result').textContent = '';
        }
    });
    $('#end-btn').addEventListener('click', () => {
        if (confirm('게임을 종료하고 결과를 볼까요?')) { endGame(); }
    });
    $('#restart-btn').addEventListener('click', () => {
        gameState = { players: [], currentPlayerIndex: 0, isGameOver: false, totalCells: 14, questionPool: [], eventPool: [] };
        showScreen('start-screen');
        updatePlayerInputs(2);
    });
}

// ===== 초기화 =====
function init() { initStartScreen(); initDice(); initControls(); }
document.addEventListener('DOMContentLoaded', init);
