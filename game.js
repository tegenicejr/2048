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

  // ランダムな空きマスに2または4を生成
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
  render(mergedCells = []) {
    this.tileContainer.innerHTML = '';
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.grid[r][c];
        if (val !== 0) {
          const tile = document.createElement('div');
          const isSuper = val > 2048;
          tile.className = `tile tile-${isSuper ? 'super' : val}`;
          tile.textContent = val;
          // グリッド位置の計算（gap 12px 基準）
          tile.style.top = `calc(${r} * (25% + 3px))`;
          tile.style.left = `calc(${c} * (25% + 3px))`;

          if (mergedCells.some(m => m.r === r && m.c === c)) {
            tile.classList.add('tile-merged');
          }
          this.tileContainer.appendChild(tile);
        }
      }
    }
  }

  // スコア加算
  updateScore(addScore) {
    this.score += addScore;
    this.scoreDisplay.textContent = this.score;
    const best = StorageManager.setBestScore(this.score);
    this.bestScoreDisplay.textContent = best;
  }

  // 1手進める（スライド・合体計算）
  move(direction) {
    // 状態を履歴に保存（UNDO用）
    const previousGrid = JSON.parse(JSON.stringify(this.grid));
    const previousScore = this.score;

    let moved = false;
    let scoreGained = 0;
    const mergedPositions = [];

    // 回転を用いてすべて左方向への移動として処理
    const rotations = { up: 1, right: 2, down: 3, left: 0 }[direction];
    for (let i = 0; i < rotations; i++) this.rotateGrid();

    for (let r = 0; r < this.size; r++) {
      let row = this.grid[r].filter(val => val !== 0);
      for (let c = 0; c < row.length - 1; c++) {
        if (row[c] === row[c + 1]) {
          row[c] *= 2;
          scoreGained += row[c];
          row.splice(c + 1, 1);
          mergedPositions.push({ r, c });
        }
      }
      while (row.length < this.size) row.push(0);

      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] !== row[c]) moved = true;
        this.grid[r][c] = row[c];
      }
    }

    // 元の向きに回転を戻す
    for (let i = 0; i < (4 - rotations) % 4; i++) this.rotateGrid();

    if (moved) {
      StorageManager.saveState(previousGrid, previousScore);
      this.updateScore(scoreGained);
      this.addRandomTile();
      this.render(mergedPositions);
      this.checkGameState();
    }
  }

  // 盤面を90度反時計回りに回転
  rotateGrid() {
    const newGrid = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        newGrid[this.size - 1 - c][r] = this.grid[r][c];
      }
    }
    this.grid = newGrid;
  }

  // 1手戻す
  undo() {
    const prevState = StorageManager.popState();
    if (!prevState) return;
    this.grid = prevState.grid;
    this.score = prevState.score;
    this.scoreDisplay.textContent = this.score;
    this.render();
  }

  // 最大タイル値の取得
  getMaxTile() {
    return Math.max(...this.grid.flat());
  }

  // ゲームオーバー判定
  checkGameState() {
    let canMove = false;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) return;
        if (c < this.size - 1 && this.grid[r][c] === this.grid[r][c + 1]) canMove = true;
        if (r < this.size - 1 && this.grid[r][c] === this.grid[r + 1][c]) canMove = true;
      }
    }

    if (!canMove) {
      StorageManager.addRanking(this.score, this.getMaxTile());
      alert(`ゲームオーバー！\nスコア: ${this.score}`);
    }
  }

  // 操作イベント登録（スワイプ ＆ キーボード ＆ ボタン）
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

    // キーボード操作
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

    // スマホのスワイプ操作検知
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
      const threshold = 30; // 最小認識距離(px)

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

// 起動
document.addEventListener('DOMContentLoaded', () => {
  new GameManager();
});
