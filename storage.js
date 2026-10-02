class StorageManager {
  static getBestScore(size = 4) {
    const key = `2048_best_${size}`;
    return parseInt(localStorage.getItem(key)) || 0;
  }

  static setBestScore(score, size = 4) {
    const key = `2048_best_${size}`;
    const currentBest = this.getBestScore(size);
    if (score > currentBest) {
      localStorage.setItem(key, score);
      return score;
    }
    return currentBest;
  }

  // 1手戻す用スタック
  static saveState(grid, score) {
    const history = JSON.parse(localStorage.getItem('2048_history') || '[]');
    history.push({ grid, score });
    if (history.length > 30) history.shift();
    localStorage.setItem('2048_history', JSON.stringify(history));
  }

  static popState() {
    const history = JSON.parse(localStorage.getItem('2048_history') || '[]');
    if (history.length === 0) return null;
    const last = history.pop();
    localStorage.setItem('2048_history', JSON.stringify(history));
    return last;
  }

  static clearHistory() {
    localStorage.removeItem('2048_history');
  }

  // オートセーブ（進行中の盤面・タイム・手数）
  static saveCurrentGame(gameData) {
    localStorage.setItem('2048_saved_game', JSON.stringify(gameData));
  }

  static loadCurrentGame() {
    const data = localStorage.getItem('2048_saved_game');
    return data ? JSON.parse(data) : null;
  }

  static clearCurrentGame() {
    localStorage.removeItem('2048_saved_game');
  }

  // アンロック済みタイル図鑑
  static getUnlockedTiles() {
    const data = localStorage.getItem('2048_unlocked_tiles');
    return data ? JSON.parse(data) : [2, 4];
  }

  static unlockTile(value) {
    const unlocked = this.getUnlockedTiles();
    if (!unlocked.includes(value)) {
      unlocked.push(value);
      localStorage.setItem('2048_unlocked_tiles', JSON.stringify(unlocked));
    }
  }
}
