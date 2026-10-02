// Web Audio API を使った軽量SEマネージャー
class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  // 初回タップ時にオーディオコンテキストを初期化（スマホブラウザの制限対策）
  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 基本のトーン発音関数
  playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.15) {
    if (this.isMuted) return;
    this.initContext();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // 音の立ち上がりと減衰（クリックノイズ防止）
    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // スライド移動音（シュッとした低めの音）
  playMove() {
    this.playTone(220, 'triangle', 0.05, 0.08);
  }

  // 合体音（数字が大きくなるほど高音でピコッと鳴る）
  playMerge(value) {
    this.initContext();
    // 2 -> 400Hz, 4 -> 480Hz ... と音階が上がる
    const baseFreq = 380 + Math.log2(value) * 60;
    
    // 2音重ねてリッチなポコッ音を作る
    this.playTone(baseFreq, 'sine', 0.09, 0.2);
    setTimeout(() => {
      this.playTone(baseFreq * 1.5, 'sine', 0.07, 0.15);
    }, 30);
  }

  // 大きな数字（128以上）合体時のファンファーレ
  playBigMerge() {
    this.initContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // ド・ミ・ソ・高ド
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.12, 0.2);
      }, idx * 60);
    });
  }

  // ゲームオーバー音
  playGameOver() {
    this.initContext();
    const notes = [300, 260, 220, 180];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sawtooth', 0.2, 0.15);
      }, idx * 120);
    });
  }
}

const sounds = new SoundManager();
