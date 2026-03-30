#!/bin/bash
set -e

# 1. 通常のビルド（workbench → mock/）
npx gulp build

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
      if (decoded === 'nopt:heartup2026') {
        return new Response(null, {
          headers: { 'x-middleware-next': '1' },
        });
      }
    }
  }
  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Protected"' },
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
