---
name: deploy
description: "mainブランチの最新状態をVercel CLIでデプロイする。ビルド→プレビュー→本番昇格のフローを実行。"
user-invocable: true
argument-hint: "[preview|production（省略でpreview）]"
---

# Vercelデプロイスキル（deploy）

mainブランチの最新状態をそのままVercelにデプロイする。

- **`/deploy`** または **`/deploy preview`** — プレビューデプロイ（確認用URL発行）
- **`/deploy production`** — 本番デプロイ

---

## 基本方針

- **デプロイ対象は常にmainブランチ。** featureブランチからは直接デプロイしない。
- featureブランチで作業中に `/deploy` を実行した場合は、mainに切り替えてからデプロイする。
- デプロイ前に必ずビルド検証を行い、壊れた状態をデプロイしない。

---

## Step 1: mainブランチへの切り替えと状態確認

```bash
git branch --show-current
git status
```

| 状況 | 動作 |
|---|---|
| mainブランチにいる + 未コミット変更なし | そのまま Step 2 へ |
| mainブランチにいる + 未コミット変更あり | **停止してユーザーに確認**（コミットするか、stashするか） |
| featureブランチにいる + 未コミット変更なし | `git checkout main` で切り替え |
| featureブランチにいる + 未コミット変更あり | **停止してユーザーに確認**（コミットするか、stashするか） |

```bash
# mainに切り替え
git checkout main
```

---

## Step 2: ビルド検証

```bash
npm run build
```

| 結果 | 動作 |
|---|---|
| ビルド成功 | Step 3 へ |
| ビルドエラー | **停止。** エラー内容を表示し、修正を促す。壊れた状態ではデプロイしない |

ビルド成功後、出力ファイルを簡易確認:

```bash
# design.css が出力されているか
ls -la mock/files/commonfiles/styles/design.css

# HTMLが出力されているか
ls mock/cms/pc/
```

---

## Step 3: デプロイ実行

### 3-1. プレビューデプロイ（デフォルト）

`/deploy` または `/deploy preview` の場合:

```bash
vercel --yes
```

- `--yes` でプロンプトをスキップ（既存の `.vercel/project.json` のプロジェクト設定を使用）
- デプロイ完了後、**プレビューURLを表示**する

### 3-2. 本番デプロイ

`/deploy production` の場合:

```bash
vercel --prod --yes
```

- 本番URLにデプロイされる

---

## Step 4: デプロイ結果の確認

デプロイ完了後、以下を実行:

```bash
# 最新のデプロイ情報を確認
vercel ls --limit 1
```

結果をレポートとして出力:

```
══════════════════════════════════════════
  デプロイレポート
══════════════════════════════════════════

■ デプロイ種別: preview / production
■ ブランチ: main
■ コミット: {直近のコミットハッシュ + メッセージ}
■ URL: {デプロイURL}
■ ビルド: 成功
■ Basic認証: nopt / heartup2026
══════════════════════════════════════════
```

---

## Step 5: 元のブランチに戻る

デプロイ前にfeatureブランチで作業していた場合は、元のブランチに戻る:

```bash
# デプロイ前にfeatureブランチにいた場合
git checkout feature/{元のブランチ名}
```

mainで作業していた場合はそのまま。

---

## エラー時の対応

| エラー | 対応 |
|---|---|
| `vercel: command not found` | `npm i -g vercel` でインストール |
| 認証エラー | `vercel login` でログイン |
| プロジェクト未リンク | `vercel link` でプロジェクトをリンク（`.vercel/project.json` を確認） |
| ビルドエラー（Vercel側） | `vercel logs {URL}` でログ確認 |
| タイムアウト | 再度 `vercel --yes` を実行 |

---

## 禁止事項

- **featureブランチから直接デプロイしない**（必ずmainから）
- **ビルドエラーの状態でデプロイしない**
- **`vercel` の設定ファイル（`vercel.json`, `.vercel/project.json`）を独断で変更しない**
- **`scripts/vercel-build.sh` のBasic認証情報を独断で変更しない**
- **`--force` オプションは使わない**
