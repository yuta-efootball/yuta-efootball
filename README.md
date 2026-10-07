# eFootball タレントデザインシミュレーター v2.9.8

スマートフォンのブラウザで動作する静的HTML/CSS/JS版。

## v2.9.8 更新内容
- 選手CSVを93件から123件へ拡張（新規TPカード30件）。
- 新規カードはGame8の個別選手ページを基準に照合。未確認情報は推測で補完しない方針。
- 4件の重複候補（既存93件に収録済み）を、未収録かつGame8で必要項目を確認できるTPカード4件へ置換。
- 既存のv2.9.7のUI・計算順序・ブースター選択UIを維持。

## ファイル
- index.html相当の画面は script.js / style.css と組み合わせて利用。
- players.csv：選手データ123件。
- README.md：本説明。

## CSV列
name, cardName, position, overall, foot, height, weakFootFrequency, weakFootAccuracy, conditionWave, talentPoints, attackType, offensivePlayingStyle, defensivePlayingStyle, ownedBoosters, playerType, skills, offensiveAwareness, ballControl, dribbling, ballKeeping, lowPass, loftedPass, finishing, heading, placeKicking, curl, speed, acceleration, kickingPower, jump, physicalContact, bodyControl, stamina, defensiveAwareness, ballWinning, aggression, defensiveEngagement, gkAwareness, catching, clearing, reflexes, coverage

## データ方針
- 選手データはGame8を基準に確認。
- 確認できない値を推測で埋めない。
- ルーベンディアスは攻撃プレースタイルを「未選択」、守備プレースタイルを「ハードプレス」とする。

## 利用
1. script.js / style.css / players.csv を同一フォルダに配置。
2. HTMLをスマートフォンのブラウザで開く。
3. 選手を選択し、能力配分・監督・適性・選手ブースター等を設定して最終値を確認。

## 主な計算ルール
- 能力配分：1～4は各1点、5～8は各2点、9～12は各3点、13～16は各4点で周期的に繰り返す。
- 通常上限は99。100以上は選手側ブースターによる対象能力のみ許容。
- 処理順序は初期値→能力配分→選手ブースター→上限判定→監督適性→監督ブースター。
- ブースターの選択値は各UI領域で選択中の値のみ反映。
