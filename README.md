# eFootball タレントデザインシミュレーター v2.9.10

## 収録カード
- 既存カード：123件（変更なし）
- 今回追加：TPカード29件
- 合計：152件
- TPダビド・ラヤ(03/21)は未収録

## データ方針
- 今回追加した選手カードの基礎データは、指定されたGame8の各対象ページを基準に確認。
- `curl` はGame8の「カーブ」に対応。
- TPカードの `talentPoints` は0。
- TPカードの `attackType` は「未選択」。
- `overall` はGame8で確認した最大総合値。
- 推測による能力値補完は行わない方針。

## CSV
`players.csv` は42列構成、152カード。

主な列：name / cardName / position / overall / foot / height / weakFootFrequency / weakFootAccuracy / conditionWave / talentPoints / attackType / offensivePlayingStyle / defensivePlayingStyle / ownedBoosters / playerType / skills / 各能力値

## アプリ
- `script.js`：シミュレーションロジック
- `style.css`：スマートフォン向けUI
- GitHub Pages等の静的ホスティングで利用可能

## v2.9.10 UI修正
- 「配分をリセット」を「能力配分」の見出し横へ移動。
- 通常ブースター1・2、追加ブースター、エッジブースターの上昇値ボタンを各枠独立で反映。
- 計算順の表示領域を横方向に拡張し、1行表示を優先。
- 選手データはv2.9.9収録分から変更なし。
