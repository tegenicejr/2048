class GameManager {
  constructor() {
    this.size = 4;
    this.score = 0;
    this.grid = [];
    this.tileContainer = document.getElementById('tile-container');
    this.scoreDisplay = document.getElementById('score');
    this.bestScoreDisplay = document.getElementById('best-score');
    this.undoBtn = document.getElementById('undo-btn');
    this.restartBtn = document.getElementById('restart-btn');
    this.rankingBtn = document.getElementById('ranking-btn');

    this.initEventListeners();
    this.initGame();
  }

  // 初期化
  initGame() {
    this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
    this.score = 0;
    StorageManager.clearHistory();
    this.updateScore(0);
    this.bestScoreDisplay.textContent = StorageManager.getBestScore();
    this.addRandomTile();
    this.addRandomTile();
    this.render();
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

  // 画面描画（mergedCellsに含まれるタイルだけ確実にバウンド）
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

          // 合体したタイルのみポップ演出
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

  // 4方向のスライド＆合体を直接計算（座標ズレを完全解消）
  move(direction) {
    const previousGrid = JSON.parse(JSON.stringify(this.grid));
    const previousScore = this.score;

    let moved = false;
    let scoreGained = 0;
    const mergedCells = [];

    // 移動方向に応じたベクトル
    const vectors = {
      up: { r: -1, c: 0 },
      down: { r: 1, c: 0 },
      left: { r: 0, c: -1 },
      right: { r: 0, c: 1 }
    };
    const vector = vectors[direction];

    // 移動順序（壁に近いマスから順に詰める）
    const rowOrder = direction === 'down' ? [3, 2, 1, 0] : [0, 1, 2, 3];
    const colOrder = direction === 'right' ? [3, 2, 1, 0] : [0, 1, 2, 3];

    // 合体済みフラグ（1ターンに2度合体するのを防ぐ）
    const mergedTracker = Array(this.size).fill(false).map(() => Array(this.size).fill(false));

    for (const r of rowOrder) {
      for (const c of colOrder) {
        if (this.grid[r][c] === 0) continue;

        let currR = r;
        let currC = c;
        const val = this.grid[r][c];

        // どこまで滑れるかを探索
        while (true) {
          const nextR = currR + vector.r;
          const nextC = currC + vector.c;

          // 盤面の外に出るならストップ
          if (nextR < 0 || nextR >= this.size || nextC < 0 || nextC >= this.size) break;

          const nextVal = this.grid[nextR][nextC];

          if (nextVal === 0) {
            // 空きマスなら進む
            this.grid[nextR][nextC] = val;
            this.grid[currR][currC] = 0;
            currR = nextR;
            currC = nextC;
            moved = true;
          } else if (nextVal === val && !mergedTracker[nextR][nextC]) {
            // 同じ数字かつ未合体なら合体！
            this.grid[nextR][nextC] = val * 2;
            this.grid[currR][currC] = 0;
            scoreGained += val * 2;
            mergedTracker[nextR][nextC] = true;
            mergedCells.push({ r: nextR, c: nextC }); // 正確な合体位置を記録
            moved = true;
            break;
          } else {
            // 別の数字にぶつかったらストップ
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
      this.checkGameState();
    }
  }

  undo() {
    const prevState = StorageManager.popState();
    if (!prevState) return;
    this.grid = prevState.grid;
    this.score = prevState.score;
    this.scoreDisplay.textContent = this.score;
    this.render();
  }

  getMaxTile() {
    return Math.max(...this.grid.flat());
  }

  checkGameState() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) return;
        if (c < this.size - 1 && this.grid[r][c] === this.grid[r][c + 1]) return;
        if (r < this.size - 1 && this.grid[r][c] === this.grid[r + 1][c]) return;
      }
    }
    StorageManager.addRanking(this.score, this.getMaxTile());
    alert(`ゲームオーバー！\nスコア: ${this.score}`);
  }

  initEventListeners() {
    this.restartBtn.addEventListener('click', () => this.initGame());
    this.undoBtn.addEventListener('click', () => this.undo());
    this.rankingBtn.addEventListener('click', () => {
      const records = StorageManager.getRankings();
      if (records.length === 0) {
        alert('ランキング記録はまだありません。');
        return;
      }
      const list = records.map((rec, i) => `${i + 1}位: ${rec.score}点 (最大: ${rec.maxTile}) - ${rec.date}`).join('\n');
      alert(`【ランキング TOP 5】\n${list}`);
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
