// ストレージ管理オブジェクト
const StorageManager = {
  BEST_SCORE_KEY: '2048_best_score',
  HISTORY_KEY: '2048_history_stack',
  RANKING_KEY: '2048_ranking_data',

  // ハイスコア取得
  getBestScore() {
    return parseInt(localStorage.getItem(this.BEST_SCORE_KEY)) || 0;
  },

  // ハイスコア更新
  setBestScore(score) {
    const currentBest = this.getBestScore();
    if (score > currentBest) {
      localStorage.setItem(this.BEST_SCORE_KEY, score);
      return score;
    }
    return currentBest;
  },

  // UNDO用：盤面とスコアの履歴スタック
  history: [],

  // 1手前の状態を保存
  saveState(grid, score) {
    // 最大10手まで保持
    if (this.history.length >= 10) {
      this.history.shift();
    }
    // ディープコピーして履歴に追加
    this.history.push({
      grid: JSON.parse(JSON.stringify(grid)),
      score: score
    });
  },

  // 1手前の状態を取得
  popState() {
    return this.history.pop() || null;
  },

  // 履歴クリア
  clearHistory() {
    this.history = [];
  },

  // ランキング取得（上位5件）
  getRankings() {
    const data = localStorage.getItem(this.RANKING_KEY);
    return data ? JSON.parse(data) : [];
  },

  // ランキングにスコアを記録
  addRanking(score, maxTile) {
    if (score === 0) return;
    const rankings = this.getRankings();
    const newEntry = {
      score: score,
      maxTile: maxTile,
      date: new Date().toLocaleDateString('ja-JP')
    };

    rankings.push(newEntry);
    // スコア降順ソート
    rankings.sort((a, b) => b.score - a.score);
    // 上位5件にカット
    const top5 = rankings.slice(0, 5);
    localStorage.setItem(this.RANKING_KEY, JSON.stringify(top5));
  }
};
