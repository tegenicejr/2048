class GameManager {
  constructor() {
    this.size = 4;
    this.score = 0;
    this.grid = [];
    this.won = false;
    this.over = false;

    this.tileContainer = document.getElementById('tile-container');
    this.scoreDisplay = document.getElementById('score');
    this.bestScoreDisplay = document.getElementById('best-score');
    this.undoBtn = document.getElementById('undo-btn');
    this.restartBtn = document.getElementById('restart-btn');
    this.messageBox = document.getElementById('game-message');
    this.messageText = document.getElementById('game-message-text');
    this.retryBtn = document.getElementById('retry-button');

    this.initEventListeners();
    this.initGame();
  }

  // 初期化
  initGame() {
    this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
    this.score = 0;
    this.won = false;
    this.over = false;
    this.hideMessage();
    StorageManager.clearHistory();
    this.updateScore(0);
    this.bestScoreDisplay.textContent = StorageManager.getBestScore();
    this.addRandomTile();
    this.addRandomTile();
    this.render();
  }

  hideMessage() {
    this.messageBox.style.display = 'none';
    this.messageBox.classList.remove('game-won');
  }

  showMessage(won) {
    this.messageText.textContent = won ? 'You Win! 2048達成!' : 'Game Over!';
    if (won) {
      this.messageBox.classList.add('game-won');
    } else {
      this.messageBox.classList.remove('game-won');
    }
    this.messageBox.style.display = 'flex';
  }

  // 空きマスにタイル生成
  addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length > 0) {
      const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
      return { r, c };
    }
    return null;
  }

  // 画面描画
  render(mergedCells = [], newCell = null) {
    this.tileContainer.innerHTML = '';
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.grid[r][c];
        if (val !== 0) {
          const tile = document.createElement('div');
          const isSuper = val > 2048;
          tile.className = `tile tile-${isSuper ? 'super' : val}`;
          tile.textContent = val;
          tile.style.top = `calc(${r} * (25% + 3px))`;
          tile.style.left = `calc(${c} * (25% + 3px))`;

          if (mergedCells.some(m => m.r === r && m.c === c)) {
            tile.classList.add('tile-merged');
          } else if (newCell && newCell.r === r && newCell.c === c) {
            tile.classList.add('tile-new');
          }

          this.tileContainer.appendChild(tile);
        }
      }
    }
  }

  updateScore(addScore) {
    this.score += addScore;
    this.scoreDisplay.textContent = this.score;
    const best = StorageManager.setBestScore(this.score);
    this.bestScoreDisplay.textContent = best;
  }

  // 4方向のスライド＆合体
  move(direction) {
    if (this.over) return;

    const previousGrid = JSON.parse(JSON.stringify(this.grid));
    const previousScore = this.score;

    let moved = false;
    let scoreGained = 0;
    const mergedCells = [];

    const vectors = {
      up: { r: -1, c: 0 },
      down: { r: 1, c: 0 },
      left: { r: 0, c: -1 },
      right: { r: 0, c: 1 }
    };
    const vector = vectors[direction];

    const rowOrder = direction === 'down' ? [3, 2, 1, 0] : [0, 1, 2, 3];
    const colOrder = direction === 'right' ? [3, 2, 1, 0] : [0, 1, 2, 3];

    const mergedTracker = Array(this.size).fill(false).map(() => Array(this.size).fill(false));

    for (const r of rowOrder) {
      for (const c of colOrder) {
        if (this.grid[r][c] === 0) continue;

        let currR = r;
        let currC = c;
        const val = this.grid[r][c];

        while (true) {
          const nextR = currR + vector.r;
          const nextC = currC + vector.c;

          if (nextR < 0 || nextR >= this.size || nextC < 0 || nextC >= this.size) break;

          const nextVal = this.grid[nextR][nextC];

          if (nextVal === 0) {
            this.grid[nextR][nextC] = val;
            this.grid[currR][currC] = 0;
            currR = nextR;
            currC = nextC;
            moved = true;
          } else if (nextVal === val && !mergedTracker[nextR][nextC]) {
            this.grid[nextR][nextC] = val * 2;
            this.grid[currR][currC] = 0;
            scoreGained += val * 2;
            mergedTracker[nextR][nextC] = true;
            mergedCells.push({ r: nextR, c: nextC });

            if (val * 2 === 2048 && !this.won) {
              this.won = true;
            }

            moved = true;
            break;
          } else {
            break;
          }
        }
      }
    }

    if (moved) {
      StorageManager.saveState(previousGrid, previousScore);
      this.updateScore(scoreGained);
      const newCell = this.addRandomTile();
      this.render(mergedCells, newCell);

      if (typeof sounds !== 'undefined') {
        if (mergedCells.length > 0) {
          const maxMergedVal = Math.max(...mergedCells.map(m => this.grid[m.r][m.c]));
          if (maxMergedVal >= 128) {
            sounds.playBigMerge();
          } else {
            sounds.playMerge(maxMergedVal);
          }
        } else {
          sounds.playMove();
        }
      }

      this.checkGameState();
    }
  }

  undo() {
    if (this.over) return;
    const prevState = StorageManager.popState();
    if (!prevState) return;
    this.grid = prevState.grid;
    this.score = prevState.score;
    this.scoreDisplay.textContent = this.score;
    this.hideMessage();
    this.render();
  }

  getMaxTile() {
    return Math.max(...this.grid.flat());
  }

  checkGameState() {
    if (this.won && !this.messageBox.classList.contains('game-won')) {
      this.showMessage(true);
      return;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) return;
        if (c < this.size - 1 && this.grid[r][c] === this.grid[r][c + 1]) return;
        if (r < this.size - 1 && this.grid[r][c] === this.grid[r + 1][c]) return;
      }
    }

    this.over = true;
    if (typeof sounds !== 'undefined') sounds.playGameOver();
    this.showMessage(false);
  }

  initEventListeners() {
    this.restartBtn.addEventListener('click', () => this.initGame());
    this.retryBtn.addEventListener('click', () => this.initGame());
    this.undoBtn.addEventListener('click', () => this.undo());

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
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const diffX = endX - startX;
      const diffY = endY - startY;
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
