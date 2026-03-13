# nopt-heart-up-ec-v2

SI Web Shoppingベースのデザインカスタマイズプロジェクト。
元モック（`モック/`）を参照しながらガイドライン（`.doc`）に完全準拠した新規デザインHTMLを作成する。

## ビルドコマンド

- `npm run dev` — 開発（Gulp watch + BrowserSync localhost:3000）
- `npm run build` — ビルド（workbench → mock）

## ファイル構成ルール

- ページHTML: `workbench/pages/[category]/`
- 汎用パーツ: `workbench/includes/parts/general/`（header, footer等）
- メインパーツ: `workbench/includes/parts/main/[category]/`
- 共通SCSS: `workbench/styles/base/` → `common.css`
- パーツSCSS: `workbench/styles/layout/`, `components/`, `pages/` → 個別CSS
- 親フォルダに新規フォルダを作成しない

## CSSコーディングルール（ガイドライン3-3, 3-4）

1. **素タグへのスタイル指定禁止**: `td {}`, `a {}`, `h3 {}` 等は使わない。必ず `.class-name {}` で定義
2. **`:nth-child(n)` 禁止**: 順番変更に耐えられる設計にする
3. **BEM命名規則**: `.c-{block}__{element}--{modifier}`
4. **ページ固有CSSは個別ファイル**: `workbench/styles/pages/[name].scss` に作成
5. **CSS/JS/画像のファイル名はディレクトリ跨ぎでも一意**
6. **相対パスのみ使用**
7. **CSS読み込み順を変更しない**（head.htmlで定義済み）
8. **可読性の高い実装**: `outputStyle: 'expanded'`（非圧縮）
9. **rem単位を基本使用**: `rem()` 関数でpx→rem変換

## HTMLコーディングルール（ガイドライン3-4）

1. **HTML5準拠**: `<!doctype html>`, 閉じタグ明示
2. **charset UTF-8**
3. **パーツHTML**: どの画面から呼び出されても同一のHTML構成
4. **レイアウト可変パターン**: 同一画面でも可変がある場合は別ページを作成

## レスポンシブ（ガイドライン2-5, 2-6）

- SP: 320px〜767px
- Tablet: 768px〜991px
- PC: 992px〜
- PC基準でタブレット・SPを調整

## デザインルール（ガイドライン2-4, 3-1, 3-3）

- 動的コンテンツの増減に対応できる構造
- タップ領域を十分に確保
- フル桁/最小表示でデザイン崩れがないこと確認
- リスト表示のページネーション定義

## パーツ設計ルール（ガイドライン3-3）

- ヘッダー、フッター、カテゴリツリー、メッセージは必ずパーツ化
- パーツのCSS/classはどの画面でも適用可能に設計
- パーツHTMLは`workbench/includes/parts/general/`に配置
- ページのメイン部品は`workbench/includes/parts/main/[category]/`に配置

## コンポーネント作成手順

1. SCSSファイル: `workbench/styles/components/[name].scss` に作成（`_`なし）
2. HTMLパーツ: `workbench/includes/parts/` に作成
3. head.htmlに当該CSSの`<link>`を追加
4. ページHTMLで `@@include` を使用
5. `npm run dev` でビルド確認

## Git管理・納品フロー

### ブランチ構成

| ブランチ | 用途 | 内容 |
|---|---|---|
| `main` | ソース管理・安定版 | workbench/, 設定ファイル, mock/静的資材すべて |
| `feature/xxx` | 画面単位の開発作業 | mainから分岐、完了後削除 |
| `delivery` | 納品専用 | mock/の中身をルート直下に展開（ガイドライン3-6構成） |

### 納品コマンド

- `npm run deliver -- "メッセージ"` — ビルド → deliveryブランチにコミット
- `npm run deliver:zip` — deliver実行 → `dist/` にzip + 納品メモ同梱

### 納品シナリオ

- **Git共有可能**: deliveryブランチのみ共有（ソース非公開）
- **Git共有不可**: `npm run deliver:zip` でzip + delivery-note.txt を納品

### 作業フロー

1. `git checkout -b feature/xxx main` — 作業ブランチ作成
2. パーツ/ページ単位でコミット
3. `git checkout main && git merge feature/xxx` — mainにマージ
4. `npm run deliver -- "メッセージ"` — 納品
5. `git branch -d feature/xxx` — ブランチ削除
6. 先方確認 → OKなら次へ / NGなら `fix/xxx` ブランチで修正

### 初回レビュー対応（ガイドライン4-2）

初回納品で先方レビュー → フィードバック対応後、以降の画面は指摘事項を横展開した状態で作成

## 対象ブラウザ（ガイドライン2-2）

### フロント
- Windows: Chrome, Edge
- Mac: Safari
- iOS 17: Safari
- Android 11: Chrome

### 店頭
- Windows: Chrome, Edge
- タブレット: iOS 17 Safari
