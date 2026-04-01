---
name: review
description: "クライアントレビュー指摘を受けて対象箇所を修正し、同種パーツ・レイアウトへ横展開する。ガイドライン4-2準拠。"
user-invocable: true
argument-hint: "{画面名} {指摘内容}"
---

# レビュー指摘対応スキル（review）

クライアントからのレビュー指摘を受けて、対象修正 + 横展開 + 検証 + マージまでを実行する。

---

## 入力パターン

| 入力例 | 動作 |
|---|---|
| `/review マイページ クーポン一覧の余白が狭い。16pxを24pxに` | 特定パーツの余白修正 + 横展開 |
| `/review 全体 タップ領域が小さいボタンがある` | 全画面横断でタップ領域修正 |
| `/review トップ バナーエリアのSP時に画像が切れている` | レスポンシブ修正 + 横展開 |
| `/review マイページ BEMの命名が統一されていない` | 命名修正 + 横展開 |

---

## ワークフロー

### Step 1: 指摘内容の解析

指摘を以下の属性に分解する:

```
対象画面: {画面名 or 全体}
対象パーツ: {パーツ名 or 不明}
指摘種別: {以下のいずれか}
修正内容: {具体的な修正指示}
```

**指摘種別の分類:**

| 種別 | 横展開対象 |
|---|---|
| 余白（margin/padding） | 同じコンポーネント構造を持つ全パーツ |
| タップ領域 | 全画面のボタン・リンク要素 |
| BEM命名 | 同じ命名パターンを使う全コンポーネント |
| CSS設計（セレクタ等） | 同じパターンを使う全SCSS |
| パーツ構造（HTML） | 同じパーツを使う全画面 |
| ファイル命名 | 同じ命名規則に該当する全ファイル |
| レスポンシブ崩れ | 同じレイアウトパターンを使う全パーツ |
| 状態差分の漏れ | 同じ状態パターンを持つ全パーツ |
| 可変要素への耐性 | 固定値を使っている全箇所 |
| フォルダ格納 | 同じルールに該当する全ファイル |

### Step 2: 対象パーツの特定

```bash
# 画面名から対象ファイルを特定
grep -rl "{パーツ名のキーワード}" workbench/includes/parts/ workbench/styles/components/

# 該当するSCSSとHTMLを読む
cat workbench/styles/components/_対象.scss
cat workbench/includes/parts/対象.html
```

### Step 3: fixブランチ作成

```bash
git checkout main
git pull origin main 2>/dev/null || true
git checkout -b fix/review-YYYYMMDD
```

同日に複数のレビュー対応がある場合は `-01`, `-02` のサフィックス。

### Step 4: 対象箇所の修正

指摘内容に基づいて、対象ファイルを修正する。

**修正時の注意:**
- 指摘された内容のみ修正する。関連しない「ついでの改善」はしない
- 設計資料と矛盾する修正が求められた場合は、ユーザーに確認する

### Step 5: 横展開対象の自動検出

`@reviewer` エージェントを使って横展開対象を検出する。

```
@reviewer {指摘種別} {修正内容} を横展開対象検出して
```

reviewerエージェントが以下を行う:

1. **同じクラス名パターンの検索**
   ```bash
   grep -rl "修正したクラス名のベース部分" workbench/styles/components/
   ```

2. **同じHTML構造の検索**
   ```bash
   grep -rl "修正したHTML要素のパターン" workbench/includes/parts/
   ```

3. **同じCSS値の検索**（余白修正の場合）
   ```bash
   grep -rn "修正前の値" workbench/styles/components/
   ```

4. **同じレスポンシブパターンの検索**
   ```bash
   grep -rl "@include sp" workbench/styles/components/ | xargs grep "修正に関連するプロパティ"
   ```

**横展開候補をユーザーに提示:**
```
横展開候補を検出しました:

| No | ファイル | 該当箇所 | 現在の値 | 修正後の値 |
|----|----------|----------|----------|-----------|
| 1  | _orderHistory.scss:42 | padding | rem(16) | rem(24) |
| 2  | _favoriteProducts.scss:38 | padding | rem(16) | rem(24) |
| 3  | _availableLens.scss:45 | padding | rem(16) | rem(24) |

全て修正しますか？（全て / 個別選択 / スキップ）
```

### Step 6: 横展開の実行

ユーザーが承認した横展開先を修正する。

### Step 7: 検証

修正した全ファイルに対して、`/implement` スキルの検証項目を実行:

```bash
npm run build
```

+ Grepによる違反チェック（素タグセレクタ、nth-child、BEM命名、!important等）

### Step 8: コミット

```bash
# 対象箇所の修正
git add workbench/styles/components/_対象.scss
git commit -m "fix(review): {指摘概要} [{対象パーツ}]"

# 横展開の修正（別コミット）
git add workbench/styles/components/_横展開先1.scss
git add workbench/styles/components/_横展開先2.scss
git commit -m "fix(review): {指摘概要}の横展開 [{横展開先パーツ}]"
```

### Step 9: mainマージ + 全ブランチ同期

```bash
git checkout main
git merge fix/review-YYYYMMDD

# 全featureブランチにmainをマージ
git checkout feature/xxx
git merge main
git checkout main

# fixブランチ削除
git branch -d fix/review-YYYYMMDD
```

### Step 10: レポート出力

```
══════════════════════════════════════════
  レビュー対応レポート（YYYY-MM-DD）
══════════════════════════════════════════

■ 指摘内容:
  {元の指摘テキスト}

■ 指摘種別: {余白/タップ領域/命名/...}

■ 対象箇所の修正:
  - {ファイルパス}: {修正内容}

■ 横展開:
  | ファイル | 修正内容 |
  |----------|----------|
  | _orderHistory.scss:42 | padding rem(16)→rem(24) |
  | _favoriteProducts.scss:38 | padding rem(16)→rem(24) |
  | _availableLens.scss:45 | padding rem(16)→rem(24) |

■ 検証: CRITICAL 0 / WARNING 0
■ mainマージ: 完了
■ ブランチ同期: 完了

■ コミット:
  - {hash} fix(review): {メッセージ}
  - {hash} fix(review): {横展開メッセージ}
══════════════════════════════════════════
```

---

## 複数指摘の一括処理

複数の指摘を一度に受けた場合:

```
/review マイページ
  1. クーポン一覧の余白を広げて
  2. ボタンのタップ領域が小さい
  3. SP時にテーブルが横にはみ出る
```

各指摘を個別に処理し、コミットも指摘ごとに分ける。
横展開は指摘ごとに検出・提示する。
最後に統合レポートを出力する。

---

## 禁止事項

- 指摘されていない箇所を独断で修正しない
- 設計資料と矛盾する修正を独断で行わない
- 横展開候補をユーザーに提示せず勝手に修正しない
- `モック/` `specs/` 配下のファイルを編集しない
- `git add -A` / `git add .` を使わない
