class StorageManager {
  static getBestKey(size) {
    return `bestScore_size_${size}`;
  }

  static getBestScore(size) {
    return parseInt(localStorage.getItem(this.getBestKey(size))) || 0;
  }

  static setBestScore(score, size) {
    const current = this.getBestScore(size);
    if (score > current) {
      localStorage.setItem(this.getBestKey(size), score);
      return score;
    }
    return current;
  }

  static saveState(grid, score) {
    const history = JSON.parse(sessionStorage.getItem('history') || '[]');
    history.push({ grid, score });
    if (history.length > 5) history.shift();
    sessionStorage.setItem('history', JSON.stringify(history));
  }

  static popState() {
    const history = JSON.parse(sessionStorage.getItem('history') || '[]');
    if (history.length === 0) return null;
    const last = history.pop();
    sessionStorage.setItem('history', JSON.stringify(history));
    return last;
  }

  static clearHistory() {
    sessionStorage.removeItem('history');
  }
}
