// ===== 게임 상태 =====
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    isGameOver: false,
    totalCells: 13 // 출발 + 12 상황칸
};

// ===== DOM 요소 =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== 시작 화면 로직 =====
function initStartScreen() {
    const countSelect = $('#player-count-select');
    const namesContainer = $('#player-names');
    const startBtn = $('#start-btn');

    countSelect.addEventListener('change', () => {
        const count = parseInt(countSelect.value);
        updatePlayerInputs(count);
    });

    startBtn.addEventListener('click', startGame);
}

function updatePlayerInputs(count) {
    const container = $('#player-names');
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'player-name-input';
        input.placeholder = `플레이어 ${i + 1} 이름`;
        input.dataset.index = i;
        container.appendChild(input);
    }
}

function startGame() {
    const inputs = $$('.player-name-input');
    const players = [];

    inputs.forEach((input, i) => {
        const name = input.value.trim() || `플레이어 ${i + 1}`;
        players.push({
            name: name,
            position: 0,
            choices: [], // { cardId, choiceIndex, tag }
            finished: false
        });
    });

    if (players.length < 2) {
        alert('최소 2명이 필요합니다!');
        return;
    }

    gameState.players = players;
    gameState.currentPlayerIndex = 0;
    gameState.isGameOver = false;

    showScreen('game-screen');
    initBoard();
    initPlayerPanel();
    updateTurnInfo();
    updateBoard();
}

// ===== 화면 전환 =====
function showScreen(screenId) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    $(`#${screenId}`).classList.add('active');
}

// ===== 보드 초기화 =====
function initBoard() {
    const board = $('#board');
    board.innerHTML = '';

    // 13칸 생성 (출발 + 12 상황)
    // 보드 배치: ㅁ자 시계방향
    // 위쪽: 0,1,2,3,4 / 오른쪽: 5,6,7 / 아래쪽: 8,9,10,11 / 왼쪽: 12
    // 총 13칸을 ㅁ자로 배치

    for (let i = 0; i < gameState.totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'board-cell';
        cell.dataset.index = i;

        if (i === 0) {
            cell.classList.add('start-cell');
            cell.innerHTML = `
                <span class="cell-icon">🚀</span>
                <span class="cell-name">출발</span>
            `;
        } else {
            const card = SITUATION_CARDS[i - 1];
            cell.innerHTML = `
                <span class="cell-icon">${card.icon}</span>
                <span class="cell-name">${card.category}</span>
            `;
        }

        // 플레이어 토큰 영역
        const tokens = document.createElement('div');
        tokens.className = 'player-tokens';
        cell.appendChild(tokens);

        board.appendChild(cell);
    }
}

// ===== 플레이어 패널 =====
function initPlayerPanel() {
    const panel = $('#player-panel');
    panel.innerHTML = '';

    gameState.players.forEach((player, i) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.dataset.playerIndex = i;
        card.innerHTML = `
            <div>
                <span class="player-dot p${i}" style="background: var(--player${i + 1})"></span>
                <span class="player-name">${player.name}</span>
            </div>
            <div class="player-progress">시작 지점</div>
        `;
        panel.appendChild(card);
    });
}

// ===== 보드 업데이트 =====
function updateBoard() {
    // 모든 토큰 초기화
    $$('.player-tokens').forEach(t => t.innerHTML = '');

    // 현재 칸 하이라이트 초기화
    $$('.board-cell').forEach(c => c.classList.remove('current-cell'));

    // 플레이어 토큰 배치
    gameState.players.forEach((player, i) => {
        if (player.position < gameState.totalCells) {
            const cell = $(`.board-cell[data-index="${player.position}"]`);
            if (cell) {
                const tokenContainer = cell.querySelector('.player-tokens');
                const token = document.createElement('div');
                token.className = `player-token p${i}`;
                tokenContainer.appendChild(token);
            }
        }
    });

    // 현재 플레이어의 칸 하이라이트
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer && !currentPlayer.finished) {
        const currentCell = $(`.board-cell[data-index="${currentPlayer.position}"]`);
        if (currentCell) {
            currentCell.classList.add('current-cell');
        }
    }

    // 방문한 칸 표시
    $$('.board-cell').forEach((cell, idx) => {
        if (idx === 0) return;
        const anyVisited = gameState.players.some(p =>
            p.choices.some(c => c.cardId === idx)
        );
        if (anyVisited) {
            cell.classList.add('visited-cell');
        }
    });

    // 플레이어 패널 업데이트
    $$('.player-card').forEach((card, i) => {
        card.classList.toggle('active-player', i === gameState.currentPlayerIndex);
        const player = gameState.players[i];
        const progress = card.querySelector('.player-progress');
        if (player.finished) {
            progress.textContent = `완료! (${player.choices.length}개 선택)`;
        } else {
            progress.textContent = `${player.choices.length}/12 진행`;
        }
    });
}

// ===== 턴 정보 =====
function updateTurnInfo() {
    const player = gameState.players[gameState.currentPlayerIndex];
    $('#turn-info').innerHTML = `<strong>${player.name}</strong>의 차례`;
}

// ===== 주사위 =====
function initDice() {
    $('#roll-dice-btn').addEventListener('click', rollDice);
}

function rollDice() {
    const btn = $('#roll-dice-btn');
    const resultEl = $('#dice-result');
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    if (currentPlayer.finished || gameState.isGameOver) return;

    btn.disabled = true;

    // 주사위 애니메이션
    let rollCount = 0;
    const maxRolls = 10;
    const rollInterval = setInterval(() => {
        const tempNum = Math.floor(Math.random() * 6) + 1;
        resultEl.textContent = getDiceEmoji(tempNum);
        resultEl.classList.add('dice-rolling');
        rollCount++;

        if (rollCount >= maxRolls) {
            clearInterval(rollInterval);

            // 최종 주사위 결과 (1~3으로 제한 - 12칸에서 적절한 이동)
            // 실제로는 1칸씩 이동하도록 함 (모든 칸을 경험하게)
            const diceValue = 1;
            resultEl.textContent = getDiceEmoji(1);
            resultEl.classList.remove('dice-rolling');

            setTimeout(() => movePlayer(diceValue), 500);
        }
    }, 80);
}

function getDiceEmoji(num) {
    const emojis = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return emojis[num] || '🎲';
}

// ===== 플레이어 이동 =====
function movePlayer(steps) {
    const player = gameState.players[gameState.currentPlayerIndex];
    const newPosition = player.position + steps;

    // 12번째 상황칸(인덱스 12)이 마지막. 그 이후면 완료
    if (newPosition >= gameState.totalCells) {
        player.finished = true;
        updateBoard();
        checkGameOver();
        return;
    }

    player.position = newPosition;
    updateBoard();

    // 상황 칸이면 카드 표시 (position 1~12가 상황칸)
    if (newPosition > 0 && newPosition < gameState.totalCells) {
        setTimeout(() => showSituationCard(newPosition - 1), 600);
    } else {
        nextTurn();
    }
}

// 마지막 상황칸 선택 후 완료 체크
function checkPlayerFinished(player) {
    // 12개 상황을 모두 선택했으면 완료
    if (player.choices.length >= 12) {
        player.finished = true;
        return true;
    }
    return false;
}

// ===== 상황 카드 표시 =====
function showSituationCard(cardIndex) {
    const card = SITUATION_CARDS[cardIndex];
    const modal = $('#card-modal');
    const categoryEl = $('#card-category');
    const situationEl = $('#card-situation');
    const choicesEl = $('#card-choices');

    categoryEl.textContent = `${card.icon} ${card.category}`;
    situationEl.textContent = card.situation;

    choicesEl.innerHTML = '';
    card.choices.forEach((choice, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `<span class="choice-number">${i + 1}</span>${choice.text}`;
        btn.addEventListener('click', () => selectChoice(cardIndex, i));
        choicesEl.appendChild(btn);
    });

    modal.classList.remove('hidden');
}

// ===== 선택 처리 =====
function selectChoice(cardIndex, choiceIndex) {
    const card = SITUATION_CARDS[cardIndex];
    const choice = card.choices[choiceIndex];
    const player = gameState.players[gameState.currentPlayerIndex];

    // 선택 기록
    player.choices.push({
        cardId: cardIndex + 1,
        cardTitle: card.title,
        choiceIndex: choiceIndex,
        choiceText: choice.text,
        tag: choice.tag
    });

    // 모달 닫기
    $('#card-modal').classList.add('hidden');

    // 마지막 칸(12번째 상황)에 도달했으면 완료 처리
    if (player.position >= gameState.totalCells - 1) {
        player.finished = true;
        updateBoard();
        checkGameOver();
        return;
    }

    // 다음 턴
    nextTurn();
}

// ===== 다음 턴 =====
function nextTurn() {
    const btn = $('#roll-dice-btn');
    const resultEl = $('#dice-result');

    // 다음 플레이어 찾기
    let nextIndex = gameState.currentPlayerIndex;
    let attempts = 0;

    do {
        nextIndex = (nextIndex + 1) % gameState.players.length;
        attempts++;
    } while (gameState.players[nextIndex].finished && attempts <= gameState.players.length);

    // 모든 플레이어가 끝났는지 확인
    if (attempts > gameState.players.length || gameState.players.every(p => p.finished)) {
        endGame();
        return;
    }

    gameState.currentPlayerIndex = nextIndex;
    updateTurnInfo();
    updateBoard();

    btn.disabled = false;
    resultEl.textContent = '';
}

// ===== 게임 종료 확인 =====
function checkGameOver() {
    if (gameState.players.every(p => p.finished)) {
        endGame();
    } else {
        nextTurn();
    }
}

// ===== 게임 종료 & 결과 =====
function endGame() {
    gameState.isGameOver = true;
    setTimeout(() => {
        showScreen('result-screen');
        generateResults();
    }, 1000);
}

function generateResults() {
    const container = $('#result-content');
    container.innerHTML = '';

    // 각 플레이어별 결과
    gameState.players.forEach((player, playerIndex) => {
        const section = document.createElement('div');
        section.className = 'result-player-section';

        // 플레이어 이름
        const nameEl = document.createElement('div');
        nameEl.className = 'result-player-name';
        nameEl.innerHTML = `<span class="player-dot p${playerIndex}" style="background: var(--player${playerIndex + 1}); display:inline-block; width:14px; height:14px; border-radius:50%; margin-right:8px; vertical-align:middle;"></span>${player.name}의 선택 리포트`;
        section.appendChild(nameEl);

        // 태그 집계
        const tagCounts = {};
        player.choices.forEach(c => {
            tagCounts[c.tag] = (tagCounts[c.tag] || 0) + 1;
        });

        // 태그를 카테고리별로 분류
        const negativePatterns = [TAGS.PACKAGED_GREED, TAGS.PEER_PRESSURE, TAGS.POSTPONE, TAGS.IDOL_MONEY, TAGS.NINETY_PERCENT, TAGS.SELF_RATIONALIZE, TAGS.IMPULSE, TAGS.SMALL_DISHONEST, TAGS.COMPARISON];
        const positivePatterns = [TAGS.FAITH_FIRST, TAGS.STEWARD_CONFESS, TAGS.PRAYER_DECIDE, TAGS.TRUST_GOD, TAGS.CONTENTMENT, TAGS.HONESTY, TAGS.COMMUNITY, TAGS.DECISION];
        const honestPatterns = [TAGS.HONEST_ADMIT, TAGS.SELF_CHECK, TAGS.FUTURE_ANXIETY];

        // 차트 생성
        const chartEl = document.createElement('div');
        chartEl.className = 'result-chart';

        const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
        const maxCount = Math.max(...Object.values(tagCounts), 1);

        sortedTags.forEach(([tag, count]) => {
            let barClass = 'bar-neutral';
            if (negativePatterns.includes(tag)) barClass = 'bar-negative';
            else if (positivePatterns.includes(tag)) barClass = 'bar-positive';
            else if (honestPatterns.includes(tag)) barClass = 'bar-honest';

            const percentage = (count / player.choices.length) * 100;

            const barItem = document.createElement('div');
            barItem.className = 'result-bar-item';
            barItem.innerHTML = `
                <span class="result-bar-label">${tag}</span>
                <div class="result-bar-track">
                    <div class="result-bar-fill ${barClass}" style="width: ${percentage}%"></div>
                </div>
                <span class="result-bar-count">${count}회</span>
            `;
            chartEl.appendChild(barItem);
        });

        section.appendChild(chartEl);

        // 가장 많이 나온 태그의 메시지
        if (sortedTags.length > 0) {
            const topTag = sortedTags[0][0];
            const tagResult = TAG_RESULTS[topTag];

            if (tagResult) {
                const topTagEl = document.createElement('div');
                topTagEl.className = 'result-top-tag';
                topTagEl.innerHTML = `
                    <h4>📌 가장 많이 나타난 패턴: "${topTag}"</h4>
                    <p class="tag-description">${tagResult.description}</p>
                    <p class="tag-verse">${tagResult.verse}</p>
                    <p class="tag-question">💬 ${tagResult.question}</p>
                `;
                section.appendChild(topTagEl);
            }

            // 두 번째로 많은 태그도 표시 (있다면)
            if (sortedTags.length > 1) {
                const secondTag = sortedTags[1][0];
                const secondResult = TAG_RESULTS[secondTag];

                if (secondResult) {
                    const secondEl = document.createElement('div');
                    secondEl.className = 'result-top-tag';
                    secondEl.innerHTML = `
                        <h4>📌 두 번째 패턴: "${secondTag}"</h4>
                        <p class="tag-description">${secondResult.description}</p>
                        <p class="tag-verse">${secondResult.verse}</p>
                        <p class="tag-question">💬 ${secondResult.question}</p>
                    `;
                    section.appendChild(secondEl);
                }
            }
        }

        // 선택 로그
        const logEl = document.createElement('div');
        logEl.className = 'result-choices-log';
        logEl.innerHTML = '<h4>📝 나의 선택 기록</h4>';

        player.choices.forEach((choice, i) => {
            const item = document.createElement('div');
            item.className = 'choice-log-item';
            item.innerHTML = `
                <span class="choice-log-num">${i + 1}</span>
                <div>
                    <div class="choice-log-text">${choice.choiceText}</div>
                    <div class="choice-log-tag">[${choice.tag}] — ${choice.cardTitle}</div>
                </div>
            `;
            logEl.appendChild(item);
        });

        section.appendChild(logEl);
        container.appendChild(section);
    });

    // 나눔 질문 섹션
    const sharingEl = document.createElement('div');
    sharingEl.className = 'sharing-questions';
    sharingEl.innerHTML = `
        <h3>🙏 함께 나눠볼 질문</h3>
        <ul>
            <li>12개 상황 중 가장 오래 고민한 것은 몇 번이었나요? 왜요?</li>
            <li>"하나님을 위한다"고 하면서 실은 내 욕심이었던 적, 있었나요?</li>
            <li>내가 가장 자주 하는 자기합리화 패턴은 무엇인가요?</li>
            <li>"나중에"라는 말을 얼마나 자주 쓰고 있었나요?</li>
            <li>지금 내 마음의 보물 1순위는 솔직히 무엇인가요?</li>
            <li>게임에서의 선택과 실제 내 삶의 선택이 다른가요, 같은가요?</li>
        </ul>
    `;
    container.appendChild(sharingEl);
}

// ===== 다시하기 =====
function initRestart() {
    $('#restart-btn').addEventListener('click', () => {
        gameState = {
            players: [],
            currentPlayerIndex: 0,
            isGameOver: false,
            totalCells: 13
        };
        showScreen('start-screen');
        updatePlayerInputs(2);
    });
}

// ===== 게임 초기화 =====
function init() {
    initStartScreen();
    initDice();
    initRestart();
}

// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', init);
