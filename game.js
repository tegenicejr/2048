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
    this.won = false;
    this.over = false;
    this.keepPlaying = false;
    this.tiles = [];

    this.gridContainer = document.getElementById('grid-container');
    this.tileContainer = document.getElementById('tile-container');
    this.scoreDisplay = document.getElementById('score');
    this.bestScoreDisplay = document.getElementById('best-score');
    this.undoBtn = document.getElementById('undo-btn');
    this.restartBtn = document.getElementById('restart-btn');
    this.messageBox = document.getElementById('game-message');
    this.messageText = document.getElementById('game-message-text');
    this.retryBtn = document.getElementById('retry-button');
    this.keepPlayingBtn = document.getElementById('keep-playing-button');
    this.modeButtons = document.querySelectorAll('.mode-btn');

    // 2から65536まで極めた市販級グラデーション＆ネオングローマップ
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
      // 4096以降：覚醒ネオン＆クリスタルカラー
      4096:  { bg: 'linear-gradient(180deg, #38ef7d 0%, #11998e 100%)', text: '#ffffff', shadow: '0 3px 0 #0c726a, 0 0 30px rgba(56, 239, 125, 0.9)' },
      8192:  { bg: 'linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)', text: '#ffffff', shadow: '0 3px 0 #00b4d8, 0 0 32px rgba(0, 242, 254, 0.9)' },
      16384: { bg: 'linear-gradient(180deg, #b224ef 0%, #7579ff 100%)', text: '#ffffff', shadow: '0 3px 0 #5b5ee6, 0 0 34px rgba(178, 36, 239, 0.9)' },
      32768: { bg: 'linear-gradient(180deg, #ff0844 0%, #ffb199 100%)', text: '#ffffff', shadow: '0 3px 0 #d90437, 0 0 36px rgba(255, 8, 68, 0.95)' },
      65536: { bg: 'linear-gradient(180deg, #1f1c2c 0%, #928dab 100%)', text: '#ffd700', shadow: '0 3px 0 #12101a, 0 0 40px rgba(255, 215, 0, 1)' }
    };

    this.isMoving = false;
    this.initEventListeners();
    this.initGame();
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

  initGame() {
    this.setupGrid();
    this.tiles = [];
    this.score = 0;
    this.won = false;
    this.over = false;
    this.keepPlaying = false;
    this.isMoving = false;
    this.hideMessage();
    StorageManager.clearHistory();
    this.updateScore(0, false);
    this.bestScoreDisplay.textContent = StorageManager.getBestScore(this.size);

    this.addRandomTile();
    this.addRandomTile();
    this.render();
  }

  hideMessage() {
    this.messageBox.style.display = 'none';
    this.messageBox.classList.remove('game-won');
  }

  showMessage(won) {
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
      const tile = new Tile(pos, Math.random() < 0.9 ? 2 : 4);
      tile.isNew = true;
      this.tiles.push(tile);
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

      // 桁数に応じた文字縮小（5桁・6桁でも絶対にはみ出さない）
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

  move(direction) {
    if (this.over || this.isMoving) return;

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
      this.tiles = nextTiles;
      this.render();

      if (mergedTracker.size > 0) {
        this.triggerHaptic('medium');
        const maxVal = Math.max(...Array.from(mergedTracker).map(t => t.value));
        if (typeof sounds !== 'undefined') {
          if (maxVal >= 128) sounds.playBigMerge();
          else sounds.playMerge(maxVal);
        }
      } else {
        this.triggerHaptic('light');
        if (typeof sounds !== 'undefined') sounds.playMove();
      }

      setTimeout(() => {
        StorageManager.saveState(previousGrid, previousScore);
        this.updateScore(scoreGained);
        this.addRandomTile();
        this.render();
        this.checkGameState();
        this.isMoving = false;
      }, 105);
    }
  }

  undo() {
    if (this.over || this.isMoving) return;
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
    this.hideMessage();
    this.render();
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
    if (typeof sounds !== 'undefined') sounds.playGameOver();
    this.showMessage(false);
  }

  initEventListeners() {
    this.restartBtn.addEventListener('click', () => this.initGame());
    this.retryBtn.addEventListener('click', () => this.initGame());
    this.undoBtn.addEventListener('click', () => this.undo());

    this.keepPlayingBtn.addEventListener('click', () => {
      this.keepPlaying = true;
      this.hideMessage();
    });

    this.modeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const newSize = parseInt(e.target.dataset.size);
        if (newSize === this.size) return;

        this.modeButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        this.size = newSize;
        this.initGame();
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
