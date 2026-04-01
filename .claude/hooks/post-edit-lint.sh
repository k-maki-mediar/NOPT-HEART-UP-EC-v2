#!/bin/bash
# PostToolUse Hook: Edit/Write後にガイドライン違反を即時検出
# 違反があればstderrに出力してClaude本体にフィードバック

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.filePath // empty')

# ファイルパスが取れない場合はスキップ
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# ファイルが存在しない場合はスキップ
if [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

VIOLATIONS=""

# ── SCSS検証 ──
if echo "$FILE_PATH" | grep -qE '\.scss$'; then

  # S-01: 素タグセレクタ（コメント行除外）
  BARE_TAGS=$(grep -nE '^\s*(a|p|h[1-6]|ul|ol|li|dl|dt|dd|td|th|tr|table|div|span|img|input|button|select|textarea|label|form|nav|header|footer|main|section|article|aside)\s*[,\{]' "$FILE_PATH" | grep -v '^\s*//' || true)
  if [ -n "$BARE_TAGS" ]; then
    VIOLATIONS="${VIOLATIONS}[S-01] 素タグセレクタ検出:\n${BARE_TAGS}\n\n"
  fi

  # S-02: :nth-child / :first-child / :last-child
  NTH=$(grep -n ':nth-child\|:nth-of-type\|:first-child\|:last-child' "$FILE_PATH" | grep -v '^\s*//' || true)
  if [ -n "$NTH" ]; then
    VIOLATIONS="${VIOLATIONS}[S-02] :nth-child系セレクタ検出:\n${NTH}\n\n"
  fi

  # S-07: !important
  IMPORTANT=$(grep -n '!important' "$FILE_PATH" | grep -v '^\s*//' || true)
  if [ -n "$IMPORTANT" ]; then
    VIOLATIONS="${VIOLATIONS}[S-07] !important検出:\n${IMPORTANT}\n\n"
  fi

  # S-06: @import（@use推奨）
  IMPORT=$(grep -n '@import\s' "$FILE_PATH" | grep -v '^\s*//' || true)
  if [ -n "$IMPORT" ]; then
    VIOLATIONS="${VIOLATIONS}[S-06] @import検出（@use推奨）:\n${IMPORT}\n\n"
  fi
fi

# ── HTML検証 ──
if echo "$FILE_PATH" | grep -qE '\.html$'; then

  # H-01: void要素の自己閉じスラッシュ
  VOID_SLASH=$(grep -nE '<(br|hr|img|input|meta|link|area|base|col|embed|param|source|track|wbr)\b[^>]*/>' "$FILE_PATH" || true)
  if [ -n "$VOID_SLASH" ]; then
    VIOLATIONS="${VIOLATIONS}[H-01] void要素に閉じスラッシュ:\n${VOID_SLASH}\n\n"
  fi

  # H-08: img alt欠落
  IMG_NO_ALT=$(grep -nE '<img(?![^>]*\balt\b)[^>]*>' "$FILE_PATH" || true)
  if [ -n "$IMG_NO_ALT" ]; then
    VIOLATIONS="${VIOLATIONS}[H-08] img要素にalt属性なし:\n${IMG_NO_ALT}\n\n"
  fi
fi

# ── JS検証 ──
if echo "$FILE_PATH" | grep -qE '\.js$'; then

  # J-02: console.log
  CONSOLE=$(grep -n 'console\.\(log\|debug\|info\)' "$FILE_PATH" || true)
  if [ -n "$CONSOLE" ]; then
    VIOLATIONS="${VIOLATIONS}[J-02] console.log残存:\n${CONSOLE}\n\n"
  fi
fi

# 違反があればフィードバック
if [ -n "$VIOLATIONS" ]; then
  echo -e "⚠ ガイドライン違反を検出（${FILE_PATH}）:\n${VIOLATIONS}即座に修正してください。" >&2
  # exit 0 で処理は続行（ブロックはしない、フィードバックのみ）
fi

exit 0
