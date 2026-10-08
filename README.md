# eFootball タレントデザインシミュレーター v2.9.9

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
