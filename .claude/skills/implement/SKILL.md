---
name: implement
description: >
  プロジェクト全体のHTML/CSS/JSをガイドライン・規格に照合して厳格に検証し、
  違反を検出→fixブランチで修正→mainマージ→全ブランチ同期まで自動で行うスキル。
  新規実装時のワークフロー管理も兼ねる。
user_invocable: true
---

# 検証・修正・同期スキル（implement）

このスキルは2つのモードを持つ:

- **`/implement`** — プロジェクト全体を検証し、違反があれば修正ブランチを切って修正→マージ→同期
- **`/implement {画面名}`** — 指定画面の新規実装（設計資料参照→ブランチ→実装→検証→マージ→同期）

---

# ══════════════════════════════════════════
# MODE A: 全体検証・修正・同期（引数なし）
# ══════════════════════════════════════════

## Step 1: 事前状態の記録

作業開始前に必ず以下を実行し、状態を把握する:

```bash
git branch --show-current
git status
git stash list
git branch -a
```

**未コミットの変更がある場合は `git stash` してから作業を開始すること。**

---

## Step 2: 厳格検証（全ファイル対象）

以下の検証項目を**全ての対象ファイルに対して**Grep/Globで実行する。
検出結果は「違反リスト」として一覧にまとめ、ファイル名・行番号・違反内容・重要度（CRITICAL/WARNING）を明示する。

### ═══ 2-1. HTML検証（workbench/includes/**/*.html, workbench/pages/**/*.html） ═══

#### [H-01] CRITICAL: void要素の自己閉じスラッシュ
HTML5ではvoid要素にスラッシュ不要。`<br />`, `<img ... />`, `<input ... />` 等を検出。

```
検索パターン: <(br|hr|img|input|meta|link|area|base|col|embed|param|source|track|wbr)\b[^>]*/>
対象: workbench/**/*.html
```

#### [H-02] CRITICAL: DOCTYPE宣言
ページHTMLの1行目が `<!DOCTYPE html>` であること（大文字DOCTYPE）。`<!doctype html>` は許容するが `<!Doctype html>` 等は不可。

```
検索パターン: ページHTMLの1行目を確認
許容: <!DOCTYPE html> または <!doctype html>
```

#### [H-03] CRITICAL: html要素にclass="c-html"がない

```
検索パターン: <html で始まる行に class="c-html" が含まれない
対象: workbench/pages/**/*.html
```

#### [H-04] CRITICAL: body要素にclass="c-body"がない

```
検索パターン: <body で始まる行に class="c-body" が含まれない
対象: workbench/pages/**/*.html
```

#### [H-05] WARNING: パーツHTML内のid属性使用
パーツHTMLではidを使わず、class/data属性ベースで設計する。

```
検索パターン: \sid=["']
対象: workbench/includes/**/*.html
除外: head.html内のscriptタグ等は許容
```

#### [H-06] CRITICAL: 絶対パスの使用
href/src属性に絶対パスが使われていないか。

```
検索パターン: (href|src|action)=["'](https?://|/)
対象: workbench/**/*.html
除外: 外部CDN等の意図的なURLは除外判定
```

#### [H-07] WARNING: X-UA-Compatible meta（廃止済み）

```
検索パターン: X-UA-Compatible
対象: workbench/**/*.html
```

#### [H-08] CRITICAL: img要素のalt属性欠落

```
検索パターン: <img(?![^>]*\balt\b)[^>]*>
対象: workbench/**/*.html
```

#### [H-09] WARNING: 閉じタグの欠落チェック
開きタグに対応する閉じタグがあるか。特に `<div>`, `<section>`, `<nav>`, `<ul>`, `<li>` に注意。

```
方法: 各HTMLファイルの開き/閉じタグ数を比較
```

#### [H-10] CRITICAL: charset UTF-8 指定の確認

```
検索パターン: head.html に <meta charset="UTF-8"> が存在すること
```

#### [H-11] WARNING: lang属性の確認

```
検索パターン: <html に lang="ja" が含まれること
対象: workbench/pages/**/*.html
```

#### [H-12] CRITICAL: head.htmlの@@include確認

```
検索パターン: ページHTMLに @@include.*head\.html が存在すること
対象: workbench/pages/**/*.html
```

### ═══ 2-2. SCSS/CSS検証（workbench/styles/**/*.scss） ═══

#### [S-01] CRITICAL: 素タグセレクタの使用
`td {}`, `a {}`, `h3 {}` 等の素タグへの直接スタイル指定は禁止。
必ず `.c-xxx {}` のクラスセレクタで定義する。

```
検索パターン: ^\s*(html|body|div|span|p|a|ul|ol|li|dl|dt|dd|h[1-6]|table|thead|tbody|tfoot|tr|th|td|caption|form|fieldset|legend|label|input|textarea|select|button|img|figure|figcaption|nav|header|footer|main|section|article|aside|details|summary|mark|time|small|strong|em|b|i|u|s|sub|sup|abbr|address|blockquote|pre|code|hr|br)\s*[,\{]
対象: workbench/styles/**/*.scss
除外: コメント行、文字列中、@use/@forward行、変数宣言中、ネスト内の & + タグ結合子は許容
注意: .c-body 内の & a {} のようなネスト記法は「素タグセレクタ」とみなす。ただし BEM ブロック内での直接子孫で意図的なリセットの場合はWARNINGに格下げ
```

#### [S-02] CRITICAL: :nth-child / :nth-of-type の使用

```
検索パターン: :nth-(child|of-type|last-child|first-child)
対象: workbench/styles/**/*.scss
除外: コメント行
注意: :first-child, :last-child も順序依存のため検出対象とする
```

#### [S-03] CRITICAL: BEM命名規則違反
クラスセレクタが `.c-{block}__{element}--{modifier}` に準拠しているか。

```
検索パターン: 全ての \.[\w-]+ セレクタを抽出し、以下に該当しないものを検出
許容パターン:
  - .c-{block} （ブロック）
  - .c-{block}__{element} （エレメント）
  - .c-{block}--{modifier} （ブロックモディファイア）
  - .c-{block}__{element}--{modifier} （エレメントモディファイア）
  - .c-html, .c-body （特殊グローバル）
  - Bootstrap既存クラス（.btn, .modal, .collapse 等）への言及は許容
  - SCSS変数展開 #{$var} は許容
```

#### [S-04] WARNING: rem()関数未使用の固定px値
フォントサイズ、余白、幅・高さ等にpx直書きがないか。

```
検索パターン: :\s*\d+px(?!\s*\))
対象: workbench/styles/**/*.scss
除外: border-width（1px等）、box-shadow、コメント行、rem()関数の引数内
注意: border: rem(1) solid のような書き方を推奨
```

#### [S-05] CRITICAL: main.scssに@useされていないパーシャル
`workbench/styles/components/`, `workbench/styles/pages/`, `workbench/styles/base/` にファイルがあるのに、`main.scss` に対応する `@use` がない場合。

```
方法: 各ディレクトリのSCSSファイル名を列挙し、main.scss内の@use宣言と照合
```

#### [S-06] WARNING: @import の使用（@use推奨）

```
検索パターン: @import\s
対象: workbench/styles/**/*.scss
```

#### [S-07] CRITICAL: !important の使用

```
検索パターン: !important
対象: workbench/styles/**/*.scss
除外: コメント行
```

#### [S-08] WARNING: マジックナンバー（z-index直値）
z-indexに変数ではなく直値を使用している場合。

```
検索パターン: z-index:\s*\d+
対象: workbench/styles/**/*.scss
推奨: $z-index-xxx 変数を使用すること
```

#### [S-09] WARNING: ハードコードされたカラー値
変数やCSS変数ではなく直接カラーコードを記述。

```
検索パターン: (?<![\$\w-])#[0-9a-fA-F]{3,8}\b
対象: workbench/styles/**/*.scss
除外: コメント行、変数定義行（$xxx: #fff）、_variables.scss内
```

#### [S-10] WARNING: ブレークポイント直書き
メディアクエリにpx直書きがないか。@include sp / tablet / pc ミックスインを使用すべき。

```
検索パターン: @media\s*\(
対象: workbench/styles/components/**/*.scss, workbench/styles/pages/**/*.scss
除外: foundation/ 内のミックスイン定義自体
```

#### [S-11] CRITICAL: @use宣言のパスがfoundation/を正しく参照しているか

```
検索パターン: @use 宣言を全て抽出し、パスの整合性を確認
対象: workbench/styles/**/*.scss (foundation/以外)
期待: @use '../foundation/functions' as *; 等の正しい相対パス
```

#### [S-12] WARNING: 空のルールセット

```
検索パターン: \{\s*\}
対象: workbench/styles/**/*.scss
```

### ═══ 2-3. JavaScript検証（workbench/scripts/parts/*.js） ═══

#### [J-01] CRITICAL: パーツディレクトリ外のJSファイル

```
方法: workbench/scripts/ 配下で parts/ 以外にJSファイルがないか
禁止: workbench/scripts/main.js, workbench/scripts/common.js 等
```

#### [J-02] WARNING: console.log の残存

```
検索パターン: console\.(log|debug|info|warn|error)
対象: workbench/scripts/**/*.js
```

#### [J-03] WARNING: jQuery非推奨パターン

```
検索パターン: \$\(document\)\.ready | \.live\( | \.bind\(
対象: workbench/scripts/**/*.js
推奨: $(function(){}) または .on() を使用
```

#### [J-04] WARNING: var宣言（let/const推奨）

```
検索パターン: \bvar\s
対象: workbench/scripts/**/*.js
```

### ═══ 2-4. ディレクトリ構造検証 ═══

#### [D-01] CRITICAL: ファイル名の一意性
CSS/JS/画像のファイル名がディレクトリを跨いで重複していないか。

```
方法: workbench/ 配下の全ファイル名（拡張子含む）を列挙し、重複を検出
```

#### [D-02] CRITICAL: 禁止ディレクトリの変更検出

```
方法: git diff main -- 'モック/' 'specs/' で変更がないことを確認
```

#### [D-03] CRITICAL: 不正なディレクトリへのファイル配置

```
チェック内容:
- workbench/scripts/ 直下にJSファイルがないか（parts/以下のみ許容）
- workbench/styles/ 直下に_パーシャルがないか（main.scssのみ許容）
- workbench/includes/ 直下にHTMLがないか（head.htmlのみ許容、parts/以下に配置すべき）
```

#### [D-04] WARNING: SCSSパーシャルの命名
`_` プレフィックスが付いているか、camelCaseになっているか。

```
方法: workbench/styles/components/, pages/, base/ のファイル名を検証
```

### ═══ 2-5. アクセシビリティ検証（workbench/**/*.html） ═══

#### [A-01] WARNING: button/a要素の空テキスト
アイコンのみのボタンにaria-labelがないか。

```
検索パターン: <(button|a)\b[^>]*>\s*<(i|img|svg|span)\b[^>]*/?\>\s*</(button|a)>
対象: workbench/**/*.html
推奨: aria-label または sr-onlyテキストを付与
```

#### [A-02] WARNING: form要素でのinputグループ囲み

```
方法: <input>, <select>, <textarea> が <form> の中に配置されているか確認
対象: workbench/**/*.html
```

#### [A-03] WARNING: タップ領域不足の疑い
min-height/min-width/padding が極端に小さいインタラクティブ要素。

```
検索パターン: (min-height|height):\s*rem\(([0-3][0-9]?)\) を持つ button/a 関連セレクタ
対象: workbench/styles/**/*.scss
基準: 44px (rem(44)) 未満はWARNING
```

### ═══ 2-6. ビルド検証 ═══

#### [B-01] CRITICAL: SCSSコンパイルエラー

```bash
npm run build
```

エラーが出た場合はその内容を記録。

#### [B-02] WARNING: ビルド出力の確認

```
方法: mock/ 配下に期待されるファイルが出力されているか確認
- mock/files/commonfiles/styles/design.css が存在
- mock/files/partsfiles/scripts/ にJS出力
- mock/cms/pc/ にHTML出力
```

---

## Step 3: 違反レポートの出力

検証結果を以下のフォーマットで出力する:

```
══════════════════════════════════════════
  検証レポート（YYYY-MM-DD HH:MM）
══════════════════════════════════════════

■ CRITICAL違反（必須修正）: N件
────────────────────────────────────
[S-01] workbench/styles/components/_xxx.scss:42
  → 素タグセレクタ `a {` を使用。`.c-xxx__link {}` に変更すべき
[H-01] workbench/includes/parts/general/xxx.html:15
  → void要素 `<br />` にスラッシュ。`<br>` に修正
...

■ WARNING違反（推奨修正）: N件
────────────────────────────────────
[S-04] workbench/styles/components/_xxx.scss:88
  → px直書き `margin: 16px` → `margin: rem(16)` を推奨
...

■ 合格項目: N件
────────────────────────────────────
[H-02] DOCTYPE宣言 ✓
[H-10] charset UTF-8 ✓
...
══════════════════════════════════════════
```

**CRITICAL違反が0件の場合は修正不要。レポートのみ出力して終了。**
**CRITICAL違反が1件以上ある場合は Step 4 に進む。**
**WARNING違反のみの場合はユーザーに修正するか確認する。**

---

## Step 4: 修正ブランチの作成と修正

### 4-1. mainブランチに移動

```bash
git checkout main
git pull origin main 2>/dev/null || true  # リモートがあれば同期
```

### 4-2. fixブランチ作成

```bash
git checkout -b fix/validate-YYYYMMDD
```

ブランチ名の日付は実行日。同日に複数回実行する場合は `-01`, `-02` のサフィックス。

### 4-3. CRITICAL違反の修正

**修正は CRITICAL 違反のみ自動実行。WARNING は報告のみ。**

各違反を修正し、修正内容をカテゴリごとにコミット:

```bash
# HTML修正
git add workbench/includes/... workbench/pages/...
git commit -m "fix(html): void要素スラッシュ除去・alt属性追加 [H-01,H-08]"

# SCSS修正
git add workbench/styles/...
git commit -m "fix(scss): 素タグセレクタをクラスセレクタに変更 [S-01]"

# JS修正（該当があれば）
git add workbench/scripts/...
git commit -m "fix(js): console.log除去 [J-02]"
```

**コミットメッセージに違反コード（[S-01]等）を必ず含める。**

### 4-4. 修正後の再検証

修正完了後、Step 2 の検証を再実行。
CRITICAL違反が0件になるまで繰り返す。

### 4-5. ビルド確認

```bash
npm run build
```

ビルドエラーがないことを確認。

---

## Step 5: mainへのマージ

```bash
git checkout main
git merge fix/validate-YYYYMMDD
```

コンフリクトがあれば解決してコミット。

---

## Step 6: 全ブランチの同期

mainの修正を全てのfeature/fixブランチに反映し、最新状態を揃える。

### 6-1. 存在するブランチの確認

```bash
git branch --list
```

### 6-2. 各ブランチにmainをマージ

**deliveryブランチ以外の全ローカルブランチ**にmainの変更を反映する。

```bash
# 各featureブランチに対して
git checkout feature/xxx
git merge main
# コンフリクトがあれば解決
git checkout main
```

### 6-3. deliveryブランチの更新

deliveryブランチは納品専用のため、通常のマージではなく `npm run deliver` で更新する。
**deliveryの更新はユーザーに確認してから実行する。**

### 6-4. 完了確認

```bash
git checkout main
git branch -v
```

全ブランチがmainの最新コミットを含んでいることを確認。

### 6-5. fixブランチの削除

マージ済みのfixブランチを削除:

```bash
git branch -d fix/validate-YYYYMMDD
```

---

## Step 7: 最終レポート

```
══════════════════════════════════════════
  修正完了レポート（YYYY-MM-DD HH:MM）
══════════════════════════════════════════

■ 修正したCRITICAL違反: N件
  - [S-01] 素タグセレクタ → クラスセレクタに変更（3ファイル）
  - [H-01] void要素スラッシュ除去（5ファイル）
  ...

■ 残存WARNING: N件
  - [S-04] px直書き（推奨修正・非必須）
  ...

■ ブランチ同期状況:
  - main: ✓ 最新
  - feature/top: ✓ mainマージ済み
  - feature/mypage: ✓ mainマージ済み
  - delivery: ⚠ ユーザー確認待ち / ✓ 更新済み

■ ビルド: ✓ 成功

■ 修正コミット:
  - abc1234 fix(html): void要素スラッシュ除去 [H-01]
  - def5678 fix(scss): 素タグセレクタ変更 [S-01]
══════════════════════════════════════════
```

---

# ══════════════════════════════════════════
# MODE B: 新規画面実装（引数あり）
# ══════════════════════════════════════════

`/implement {画面名}` で呼び出された場合は、新規実装モードで動作する。

## B-1. 設計資料の確認

1. `specs/` 配下に対応するExcel設計資料があるか確認
2. 設計資料を読み込み、全要素・状態差分・端末差分を把握
3. 設計資料がない場合はユーザーに確認

## B-2. ブランチ管理

```bash
git checkout main
git pull origin main 2>/dev/null || true
git checkout -b feature/{画面名スラッグ}
```

既存featureブランチがある場合はそこに切り替え。

## B-3. ファイル配置

| 種別 | 配置先 | 命名 |
|---|---|---|
| ページHTML | `workbench/pages/{category}/` | 設計資料の画面名 |
| 汎用パーツ | `workbench/includes/parts/general/` | camelCase.html |
| メインパーツ | `workbench/includes/parts/main/{category}/` | camelCase.html |
| SCSS | `workbench/styles/components/_{name}.scss` | _パーシャル |
| ページSCSS | `workbench/styles/pages/_{name}.scss` | _パーシャル |
| JS | `workbench/scripts/parts/{name}.js` | camelCase |

**禁止**: 親フォルダに新規フォルダ作成 / `モック/`・`specs/` 編集 / 共通main.js作成

## B-4. 実装ルール

実装時は以下を厳守:

- HTML: DOCTYPE html / c-html / c-body / @@include / void要素スラッシュなし / 相対パスのみ
- SCSS: 素タグ禁止 / nth-child禁止 / BEM(.c-block__elem--mod) / rem()使用 / main.scssに@use追加
- JS: parts/以下のみ / jQuery 3.7.1+Bootstrap 5.3.2前提 / 必要最小限
- レスポンシブ: PC基準(992px〜) / Tablet(768〜991px) / SP(320〜767px)
- タップ領域: 44×44px以上 / 隣接要素間8px以上
- 動的耐性: 固定件数・文字数・高さ前提禁止

## B-5. 実装後検証

**MODE Aの Step 2 を、作成/変更したファイルに限定して実行する。**
CRITICAL違反が検出されたら即修正し、再検証。

## B-6. コミット

パーツ/ページ単位:

```bash
git add workbench/styles/components/_newComponent.scss
git add workbench/styles/main.scss
git add workbench/includes/parts/main/{category}/newPart.html
git add workbench/pages/{category}/newPage.html
git commit -m "feat({画面名}): 画面実装"
```

## B-7. mainマージと同期

```bash
git checkout main
git merge feature/{画面名スラッグ}
```

マージ後、MODE A の Step 6（全ブランチ同期）を実行。

## B-8. 作業報告

以下を出力:

1. 対象画面/パーツ
2. 参照した設計資料名
3. 作成/更新ファイル一覧
4. 新規追加パーツ
5. 想定した状態差分
6. モック差分で設計資料を正として採用した点
7. 未確定事項/要確認事項
8. 横展開が必要な懸念点
9. 検証結果サマリ（CRITICAL: 0件 / WARNING: N件）

---

# ══════════════════════════════════════════
# 禁止事項（両モード共通）
# ══════════════════════════════════════════

以下に該当する変更を検知した場合は**即座に停止しユーザーに確認**:

- 画面の追加・削除・統合・分割
- 画面遷移/フローの変更
- 表示要素の追加・削除・並び替え
- PC/Tablet/SP間での構造変更
- 共通パーツのHTML構造変更
- フォルダ構成・CSS読み込み順の変更
- 設計資料にないアニメーション/インタラクション追加
- `モック/` 配下のファイル編集
- `specs/` 配下のファイル編集
- `git add -A` / `git add .` の使用
- `--force` / `--no-verify` オプションの使用
