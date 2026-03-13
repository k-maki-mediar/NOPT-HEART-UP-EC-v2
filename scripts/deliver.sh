#!/bin/zsh
set -euo pipefail

# ============================================
# deliver.sh
# workbench → mock ビルド後、deliveryブランチにコミット
# mock/ の中身をルート直下に展開（ガイドライン3-6構成）
# ============================================

DELIVERY_BRANCH="delivery"
WORKTREE_DIR=".delivery-worktree"
MESSAGE="${1:-"deliver: ビルド成果物を更新"}"

# 現在のブランチを記録
CURRENT_BRANCH=$(git branch --show-current)

echo "=== deliver: ビルド開始 ==="
npx gulp build

echo "=== deliver: deliveryブランチにコミット ==="

# worktreeが残っていたら削除
if [ -d "$WORKTREE_DIR" ]; then
  git worktree remove "$WORKTREE_DIR" --force 2>/dev/null || rm -rf "$WORKTREE_DIR"
fi

# deliveryブランチをworktreeとして展開
git worktree add "$WORKTREE_DIR" "$DELIVERY_BRANCH"

# mock/ の中身を worktree ルートに同期（mock/プレフィックス除去）
# --delete で不要ファイルも削除、.git は除外
rsync -a --delete \
  --exclude='.git' \
  --exclude='README.md' \
  mock/ "$WORKTREE_DIR/"

# worktree内でコミット
cd "$WORKTREE_DIR"
git add -A

# 変更がなければスキップ
if git diff --cached --quiet; then
  echo "=== deliver: 変更なし。コミットをスキップ ==="
  cd ..
  git worktree remove "$WORKTREE_DIR" --force
  exit 0
fi

git commit -m "$MESSAGE"
echo "=== deliver: コミット完了 ==="

# 元に戻る
cd ..
git worktree remove "$WORKTREE_DIR" --force

echo "=== deliver: 完了（ブランチ: $CURRENT_BRANCH のまま） ==="
echo "  deliveryブランチに新しいコミットが追加されました"
echo "  確認: git log delivery --oneline -5"
