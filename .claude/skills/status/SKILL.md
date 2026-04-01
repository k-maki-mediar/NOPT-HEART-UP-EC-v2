---
name: status
description: "プロジェクト全体の進捗状況をダッシュボード形式で表示する。画面別進捗・ブランチ状態・デプロイ状況を一覧化。"
user-invocable: true
---

# プロジェクト状況ダッシュボード（status）

プロジェクト全体の状態を一目で把握するためのダッシュボード。

---

## 手順

### Step 1: 画面別進捗の収集

#### 1-1. 設計資料（Excel）の一覧

```bash
ls specs/*.xlsx 2>/dev/null
```

#### 1-2. parsed済みファイルの一覧

```bash
ls specs/parsed/*.yaml 2>/dev/null
ls specs/parsed/*_design.md 2>/dev/null
```

#### 1-3. 実装済み画面の一覧

```bash
ls workbench/pages/**/*.html 2>/dev/null
```

#### 1-4. 各画面の進捗判定

| 条件 | ステータス |
|---|---|
| `specs/` にExcelあり、parsedなし | 未着手 |
| `specs/parsed/{画面名}.yaml` あり | 変換済み |
| `specs/parsed/{画面名}_design.md` あり | デザイン済み |
| `workbench/pages/` に該当HTMLあり + featureブランチにコミットあり | 実装済み |
| mainにマージ済み + validator通過 | 検証済み |
| Vercelにデプロイ済み | デプロイ済み |

### Step 2: ブランチ状態の確認

```bash
git branch -v
git log main --oneline -5
```

各featureブランチがmainと同期しているか:
```bash
git log main..feature/{name} --oneline 2>/dev/null
git log feature/{name}..main --oneline 2>/dev/null
```

- mainに未マージのコミットがある → 「mainより先行」
- mainにあってfeatureにないコミットがある → 「mainと未同期」
- 差分なし → 「同期済み」

### Step 3: デプロイ状況の確認

```bash
vercel ls --limit 3 2>/dev/null
```

### Step 4: パーツ・コンポーネント数の集計

```bash
# パーツHTML数
ls workbench/includes/parts/**/*.html 2>/dev/null | wc -l

# コンポーネントSCSS数
ls workbench/styles/components/_*.scss 2>/dev/null | wc -l

# パーツJS数
ls workbench/scripts/parts/*.js 2>/dev/null | wc -l
```

### Step 5: ダッシュボード出力

```
══════════════════════════════════════════
  プロジェクト状況（YYYY-MM-DD HH:MM）
══════════════════════════════════════════

■ 画面別進捗:
  | 画面 | Excel | parsed | design | 実装 | 検証 | デプロイ |
  |------|-------|--------|--------|------|------|---------|
  | トップ（ログイン前） | ✓ | ✓ | ✓ | ✓ | ✓ | preview |
  | トップ（ログイン後） | ✓ | ✓ | ✓ | ✓ | ✓ | preview |
  | マイページ | ✓ | ✓ | ✓ | ✓ | ✓ | preview |
  | ログイン | ✓ | - | - | - | - | - |

■ ブランチ状況:
  | ブランチ | 最新コミット | main同期 |
  |----------|-------------|----------|
  | main | abc1234 最新メッセージ | - |
  | feature/top | def5678 メッセージ | ✓ 同期済み |
  | feature/mypage | ghi9012 メッセージ | ✓ 同期済み |
  | delivery | jkl3456 メッセージ | ⚠ 未更新 |

■ 資材数:
  - パーツHTML: N個（general: x, main: x）
  - コンポーネントSCSS: N個
  - パーツJS: N個
  - ページHTML: N個

■ デプロイ:
  | 種別 | URL | 日時 |
  |------|-----|------|
  | preview | https://xxx.vercel.app | YYYY-MM-DD |
  | production | https://xxx.vercel.app | YYYY-MM-DD |

■ 次にやるべきこと:
  1. {最優先アクション}
  2. {次のアクション}
══════════════════════════════════════════
```

**「次にやるべきこと」の判定:**

- 未着手画面がある → 「`/work {画面名}` で開始」
- 変換済みだがデザイン未了 → 「`/work {画面名} designerから` で再開」
- 実装済みだが未検証 → 「`/work {画面名} validatorから` で検証」
- 検証済みだがデプロイ未了 → 「`/deploy preview` でプレビューデプロイ」
- ブランチが未同期 → 「`@validator` で同期」
- deliveryが古い → 「`npm run deliver` で納品ブランチ更新を検討」
- 全画面完了 → 「納品準備。`npm run deliver:zip` でzip作成」
