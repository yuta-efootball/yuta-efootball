# eFootball タレントデザイン シミュレーター v2.5

v2.4からの差分ファイルです。今回の修正対象は以下の4ファイルです。

- `script.js`
- `index.html`
- `style.css`
- `README.md`

## v2.5 変更点

### 1. フォールバックデータを使用しない
選手データはGitHub Pages上の `players.csv` を正本として読み込みます。

`players.csv` の読み込みに失敗した場合、クヴァラツヘリア等のローカル確認用フォールバックデータへ切り替えません。エラー内容を画面のデータステータスに表示します。

監督、監督適性、ブースターについても、外部JSONを読み込めない場合はフォールバックへ切り替えず、エラーとして扱います。

### 2. 最終能力値の縦方向の余白を圧縮
最終能力値カードの上下paddingを `0.3em` に設定し、スマートフォンで縦方向によりコンパクトに表示します。

### 3. 選手検索の例を変更
検索欄の例を「クヴァ」から「エムバペ」に変更しました。

## GitHubへの反映

この4ファイルだけを既存リポジトリへ上書きしてください。

- `script.js`
- `index.html`
- `style.css`
- `README.md`

`config.js`、`players.csv`、`coaches.json`、`coachAptitude.json`、`boosters.json`、`icons.svg` は今回変更していません。
