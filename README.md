# eFootball タレントデザイン シミュレーター v2.6

v2.5からのデータ読み込み仕様を修正しました。

## v2.6の変更内容

- フォールバックデータを復活。
- `players.csv`、`coaches.json`、`coachAptitude.json`、`boosters.json` は、それぞれGitHub上の外部データを優先して使用。
- 外部データの取得に失敗した場合は、そのデータだけフォールバックへ切り替える。
- `players.csv` がGitHub上に存在し、内容が有効なら、フォールバックの選手データではなくCSVの選手データを使用。
- これにより、CSV未配置・一時的な読み込み失敗時でも、監督・監督適性・ブースター・選手データを含むアプリを従来どおり利用可能。
- 外部データを使用できた場合とフォールバックを使用した場合を画面下部のデータステータスに表示。

## GitHubへの更新方法

1. ZIPを解凍する。
2. `script.js` と `README.md` の2ファイルだけをGitHubリポジトリへアップロードする。
3. 既存の同名ファイルを置き換える。
4. Commitする。
5. GitHub Pagesの公開URLを再読み込みする。

`config.js`、`players.csv`、`coaches.json`、`coachAptitude.json`、`boosters.json`、`icons.svg`、`index.html`、`style.css` は変更していません。
