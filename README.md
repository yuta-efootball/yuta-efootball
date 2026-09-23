# eFootball タレントデザイン シミュレーター v2.8

## v2.8の修正内容

### 最終能力値の縦方向の余白をさらに圧縮

最終能力値の各パラメータカードについて、上下の内側余白を従来の `0.3em` から `0.15em` に変更しました。

- 変更前：上下 `0.3em`
- v2.8：上下 `0.15em`
- 変更量：従来の50%

スマートフォンでの縦スクロール量をさらに減らすことを目的とした変更です。

## 今回アップロードするファイル

今回変更したファイルは以下の2つです。

- `script.js`
- `README.md`

`index.html`、`style.css`、`config.js`、`players.csv`、`coaches.json`、`coachAptitude.json`、`boosters.json`、`icons.svg` など、今回変更していないファイルは現在のGitHub上のものをそのまま使用してください。

## GitHubへの更新

1. `script.js` をGitHubリポジトリへアップロードして、既存の `script.js` を置き換える。
2. `README.md` も同様に置き換える。
3. Commitする。
4. GitHub Pagesの公開ページを再読み込みする。

今回の修正では、シミュレーションの計算ロジックやデータ読み込みロジックは変更していません。
