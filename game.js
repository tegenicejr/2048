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

    // タイル色マップ（JS側で直接保証）
    this.tileColors = {
      2:    { bg: '#eee4da', text: '#776e65', shadow: 'none' },
      4:    { bg: '#ede0c8', text: '#776e65', shadow: 'none' },
      8:    { bg: '#f2b179', text: '#f9f6f2', shadow: 'none' },
      16:   { bg: '#f59563', text: '#f9f6f2', shadow: 'none' },
      32:   { bg: '#f67c5f', text: '#f9f6f2', shadow: 'none' },
      64:   { bg: '#f65e3b', text: '#f9f6f2', shadow: 'none' },
      128:  { bg: '#edcf72', text: '#f9f6f2', shadow: '0 0 10px rgba(243, 215, 116, 0.4)' },
      256:  { bg: '#edcc61', text: '#f9f6f2', shadow: '0 0 14px rgba(243, 215, 116, 0.5)' },
      512:  { bg: '#edc850', text: '#f9f6f2', shadow: '0 0 18px rgba(243, 215, 116, 0.6)' },
      1024: { bg: '#edc53f', text: '#f9f6f2', shadow: '0 0 22px rgba(243, 215, 116, 0.7)' },
      2048: { bg: '#edc22e', text: '#f9f6f2', shadow: '0 0 26px rgba(237, 194, 46, 0.85)' }
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
    this.updateScore(0);
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

    // 盤面サイズに応じたタイル幅・隙間の計算
    const gapPercent = this.size <= 4 ? 2.8 : 2.0;
    const tilePercent = (100 - (this.size - 1) * gapPercent) / this.size;

    this.tiles.forEach(tile => {
      const el = document.createElement('div');
      el.className = 'tile';
      el.textContent = tile.value;

      // デザイン属性をインラインで直接確定
      const color = this.tileColors[tile.value] || { bg: '#3c3a32', text: '#f9f6f2', shadow: 'none' };
      el.style.position = 'absolute';
      el.style.width = `${tilePercent}%`;
      el.style.height = `${tilePercent}%`;
      el.style.backgroundColor = color.bg;
      el.style.color = color.text;
      el.style.boxShadow = color.shadow;
      el.style.borderRadius = '6px';
      el.style.display = 'flex';
      el.style.justifyContent = 'center';
      el.style.alignItems = 'center';
      el.style.fontWeight = '800';
      el.style.lineHeight = '1';
      el.style.transition = 'transform 100ms ease-in-out';
      el.style.willChange = 'transform';

      // 文字サイズ
      let fontSize = 35;
      if (this.size === 2) fontSize = 54;
      if (this.size === 5) fontSize = 24;
      if (this.size === 6) fontSize = 18;
      if (tile.value >= 100 && this.size >= 4) fontSize = Math.floor(fontSize * 0.8);
      if (tile.value >= 1000) fontSize = Math.floor(fontSize * 0.7);
      el.style.fontSize = `${fontSize}px`;

      // スライド移動位置
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

  updateScore(add) {
    this.score += add;
    this.scoreDisplay.textContent = this.score;
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
