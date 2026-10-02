let tileIdCounter = 1;

class Tile {
  constructor(position, value) {
    this.x = position.x;
    this.y = position.y;
    this.value = value || 2;
    this.id = tileIdCounter++;
    this.previousPosition = null;
    this.mergedInto = null;
  }

  savePosition() {
    this.previousPosition = { x: this.x, y: this.y };
  }

  updatePosition(position) {
    this.x = position.x;
    this.y = position.y;
  }
}

class GameManager {
  constructor() {
    this.size = 4;
    this.score = 0;
    this.moves = 0;
    this.seconds = 0;
    this.timerInterval = null;
    this.isTimerRunning = false;
    this.won = false;
    this.over = false;
    this.keepPlaying = false;
    this.tiles = [];
    this.isGameStarted = false;
    this.pendingAction = null;

    this.isMuted = localStorage.getItem('2048_muted') === 'true';

    this.gridContainer = document.getElementById('grid-container');
    this.tileContainer = document.getElementById('tile-container');
    this.scoreDisplay = document.getElementById('score');
    this.bestScoreDisplay = document.getElementById('best-score');
    this.movesDisplay = document.getElementById('moves');
    this.timeDisplay = document.getElementById('time');
    this.soundToggleBtn = document.getElementById('sound-toggle-btn');

    this.undoBtn = document.getElementById('undo-btn');
    this.restartBtn = document.getElementById('restart-btn');
    this.messageBox = document.getElementById('game-message');
    this.messageText = document.getElementById('game-message-text');
    this.messageStatsSummary = document.getElementById('message-stats-summary');
    this.shareScoreBtn = document.getElementById('share-score-button');
    this.retryBtn = document.getElementById('retry-button');
    this.keepPlayingBtn = document.getElementById('keep-playing-button');
    this.modeButtons = document.querySelectorAll('.mode-btn');

    // スタート画面＆タイトルへ戻る
    this.startScreen = document.getElementById('start-screen');
    this.startGameBtn = document.getElementById('start-game-btn');
    this.startHelpBtn = document.getElementById('start-help-btn');
    this.collectionBtn = document.getElementById('collection-btn');
    this.startModeButtons = document.querySelectorAll('.start-mode-btn');
    this.backToTitleBtn = document.getElementById('back-to-title-btn');

    // コレクションモーダル
    this.collectionModal = document.getElementById('collection-modal');
    this.collectionGrid = document.getElementById('collection-grid');
    this.closeCollectionBtn = document.getElementById('close-collection-btn');
    this.closeCollectionBottomBtn = document.getElementById('close-collection-bottom-btn');

    // 確認モーダル
    this.confirmModal = document.getElementById('confirm-modal');
    this.confirmTitle = document.getElementById('confirm-title');
    this.confirmDesc = document.getElementById('confirm-desc');
    this.cancelRestartBtn = document.getElementById('cancel-restart-btn');
    this.confirmRestartBtn = document.getElementById('confirm-restart-btn');

    // あそびかたモーダル
    this.helpModal = document.getElementById('help-modal');
    this.howToPlayBtn = document.getElementById('how-to-play-btn');
    this.closeHelpBtn = document.getElementById('close-help-btn');
    this.gotItBtn = document.getElementById('got-it-btn');

    this.allTileValues = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536];

    this.tileStyles = {
      2:     { bg: 'linear-gradient(180deg, #f2ece4 0%, #eee4da 100%)', text: '#776e65', shadow: '0 3px 0 #ded2c3' },
      4:     { bg: 'linear-gradient(180deg, #f0e6d2 0%, #ede0c8 100%)', text: '#776e65', shadow: '0 3px 0 #d9ccaF' },
      8:     { bg: 'linear-gradient(180deg, #f7ba82 0%, #f2b179 100%)', text: '#ffffff', shadow: '0 3px 0 #d99962' },
      16:    { bg: 'linear-gradient(180deg, #faa171 0%, #f59563 100%)', text: '#ffffff', shadow: '0 3px 0 #da7d4d' },
      32:    { bg: 'linear-gradient(180deg, #fa8a6e 0%, #f67c5f 100%)', text: '#ffffff', shadow: '0 3px 0 #d86246' },
      64:    { bg: 'linear-gradient(180deg, #fa6d4b 0%, #f65e3b 100%)', text: '#ffffff', shadow: '0 3px 0 #d44524' },
      128:   { bg: 'linear-gradient(180deg, #edd27c 0%, #edcf72 100%)', text: '#ffffff', shadow: '0 3px 0 #cdb055, 0 0 16px rgba(237, 207, 114, 0.6)' },
      256:   { bg: 'linear-gradient(180deg, #edcf6b 0%, #edcc61 100%)', text: '#ffffff', shadow: '0 3px 0 #cdad43, 0 0 20px rgba(237, 204, 97, 0.7)' },
      512:   { bg: 'linear-gradient(180deg, #edcb59 0%, #edc850 100%)', text: '#ffffff', shadow: '0 3px 0 #caa632, 0 0 24px rgba(237, 200, 80, 0.8)' },
      1024:  { bg: 'linear-gradient(180deg, #edc849 0%, #edc53f 100%)', text: '#ffffff', shadow: '0 3px 0 #caa320, 0 0 28px rgba(237, 197, 63, 0.9)' },
      2048:  { bg: 'linear-gradient(180deg, #edc436 0%, #edc22e 100%)', text: '#ffffff', shadow: '0 3px 0 #ca9f10, 0 0 35px rgba(237, 194, 46, 1)' },
      4096:  { bg: 'linear-gradient(180deg, #38ef7d 0%, #11998e 100%)', text: '#ffffff', shadow: '0 3px 0 #0c726a, 0 0 30px rgba(56, 239, 125, 0.9)' },
      8192:  { bg: 'linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)', text: '#ffffff', shadow: '0 3px 0 #00b4d8, 0 0 32px rgba(0, 242, 254, 0.9)' },
      16384: { bg: 'linear-gradient(180deg, #b224ef 0%, #7579ff 100%)', text: '#ffffff', shadow: '0 3px 0 #5b5ee6, 0 0 34px rgba(178, 36, 239, 0.9)' },
      32768: { bg: 'linear-gradient(180deg, #ff0844 0%, #ffb199 100%)', text: '#ffffff', shadow: '0 3px 0 #d90437, 0 0 36px rgba(255, 8, 68, 0.95)' },
      65536: { bg: 'linear-gradient(180deg, #1f1c2c 0%, #928dab 100%)', text: '#ffd700', shadow: '0 3px 0 #12101a, 0 0 40px rgba(255, 215, 0, 1)' }
    };

    this.isMoving = false;
    this.hasMoved = false;

    this.updateSoundButtonState();
    this.checkSavedGame();
    this.initEventListeners();
    this.initGameFromSaveOrNew();
  }

  // 保存データの確認とスタートボタン文言の切り替え
  checkSavedGame() {
    const saved = StorageManager.loadCurrentGame();
    if (saved && !saved.over) {
      this.startGameBtn.textContent = 'つづきから';
      this.size = saved.size || 4;
      this.syncModeButtons(this.size);
    } else {
      this.startGameBtn.textContent = 'ゲームスタート';
    }
  }

  syncModeButtons(size) {
    this.modeButtons.forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.size) === size);
    });
    this.startModeButtons.forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.size) === size);
    });
  }

  updateSoundButtonState() {
    if (this.isMuted) {
      this.soundToggleBtn.textContent = '🔇';
      this.soundToggleBtn.classList.add('muted');
    } else {
      this.soundToggleBtn.textContent = '🔊';
      this.soundToggleBtn.classList.remove('muted');
    }
  }

  toggleSound() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('2048_muted', this.isMuted);
    this.updateSoundButtonState();
    this.triggerHaptic('light');
  }

  playSound(type, arg) {
    if (this.isMuted || typeof sounds === 'undefined') return;
    if (type === 'move') sounds.playMove();
    else if (type === 'merge') sounds.playMerge(arg);
    else if (type === 'bigMerge') sounds.playBigMerge();
    else if (type === 'gameOver') sounds.playGameOver();
  }

  startTimer() {
    if (this.isTimerRunning) return;
    this.isTimerRunning = true;
    this.timerInterval = setInterval(() => {
      this.seconds++;
      this.renderTime();
      this.autoSave();
    }, 1000);
  }

  stopTimer() {
    this.isTimerRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resetTimer() {
    this.stopTimer();
    this.seconds = 0;
    this.renderTime();
  }

  renderTime() {
    const m = String(Math.floor(this.seconds / 60)).padStart(2, '0');
    const s = String(this.seconds % 60).padStart(2, '0');
    this.timeDisplay.textContent = `${m}:${s}`;
  }

  setupGrid() {
    const gap = this.size <= 4 ? 10 : 8;
    this.gridContainer.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
    this.gridContainer.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
    this.gridContainer.style.gap = `${gap}px`;
    this.gridContainer.innerHTML = '';

    for (let i = 0; i < this.size * this.size; i++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      this.gridContainer.appendChild(cell);
    }
  }

  // オートセーブからの復旧または新規開始
  initGameFromSaveOrNew() {
    const saved = StorageManager.loadCurrentGame();
    if (saved && !saved.over) {
      this.size = saved.size;
      this.setupGrid();
      this.score = saved.score;
      this.moves = saved.moves || 0;
      this.seconds = saved.seconds || 0;
      this.won = saved.won || false;
      this.over = false;
      this.keepPlaying = saved.keepPlaying || false;
      this.hasMoved = true;

      this.tiles = (saved.tiles || []).map(t => new Tile({ x: t.x, y: t.y }, t.value));
      this.scoreDisplay.textContent = this.score;
      this.movesDisplay.textContent = this.moves;
      this.renderTime();
      this.bestScoreDisplay.textContent = StorageManager.getBestScore(this.size);
      this.render();
    } else {
      this.initGame();
    }
  }

  initGame() {
    this.setupGrid();
    this.tiles = [];
    this.score = 0;
    this.moves = 0;
    this.won = false;
    this.over = false;
    this.keepPlaying = false;
    this.isMoving = false;
    this.hasMoved = false;

    this.resetTimer();
    this.movesDisplay.textContent = '0';
    this.hideMessage();
    this.hideConfirm();
    this.hideHelp();
    this.hideCollection();
    StorageManager.clearHistory();
    StorageManager.clearCurrentGame();
    this.updateScore(0, false);
    this.bestScoreDisplay.textContent = StorageManager.getBestScore(this.size);

    this.addRandomTile();
    this.addRandomTile();
    this.render();
  }

  // オートセーブ実行
  autoSave() {
    if (this.over) {
      StorageManager.clearCurrentGame();
      return;
    }
    const data = {
      size: this.size,
      score: this.score,
      moves: this.moves,
      seconds: this.seconds,
      won: this.won,
      keepPlaying: this.keepPlaying,
      over: this.over,
      tiles: this.tiles.map(t => ({ x: t.x, y: t.y, value: t.value }))
    };
    StorageManager.saveCurrentGame(data);
  }

  showStartScreen() {
    this.isGameStarted = false;
    this.stopTimer();
    this.checkSavedGame();
    this.startScreen.classList.remove('hidden');
    this.hideMessage();
    this.hideConfirm();
    this.hideHelp();
    this.hideCollection();
  }

  startGame() {
    this.isGameStarted = true;
    this.startScreen.classList.add('hidden');
    this.triggerHaptic('light');
    this.playSound('move');
    if (this.hasMoved) {
      this.startTimer();
    }
  }

  changeSize(newSize) {
    if (newSize === this.size) return;
    this.size = newSize;
    this.syncModeButtons(newSize);
    this.initGame();
  }

  hideMessage() {
    this.messageBox.style.display = 'none';
    this.messageBox.classList.remove('game-won');
  }

  getMaxTileValue() {
    if (this.tiles.length === 0) return 0;
    return Math.max(...this.tiles.map(t => t.value));
  }

  showMessage(won) {
    this.stopTimer();
    StorageManager.clearCurrentGame();

    const maxTile = this.getMaxTileValue();
    this.messageStatsSummary.textContent = `SCORE: ${this.score} | 最高タイル: ${maxTile} | 手数: ${this.moves} | タイム: ${this.timeDisplay.textContent}`;

    if (won) {
      this.messageText.textContent = 'You Win! 2048達成!';
      this.messageBox.classList.add('game-won');
      this.keepPlayingBtn.style.display = 'inline-block';
    } else {
      this.messageText.textContent = 'Game Over!';
      this.messageBox.classList.remove('game-won');
      this.keepPlayingBtn.style.display = 'none';
    }
    this.messageBox.style.display = 'flex';
  }

  // X（旧Twitter）への共有
  shareResult() {
    const maxTile = this.getMaxTileValue();
    const isWin = this.won ? '【2048達成！】' : '【ゲームオーバー】';
    const text = `${isWin} 2048をプレイしたよ！\nスコア: ${this.score}\n盤面: ${this.size}×${this.size}\n最高タイル: ${maxTile}\n手数: ${this.moves}手 | タイム: ${this.timeDisplay.textContent}\n#2048 #GamesClubhouse\n`;
    const url = 'https://tegenicejr.github.io/2048/';
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }

  // タイルコレクションのレンダリング
  renderCollection() {
    this.collectionGrid.innerHTML = '';
    const unlocked = StorageManager.getUnlockedTiles();

    this.allTileValues.forEach(val => {
      const item = document.createElement('div');
      item.className = 'collection-item';

      const isUnlocked = unlocked.includes(val);
      if (isUnlocked) {
        const style = this.tileStyles[val] || { bg: '#333', text: '#fff', shadow: 'none' };
        item.style.background = style.bg;
        item.style.color = style.text;
        item.style.boxShadow = style.shadow;
        item.textContent = val;
      } else {
        item.classList.add('locked');
        item.textContent = '?';
      }

      this.collectionGrid.appendChild(item);
    });
  }

  showCollection() {
    this.renderCollection();
    this.collectionModal.style.display = 'flex';
  }

  hideCollection() {
    this.collectionModal.style.display = 'none';
  }

  showConfirm(title, desc, confirmText, action) {
    this.confirmTitle.textContent = title || 'やり直しますか？';
    this.confirmDesc.innerHTML = desc || '現在のスコアと盤面の進行状況が<br>リセットされます。';
    this.confirmRestartBtn.textContent = confirmText || 'やり直す';
    this.pendingAction = action;
    this.confirmModal.style.display = 'flex';
  }

  hideConfirm() {
    this.confirmModal.style.display = 'none';
    this.pendingAction = null;
  }

  showHelp() {
    this.helpModal.style.display = 'flex';
  }

  hideHelp() {
    this.helpModal.style.display = 'none';
  }

  handleRestartRequest() {
    if (this.score > 0 || this.hasMoved) {
      this.showConfirm(
        'やり直しますか？',
        '現在のスコアと盤面の進行状況が<br>リセットされます。',
        'やり直す',
        () => this.initGame()
      );
    } else {
      this.initGame();
    }
  }

  handleModeChangeRequest(newSize) {
    if (newSize === this.size) return;

    if (this.score > 0 || this.hasMoved) {
      this.showConfirm(
        '盤面を変更しますか？',
        `盤面を${newSize}×${newSize}に変更すると、<br>現在のスコアと進行状況がリセットされます。`,
        '変更する',
        () => this.changeSize(newSize)
      );
    } else {
      this.changeSize(newSize);
    }
  }

  handleBackToTitleRequest() {
    if (this.score > 0 || this.hasMoved) {
      this.showConfirm(
        'タイトルへ戻りますか？',
        'タイトルに戻ると、<br>現在の進行状況は自動保存されます。',
        'もどる',
        () => {
          this.autoSave();
          this.showStartScreen();
        }
      );
    } else {
      this.showStartScreen();
    }
  }

  getGridState() {
    const grid = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
    this.tiles.forEach(tile => {
      grid[tile.y][tile.x] = tile.value;
    });
    return grid;
  }

  addRandomTile() {
    const occupied = new Set(this.tiles.map(t => `${t.x},${t.y}`));
    const emptyCells = [];
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (!occupied.has(`${x},${y}`)) emptyCells.push({ x, y });
      }
    }
    if (emptyCells.length > 0) {
      const pos = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const val = Math.random() < 0.9 ? 2 : 4;
      const tile = new Tile(pos, val);
      tile.isNew = true;
      this.tiles.push(tile);
      StorageManager.unlockTile(val);
    }
  }

  triggerHaptic(type = 'light') {
    if ('vibrate' in navigator) {
      if (type === 'light') navigator.vibrate(8);
      else if (type === 'medium') navigator.vibrate([12, 30, 15]);
      else if (type === 'heavy') navigator.vibrate([30, 50, 40]);
    }
  }

  render() {
    this.tileContainer.innerHTML = '';

    const gapPercent = this.size <= 4 ? 2.8 : 2.0;
    const tilePercent = (100 - (this.size - 1) * gapPercent) / this.size;

    this.tiles.forEach(tile => {
      const el = document.createElement('div');
      el.className = 'tile';
      el.textContent = tile.value;

      const style = this.tileStyles[tile.value] || {
        bg: 'linear-gradient(180deg, #111111 0%, #000000 100%)',
        text: '#00ffff',
        shadow: '0 3px 0 #000000, 0 0 40px rgba(0, 255, 255, 1)'
      };

      el.style.position = 'absolute';
      el.style.width = `${tilePercent}%`;
      el.style.height = `${tilePercent}%`;
      el.style.background = style.bg;
      el.style.color = style.text;
      el.style.boxShadow = style.shadow;
      el.style.borderRadius = '8px';
      el.style.display = 'flex';
      el.style.justifyContent = 'center';
      el.style.alignItems = 'center';
      el.style.fontWeight = '900';
      el.style.lineHeight = '1';
      el.style.transition = 'transform 100ms ease-in-out';
      el.style.willChange = 'transform';

      let fontSize = 36;
      if (this.size === 2) fontSize = 56;
      if (this.size === 5) fontSize = 26;
      if (this.size === 6) fontSize = 20;

      if (tile.value >= 100 && this.size >= 4) fontSize = Math.floor(fontSize * 0.82);
      if (tile.value >= 1000) fontSize = Math.floor(fontSize * 0.72);
      if (tile.value >= 10000) fontSize = Math.floor(fontSize * 0.60);
      el.style.fontSize = `${fontSize}px`;

      const step = 100 + (gapPercent / tilePercent) * 100;
      const posX = tile.x * step;
      const posY = tile.y * step;

      const transformStr = `translate(${posX}%, ${posY}%)`;
      el.style.setProperty('--pos', transformStr);
      el.style.transform = transformStr;

      if (tile.isNew) {
        el.classList.add('tile-new');
        tile.isNew = false;
      } else if (tile.isMerged) {
        el.classList.add('tile-merged');
        tile.isMerged = false;
      }

      this.tileContainer.appendChild(el);
    });
  }

  updateScore(add, showAddition = true) {
    this.score += add;
    this.scoreDisplay.textContent = this.score;

    if (showAddition && add > 0) {
      const addition = document.createElement('div');
      addition.className = 'score-addition';
      addition.textContent = `+${add}`;
      this.scoreDisplay.parentElement.appendChild(addition);
      setTimeout(() => addition.remove(), 600);
    }

    const best = StorageManager.setBestScore(this.score, this.size);
    this.bestScoreDisplay.textContent = best;
  }

  isAnyModalOpen() {
    return (
      !this.isGameStarted ||
      (this.confirmModal && this.confirmModal.style.display === 'flex') ||
      (this.helpModal && this.helpModal.style.display === 'flex') ||
      (this.collectionModal && this.collectionModal.style.display === 'flex')
    );
  }

  move(direction) {
    if (this.over || this.isMoving || this.isAnyModalOpen()) return;

    const vectors = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 }
    };
    const vector = vectors[direction];

    const xTraversal = Array.from({ length: this.size }, (_, i) => i);
    const yTraversal = Array.from({ length: this.size }, (_, i) => i);
    if (vector.x === 1) xTraversal.reverse();
    if (vector.y === 1) yTraversal.reverse();

    const previousGrid = this.getGridState();
    const previousScore = this.score;

    this.tiles.forEach(t => t.savePosition());

    let moved = false;
    let scoreGained = 0;
    const mergedTracker = new Set();
    const nextTiles = [];

    xTraversal.forEach(x => {
      yTraversal.forEach(y => {
        const tile = this.tiles.find(t => t.x === x && t.y === y);
        if (!tile) return;

        let currX = x;
        let currY = y;

        while (true) {
          const nextX = currX + vector.x;
          const nextY = currY + vector.y;

          if (nextX < 0 || nextX >= this.size || nextY < 0 || nextY >= this.size) break;

          const target = nextTiles.find(t => t.x === nextX && t.y === nextY);

          if (!target) {
            currX = nextX;
            currY = nextY;
          } else if (target.value === tile.value && !mergedTracker.has(target)) {
            currX = nextX;
            currY = nextY;
            mergedTracker.add(target);
            target.value *= 2;
            target.isMerged = true;
            scoreGained += target.value;
            moved = true;

            // コレクションへの解放
            StorageManager.unlockTile(target.value);

            if (target.value === 2048 && !this.won) this.won = true;

            tile.mergedInto = target;
            tile.updatePosition({ x: currX, y: currY });
            return;
          } else {
            break;
          }
        }

        if (currX !== x || currY !== y) moved = true;
        tile.updatePosition({ x: currX, y: currY });
        nextTiles.push(tile);
      });
    });

    if (moved) {
      this.isMoving = true;
      this.hasMoved = true;
      this.moves++;
      this.movesDisplay.textContent = this.moves;
      this.startTimer();

      this.tiles = nextTiles;
      this.render();

      if (mergedTracker.size > 0) {
        this.triggerHaptic('medium');
        const maxVal = Math.max(...Array.from(mergedTracker).map(t => t.value));
        if (maxVal >= 128) this.playSound('bigMerge');
        else this.playSound('merge', maxVal);
      } else {
        this.triggerHaptic('light');
        this.playSound('move');
      }

      setTimeout(() => {
        StorageManager.saveState(previousGrid, previousScore);
        this.updateScore(scoreGained);
        this.addRandomTile();
        this.render();
        this.autoSave(); // 自動保存
        this.checkGameState();
        this.isMoving = false;
      }, 105);
    }
  }

  undo() {
    if (this.over || this.isMoving || this.isAnyModalOpen()) return;
    const prevState = StorageManager.popState();
    if (!prevState) return;

    this.tiles = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const val = prevState.grid[y][x];
        if (val !== 0) {
          this.tiles.push(new Tile({ x, y }, val));
        }
      }
    }
    this.score = prevState.score;
    this.scoreDisplay.textContent = this.score;

    if (this.moves > 0) {
      this.moves--;
      this.movesDisplay.textContent = this.moves;
    }

    this.hideMessage();
    this.render();
    this.autoSave();
  }

  checkGameState() {
    if (this.won && !this.keepPlaying) {
      this.showMessage(true);
      return;
    }

    if (this.tiles.length < this.size * this.size) return;

    const grid = this.getGridState();
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (x < this.size - 1 && grid[y][x] === grid[y][x + 1]) return;
        if (y < this.size - 1 && grid[y][x] === grid[y + 1][x]) return;
      }
    }

    this.over = true;
    this.triggerHaptic('heavy');
    this.playSound('gameOver');
    this.showMessage(false);
  }

  initEventListeners() {
    this.soundToggleBtn.addEventListener('click', () => this.toggleSound());

    // スタート画面
    const handleStart = (e) => {
      e.preventDefault();
      this.startGame();
    };
    this.startGameBtn.addEventListener('click', handleStart);
    this.startGameBtn.addEventListener('touchend', handleStart);

    const handleStartHelp = (e) => {
      e.preventDefault();
      this.showHelp();
    };
    this.startHelpBtn.addEventListener('click', handleStartHelp);
    this.startHelpBtn.addEventListener('touchend', handleStartHelp);

    // コレクションボタン
    const handleCollection = (e) => {
      e.preventDefault();
      this.showCollection();
    };
    this.collectionBtn.addEventListener('click', handleCollection);
    this.collectionBtn.addEventListener('touchend', handleCollection);

    this.closeCollectionBtn.addEventListener('click', () => this.hideCollection());
    this.closeCollectionBottomBtn.addEventListener('click', () => this.hideCollection());
    this.collectionModal.addEventListener('click', (e) => {
      if (e.target === this.collectionModal) this.hideCollection();
    });

    this.startModeButtons.forEach(btn => {
      const handleMode = (e) => {
        e.preventDefault();
        this.changeSize(parseInt(btn.dataset.size));
      };
      btn.addEventListener('click', handleMode);
      btn.addEventListener('touchend', handleMode);
    });

    this.backToTitleBtn.addEventListener('click', () => this.handleBackToTitleRequest());

    this.restartBtn.addEventListener('click', () => this.handleRestartRequest());
    this.retryBtn.addEventListener('click', () => this.initGame());
    this.shareScoreBtn.addEventListener('click', () => this.shareResult());

    this.howToPlayBtn.addEventListener('click', () => this.showHelp());
    this.closeHelpBtn.addEventListener('click', () => this.hideHelp());
    this.gotItBtn.addEventListener('click', () => this.hideHelp());
    this.helpModal.addEventListener('click', (e) => {
      if (e.target === this.helpModal) this.hideHelp();
    });

    this.cancelRestartBtn.addEventListener('click', () => this.hideConfirm());
    this.confirmRestartBtn.addEventListener('click', () => {
      const action = this.pendingAction;
      this.hideConfirm();
      if (action) action();
    });
    this.confirmModal.addEventListener('click', (e) => {
      if (e.target === this.confirmModal) this.hideConfirm();
    });

    this.undoBtn.addEventListener('click', () => this.undo());

    this.keepPlayingBtn.addEventListener('click', () => {
      this.keepPlaying = true;
      this.hideMessage();
      this.startTimer();
      this.autoSave();
    });

    this.modeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleModeChangeRequest(parseInt(e.target.dataset.size));
      });
    });

    window.addEventListener('keydown', (e) => {
      const map = {
        ArrowUp: 'up', KeyW: 'up',
        ArrowDown: 'down', KeyS: 'down',
        ArrowLeft: 'left', KeyA: 'left',
        ArrowRight: 'right', KeyD: 'right'
      };
      if (map[e.code]) {
        e.preventDefault();
        this.move(map[e.code]);
      }
    });

    let startX = 0;
    let startY = 0;

    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;
      const diffX = e.changedTouches[0].clientX - startX;
      const diffY = e.changedTouches[0].clientY - startY;
      const threshold = 30;

      if (Math.max(Math.abs(diffX), Math.abs(diffY)) > threshold) {
        if (Math.abs(diffX) > Math.abs(diffY)) {
          this.move(diffX > 0 ? 'right' : 'left');
        } else {
          this.move(diffY > 0 ? 'down' : 'up');
        }
      }
      startX = 0;
      startY = 0;
    }, { passive: false });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new GameManager();
});
