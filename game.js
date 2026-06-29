// ===== 게임 상태 =====
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    isGameOver: false,
    totalCells: 13 // 출발(0) + 12칸
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
            choices: [],
            finished: false
        });
    });
    if (players.length < 2) { alert('최소 2명이 필요합니다!'); return; }
    gameState.players = players;
    gameState.currentPlayerIndex = 0;
    gameState.isGameOver = false;
    showScreen('game-screen');
    initBoard();
    initPlayerPanel();
    updateTurnInfo();
    updateBoard();
}

function showScreen(screenId) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    $(`#${screenId}`).classList.add('active');
}


// ===== 보드 초기화 =====
function initBoard() {
    const board = $('#board');
    board.innerHTML = '';
    BOARD_CELLS.forEach((cellData, i) => {
        const cell = document.createElement('div');
        cell.className = 'board-cell';
        cell.dataset.index = i;
        if (cellData.type === 'start') {
            cell.classList.add('start-cell');
        } else {
            cell.classList.add(`cell-${cellData.type}`);
        }
        cell.innerHTML = `
            <span class="cell-icon">${cellData.icon}</span>
            <span class="cell-name">${cellData.name}</span>
            <div class="player-tokens"></div>
        `;
        board.appendChild(cell);
    });
}

function initPlayerPanel() {
    const panel = $('#player-panel');
    panel.innerHTML = '';
    gameState.players.forEach((player, i) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
            <div><span class="player-dot p${i}"></span>
            <span class="player-name">${player.name}</span></div>
            <div class="player-progress">시작</div>
        `;
        panel.appendChild(card);
    });
}


// ===== 보드 업데이트 =====
function updateBoard() {
    $$('.player-tokens').forEach(t => t.innerHTML = '');
    $$('.board-cell').forEach(c => c.classList.remove('current-cell'));

    gameState.players.forEach((player, i) => {
        if (player.position < gameState.totalCells) {
            const cell = $(`.board-cell[data-index="${player.position}"]`);
            if (cell) {
                const token = document.createElement('div');
                token.className = `player-token p${i}`;
                cell.querySelector('.player-tokens').appendChild(token);
            }
        }
    });

    const current = gameState.players[gameState.currentPlayerIndex];
    if (current && !current.finished) {
        const cell = $(`.board-cell[data-index="${current.position}"]`);
        if (cell) cell.classList.add('current-cell');
    }

    $$('.player-card').forEach((card, i) => {
        card.classList.toggle('active-player', i === gameState.currentPlayerIndex);
        const p = gameState.players[i];
        card.querySelector('.player-progress').textContent =
            p.finished ? `완료!` : `${p.choices.length}개 선택`;
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
    const current = gameState.players[gameState.currentPlayerIndex];
    if (current.finished || gameState.isGameOver) return;
    btn.disabled = true;

    let rollCount = 0;
    const emojis = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    const rollInterval = setInterval(() => {
        resultEl.textContent = emojis[Math.floor(Math.random() * 6) + 1];
        resultEl.classList.add('dice-rolling');
        rollCount++;
        if (rollCount >= 10) {
            clearInterval(rollInterval);
            // 1~3 주사위 (12칸을 10-15분에 마치기 적합)
            const diceValue = Math.floor(Math.random() * 3) + 1;
            resultEl.textContent = emojis[diceValue];
            resultEl.classList.remove('dice-rolling');
            setTimeout(() => movePlayer(diceValue), 500);
        }
    }, 80);
}


// ===== 이동 =====
function movePlayer(steps) {
    const player = gameState.players[gameState.currentPlayerIndex];
    let newPosition = player.position + steps;

    // 마지막 칸(12) 넘으면 마지막 칸에 멈춤
    if (newPosition >= gameState.totalCells) {
        newPosition = gameState.totalCells - 1;
    }

    player.position = newPosition;
    updateBoard();

    const cellData = BOARD_CELLS[newPosition];
    setTimeout(() => {
        switch (cellData.type) {
            case 'choice':
                showChoiceCard(cellData.cardIndex);
                break;
            case 'event':
                showEventCard(cellData.eventIndex);
                break;
            case 'sharing':
                showSharingCard(cellData.sharingIndex);
                break;
            default:
                nextTurn();
        }
    }, 600);
}


// ===== 선택 칸 =====
function showChoiceCard(cardIndex) {
    const card = CHOICE_CARDS[cardIndex];
    const modal = $('#card-modal');
    $('#card-category').textContent = `${card.icon} ${card.category}`;
    $('#card-title').textContent = card.title;
    $('#card-situation').textContent = card.situation;
    const choicesEl = $('#card-choices');
    choicesEl.innerHTML = '';
    card.choices.forEach((choice, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `<span class="choice-number">${i + 1}</span>${choice.text}`;
        btn.addEventListener('click', () => {
            const player = gameState.players[gameState.currentPlayerIndex];
            player.choices.push({
                type: 'choice',
                cardTitle: card.title,
                choiceText: choice.text,
                tag: choice.tag
            });
            modal.classList.add('hidden');
            checkFinishOrNext();
        });
        choicesEl.appendChild(btn);
    });
    modal.classList.remove('hidden');
}

// ===== 이벤트 칸 =====
function showEventCard(eventIndex) {
    const card = EVENT_CARDS[eventIndex];
    const modal = $('#card-modal');
    $('#card-category').textContent = `⚡ 이벤트`;
    $('#card-title').textContent = card.title;
    $('#card-situation').textContent = card.situation;
    const choicesEl = $('#card-choices');
    choicesEl.innerHTML = '';
    card.choices.forEach((choice, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `<span class="choice-number">${i + 1}</span>${choice.text}`;
        btn.addEventListener('click', () => {
            const player = gameState.players[gameState.currentPlayerIndex];
            player.choices.push({
                type: 'event',
                cardTitle: card.title,
                choiceText: choice.text,
                tag: choice.tag
            });
            modal.classList.add('hidden');
            checkFinishOrNext();
        });
        choicesEl.appendChild(btn);
    });
    modal.classList.remove('hidden');
}


// ===== 나눔 칸 =====
function showSharingCard(sharingIndex) {
    const card = SHARING_CARDS[sharingIndex];
    const modal = $('#card-modal');
    $('#card-category').textContent = `💬 나눔`;
    $('#card-title').textContent = card.title;
    // 랜덤 질문 선택
    const randomQ = card.questions[Math.floor(Math.random() * card.questions.length)];
    $('#card-situation').textContent = randomQ;
    const choicesEl = $('#card-choices');
    choicesEl.innerHTML = `
        <p style="font-size:0.85rem; color:#666; margin-bottom:16px; line-height:1.6;">
            ${card.instruction}
        </p>
        <button class="choice-btn sharing-done-btn">
            <span class="choice-number">✓</span>나눔을 마쳤습니다
        </button>
    `;
    choicesEl.querySelector('.sharing-done-btn').addEventListener('click', () => {
        modal.classList.add('hidden');
        checkFinishOrNext();
    });
    modal.classList.remove('hidden');
}

// ===== 완료 체크 & 다음 턴 =====
function checkFinishOrNext() {
    const player = gameState.players[gameState.currentPlayerIndex];
    // 마지막 칸 도달 시 완료
    if (player.position >= gameState.totalCells - 1) {
        player.finished = true;
        updateBoard();
        if (gameState.players.every(p => p.finished)) {
            endGame();
        } else {
            nextTurn();
        }
    } else {
        nextTurn();
    }
}

function nextTurn() {
    const btn = $('#roll-dice-btn');
    const resultEl = $('#dice-result');
    let nextIndex = gameState.currentPlayerIndex;
    let attempts = 0;
    do {
        nextIndex = (nextIndex + 1) % gameState.players.length;
        attempts++;
    } while (gameState.players[nextIndex].finished && attempts <= gameState.players.length);

    if (gameState.players.every(p => p.finished)) {
        endGame();
        return;
    }
    gameState.currentPlayerIndex = nextIndex;
    updateTurnInfo();
    updateBoard();
    btn.disabled = false;
    resultEl.textContent = '';
}


// ===== 게임 종료 & 결과 =====
function endGame() {
    gameState.isGameOver = true;
    setTimeout(() => {
        showScreen('result-screen');
        generateResults();
    }, 800);
}

function generateResults() {
    const container = $('#result-content');
    container.innerHTML = '';

    gameState.players.forEach((player, pi) => {
        const section = document.createElement('div');
        section.className = 'result-player-section';

        // 이름
        const nameEl = document.createElement('div');
        nameEl.className = 'result-player-name';
        nameEl.innerHTML = `<span class="player-dot p${pi}"></span>${player.name}의 선택 리포트`;
        section.appendChild(nameEl);

        // 태그 집계
        const tagCounts = {};
        player.choices.forEach(c => {
            if (c.tag) tagCounts[c.tag] = (tagCounts[c.tag] || 0) + 1;
        });

        const negTags = [TAGS.PACKAGED_GREED, TAGS.PEER_PRESSURE, TAGS.POSTPONE,
            TAGS.IDOL_MONEY, TAGS.NINETY_PERCENT, TAGS.SELF_RATIONALIZE,
            TAGS.IMPULSE, TAGS.SMALL_DISHONEST, TAGS.COMPARISON, TAGS.FOMO, TAGS.SELF_WORTH_MONEY];
        const posTags = [TAGS.FAITH_FIRST, TAGS.STEWARD_CONFESS, TAGS.PRAYER_DECIDE,
            TAGS.TRUST_GOD, TAGS.CONTENTMENT, TAGS.HONESTY, TAGS.COMMUNITY, TAGS.DECISION];

        // 차트
        const chartEl = document.createElement('div');
        chartEl.className = 'result-chart';
        const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
        const total = player.choices.filter(c => c.tag).length || 1;

        sorted.forEach(([tag, count]) => {
            let barClass = 'bar-honest';
            if (negTags.includes(tag)) barClass = 'bar-negative';
            else if (posTags.includes(tag)) barClass = 'bar-positive';
            const pct = (count / total) * 100;
            const bar = document.createElement('div');
            bar.className = 'result-bar-item';
            bar.innerHTML = `
                <span class="result-bar-label">${tag}</span>
                <div class="result-bar-track">
                    <div class="result-bar-fill ${barClass}" style="width:${pct}%"></div>
                </div>
                <span class="result-bar-count">${count}회</span>`;
            chartEl.appendChild(bar);
        });
        section.appendChild(chartEl);

        // 상위 패턴 메시지
        if (sorted.length > 0) {
            const topTag = sorted[0][0];
            const res = TAG_RESULTS[topTag];
            if (res) {
                const topEl = document.createElement('div');
                topEl.className = 'result-top-tag';
                topEl.innerHTML = `
                    <h4>📌 가장 많이 나타난 패턴: "${topTag}"</h4>
                    <p class="tag-description">${res.description}</p>
                    <p class="tag-verse">${res.verse}</p>
                    <p class="tag-question">💬 ${res.question}</p>`;
                section.appendChild(topEl);
            }
        }

        // 선택 로그
        const logEl = document.createElement('div');
        logEl.className = 'result-choices-log';
        logEl.innerHTML = '<h4>📝 나의 선택 기록</h4>';
        player.choices.forEach((c, i) => {
            const item = document.createElement('div');
            item.className = 'choice-log-item';
            item.innerHTML = `
                <span class="choice-log-num">${i + 1}</span>
                <div>
                    <div class="choice-log-text">${c.choiceText}</div>
                    <div class="choice-log-tag">[${c.tag || '나눔'}] — ${c.cardTitle}</div>
                </div>`;
            logEl.appendChild(item);
        });
        section.appendChild(logEl);
        container.appendChild(section);
    });

    // 나눔 질문
    const sharingEl = document.createElement('div');
    sharingEl.className = 'sharing-questions';
    sharingEl.innerHTML = `
        <h3>🙏 함께 나눠볼 질문</h3>
        <ul>
            <li>가장 오래 고민한 상황은 어떤 것이었나요?</li>
            <li>"하나님을 위한다"고 하면서 실은 내 욕심이었던 적, 있었나요?</li>
            <li>내가 가장 자주 하는 자기합리화 패턴은 무엇인가요?</li>
            <li>지금 내 마음의 보물 1순위는 솔직히 무엇인가요?</li>
            <li>게임에서의 선택과 실제 내 삶의 선택이 다른가요, 같은가요?</li>
        </ul>`;
    container.appendChild(sharingEl);
}


// ===== 다시하기 =====
function initRestart() {
    $('#restart-btn').addEventListener('click', () => {
        gameState = { players: [], currentPlayerIndex: 0, isGameOver: false, totalCells: 13 };
        showScreen('start-screen');
        updatePlayerInputs(2);
    });
}

// ===== 초기화 =====
function init() {
    initStartScreen();
    initDice();
    initRestart();
}

document.addEventListener('DOMContentLoaded', init);
