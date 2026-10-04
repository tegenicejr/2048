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

// 多言語テキスト辞書（8言語対応）
const I18N = {
  en: {
    backToGamesClub: '‹ Back to Clubhouse',
    subtitle: 'Merge the tiles to reach the legend.',
    selectSize: 'Select Board Size',
    startGame: 'Start Game',
    resumeGame: 'Resume',
    collection: 'Collection',
    howToPlay: 'How to Play',
    settings: '⚙️ Settings',
    backToTitle: '‹ Title',
    score: 'SCORE',
    best: 'BEST',
    moves: 'MOVES',
    time: 'TIME',
    undo: 'Undo',
    restart: 'Restart',
    post: 'Share on X',
    keepPlaying: 'Keep Going',
    retry: 'Retry',
    close: 'Close',
    understood: 'Got It!',
    winMsg: 'You Win! 2048 Reached!',
    gameOverMsg: 'Game Over!',
    maxTile: 'Max Tile',
    settingsTitle: '⚙️ Settings',
    langLabel: 'Language',
    soundLabel: 'Sound FX',
    vibLabel: 'Vibration',
    speedLabel: 'Speed',
    speedNormal: 'Normal',
    speedFast: 'Fast',
    resetData: 'Reset Data',
    collectionTitle: 'Tile Collection',
    collectionDesc: 'Tiles reached during gameplay will be unlocked here.',
    helpTitle: 'How to Play',
    step1Title: 'Swipe to Move',
    step1Desc: 'Swipe in any direction (or use Arrow keys on PC) to slide all tiles.',
    step2Title: 'Merge Tiles',
    step2Desc: 'When two tiles with the same number touch, they merge into one with double value.',
    step3Title: 'Reach 2048!',
    step3Desc: 'When no moves are possible, game is over. Reach 2048 and continue into endless mode!',
    confirmStartGameTitle: 'Start New Game?',
    confirmStartGameDesc: 'Your previous saved progress will be overwritten.',
    confirmRestartTitle: 'Restart Game?',
    confirmRestartDesc: 'Your current score and board progress will be reset.',
    confirmModeTitle: 'Change Board Size?',
    confirmModeDesc: (size) => `Changing to ${size}×${size} will reset your saved progress.`,
    confirmTitleBackTitle: 'Return to Title?',
    confirmTitleBackDesc: 'Your current board progress will be automatically saved.',
    confirmResetDataTitle: 'Reset All Data?',
    confirmResetDataDesc: 'Your best scores and unlocked tiles will be permanently deleted.',
    confirmBtn: 'Confirm',
    confirmStartBtn: 'Start',
    confirmBackBtn: 'Back',
    confirmResetBtn: 'Reset',
    cancel: 'Cancel',
    shareWin: '【2048 CLEARED!】',
    shareOver: '【GAME OVER】',
    shareScore: 'Score',
    shareBoard: 'Board',
    shareMax: 'Max Tile',
    shareStats: (moves, time) => `Moves: ${moves} | Time: ${time}`
  },
  ja: {
    backToGamesClub: '‹ CLUB HOUSEへ戻る',
    subtitle: 'タイルを重ねて、伝説の数字へ。',
    selectSize: '盤面サイズを選択',
    startGame: 'ゲームスタート',
    resumeGame: 'つづきから',
    collection: 'コレクション',
    howToPlay: 'あそびかた',
    settings: '⚙️ 設定',
    backToTitle: '‹ タイトルへ',
    score: 'SCORE',
    best: 'BEST',
    moves: 'MOVES',
    time: 'TIME',
    undo: '1手戻す',
    restart: 'やり直す',
    post: 'ポストする',
    keepPlaying: '続ける',
    retry: 'もう一度',
    close: 'とじる',
    understood: 'わかった！',
    winMsg: 'You Win! 2048達成!',
    gameOverMsg: 'Game Over!',
    maxTile: '最高タイル',
    settingsTitle: '⚙️ 設定',
    langLabel: '言語 (Language)',
    soundLabel: '効果音 (Sound FX)',
    vibLabel: '振動 (Vibration)',
    speedLabel: '速度 (Speed)',
    speedNormal: '通常',
    speedFast: '高速',
    resetData: 'データ初期化',
    collectionTitle: 'タイルコレクション',
    collectionDesc: 'ゲーム内で合体させて到達したタイルが解放されます。',
    helpTitle: 'あそびかた',
    step1Title: 'スワイプでスライド',
    step1Desc: '上下左右にスワイプ（PCは矢印キー）すると、すべてのタイルが一斉に動きます。',
    step2Title: '同じ数字を合体',
    step2Desc: '同じ数字同士がぶつかると合体して2倍の数字に進化します。',
    step3Title: '「2048」を目指そう！',
    step3Desc: 'マスが埋まって動かせなくなるとゲームオーバー。2048完成後もエンドレスに挑戦可能です！',
    confirmStartGameTitle: '新しく始めますか？',
    confirmStartGameDesc: '前回のプレイデータは上書きされ、<br>最初からスタートします。',
    confirmRestartTitle: 'やり直しますか？',
    confirmRestartDesc: '現在のスコアと盤面の進行状況が<br>リセットされます。',
    confirmModeTitle: '盤面を変更しますか？',
    confirmModeDesc: (size) => `盤面を${size}×${size}に変更すると、<br>保存されている進行状況はリセットされます。`,
    confirmTitleBackTitle: 'タイトルへ戻りますか？',
    confirmTitleBackDesc: '現在の進行状況は自動保存されます。',
    confirmResetDataTitle: 'データを初期化しますか？',
    confirmResetDataDesc: 'ハイスコアやコレクションの解放状況がすべて消去されます。元には戻せません。',
    confirmBtn: '変更する',
    confirmStartBtn: 'はじめる',
    confirmBackBtn: 'もどる',
    confirmResetBtn: '初期化する',
    cancel: 'キャンセル',
    shareWin: '【2048達成！】',
    shareOver: '【ゲームオーバー】',
    shareScore: 'スコア',
    shareBoard: '盤面',
    shareMax: '最高タイル',
    shareStats: (moves, time) => `手数: ${moves}手 | タイム: ${time}`
  },
  'zh-CN': {
    backToGamesClub: '‹ 返回大厅',
    subtitle: '合并方块，挑战传说中的数字。',
    selectSize: '选择棋盘大小',
    startGame: '开始游戏',
    resumeGame: '继续游戏',
    collection: '收藏馆',
    howToPlay: '游戏玩法',
    settings: '⚙️ 设置',
    backToTitle: '‹ 返回标题',
    score: '得分',
    best: '最佳',
    moves: '步数',
    time: '时间',
    undo: '撤销一步',
    restart: '重新开始',
    post: '分享至 X',
    keepPlaying: '继续挑战',
    retry: '再试一次',
    close: '关闭',
    understood: '知道了！',
    winMsg: '获胜！达成2048！',
    gameOverMsg: '游戏结束！',
    maxTile: '最高方块',
    settingsTitle: '⚙️ 设置',
    langLabel: '语言',
    soundLabel: '音效',
    vibLabel: '震动',
    speedLabel: '动画速度',
    speedNormal: '正常',
    speedFast: '快速',
    resetData: '清除所有数据',
    collectionTitle: '方块图鉴',
    collectionDesc: '合成并解锁游戏中出现的所有数字方块。',
    helpTitle: '游戏规则',
    step1Title: '滑动移动',
    step1Desc: '向上下左右任意方向滑动以移动所有方块。',
    step2Title: '合并数字',
    step2Desc: '相同数字的方块碰撞后会合成为两倍数值的新方块。',
    step3Title: '目标2048！',
    step3Desc: '所有格子占满且无法合并时游戏结束。达成2048后可继续无尽模式！',
    confirmStartGameTitle: '开始新游戏？',
    confirmStartGameDesc: '之前的存档将被覆盖，从头开始。',
    confirmRestartTitle: '重新开始？',
    confirmRestartDesc: '当前的分数与棋盘进度将被重置。',
    confirmModeTitle: '更换棋盘大小？',
    confirmModeDesc: (size) => `切换为${size}×${size}将重置当前保存的进度。`,
    confirmTitleBackTitle: '返回标题界面？',
    confirmTitleBackDesc: '当前进度将会自动保存。',
    confirmResetDataTitle: '重置所有数据？',
    confirmResetDataDesc: '最高记录与已解锁的方块将全部清除且无法恢复。',
    confirmBtn: '确认更换',
    confirmStartBtn: '开始',
    confirmBackBtn: '返回',
    confirmResetBtn: '重置',
    cancel: '取消',
    shareWin: '【达成2048！】',
    shareOver: '【游戏结束】',
    shareScore: '得分',
    shareBoard: '棋盘',
    shareMax: '最高方块',
    shareStats: (moves, time) => `步数: ${moves} | 耗时: ${time}`
  },
  'zh-TW': {
    backToGamesClub: '‹ 返回大廳',
    subtitle: '合併方塊，挑戰傳說中的數字。',
    selectSize: '選擇棋盤大小',
    startGame: '開始遊戲',
    resumeGame: '繼續遊戲',
    collection: '收藏館',
    howToPlay: '遊戲玩法',
    settings: '⚙️ 設定',
    backToTitle: '‹ 返回標題',
    score: '得分',
    best: '最佳',
    moves: '步數',
    time: '時間',
    undo: '復原一步',
    restart: '重新開始',
    post: '分享至 X',
    keepPlaying: '繼續挑戰',
    retry: '再試一次',
    close: '關閉',
    understood: '知道了！',
    winMsg: '獲勝！達成2048！',
    gameOverMsg: '遊戲結束！',
    maxTile: '最高方塊',
    settingsTitle: '⚙️ 設定',
    langLabel: '語言',
    soundLabel: '音效',
    vibLabel: '震動',
    speedLabel: '動畫速度',
    speedNormal: '正常',
    speedFast: '快速',
    resetData: '清除所有資料',
    collectionTitle: '方塊圖鑑',
    collectionDesc: '合成並解鎖遊戲中出現的所有數字方塊。',
    helpTitle: '遊戲規則',
    step1Title: '滑動移動',
    step1Desc: '向上下左右任意方向滑動以移動所有方塊。',
    step2Title: '合併數字',
    step2Desc: '相同數字的方塊碰撞後會合併為兩倍數值的新方塊。',
    step3Title: '目標2048！',
    step3Desc: '所有格子佔滿且無法合併時遊戲結束。達成2048後可繼續無盡模式！',
    confirmStartGameTitle: '開始新遊戲？',
    confirmStartGameDesc: '先前的存檔將被覆蓋，從頭開始。',
    confirmRestartTitle: '重新開始？',
    confirmRestartDesc: '當前的分數與棋盤進度將被重設。',
    confirmModeTitle: '更換棋盤大小？',
    confirmModeDesc: (size) => `切換為${size}×${size}將重設當前保存的進度。`,
    confirmTitleBackTitle: '返回標題畫面？',
    confirmTitleBackDesc: '當前進度將會自動保存。',
    confirmResetDataTitle: '重設所有資料？',
    confirmResetDataDesc: '最高紀錄與已解鎖的方塊將全部清除且無法復原。',
    confirmBtn: '確認更換',
    confirmStartBtn: '開始',
    confirmBackBtn: '返回',
    confirmResetBtn: '重設',
    cancel: '取消',
    shareWin: '【達成2048！】',
    shareOver: '【遊戲結束】',
    shareScore: '得分',
    shareBoard: '棋盤',
    shareMax: '最高方塊',
    shareStats: (moves, time) => `步數: ${moves} | 耗時: ${time}`
  },
  ko: {
    backToGamesClub: '‹ 클럽하우스로 돌아가기',
    subtitle: '타일을 합쳐 전설의 숫자에 도달하세요.',
    selectSize: '보드 크기 선택',
    startGame: '게임 시작',
    resumeGame: '이어하기',
    collection: '컬렉션',
    howToPlay: '게임 방법',
    settings: '⚙️ 설정',
    backToTitle: '‹ 타이틀로',
    score: '점수',
    best: '최고 점수',
    moves: '이동 수',
    time: '시간',
    undo: '한 수 무르기',
    restart: '다시 시작',
    post: 'X에 공유하기',
    keepPlaying: '계속하기',
    retry: '다시 도전',
    close: '닫기',
    understood: '확인!',
    winMsg: '승리! 2048 달성!',
    gameOverMsg: '게임 오버!',
    maxTile: '최고 타일',
    settingsTitle: '⚙️ 설정',
    langLabel: '언어',
    soundLabel: '효과음',
    vibLabel: '진동',
    speedLabel: '애니메이션 속도',
    speedNormal: '보통',
    speedFast: '빠름',
    resetData: '데이터 초기화',
    collectionTitle: '타일 컬렉션',
    collectionDesc: '게임 중 달성한 타일이 여기에 잠금 해제됩니다.',
    helpTitle: '게임 방법',
    step1Title: '스와이프하여 이동',
    step1Desc: '상하좌우로 스와이프하여 모든 타일을 한 번에 이동합니다.',
    step2Title: '같은 숫자 합치기',
    step2Desc: '같은 숫자의 타일이 부딪히면 합쳐져 2배의 타일이 됩니다.',
    step3Title: '2048에 도전하세요!',
    step3Desc: '더 이상 이동할 수 없으면 게임 오버입니다. 2048 이후에도 끝없이 도전 가능합니다!',
    confirmStartGameTitle: '새 게임을 시작할까요?',
    confirmStartGameDesc: '이전 저장 데이터가 덮어씌워지고 처음부터 시작됩니다.',
    confirmRestartTitle: '다시 시작할까요?',
    confirmRestartDesc: '현재 점수와 진행 상황이 초기화됩니다.',
    confirmModeTitle: '보드 크기를 변경할까요?',
    confirmModeDesc: (size) => `${size}×${size} 크기로 변경하면 저장된 진행 상황이 초기화됩니다.`,
    confirmTitleBackTitle: '타이틀로 돌아갈까요?',
    confirmTitleBackDesc: '현재 진행 상황은 자동 저장됩니다.',
    confirmResetDataTitle: '모든 데이터를 초기화할까요?',
    confirmResetDataDesc: '최고 점수와 해금된 컬렉션이 영구적으로 삭제됩니다.',
    confirmBtn: '변경',
    confirmStartBtn: '시작',
    confirmBackBtn: '돌아가기',
    confirmResetBtn: '초기화',
    cancel: '취소',
    shareWin: '【2048 달성!】',
    shareOver: '【게임 오버】',
    shareScore: '점수',
    shareBoard: '보드',
    shareMax: '최고 타일',
    shareStats: (moves, time) => `이동 수: ${moves} | 시간: ${time}`
  },
  es: {
    backToGamesClub: '‹ Volver a Clubhouse',
    subtitle: 'Combina fichas para alcanzar la leyenda.',
    selectSize: 'Seleccionar tablero',
    startGame: 'Jugar',
    resumeGame: 'Continuar',
    collection: 'Colección',
    howToPlay: 'Cómo jugar',
    settings: '⚙️ Ajustes',
    backToTitle: '‹ Inicio',
    score: 'PUNTOS',
    best: 'RÉCORD',
    moves: 'PASOS',
    time: 'TIEMPO',
    undo: 'Deshacer',
    restart: 'Reiniciar',
    post: 'Compartir en X',
    keepPlaying: 'Continuar',
    retry: 'Reintentar',
    close: 'Cerrar',
    understood: '¡Entendido!',
    winMsg: '¡Victoria! ¡2048 alcanzado!',
    gameOverMsg: '¡Fin de la partida!',
    maxTile: 'Ficha máx.',
    settingsTitle: '⚙️ Ajustes',
    langLabel: 'Idioma',
    soundLabel: 'Efectos de sonido',
    vibLabel: 'Vibración',
    speedLabel: 'Velocidad',
    speedNormal: 'Normal',
    speedFast: 'Rápido',
    resetData: 'Restablecer datos',
    collectionTitle: 'Colección de fichas',
    collectionDesc: 'Las fichas desbloqueadas se mostrarán aquí.',
    helpTitle: 'Cómo jugar',
    step1Title: 'Desliza para mover',
    step1Desc: 'Desliza en cualquier dirección para mover todas las fichas.',
    step2Title: 'Combina fichas',
    step2Desc: 'Cuando dos fichas con el mismo número chocan, se fusionan duplicando su valor.',
    step3Title: '¡Llega a 2048!',
    step3Desc: 'El juego termina cuando no quedan movimientos. ¡Puedes seguir jugando tras lograr 2048!',
    confirmStartGameTitle: '¿Empezar partida nueva?',
    confirmStartGameDesc: 'Se sobrescribirá la partida guardada anterior.',
    confirmRestartTitle: '¿Reiniciar partida?',
    confirmRestartDesc: 'Tu puntuación y progreso actual se perderán.',
    confirmModeTitle: '¿Cambiar tamaño?',
    confirmModeDesc: (size) => `Cambiar a ${size}×${size} reiniciará tu progreso guardado.`,
    confirmTitleBackTitle: '¿Volver al inicio?',
    confirmTitleBackDesc: 'El progreso actual se guardará automáticamente.',
    confirmResetDataTitle: '¿Borrar todos los datos?',
    confirmResetDataDesc: 'Los récords y las fichas desbloqueadas se borrarán de forma permanente.',
    confirmBtn: 'Cambiar',
    confirmStartBtn: 'Empezar',
    confirmBackBtn: 'Volver',
    confirmResetBtn: 'Borrar',
    cancel: 'Cancelar',
    shareWin: '【¡2048 SUPERADO!】',
    shareOver: '【FIN DE LA PARTIDA】',
    shareScore: 'Puntuación',
    shareBoard: 'Tablero',
    shareMax: 'Ficha máxima',
    shareStats: (moves, time) => `Movimientos: ${moves} | Tiempo: ${time}`
  },
  fr: {
    backToGamesClub: '‹ Retour au Clubhouse',
    subtitle: 'Fusionnez les tuiles pour atteindre la légende.',
    selectSize: 'Taille du plateau',
    startGame: 'Jouer',
    resumeGame: 'Reprendre',
    collection: 'Collection',
    howToPlay: 'Comment jouer',
    settings: '⚙️ Paramètres',
    backToTitle: '‹ Accueil',
    score: 'SCORE',
    best: 'RECORD',
    moves: 'COUPS',
    time: 'TEMPS',
    undo: 'Annuler',
    restart: 'Recommencer',
    post: 'Partager sur X',
    keepPlaying: 'Continuer',
    retry: 'Réessayer',
    close: 'Fermer',
    understood: 'Compris !',
    winMsg: 'Victoire ! 2048 atteint !',
    gameOverMsg: 'Partie terminée !',
    maxTile: 'Tuile max',
    settingsTitle: '⚙️ Paramètres',
    langLabel: 'Langue',
    soundLabel: 'Effets sonores',
    vibLabel: 'Vibration',
    speedLabel: 'Vitesse',
    speedNormal: 'Normale',
    speedFast: 'Rapide',
    resetData: 'Réinitialiser les données',
    collectionTitle: 'Collection de tuiles',
    collectionDesc: 'Les tuiles débloquées en jeu apparaissent ici.',
    helpTitle: 'Règles du jeu',
    step1Title: 'Glissez pour déplacer',
    step1Desc: 'Faites glisser dans n’importe quelle direction pour bouger les tuiles.',
    step2Title: 'Fusionnez les tuiles',
    step2Desc: 'Deux tuiles identiques qui se touchent fusionnent et doublent leur valeur.',
    step3Title: 'Atteignez 2048 !',
    step3Desc: 'La partie est finie si aucun coup n’est possible. Vous pouvez continuer après 2048 !',
    confirmStartGameTitle: 'Nouvelle partie ?',
    confirmStartGameDesc: 'Votre sauvegarde précédente sera écrasée.',
    confirmRestartTitle: 'Recommencer ?',
    confirmRestartDesc: 'Votre score et le plateau actuel seront réinitialisés.',
    confirmModeTitle: 'Changer la taille ?',
    confirmModeDesc: (size) => `Passer à ${size}×${size} réinitialisera votre partie en cours.`,
    confirmTitleBackTitle: 'Retourner au menu ?',
    confirmTitleBackDesc: 'Votre progression actuelle est sauvegardée automatiquement.',
    confirmResetDataTitle: 'Effacer toutes les données ?',
    confirmResetDataDesc: 'Vos records et tuiles débloquées seront supprimés définitivement.',
    confirmBtn: 'Changer',
    confirmStartBtn: 'Commencer',
    confirmBackBtn: 'Retour',
    confirmResetBtn: 'Effacer',
    cancel: 'Annuler',
    shareWin: '【2048 ATTEINT !】',
    shareOver: '【PARTIE TERMINÉE】',
    shareScore: 'Score',
    shareBoard: 'Plateau',
    shareMax: 'Tuile max',
    shareStats: (moves, time) => `Coups: ${moves} | Temps: ${time}`
  },
  pt: {
    backToGamesClub: '‹ Voltar ao Clubhouse',
    subtitle: 'Junte as peças até alcançar a lendária.',
    selectSize: 'Tamanho do tabuleiro',
    startGame: 'Jogar',
    resumeGame: 'Continuar',
    collection: 'Coleção',
    howToPlay: 'Como jogar',
    settings: '⚙️ Configurações',
    backToTitle: '‹ Início',
    score: 'PONTOS',
    best: 'RECORDE',
    moves: 'JOGADAS',
    time: 'TEMPO',
    undo: 'Desfazer',
    restart: 'Reiniciar',
    post: 'Compartilhar no X',
    keepPlaying: 'Continuar',
    retry: 'Tentar de novo',
    close: 'Fechar',
    understood: 'Entendi!',
    winMsg: 'Vitória! 2048 alcançado!',
    gameOverMsg: 'Fim de jogo!',
    maxTile: 'Peça máxima',
    settingsTitle: '⚙️ Configurações',
    langLabel: 'Idioma',
    soundLabel: 'Efeitos sonoros',
    vibLabel: 'Vibração',
    speedLabel: 'Velocidade',
    speedNormal: 'Normal',
    speedFast: 'Rápido',
    resetData: 'Redefinir dados',
    collectionTitle: 'Coleção de peças',
    collectionDesc: 'Peças desbloqueadas durante as partidas aparecem aqui.',
    helpTitle: 'Como jogar',
    step1Title: 'Deslize para mover',
    step1Desc: 'Deslize em qualquer direção para mover todas as peças.',
    step2Title: 'Junte as peças',
    step2Desc: 'Quando duas peças iguais colidem, elas se fundem dobrando seu valor.',
    step3Title: 'Alcance 2048!',
    step3Desc: 'O jogo acaba quando não há jogadas possíveis. Continue no modo infinito após o 2048!',
    confirmStartGameTitle: 'Novo jogo?',
    confirmStartGameDesc: 'O jogo salvo anterior será substituído.',
    confirmRestartTitle: 'Reiniciar jogo?',
    confirmRestartDesc: 'Sua pontuação e progresso atual serão zerados.',
    confirmModeTitle: 'Mudar tamanho?',
    confirmModeDesc: (size) => `Mudar para ${size}×${size} apagará seu jogo salvo.`,
    confirmTitleBackTitle: 'Voltar ao início?',
    confirmTitleBackDesc: 'Seu progresso atual será salvo automaticamente.',
    confirmResetDataTitle: 'Apagar todos os dados?',
    confirmResetDataDesc: 'Seus recordes e peças desbloqueadas serão excluídos permanentemente.',
    confirmBtn: 'Mudar',
    confirmStartBtn: 'Começar',
    confirmBackBtn: 'Voltar',
    confirmResetBtn: 'Apagar',
    cancel: 'Cancelar',
    shareWin: '【2048 CONCLUÍDO!】',
    shareOver: '【FIM DE JOGO】',
    shareScore: 'Pontos',
    shareBoard: 'Tabuleiro',
    shareMax: 'Peça máxima',
    shareStats: (moves, time) => `Jogadas: ${moves} | Tempo: ${time}`
  }
};

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

    // デフォルトは英語（保存値がなければ 'en'）
    this.currentLang = localStorage.getItem('2048_lang') || 'en';
    this.isMuted = localStorage.getItem('2048_muted') === 'true';
    this.isVibrationEnabled = localStorage.getItem('2048_vibration') !== 'false';
    this.animSpeed = localStorage.getItem('2048_speed') || 'normal';

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
    this.startTopBackLink = document.getElementById('start-top-back-link');
    this.startSubtitle = document.getElementById('start-subtitle');
    this.startModeLabel = document.getElementById('start-mode-label');
    this.startGameBtn = document.getElementById('start-game-btn');
    this.startContinueBtn = document.getElementById('start-continue-btn');
    this.startHelpBtn = document.getElementById('start-help-btn');
    this.collectionBtn = document.getElementById('collection-btn');
    this.settingsBtn = document.getElementById('settings-btn');
    this.startModeButtons = document.querySelectorAll('.start-mode-btn');
    this.backToTitleBtn = document.getElementById('back-to-title-btn');

    // 設定モーダル
    this.settingsModal = document.getElementById('settings-modal');
    this.closeSettingsBtn = document.getElementById('close-settings-btn');
    this.closeSettingsBottomBtn = document.getElementById('close-settings-bottom-btn');
    this.langSelect = document.getElementById('lang-select');
    this.soundOnBtn = document.getElementById('sound-on-btn');
    this.soundOffBtn = document.getElementById('sound-off-btn');
    this.vibOnBtn = document.getElementById('vib-on-btn');
    this.vibOffBtn = document.getElementById('vib-off-btn');
    this.speedNormalBtn = document.getElementById('speed-normal-btn');
    this.speedFastBtn = document.getElementById('speed-fast-btn');
    this.resetDataBtn = document.getElementById('reset-data-btn');

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

    this.applyLanguage();
    this.updateSoundButtonState();
    this.updateSettingsUI();
    this.checkSavedGame();
    this.initEventListeners();
    this.initGameFromSaveOrNew();
  }

  applyLanguage() {
    const t = I18N[this.currentLang] || I18N.en;
    document.documentElement.lang = this.currentLang;

    this.startTopBackLink.textContent = t.backToGamesClub;
    this.startSubtitle.textContent = t.subtitle;
    this.startModeLabel.textContent = t.selectSize;
    this.startGameBtn.textContent = t.startGame;
    if (this.startContinueBtn) this.startContinueBtn.textContent = t.resumeGame;
    this.collectionBtn.textContent = t.collection;
    this.startHelpBtn.textContent = t.howToPlay;
    this.settingsBtn.textContent = t.settings;
    this.backToTitleBtn.textContent = t.backToTitle;

    document.getElementById('label-score').textContent = t.score;
    document.getElementById('label-best').textContent = t.best;
    document.getElementById('label-moves').textContent = t.moves;
    document.getElementById('label-time').textContent = t.time;

    this.howToPlayBtn.textContent = t.howToPlay;
    this.undoBtn.textContent = t.undo;
    this.restartBtn.textContent = t.restart;

    this.shareScoreBtn.textContent = t.post;
    this.keepPlayingBtn.textContent = t.keepPlaying;
    this.retryBtn.textContent = t.retry;

    this.cancelRestartBtn.textContent = t.cancel;

    document.getElementById('settings-title').textContent = t.settingsTitle;
    document.getElementById('setting-lbl-lang').textContent = t.langLabel;
    document.getElementById('setting-lbl-sound').textContent = t.soundLabel;
    document.getElementById('setting-lbl-vibration').textContent = t.vibLabel;
    document.getElementById('setting-lbl-speed').textContent = t.speedLabel;
    this.speedNormalBtn.textContent = t.speedNormal;
    this.speedFastBtn.textContent = t.speedFast;
    this.resetDataBtn.textContent = t.resetData;
    this.closeSettingsBottomBtn.textContent = t.close;

    document.getElementById('collection-modal-title').textContent = t.collectionTitle;
    document.getElementById('collection-modal-desc').textContent = t.collectionDesc;
    this.closeCollectionBottomBtn.textContent = t.close;

    document.getElementById('help-modal-title').textContent = t.helpTitle;
    document.getElementById('help-step1-title').textContent = t.step1Title;
    document.getElementById('help-step1-desc').textContent = t.step1Desc;
    document.getElementById('help-step2-title').textContent = t.step2Title;
    document.getElementById('help-step2-desc').textContent = t.step2Desc;
    document.getElementById('help-step3-title').textContent = t.step3Title;
    document.getElementById('help-step3-desc').textContent = t.step3Desc;
    this.gotItBtn.textContent = t.understood;

    if (this.langSelect) {
      this.langSelect.value = this.currentLang;
    }

    this.checkSavedGame();
  }

  updateSettingsUI() {
    if (this.langSelect) {
      this.langSelect.value = this.currentLang;
    }

    this.soundOnBtn.classList.toggle('active', !this.isMuted);
    this.soundOffBtn.classList.toggle('active', this.isMuted);

    this.vibOnBtn.classList.toggle('active', this.isVibrationEnabled);
    this.vibOffBtn.classList.toggle('active', !this.isVibrationEnabled);

    this.speedNormalBtn.classList.toggle('active', this.animSpeed === 'normal');
    this.speedFastBtn.classList.toggle('active', this.animSpeed === 'fast');
  }

  checkSavedGame() {
    const saved = StorageManager.loadCurrentGame();
    const t = I18N[this.currentLang] || I18N.en;
    
    // セーブデータがある場合：上に「つづきから」、下に「ゲームスタート」
    if (saved && !saved.over) {
      if (this.startContinueBtn) {
        this.startContinueBtn.style.display = 'block';
        this.startContinueBtn.textContent = t.resumeGame;
      }
      this.startGameBtn.textContent = t.startGame;
      this.size = saved.size || 4;
      this.syncModeButtons(this.size);
    } else {
      // セーブデータがない場合：「ゲームスタート」のみ
      if (this.startContinueBtn) {
        this.startContinueBtn.style.display = 'none';
      }
      this.startGameBtn.textContent = t.startGame;
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
    this.updateSettingsUI();
  }

  toggleSound(forceVal = null) {
    this.isMuted = forceVal !== null ? forceVal : !this.isMuted;
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
    this.hideSettings();
    StorageManager.clearHistory();
    StorageManager.clearCurrentGame();
    this.updateScore(0, false);
    this.bestScoreDisplay.textContent = StorageManager.getBestScore(this.size);

    this.addRandomTile();
    this.addRandomTile();
    this.render();
    this.checkSavedGame();
  }

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
    this.hideSettings();
  }

  startGame(resume = false) {
    if (resume) {
      this.launchGame();
      return;
    }

    const saved = StorageManager.loadCurrentGame();
    if (saved && !saved.over) {
      const t = I18N[this.currentLang] || I18N.en;
      this.showConfirm(
        t.confirmStartGameTitle,
        t.confirmStartGameDesc,
        t.confirmStartBtn,
        () => {
          this.initGame();
          this.launchGame();
        },
        true
      );
      return;
    }

    this.initGame();
    this.launchGame();
  }

  launchGame() {
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
    const t = I18N[this.currentLang] || I18N.en;

    const maxTile = this.getMaxTileValue();
    this.messageStatsSummary.textContent = `${t.score}: ${this.score} | ${t.maxTile}: ${maxTile} | ${t.moves}: ${this.moves} | ${t.time}: ${this.timeDisplay.textContent}`;

    if (won) {
      this.messageText.textContent = t.winMsg;
      this.messageBox.classList.add('game-won');
      this.keepPlayingBtn.style.display = 'inline-block';
    } else {
      this.messageText.textContent = t.gameOverMsg;
      this.messageBox.classList.remove('game-won');
      this.keepPlayingBtn.style.display = 'none';
    }
    this.messageBox.style.display = 'flex';
  }

  shareResult() {
    const t = I18N[this.currentLang] || I18N.en;
    const maxTile = this.getMaxTileValue();
    const isWin = this.won ? t.shareWin : t.shareOver;
    const text = `${isWin} 2048\n${t.shareScore}: ${this.score}\n${t.shareBoard}: ${this.size}×${this.size}\n${t.shareMax}: ${maxTile}\n${t.shareStats(this.moves, this.timeDisplay.textContent)}\n#2048 #GamesClubhouse\n`;
    const url = 'https://tegenicejr.github.io/2048/';
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }

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

  showSettings() {
    this.updateSettingsUI();
    this.settingsModal.style.display = 'flex';
  }

  hideSettings() {
    this.settingsModal.style.display = 'none';
  }

  showConfirm(title, desc, confirmText, action, showIcon = true) {
    const t = I18N[this.currentLang] || I18N.en;
    this.confirmTitle.textContent = title;
    this.confirmDesc.innerHTML = desc;
    this.confirmRestartBtn.textContent = confirmText;
    this.cancelRestartBtn.textContent = t.cancel;
    this.pendingAction = action;

    const iconEl = this.confirmModal.querySelector('.confirm-icon');
    if (iconEl) {
      iconEl.style.display = showIcon ? 'block' : 'none';
    }

    this.confirmModal.style.zIndex = '10005';
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
    const t = I18N[this.currentLang] || I18N.en;
    if (this.score > 0 || this.hasMoved) {
      this.showConfirm(
        t.confirmRestartTitle,
        t.confirmRestartDesc,
        t.restart,
        () => this.initGame(),
        true
      );
    } else {
      this.initGame();
    }
  }

  handleModeChangeRequest(newSize) {
    if (newSize === this.size) return;
    const t = I18N[this.currentLang] || I18N.en;
    const saved = StorageManager.loadCurrentGame();

    if ((saved && !saved.over) || this.score > 0 || this.hasMoved) {
      this.showConfirm(
        t.confirmModeTitle,
        t.confirmModeDesc(newSize),
        t.confirmBtn,
        () => this.changeSize(newSize),
        true
      );
    } else {
      this.changeSize(newSize);
    }
  }

  handleBackToTitleRequest() {
    const t = I18N[this.currentLang] || I18N.en;
    if (this.score > 0 || this.hasMoved) {
      this.showConfirm(
        t.confirmTitleBackTitle,
        t.confirmTitleBackDesc,
        t.confirmBackBtn,
        () => {
          this.autoSave();
          this.showStartScreen();
        },
        false
      );
    } else {
      this.showStartScreen();
    }
  }

  handleResetDataRequest() {
    const t = I18N[this.currentLang] || I18N.en;
    this.showConfirm(
      t.confirmResetDataTitle,
      t.confirmResetDataDesc,
      t.confirmResetBtn,
      () => {
        localStorage.clear();
        this.currentLang = 'en';
        this.isMuted = false;
        this.isVibrationEnabled = true;
        this.animSpeed = 'normal';
        this.hideSettings();
        this.applyLanguage();
        this.updateSettingsUI();
        this.initGame();
        this.showStartScreen();
      },
      true
    );
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
    if (!this.isVibrationEnabled) return;
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
    const transitionDuration = this.animSpeed === 'fast' ? '50ms' : '100ms';

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
      el.style.transition = `transform ${transitionDuration} ease-in-out`;
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
      (this.collectionModal && this.collectionModal.style.display === 'flex') ||
      (this.settingsModal && this.settingsModal.style.display === 'flex')
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

      const moveDelay = this.animSpeed === 'fast' ? 55 : 105;

      setTimeout(() => {
        StorageManager.saveState(previousGrid, previousScore);
        this.updateScore(scoreGained);
        this.addRandomTile();
        this.render();
        this.autoSave();
        this.checkGameState();
        this.isMoving = false;
      }, moveDelay);
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

    // ゲームスタート
    const handleStart = (e) => {
      e.preventDefault();
      this.startGame(false);
    };
    this.startGameBtn.addEventListener('click', handleStart);
    this.startGameBtn.addEventListener('touchend', handleStart);

    // つづきから
    if (this.startContinueBtn) {
      const handleContinue = (e) => {
        e.preventDefault();
        this.startGame(true);
      };
      this.startContinueBtn.addEventListener('click', handleContinue);
      this.startContinueBtn.addEventListener('touchend', handleContinue);
    }

    const handleStartHelp = (e) => {
      e.preventDefault();
      this.showHelp();
    };
    this.startHelpBtn.addEventListener('click', handleStartHelp);
    this.startHelpBtn.addEventListener('touchend', handleStartHelp);

    const handleCollection = (e) => {
      e.preventDefault();
      this.showCollection();
    };
    this.collectionBtn.addEventListener('click', handleCollection);
    this.collectionBtn.addEventListener('touchend', handleCollection);

    const handleSettings = (e) => {
      e.preventDefault();
      this.showSettings();
    };
    this.settingsBtn.addEventListener('click', handleSettings);
    this.settingsBtn.addEventListener('touchend', handleSettings);

    // 言語切り替えプルダウン
    if (this.langSelect) {
      this.langSelect.addEventListener('change', (e) => {
        this.currentLang = e.target.value;
        localStorage.setItem('2048_lang', this.currentLang);
        this.applyLanguage();
        this.updateSettingsUI();
      });
    }

    this.soundOnBtn.addEventListener('click', () => this.toggleSound(false));
    this.soundOffBtn.addEventListener('click', () => this.toggleSound(true));

    this.vibOnBtn.addEventListener('click', () => {
      this.isVibrationEnabled = true;
      localStorage.setItem('2048_vibration', 'true');
      this.updateSettingsUI();
      this.triggerHaptic('light');
    });
    this.vibOffBtn.addEventListener('click', () => {
      this.isVibrationEnabled = false;
      localStorage.setItem('2048_vibration', 'false');
      this.updateSettingsUI();
    });

    this.speedNormalBtn.addEventListener('click', () => {
      this.animSpeed = 'normal';
      localStorage.setItem('2048_speed', 'normal');
      this.updateSettingsUI();
      this.render();
    });
    this.speedFastBtn.addEventListener('click', () => {
      this.animSpeed = 'fast';
      localStorage.setItem('2048_speed', 'fast');
      this.updateSettingsUI();
      this.render();
    });

    this.resetDataBtn.addEventListener('click', () => this.handleResetDataRequest());

    this.closeSettingsBtn.addEventListener('click', () => this.hideSettings());
    this.closeSettingsBottomBtn.addEventListener('click', () => this.hideSettings());
    this.settingsModal.addEventListener('click', (e) => {
      if (e.target === this.settingsModal) this.hideSettings();
    });

    this.closeCollectionBtn.addEventListener('click', () => this.hideCollection());
    this.closeCollectionBottomBtn.addEventListener('click', () => this.hideCollection());
    this.collectionModal.addEventListener('click', (e) => {
      if (e.target === this.collectionModal) this.hideCollection();
    });

    // 盤面サイズボタン（スタート画面）
    this.startModeButtons.forEach(btn => {
      const handleMode = (e) => {
        e.preventDefault();
        this.handleModeChangeRequest(parseInt(btn.dataset.size));
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

    // 盤面サイズボタン（ゲーム画面内）
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
