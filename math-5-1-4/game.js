// ============================================================================
// 🎮 브롤스튜던츠 - 게임 로직 (game.js)
// ============================================================================

// 게임 설정 (config)
const GAME_CONFIG = {
  maxHp: 100,
  stageCount: 5,
  timeLimit: 15,
  shieldAbilityTrigger: 3,
  hintPenalty: 0.5,
  
  speedScoreTiers: [
    { min: 0, max: 2, score: 200 },
    { min: 2, max: 5, score: 150 },
    { min: 5, max: 10, score: 100 },
    { min: 10, max: 15, score: 60 },
    { min: 15, max: Infinity, score: 40 }
  ],
  
  baseComboMultipliers: [
    { min: 2, max: 2, mult: 1.2 },
    { min: 3, max: 4, mult: 1.5 },
    { min: 5, max: Infinity, mult: 2.0 }
  ],
};

// 캐릭터 정보
const CHARACTERS = [
  { 
    id: 'shelly', emoji: '🦸‍♀️', name: '쉘리', 
    power: '⚡ 정답시 +5데미지',
    ability: 'bonusDamage',
    bonus: 5,
  },
  { 
    id: 'colt', emoji: '🤠', name: '콜트', 
    power: '⏱ 풀이시간 +3초',
    ability: 'extraTime',
    timeBonus: 3,
  },
  { 
    id: 'nita', emoji: '🐻', name: '니타', 
    power: '💚 정답시 HP회복',
    ability: 'heal',
    healAmount: 5,
  },
  { 
    id: 'leon', emoji: '🥷', name: '레온', 
    power: '🛡 3연속시 보호막',
    ability: 'shield',
  },
  { 
    id: 'spike', emoji: '🌵', name: '스파이크', 
    power: '🔥 콤보 안깨짐',
    ability: 'comboKeep',
  },
  { 
    id: 'crow', emoji: '🦅', name: '크로우', 
    power: '🗡 5초내 +10데미지',
    ability: 'quickStrike',
    quickBonus: 10,
    quickTime: 5,
  },
];

// 난이도
const DIFFICULTIES = [
  { id: 'easy', name: '이지 - 새내기', icon: '🥉', color: '#3ddc84' },
  { id: 'normal', name: '노멀 - 베테랑', icon: '🥈', color: '#00d4ff' },
  { id: 'hard', name: '하드 - 챔피언', icon: '🥇', color: '#ff3d8b' },
];

// 게임 상태
let gameState = {
  currentPack: null,
  mode: null,
  difficulty: null,
  p1Character: null,
  playerHp: GAME_CONFIG.maxHp,
  enemyHp: GAME_CONFIG.maxHp,
  score: 0,
  correct: 0,
  wrong: 0,
  combo: 0,
  maxCombo: 0,
  stage: 0,
  advStartTime: 0,
  advTotalTime: 0,
  currentQuestion: null,
  hintUsed: false,
  shield: false,
  advQuestionStartTime: 0,
  advQuestionTimerInterval: null,
};

// ========== 유틸 함수 ==========
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function getTimeLimit(character) {
  let base = GAME_CONFIG.timeLimit;
  if (character && character.ability === 'extraTime') base += character.timeBonus;
  return base;
}

function getComboMultiplier(combo) {
  for (const tier of GAME_CONFIG.baseComboMultipliers) {
    if (combo >= tier.min && combo <= tier.max) return tier.mult;
  }
  return 1;
}

function getSpeedScore(elapsedSec) {
  for (const tier of GAME_CONFIG.speedScoreTiers) {
    if (elapsedSec >= tier.min && elapsedSec < tier.max) return tier.score;
  }
  return 0;
}

// 분수 동치 비교 (2/3 == 4/6 등)
function parseFraction(str) {
  str = str.trim().replace(/\s/g, '');
  if (str.includes('/')) {
    const [n, d] = str.split('/').map(Number);
    if (!isNaN(n) && !isNaN(d) && d !== 0) return { n, d };
  }
  const f = parseFloat(str);
  if (!isNaN(f)) return { n: f * 1000, d: 1000 };
  return null;
}

function gcd(a, b) { return b === 0 ? Math.abs(a) : gcd(b, a % b); }

function isCorrectAnswer(input, answer) {
  if (input.trim() === answer.trim()) return true;
  // 소수 비교
  const fi = parseFloat(input);
  const fa = parseFloat(answer);
  if (!isNaN(fi) && !isNaN(fa)) return Math.abs(fi - fa) < 0.0001;
  // 분수 동치 비교
  const pi = parseFraction(input);
  const pa = parseFraction(answer);
  if (pi && pa) return pi.n * pa.d === pa.n * pi.d;
  return false;
}

function getRandomProblem() {
  const diff = gameState.difficulty || 'easy';
  const filtered = PROBLEM_PACK.problems.filter(p => p.difficulty === diff);
  const pool = filtered.length > 0 ? filtered : PROBLEM_PACK.problems;
  return pool[randInt(0, pool.length - 1)];
}
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// ========== 시작 화면 초기화 ==========
function initStartScreen() {
  // 문제팩 제목 설정 (pack.js에서 PROBLEM_PACK 로드됨)
  if (typeof PROBLEM_PACK === 'undefined') {
    console.error('❌ 오류: pack.js 파일을 찾을 수 없습니다!');
    alert('게임 데이터 파일을 찾을 수 없습니다.\npack.js를 확인해주세요.');
    return;
  }
  
  // 문제팩 정보 표시
  document.getElementById('packTitle').textContent = PROBLEM_PACK.name;
  gameState.currentPack = PROBLEM_PACK;

  // 모드 선택
  const modes = [
    { id: 'adventure', name: '모험 모드', emoji: '🗺️', desc: '5스테이지 보스 격파!' },
    { id: 'pvp', name: '배틀 모드', emoji: '⚔️', desc: '2인 PvP' },
  ];
  
  const modeGrid = document.getElementById('modeGrid');
  modeGrid.innerHTML = modes.map(m => `
    <div class="mode-card" data-mode="${m.id}">
      <span class="mode-emoji">${m.emoji}</span>
      <div class="mode-name">${m.name}</div>
      <div class="mode-desc">${m.desc}</div>
    </div>
  `).join('');

  modeGrid.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      modeGrid.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      gameState.mode = card.dataset.mode;
      gameState.p1Character = null;
      updateCharGrid();
      checkStartReady();
    });
  });

  // 캐릭터 선택
  updateCharGrid();

  // 난이도 선택
  const diffGrid = document.getElementById('difficultyGrid');
  diffGrid.innerHTML = DIFFICULTIES.map(d => `
    <div class="difficulty-card" data-diff="${d.id}" style="--diff-color: ${d.color};">
      <div class="difficulty-icon">${d.icon}</div>
      <div class="difficulty-info">
        <h3>${d.name}</h3>
      </div>
    </div>
  `).join('');

  diffGrid.querySelectorAll('.difficulty-card').forEach(card => {
    card.addEventListener('click', () => {
      diffGrid.querySelectorAll('.difficulty-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      gameState.difficulty = card.dataset.diff;
      checkStartReady();
    });
  });

  // 시작 버튼
  document.getElementById('startBtn').addEventListener('click', startGame);
}

function updateCharGrid() {
  const grid = document.getElementById('characterGrid');
  grid.innerHTML = CHARACTERS.map(c => `
    <div class="character-card" data-id="${c.id}">
      <span class="character-emoji">${c.emoji}</span>
      <div class="character-name">${c.name}</div>
      <div class="character-power">${c.power}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.character-card').forEach(card => {
    card.addEventListener('click', () => handleCharacterClick(card));
  });

  updateCharIndicator();
}

function handleCharacterClick(card) {
  if (!gameState.mode) {
    alert('먼저 모드를 선택하세요!');
    return;
  }

  const char = CHARACTERS.find(c => c.id === card.dataset.id);

  if (gameState.mode === 'adventure') {
    document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected-p1'));
    card.classList.add('selected-p1');
    gameState.p1Character = char;
  } else {
    // PvP: p1 미선택이면 p1 지정, p1 선택됐으면 p2 지정
    // 카드 클릭 순서 기반 (같은 브롤러도 허용)
    if (!gameState.p1Character) {
      card.classList.add('selected-p1');
      gameState.p1Character = char;
    } else if (!gameState.p2Character) {
      card.classList.add('selected-p2');
      gameState.p2Character = char;
    } else {
      // 둘 다 선택된 상태 → 초기화 후 p1 재선택
      document.querySelectorAll('.character-card').forEach(c => {
        c.classList.remove('selected-p1', 'selected-p2');
      });
      gameState.p1Character = null;
      gameState.p2Character = null;
      card.classList.add('selected-p1');
      gameState.p1Character = char;
    }
  }

  updateCharIndicator();
  checkStartReady();
}

function updateCharIndicator() {
  const indicator = document.getElementById('charTurnIndicator');
  if (gameState.mode === 'pvp') {
    indicator.classList.add('active');
    if (!gameState.p1Character) {
      indicator.className = 'player-turn-indicator active p1-turn';
      indicator.textContent = '🎮 P1 선택';
    } else if (!gameState.p2Character) {
      indicator.className = 'player-turn-indicator active p2-turn';
      indicator.textContent = '🎮 P2 선택';
    } else {
      indicator.className = 'player-turn-indicator active';
      indicator.style.borderColor = 'var(--accent-green)';
      indicator.style.color = 'var(--accent-green)';
      indicator.textContent = '✅ 준비 완료!';
    }
  } else {
    indicator.classList.remove('active');
  }
}

function checkStartReady() {
  const btn = document.getElementById('startBtn');
  if (!gameState.mode || !gameState.difficulty) {
    btn.disabled = true;
    return;
  }
  if (gameState.mode === 'pvp') {
    btn.disabled = !(gameState.p1Character && gameState.p2Character);
  } else {
    btn.disabled = !gameState.p1Character;
  }
}

// ========== 게임 시작 ==========
function startGame() {
  gameState.score = 0;
  gameState.correct = 0;
  gameState.wrong = 0;
  gameState.combo = 0;
  gameState.maxCombo = 0;
  gameState.playerHp = GAME_CONFIG.maxHp;
  gameState.enemyHp = GAME_CONFIG.maxHp;
  gameState.stage = 0;
  gameState.shield = false;

  if (gameState.mode === 'adventure') {
    startAdventure();
  }
}

function startAdventure() {
  gameState.enemyMaxHp = PROBLEM_PACK.enemies[0].hp;
  gameState.advStartTime = Date.now();

  showScreen('adventureScreen');
  document.getElementById('playerAvatar').textContent = gameState.p1Character.emoji;
  document.getElementById('playerNameDisplay').textContent = gameState.p1Character.name;

  nextStage();
}

function nextStage() {
  if (gameState.stage >= GAME_CONFIG.stageCount) {
    endAdventure(true);
    return;
  }

  const enemy = PROBLEM_PACK.enemies[gameState.stage];
  gameState.enemyMaxHp = enemy.hp;
  gameState.enemyHp = enemy.hp;

  document.getElementById('enemyChar').textContent = enemy.emoji;
  document.getElementById('enemyName').textContent = enemy.name;
  document.getElementById('stageInfo').textContent = `스테이지 ${gameState.stage + 1}/${GAME_CONFIG.stageCount}`;

  updateAdventureBars();
  renderProgressBar();
  nextQuestion();
}

function renderProgressBar() {
  const bar = document.getElementById('progressBar');
  let html = '';
  for (let i = 0; i < GAME_CONFIG.stageCount; i++) {
    let cls = 'progress-dot';
    if (i < gameState.stage) cls += ' completed';
    else if (i === gameState.stage) cls += ' active';
    html += `<div class="${cls}"></div>`;
  }
  bar.innerHTML = html;
}

function nextQuestion() {
  gameState.hintUsed = false;
  gameState.currentQuestion = getRandomProblem();
  const num = gameState.correct + gameState.wrong + 1;

  document.getElementById('questionNum').textContent = `문제 ${num}`;
  document.getElementById('questionTopic').textContent = gameState.currentQuestion.topic;
  document.getElementById('questionText').textContent = gameState.currentQuestion.text;
  document.getElementById('answerInput').value = '';
  document.getElementById('answerInput').focus();
  document.getElementById('feedback').textContent = '정답을 입력하고 공격하세요! 💥';
  document.getElementById('feedback').className = 'feedback';

  gameState.advQuestionStartTime = Date.now();
  startAdvTimer();
}

function startAdvTimer() {
  if (gameState.advQuestionTimerInterval) clearInterval(gameState.advQuestionTimerInterval);
  const timeLimit = getTimeLimit(gameState.p1Character);
  const timerStat = document.getElementById('advQuestionTimerStat');
  timerStat.classList.remove('warning');

  gameState.advQuestionTimerInterval = setInterval(() => {
    const elapsed = (Date.now() - gameState.advQuestionStartTime) / 1000;
    const remaining = Math.max(0, timeLimit - elapsed);
    document.getElementById('advQuestionTimer').textContent = remaining.toFixed(1);
  }, 100);
}

function stopAdvTimer() {
  if (gameState.advQuestionTimerInterval) {
    clearInterval(gameState.advQuestionTimerInterval);
    gameState.advQuestionTimerInterval = null;
  }
}

function updateAdventureBars() {
  const hpPercent = (gameState.playerHp / GAME_CONFIG.maxHp) * 100;
  document.getElementById('playerHpBar').style.width = hpPercent + '%';
  document.getElementById('hpText').textContent = `${gameState.playerHp} / ${GAME_CONFIG.maxHp}`;
  const enemyPercent = (gameState.enemyHp / gameState.enemyMaxHp) * 100;
  document.getElementById('enemyHpBar').style.width = enemyPercent + '%';
  document.getElementById('scoreValue').textContent = gameState.score;
  document.getElementById('advCombo').textContent = gameState.combo;
}

function checkAdventureAnswer() {
  const input = document.getElementById('answerInput').value.trim();
  if (!input) {
    showFeedback('답을 입력해주세요!', 'wrong');
    return;
  }

  stopAdvTimer();
  const correct = isCorrectAnswer(input, gameState.currentQuestion.answer);
  const elapsed = (Date.now() - gameState.advQuestionStartTime) / 1000;

  if (correct) {
    gameState.correct++;
    gameState.combo++;
    if (gameState.combo > gameState.maxCombo) gameState.maxCombo = gameState.combo;

    if (gameState.combo >= 2) {
      showComboPopup(gameState.combo);
    }

    const mult = getComboMultiplier(gameState.combo);
    const baseScore = getSpeedScore(elapsed);
    const score = Math.floor(baseScore * mult);
    const finalScore = gameState.hintUsed ? Math.floor(score * GAME_CONFIG.hintPenalty) : score;
    gameState.score += finalScore;

    let damage = 30 * mult;
    if (gameState.p1Character.ability === 'bonusDamage') damage += gameState.p1Character.bonus;
    if (gameState.hintUsed) damage *= GAME_CONFIG.hintPenalty;
    damage = Math.floor(damage);

    gameState.enemyHp = Math.max(0, gameState.enemyHp - damage);

    if (gameState.p1Character.ability === 'heal') {
      gameState.playerHp = Math.min(GAME_CONFIG.maxHp, gameState.playerHp + gameState.p1Character.healAmount);
    }

    if (gameState.p1Character.ability === 'shield' && gameState.combo >= GAME_CONFIG.shieldAbilityTrigger && !gameState.shield) {
      gameState.shield = true;
    }

    showDamage(damage, 'damageContainer');
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

    if (gameState.p1Character.ability !== 'comboKeep') {
      gameState.combo = 0;
    }

    if (gameState.shield) {
      gameState.shield = false;
      showFeedback(`🛡 보호막! 정답: ${gameState.currentQuestion.answer}`, 'wrong');
    } else {
      const damage = 20;
      gameState.playerHp = Math.max(0, gameState.playerHp - damage);
      showFeedback(`💢 오답! 정답: ${gameState.currentQuestion.answer}`, 'wrong');
    }

    updateAdventureBars();

    if (gameState.playerHp <= 0) {
      setTimeout(() => endAdventure(false), 1500);
    } else {
      setTimeout(() => nextQuestion(), 2200);
    }
  }
}

function endAdventure(victory) {
  stopAdvTimer();
  gameState.advTotalTime = Date.now() - gameState.advStartTime;

  showScreen('resultScreen');

  if (victory) {
    document.getElementById('resultEmoji').textContent = '🏆';
    document.getElementById('resultTitle').textContent = '승리!';
    document.getElementById('resultSubtitle').textContent = `${gameState.p1Character.name}의 활약!`;
  } else {
    document.getElementById('resultEmoji').textContent = '💀';
    document.getElementById('resultTitle').textContent = '게임 오버';
    document.getElementById('resultSubtitle').textContent = '다시 도전하세요!';
  }

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
  if (gameState.hintUsed) {
    showFeedback('이미 힌트를 사용했어요!', 'wrong');
    return;
  }
  gameState.hintUsed = true;
  const h = gameState.currentQuestion.hint || '문제를 다시 천천히 읽어보세요.';
  showFeedback(`💡 힌트: ${h}`, 'wrong');
}

// ========== 이벤트 리스너 ==========
document.addEventListener('DOMContentLoaded', () => {
  // PROBLEM_PACK이 pack.js에서 로드되었는지 확인
  if (typeof PROBLEM_PACK === 'undefined') {
    console.error('❌ 오류: pack.js 파일을 찾을 수 없습니다!');
    alert('게임 데이터 파일을 찾을 수 없습니다.\npack.js를 확인해주세요.');
    return;
  }

  initStartScreen();

  document.getElementById('attackBtn').addEventListener('click', checkAdventureAnswer);
  document.getElementById('hintBtn').addEventListener('click', showAdvHint);
  document.getElementById('quitBtn').addEventListener('click', () => {
    if (confirm('메인으로 돌아갈까요?')) location.reload();
  });
  document.getElementById('restartBtn').addEventListener('click', () => location.reload());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.getElementById('adventureScreen').classList.contains('active')) {
      checkAdventureAnswer();
    }
  });
});
