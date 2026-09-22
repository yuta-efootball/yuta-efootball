// config.js
// UI/計算設定。データ本体は players.csv / coaches.json / coachAptitude.json / boosters.json に分離。
window.APP_CONFIG = {
  groups: [
    { id: "finishing", name: "シュート", icon: "shoot", stats: ["finishing", "placeKicking", "curl"] },
    { id: "passing", name: "パス", icon: "pass", stats: ["lowPass", "loftedPass"] },
    { id: "dribbling", name: "ドリブル", icon: "dribble", stats: ["dribbling", "ballControl", "ballKeeping"] },
    { id: "acceleration", name: "瞬発", icon: "quickness", stats: ["offensiveAwareness", "acceleration", "bodyControl"] },
    { id: "legs", name: "脚力", icon: "lower-body", stats: ["kickingPower", "speed", "stamina"] },
    { id: "physical", name: "フィジカル", icon: "physical", stats: ["heading", "jump", "physicalContact"] },
    { id: "defense", name: "ディフェンス", icon: "defense", stats: ["defensiveAwareness", "ballWinning", "aggression", "defensiveEngagement"] },
    { id: "gk1", name: "GK1", icon: "gk1", stats: ["gkAwareness", "jump"] },
    { id: "gk2", name: "GK2", icon: "gk2", stats: ["clearing", "reflexes"] },
    { id: "gk3", name: "GK3", icon: "gk3", stats: ["catching", "coverage"] }
  ],
  stats: [
    ["offensiveAwareness","オフェンスセンス"],
    ["ballControl","ボールコントロール"],
    ["dribbling","ドリブル"],
    ["ballKeeping","ボールキープ"],
    ["lowPass","グラウンダーパス"],
    ["loftedPass","フライパス"],
    ["finishing","決定力"],
    ["heading","ヘディング"],
    ["placeKicking","プレースキック"],
    ["curl","カーブ"],
    ["defensiveAwareness","ディフェンスセンス"],
    ["ballWinning","ボール奪取"],
    ["aggression","アグレッシブネス"],
    ["defensiveEngagement","守備意識"],
    ["gkAwareness","GKセンス"],
    ["catching","キャッチング"],
    ["clearing","クリアリング"],
    ["coverage","コラプシング"],
    ["reflexes","ディフレクティング"],
    ["speed","スピード"],
    ["acceleration","瞬発力"],
    ["kickingPower","キック力"],
    ["jump","ジャンプ"],
    ["physicalContact","フィジカルコンタクト"],
    ["bodyControl","ボディコントロール"],
    ["stamina","スタミナ"]
  ],
  personalityOptions: {
    weakFootFrequency: ["やや低い","普通","高い","最高"],
    weakFootAccuracy: ["やや低い","普通","高い","最高"],
    conditionWave: ["小さい","普通","大きい"]
  },
  attackTypes: ["未選択"],
  edgeStats: [
    "offensiveAwareness","ballControl","dribbling","ballKeeping","lowPass","loftedPass",
    "finishing","heading","placeKicking","curl","speed","acceleration","kickingPower",
    "jump","physicalContact","bodyControl","stamina","defensiveAwareness","defensiveEngagement",
    "ballWinning","aggression","gkAwareness","catching","clearing","coverage","reflexes"
  ],
  talent: {
    // 振り分け値 k の能力上昇は、各ポイントの消費段階の累積。
    // 1-4: cost 1, 5-8: cost 2, ... => growth = k - floor(k/4)
    costPerPoint(k) { return Math.ceil(k / 4); },
    growth(k) { return k - Math.floor(k / 4); }
  },
  colors: {
    low: "#d83a3a",
    mid: "#ef8c24",
    high: "#9bcf3b",
    elite: "#176b2c"
  },
  personalityColors: {
    weakFootFrequency: { "やや低い":"#d83a3a", "普通":"#ef8c24", "高い":"#9bcf3b", "最高":"#176b2c" },
    weakFootAccuracy: { "やや低い":"#d83a3a", "普通":"#ef8c24", "高い":"#9bcf3b", "最高":"#176b2c" },
    conditionWave: { "大きい":"#d83a3a", "普通":"#ef8c24", "小さい":"#9bcf3b" }
  }
};

// file:// 直開きでも画面を確認できるようにするための最小フォールバック。
// GitHub Pages等でホストした場合は外部データファイルが優先されます。
window.APP_FALLBACK = {
  players: [
    {
      name:"クヴァラツヘリア", cardName:"クヴァラツヘリア", foot:"右", height:183,
      weakFootFrequency:"高い", weakFootAccuracy:"最高", conditionWave:"小さい",
      talentPoints:60, attackType:"未選択", offensivePlayingStyle:"ウイングストライカー",
      defensivePlayingStyle:"ファーストディフェンダー", ownedBoosters:[], liveLinkTargets:[],
      offensiveAwareness:73, ballControl:79, dribbling:80, ballKeeping:79,
      lowPass:70, loftedPass:68, finishing:75, heading:49, placeKicking:66, curl:76,
      defensiveAwareness:50, ballWinning:53, aggression:60, defensiveEngagement:56,
      gkAwareness:40, catching:40, clearing:40, coverage:40, reflexes:40,
      speed:77, acceleration:81, kickingPower:77, jump:54, physicalContact:74,
      bodyControl:79, stamina:73
    }
  ],
  coaches: [
    { id:"mourinho", name:"モウリーニョ", boosts:{finishing:1, aggression:1} }
  ],
  coachAptitude: {
    "90":[
      {min:40,max:55,bonus:1},{min:56,max:82,bonus:2},{min:83,max:null,bonus:3}
    ],
    "89":[
      {min:40,max:55,bonus:1},{min:56,max:83,bonus:2},{min:84,max:null,bonus:3}
    ],
    "88":[
      {min:40,max:56,bonus:1},{min:57,max:84,bonus:2},{min:85,max:null,bonus:3}
    ]
  },
  boosters: {
    "オフザボール":["offensiveAwareness","speed","acceleration","stamina"],
    "バランサー":["offensiveAwareness","acceleration","defensiveAwareness","stamina"],
    "ストライカーセンス":["offensiveAwareness","ballControl","finishing","acceleration"],
    "シュート":["ballControl","finishing","kickingPower","physicalContact"],
    "ボールプロテクション":["ballControl","ballKeeping","physicalContact","bodyControl"],
    "ファンタジスタ":["ballControl","dribbling","finishing","bodyControl"],
    "テクニック":["ballControl","dribbling","ballKeeping","lowPass"],
    "ボールキャリー":["dribbling","ballKeeping","speed","bodyControl"],
    "レジスタ":["ballKeeping","lowPass","defensiveAwareness","ballWinning"],
    "パス":["lowPass","loftedPass","curl","kickingPower"],
    "クロス":["loftedPass","curl","speed","stamina"],
    "フリーキック":["finishing","placeKicking","curl","kickingPower"],
    "エアリアル":["finishing","heading","jump","physicalContact"],
    "エアリアルブロック":["heading","defensiveAwareness","jump","physicalContact"],
    "アジリティ":["speed","acceleration","bodyControl","stamina"],
    "デュエル":["defensiveAwareness","ballWinning","speed","stamina"],
    "シャットダウン":["defensiveAwareness","ballWinning","defensiveEngagement","speed"],
    "ディフェンス":["defensiveAwareness","ballWinning","acceleration","jump"],
    "ハードワーク":["aggression","acceleration","physicalContact","stamina"],
    "フィジカル":["jump","physicalContact","bodyControl","stamina"],
    "ゴールキーピング":["gkAwareness","catching","clearing","coverage"],
    "ゴールセービング":["gkAwareness","clearing","coverage","reflexes"]
  }
};
