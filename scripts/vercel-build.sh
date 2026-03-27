#!/bin/bash
# Vercel用ビルドスクリプト
# Build Output API v3 を使って静的サイト + Edge Middlewareを構成する

set -e

# 1. 通常のビルド（workbench → mock/）
npm run build

# 2. Build Output API ディレクトリ構成を作成
rm -rf .vercel/output
mkdir -p .vercel/output/static
mkdir -p .vercel/output/functions/_middleware.func

# 3. mock/ の中身を static/ にコピー
cp -R mock/* .vercel/output/static/

# 4. Edge Middleware関数を配置
cat > .vercel/output/functions/_middleware.func/index.js << 'MIDDLEWARE'
export default function handler(request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = atob(encoded);
      const [user, ...passParts] = decoded.split(':');
      const pass = passParts.join(':');

      if (
        user === process.env.BASIC_AUTH_USER &&
        pass === process.env.BASIC_AUTH_PASSWORD
      ) {
        return;
      }
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Protected"',
    },
  });
}
MIDDLEWARE

cat > .vercel/output/functions/_middleware.func/.vc-config.json << 'VCCONFIG'
{
  "runtime": "edge",
  "entrypoint": "index.js"
}
VCCONFIG

# 5. ルーティング設定
cat > .vercel/output/config.json << 'CONFIG'
{
  "version": 3,
  "routes": [
    { "src": "/(.*)", "middlewarePath": "_middleware", "continue": true }
  ]
}
CONFIG

echo "Build Output API structure created successfully."
