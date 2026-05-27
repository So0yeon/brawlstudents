// ============================================================================
// 🎮 브롤스튜던츠 - 게임 로직 (game.js)
// ============================================================================

const GAME_CONFIG = {
  maxHp: 100,
  stageCount: 5,
  pvpRounds: 10,
  timeLimit: 15,
  shieldAbilityTrigger: 3,
  hintPenalty: 0.5,
  speedScoreTiers: [
    { min: 0,  max: 2,        score: 200 },
    { min: 2,  max: 5,        score: 150 },
    { min: 5,  max: 10,       score: 100 },
    { min: 10, max: 15,       score: 60  },
    { min: 15, max: Infinity, score: 40  },
  ],
  baseComboMultipliers: [
    { min: 2, max: 2,        mult: 1.2 },
    { min: 3, max: 4,        mult: 1.5 },
    { min: 5, max: Infinity, mult: 2.0 },
  ],
};

const CHARACTERS = [
  { id: 'shelly', emoji: '🦸‍♀️', name: '쉘리',  power: '⚡ 정답시 +5데미지', ability: 'bonusDamage', bonus: 5 },
  { id: 'colt',   emoji: '🤠',   name: '콜트',  power: '⏱ 풀이시간 +3초',   ability: 'extraTime',   timeBonus: 3 },
  { id: 'nita',   emoji: '🐻',   name: '니타',  power: '💚 정답시 HP회복',   ability: 'heal',        healAmount: 5 },
  { id: 'leon',   emoji: '🥷',   name: '레온',  power: '🛡 3연속시 보호막',  ability: 'shield' },
  { id: 'spike',  emoji: '🌵',   name: '스파이크', power: '🔥 콤보 안깨짐',  ability: 'comboKeep' },
  { id: 'crow',   emoji: '🦅',   name: '크로우', power: '🗡 5초내 +10데미지', ability: 'quickStrike', quickBonus: 10, quickTime: 5 },
];

const DIFFICULTIES = [
  { id: 'easy',   name: 'easy - 새내기 브롤러',   icon: '🥉', color: '#3ddc84' },
  { id: 'normal', name: 'normal - 베테랑 브롤러',   icon: '🥈', color: '#00d4ff' },
  { id: 'hard',   name: 'hard - 챔피언 브롤러',   icon: '🥇', color: '#ff3d8b' },
];

let gameState = {
  mode: null, difficulty: null,
  p1Character: null, p2Character: null,
  // 모험
  playerHp: GAME_CONFIG.maxHp, enemyHp: GAME_CONFIG.maxHp,
  score: 0, correct: 0, wrong: 0,
  combo: 0, maxCombo: 0,
  stage: 0, shield: false,
  advStartTime: 0, advTotalTime: 0,
  // pvp
  pvpTurn: 1,          // 1 or 2
  pvpRound: 0,
  pvpScores: [0, 0],   // [p1, p2]
  pvpCombos: [0, 0],
  // 공통
  currentQuestion: null,
  hintUsed: false,
  questionStartTime: 0,
  timerInterval: null,
};

// ========== 유틸 ==========
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function formatTime(ms) {
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60);
  return `${String(m).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
}

function getTimeLimit(char) {
  return GAME_CONFIG.timeLimit + (char && char.ability === 'extraTime' ? char.timeBonus : 0);
}

function getComboMultiplier(combo) {
  for (const t of GAME_CONFIG.baseComboMultipliers)
    if (combo >= t.min && combo <= t.max) return t.mult;
  return 1;
}

function getSpeedScore(sec) {
  for (const t of GAME_CONFIG.speedScoreTiers)
    if (sec >= t.min && sec < t.max) return t.score;
  return 0;
}

function getRandomProblem() {
  const diff = gameState.difficulty || 'easy';
  const pool = PROBLEM_PACK.problems.filter(p => p.difficulty === diff);
  const src = pool.length > 0 ? pool : PROBLEM_PACK.problems;
  return src[randInt(0, src.length - 1)];
}

// ========== 분수 동치 비교 ==========
function parseFraction(str) {
  str = str.trim().replace(/\s/g, '');
  if (str.includes('/')) {
    const [n, d] = str.split('/').map(Number);
    if (!isNaN(n) && !isNaN(d) && d !== 0) return { n, d };
  }
  const f = parseFloat(str);
  if (!isNaN(f)) return { n: Math.round(f * 10000), d: 10000 };
  return null;
}

function gcd(a, b) { return b === 0 ? Math.abs(a) : gcd(b, a % b); }

function isCorrectAnswer(input, answer) {
  if (input.trim() === answer.trim()) return true;
  const pi = parseFraction(input), pa = parseFraction(answer);
  if (pi && pa) return pi.n * pa.d === pa.n * pi.d;
  return false;
}

// ========== 화면 전환 ==========
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ========== 선택지 버튼 렌더링 ==========
// 문제에 choices 배열이 있으면 버튼으로, 없으면 입력창으로
function renderAnswerUI(question) {
  const wrap = document.getElementById('answerInputWrap');
  const inputEl = document.getElementById('answerInput');

  if (question.choices && question.choices.length > 0) {
    // 선택지 버튼 모드
    inputEl.style.display = 'none';
    // 기존 버튼 제거
    wrap.querySelectorAll('.choice-btn').forEach(b => b.remove());
    question.choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = ch;
      btn.addEventListener('click', () => {
        document.getElementById('answerInput').value = ch;
        checkAnswer();
      });
      wrap.appendChild(btn);
    });
  } else {
    // 텍스트 입력 모드
    inputEl.style.display = '';
    wrap.querySelectorAll('.choice-btn').forEach(b => b.remove());
    inputEl.value = '';
    inputEl.focus();
  }
}

// ========== 시작 화면 ==========
function initStartScreen() {
  if (typeof PROBLEM_PACK === 'undefined') {
    alert('pack.js를 찾을 수 없습니다!'); return;
  }
  document.getElementById('packTitle').textContent = PROBLEM_PACK.name;

  // 모드
  const modes = [
    { id: 'adventure', name: '모험 모드', emoji: '🗺️', desc: '1인 · 5스테이지 보스 격파' },
    { id: 'pvp',       name: '배틀 모드', emoji: '⚔️', desc: '2인 · 10라운드 턴제 대결' },
  ];
  const modeGrid = document.getElementById('modeGrid');
  modeGrid.innerHTML = modes.map(m => `
    <div class="mode-card" data-mode="${m.id}">
      <span class="mode-emoji">${m.emoji}</span>
      <div class="mode-name">${m.name}</div>
      <div class="mode-desc">${m.desc}</div>
    </div>`).join('');
  modeGrid.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      modeGrid.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      gameState.mode = card.dataset.mode;
      gameState.p1Character = null; gameState.p2Character = null;
      updateCharGrid();
      checkStartReady();
    });
  });

  updateCharGrid();

  // 난이도
  const diffGrid = document.getElementById('difficultyGrid');
  diffGrid.innerHTML = DIFFICULTIES.map(d => `
    <div class="difficulty-card" data-diff="${d.id}" style="--diff-color:${d.color}">
      <div class="difficulty-icon">${d.icon}</div>
      <div class="difficulty-info"><h3>${d.name}</h3></div>
    </div>`).join('');
  diffGrid.querySelectorAll('.difficulty-card').forEach(card => {
    card.addEventListener('click', () => {
      diffGrid.querySelectorAll('.difficulty-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      gameState.difficulty = card.dataset.diff;
      checkStartReady();
    });
  });

  document.getElementById('startBtn').addEventListener('click', startGame);
}

function updateCharGrid() {
  const grid = document.getElementById('characterGrid');
  grid.innerHTML = CHARACTERS.map(c => `
    <div class="character-card" data-id="${c.id}">
      <div class="char-labels"></div>
      <span class="character-emoji">${c.emoji}</span>
      <div class="character-name">${c.name}</div>
      <div class="character-power">${c.power}</div>
    </div>`).join('');
  grid.querySelectorAll('.character-card').forEach(card =>
    card.addEventListener('click', () => handleCharacterClick(card)));
  updateCharIndicator();
}

function handleCharacterClick(card) {
  if (!gameState.mode) { alert('먼저 모드를 선택하세요!'); return; }
  const char = CHARACTERS.find(c => c.id === card.dataset.id);

  if (gameState.mode === 'adventure') {
    document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected-p1'));
    card.classList.add('selected-p1');
    gameState.p1Character = char;
  } else {
    if (!gameState.p1Character) {
      gameState.p1Character = char;
    } else if (!gameState.p2Character) {
      gameState.p2Character = char;
    } else {
      // 둘 다 선택됐으면 초기화 후 p1 재선택
      gameState.p1Character = null; gameState.p2Character = null;
      gameState.p1Character = char;
    }
  }

  refreshCharLabels();
  updateCharIndicator();
  checkStartReady();
}

function refreshCharLabels() {
  const p1Id = gameState.p1Character ? gameState.p1Character.id : null;
  const p2Id = gameState.p2Character ? gameState.p2Character.id : null;

  document.querySelectorAll('.character-card').forEach(card => {
    const id = card.dataset.id;
    const labels = card.querySelector('.char-labels');
    card.classList.remove('selected-p1', 'selected-p2', 'selected-p2-same');
    labels.innerHTML = '';

    const isP1 = id === p1Id;
    const isP2 = id === p2Id;

    if (isP1) { labels.innerHTML += '<span class="badge-p1">P1</span>'; card.classList.add('selected-p1'); }
    if (isP2) { labels.innerHTML += '<span class="badge-p2">P2</span>'; card.classList.add('selected-p2'); }
    if (isP1 && isP2) card.classList.add('selected-p2-same');
  });
}

function updateCharIndicator() {
  const ind = document.getElementById('charTurnIndicator');
  if (gameState.mode === 'pvp') {
    ind.classList.add('active');
    if (!gameState.p1Character) {
      ind.className = 'player-turn-indicator active p1-turn';
      ind.textContent = '🎮 P1 브롤러 선택';
    } else if (!gameState.p2Character) {
      ind.className = 'player-turn-indicator active p2-turn';
      ind.textContent = '🎮 P2 브롤러 선택';
    } else {
      ind.className = 'player-turn-indicator active';
      ind.style.cssText = 'display:block; border-color:var(--accent-green); color:var(--accent-green); box-shadow:0 0 25px rgba(61,220,132,0.4)';
      ind.textContent = '✅ 준비 완료!';
    }
  } else {
    ind.classList.remove('active');
  }
}

function checkStartReady() {
  const btn = document.getElementById('startBtn');
  const ok = gameState.mode && gameState.difficulty && gameState.p1Character &&
             (gameState.mode !== 'pvp' || gameState.p2Character);
  btn.disabled = !ok;
}

// ========== 게임 시작 ==========
function startGame() {
  Object.assign(gameState, {
    score: 0, correct: 0, wrong: 0, combo: 0, maxCombo: 0,
    playerHp: GAME_CONFIG.maxHp, enemyHp: GAME_CONFIG.maxHp,
    stage: 0, shield: false,
    pvpTurn: 1, pvpRound: 0,
    pvpScores: [0, 0], pvpCombos: [0, 0],
  });

  if (gameState.mode === 'pvp') startPvp();
  else startAdventure();
}

// ========== 모험 모드 ==========
function startAdventure() {
  gameState.advStartTime = Date.now();
  showScreen('adventureScreen');
  document.getElementById('playerAvatar').textContent = gameState.p1Character.emoji;
  document.getElementById('playerNameDisplay').textContent = gameState.p1Character.name;
  nextStage();
}

function nextStage() {
  if (gameState.stage >= GAME_CONFIG.stageCount) { endAdventure(true); return; }
  const enemy = PROBLEM_PACK.enemies[gameState.stage];
  gameState.enemyMaxHp = enemy.hp; gameState.enemyHp = enemy.hp;
  document.getElementById('enemyChar').textContent = enemy.emoji;
  document.getElementById('enemyName').textContent = enemy.name;
  document.getElementById('stageInfo').textContent = `스테이지 ${gameState.stage + 1}/${GAME_CONFIG.stageCount}`;
  updateAdventureBars(); renderProgressBar(); nextQuestion();
}

function renderProgressBar() {
  document.getElementById('progressBar').innerHTML =
    Array.from({length: GAME_CONFIG.stageCount}, (_, i) => {
      const cls = i < gameState.stage ? 'completed' : i === gameState.stage ? 'active' : '';
      return `<div class="progress-dot ${cls}"></div>`;
    }).join('');
}

function updateAdventureBars() {
  document.getElementById('playerHpBar').style.width = (gameState.playerHp / GAME_CONFIG.maxHp * 100) + '%';
  document.getElementById('hpText').textContent = `${gameState.playerHp} / ${GAME_CONFIG.maxHp}`;
  document.getElementById('enemyHpBar').style.width = (gameState.enemyHp / gameState.enemyMaxHp * 100) + '%';
  document.getElementById('scoreValue').textContent = gameState.score;
  document.getElementById('advCombo').textContent = gameState.combo;
}

// ========== PvP 모드 ==========
function startPvp() {
  gameState.pvpRound = 0;
  gameState.pvpTurn = 1;
  gameState.pvpScores = [0, 0];
  gameState.pvpCombos = [0, 0];
  gameState.pvpMaxCombos = [0, 0];
  gameState.advStartTime = Date.now();
  // pvp도 게임 화면 재사용 (enemy = 상대방)
  showScreen('adventureScreen');
  const enemy = PROBLEM_PACK.enemies[0];
  document.getElementById('enemyChar').textContent = gameState.p2Character.emoji;
  document.getElementById('enemyName').textContent = gameState.p2Character.name;
  document.getElementById('enemyHpBar').style.width = '100%';
  updatePvpHeader();
  nextPvpTurn();
}

function updatePvpHeader() {
  const t = gameState.pvpTurn;
  const char = t === 1 ? gameState.p1Character : gameState.p2Character;
  const score = gameState.pvpScores[t - 1];
  const round = gameState.pvpRound + 1;

  document.getElementById('playerAvatar').textContent = char.emoji;
  document.getElementById('playerNameDisplay').textContent = `${char.name} (P${t})`;
  document.getElementById('stageInfo').textContent = `라운드 ${round}/${GAME_CONFIG.pvpRounds} · P${t} 차례`;
  document.getElementById('scoreValue').textContent = score;
  document.getElementById('advCombo').textContent = gameState.pvpCombos[t - 1];
  document.getElementById('hpText').textContent =
    `P1: ${gameState.pvpScores[0]}점  |  P2: ${gameState.pvpScores[1]}점`;
  // HP바를 점수 비율로 표시
  const total = gameState.pvpScores[0] + gameState.pvpScores[1];
  const p1ratio = total > 0 ? gameState.pvpScores[0] / total * 100 : 50;
  document.getElementById('playerHpBar').style.width = p1ratio + '%';
  document.getElementById('hp-label-text') && (document.getElementById('hp-label-text').textContent = '⭐ P1 vs P2 점수');
}

function nextPvpTurn() {
  if (gameState.pvpRound >= GAME_CONFIG.pvpRounds) { endPvp(); return; }
  showTurnOverlay(() => nextQuestion());
}

function showTurnOverlay(callback) {
  const t = gameState.pvpTurn;
  const char = t === 1 ? gameState.p1Character : gameState.p2Character;
  const overlay = document.getElementById('turnOverlay');
  document.getElementById('turnEmoji').textContent = char.emoji;
  document.getElementById('turnTitle').textContent = `PLAYER ${t}`;
  document.getElementById('turnTitle').className = `turn-overlay-title p${t}`;
  document.getElementById('turnSubtitle').textContent = `${char.name}의 차례!`;
  overlay.classList.add('active');
  setTimeout(() => { overlay.classList.remove('active'); callback(); }, 2000);
}

function endPvp() {
  stopTimer();
  const [s1, s2] = gameState.pvpScores;
  showScreen('resultScreen');
  if (s1 > s2) {
    document.getElementById('resultEmoji').textContent = '🏆';
    document.getElementById('resultTitle').textContent = 'P1 승리!';
    document.getElementById('resultSubtitle').textContent = `${gameState.p1Character.name} 완승!`;
  } else if (s2 > s1) {
    document.getElementById('resultEmoji').textContent = '🏆';
    document.getElementById('resultTitle').textContent = 'P2 승리!';
    document.getElementById('resultSubtitle').textContent = `${gameState.p2Character.name} 완승!`;
  } else {
    document.getElementById('resultEmoji').textContent = '🤝';
    document.getElementById('resultTitle').textContent = '무승부!';
    document.getElementById('resultSubtitle').textContent = '정말 막상막하!';
  }
  document.getElementById('finalTime').textContent = formatTime(Date.now() - gameState.advStartTime);
  document.getElementById('finalScore').textContent = `P1: ${s1}  |  P2: ${s2}`;
  const mc = gameState.pvpMaxCombos || [0, 0];
  document.getElementById('finalMaxCombo').textContent = `P1: ${mc[0]}  |  P2: ${mc[1]}`;
}

// ========== 문제 표시 (공통) ==========
function nextQuestion() {
  gameState.hintUsed = false;
  gameState.currentQuestion = getRandomProblem();
  const q = gameState.currentQuestion;
  const num = gameState.correct + gameState.wrong + 1;

  document.getElementById('questionNum').textContent =
    gameState.mode === 'pvp' ? `라운드 ${gameState.pvpRound + 1}` : `문제 ${num}`;
  document.getElementById('questionTopic').textContent = q.topic;
  document.getElementById('questionText').textContent = q.text;
  document.getElementById('feedback').textContent = '정답을 입력하고 공격하세요! 💥';
  document.getElementById('feedback').className = 'feedback';

  renderAnswerUI(q);
  gameState.questionStartTime = Date.now();
  startTimer();
}

function startTimer() {
  stopTimer();
  const char = gameState.pvpTurn === 2 ? gameState.p2Character : gameState.p1Character;
  const timeLimit = getTimeLimit(char);

  gameState.timerInterval = setInterval(() => {
    const elapsed = (Date.now() - gameState.questionStartTime) / 1000;
    const remaining = Math.max(0, timeLimit - elapsed);
    document.getElementById('advQuestionTimer').textContent = remaining.toFixed(1);
  }, 100);
}

function stopTimer() {
  if (gameState.timerInterval) { clearInterval(gameState.timerInterval); gameState.timerInterval = null; }
}

// ========== 정답 처리 (공통) ==========
function checkAnswer() {
  const input = document.getElementById('answerInput').value.trim();
  if (!input) { showFeedback('답을 선택하거나 입력해주세요!', 'wrong'); return; }

  stopTimer();
  const correct = isCorrectAnswer(input, gameState.currentQuestion.answer);
  const elapsed = (Date.now() - gameState.questionStartTime) / 1000;

  if (gameState.mode === 'pvp') {
    handlePvpAnswer(correct, elapsed);
  } else {
    handleAdventureAnswer(correct, elapsed);
  }
}

function handleAdventureAnswer(correct, elapsed) {
  const char = gameState.p1Character;

  if (correct) {
    gameState.correct++;
    gameState.combo++;
    if (gameState.combo > gameState.maxCombo) gameState.maxCombo = gameState.combo;
    if (gameState.combo >= 2) showComboPopup(gameState.combo);

    const mult = getComboMultiplier(gameState.combo);
    const raw = Math.floor(getSpeedScore(elapsed) * mult);
    const finalScore = gameState.hintUsed ? Math.floor(raw * GAME_CONFIG.hintPenalty) : raw;
    gameState.score += finalScore;

    let dmg = Math.floor(30 * mult);
    if (char.ability === 'bonusDamage') dmg += char.bonus;
    if (char.ability === 'quickStrike' && elapsed <= char.quickTime) dmg += char.quickBonus;
    if (gameState.hintUsed) dmg = Math.floor(dmg * GAME_CONFIG.hintPenalty);
    gameState.enemyHp = Math.max(0, gameState.enemyHp - dmg);

    if (char.ability === 'heal') gameState.playerHp = Math.min(GAME_CONFIG.maxHp, gameState.playerHp + char.healAmount);
    if (char.ability === 'shield' && gameState.combo >= GAME_CONFIG.shieldAbilityTrigger) gameState.shield = true;

    showDamage(dmg, 'damageContainer');
    document.getElementById('enemyChar').classList.add('hit');
    setTimeout(() => document.getElementById('enemyChar').classList.remove('hit'), 400);
    showFeedback(`⚡ ${elapsed.toFixed(1)}초! +${finalScore}점`, 'correct');
    updateAdventureBars();

    setTimeout(() => {
      if (gameState.enemyHp <= 0) {
        gameState.stage++;
        gameState.playerHp = Math.min(GAME_CONFIG.maxHp, gameState.playerHp + 20);
        updateAdventureBars();
        setTimeout(() => nextStage(), 1800);
      } else {
        nextQuestion();
      }
    }, 1300);
  } else {
    gameState.wrong++;
    if (char.ability !== 'comboKeep') gameState.combo = 0;

    if (gameState.shield) {
      gameState.shield = false;
      showFeedback('🛡 보호막 발동!', 'wrong');
    } else {
      gameState.playerHp = Math.max(0, gameState.playerHp - 20);
      showFeedback('💢 오답!', 'wrong');
    }
    updateAdventureBars();
    if (gameState.playerHp <= 0) setTimeout(() => endAdventure(false), 1500);
    else setTimeout(() => nextQuestion(), 2200);
  }
}

function handlePvpAnswer(correct, elapsed) {
  const t = gameState.pvpTurn;
  const char = t === 1 ? gameState.p1Character : gameState.p2Character;
  const idx = t - 1;

  if (correct) {
    gameState.pvpCombos[idx]++;
    if (gameState.pvpCombos[idx] > (gameState.pvpMaxCombos[idx] || 0)) gameState.pvpMaxCombos[idx] = gameState.pvpCombos[idx];
    const mult = getComboMultiplier(gameState.pvpCombos[idx]);
    const raw = Math.floor(getSpeedScore(elapsed) * mult);
    const finalScore = gameState.hintUsed ? Math.floor(raw * GAME_CONFIG.hintPenalty) : raw;
    gameState.pvpScores[idx] += finalScore;

    if (gameState.pvpCombos[idx] >= 2) showComboPopup(gameState.pvpCombos[idx]);
    showFeedback(`⚡ ${elapsed.toFixed(1)}초! +${finalScore}점`, 'correct');
  } else {
    gameState.pvpCombos[idx] = 0;
    showFeedback('💢 오답!', 'wrong');
  }

  // 다음 차례로
  setTimeout(() => {
    gameState.pvpRound++;
    // 라운드마다 턴 교대
    gameState.pvpTurn = gameState.pvpTurn === 1 ? 2 : 1;
    if (gameState.pvpRound >= GAME_CONFIG.pvpRounds) {
      endPvp();
    } else {
      updatePvpHeader();
      nextPvpTurn();
    }
  }, 1500);
}

function endAdventure(victory) {
  stopTimer();
  gameState.advTotalTime = Date.now() - gameState.advStartTime;
  showScreen('resultScreen');
  document.getElementById('resultEmoji').textContent = victory ? '🏆' : '💀';
  document.getElementById('resultTitle').textContent = victory ? '승리!' : '게임 오버';
  document.getElementById('resultSubtitle').textContent = victory ? `${gameState.p1Character.name}의 활약!` : '다시 도전!';
  document.getElementById('finalTime').textContent = formatTime(gameState.advTotalTime);
  document.getElementById('finalScore').textContent = gameState.score;
  document.getElementById('finalMaxCombo').textContent = gameState.maxCombo;
}

function showFeedback(msg, type) {
  const fb = document.getElementById('feedback');
  fb.textContent = msg;
  fb.className = 'feedback ' + type;
}

function showDamage(amount, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const popup = document.createElement('div');
  popup.className = 'damage-popup';
  popup.textContent = '-' + amount;
  popup.style.left = (40 + Math.random() * 30) + '%';
  popup.style.top = '30%';
  container.appendChild(popup);
  setTimeout(() => popup.remove(), 1500);
}

function showComboPopup(combo) {
  const el = document.getElementById('comboDisplay');
  el.textContent = combo + ' COMBO!';
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
}

function showAdvHint() {
  if (gameState.hintUsed) { showFeedback('이미 힌트를 사용했어요!', 'wrong'); return; }
  gameState.hintUsed = true;
  const h = gameState.currentQuestion.hint || '문제를 다시 천천히 읽어보세요.';
  showFeedback(`💡 ${h}`, 'wrong');
}

// ========== 이벤트 ==========
document.addEventListener('DOMContentLoaded', () => {
  if (typeof PROBLEM_PACK === 'undefined') {
    alert('pack.js를 찾을 수 없습니다!'); return;
  }
  initStartScreen();

  document.getElementById('attackBtn').addEventListener('click', checkAnswer);
  document.getElementById('hintBtn').addEventListener('click', showAdvHint);
  document.getElementById('quitBtn').addEventListener('click', () => {
    if (confirm('메인으로 돌아갈까요?')) location.reload();
  });
  document.getElementById('restartBtn').addEventListener('click', () => location.reload());
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.getElementById('adventureScreen').classList.contains('active'))
      checkAnswer();
  });
});
