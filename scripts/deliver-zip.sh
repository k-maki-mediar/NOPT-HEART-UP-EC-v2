#!/bin/zsh
set -euo pipefail

# ============================================
# deliver-zip.sh
# deliverを実行後、deliveryブランチの内容をzip化
# 納品メモ（delivery-note.txt）を同梱
# ============================================

DELIVERY_BRANCH="delivery"
OUTDIR="dist"
DATE=$(date +%Y%m%d)
ZIPNAME="${OUTDIR}/${DATE}_deliver.zip"
NOTEFILE="${OUTDIR}/${DATE}_delivery-note.txt"
MESSAGE="${1:-"deliver: ビルド成果物を更新"}"

# 1. deliver実行
zsh scripts/deliver.sh "$MESSAGE"

echo "=== deliver:zip — zip作成開始 ==="

# 出力ディレクトリ作成
mkdir -p "$OUTDIR"

# 2. deliveryブランチの内容をzip化（README.mdは除外）
git archive --format=zip -o "$ZIPNAME" "$DELIVERY_BRANCH"

# 3. 納品メモを生成
{
  echo "========================================="
  echo " 納品メモ"
  echo "========================================="
  echo ""
  echo "納品日: $(date '+%Y/%m/%d %H:%M')"
  echo ""
  echo "-----------------------------------------"
  echo " 最新コミット"
  echo "-----------------------------------------"
  git log "$DELIVERY_BRANCH" -1 --format="  %H%n  %s%n  %ai"
  echo ""
  echo "-----------------------------------------"
  echo " 納品履歴（直近10件）"
  echo "-----------------------------------------"
  git log "$DELIVERY_BRANCH" --oneline -10
  echo ""
  echo "-----------------------------------------"
  echo " 含まれるHTMLページ"
  echo "-----------------------------------------"
  git ls-tree -r --name-only "$DELIVERY_BRANCH" | grep '\.html$' | grep -v 'README' | sed 's/^/  /'
  echo ""
  echo "-----------------------------------------"
  echo " 含まれるCSSファイル"
  echo "-----------------------------------------"
  git ls-tree -r --name-only "$DELIVERY_BRANCH" | grep '\.css$' | sed 's/^/  /'
  echo ""
  echo "========================================="
} > "$NOTEFILE"

echo "=== deliver:zip — 完了 ==="
echo "  ZIP: $ZIPNAME"
echo "  納品メモ: $NOTEFILE"
