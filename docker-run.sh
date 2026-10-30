#!/usr/bin/env bash
# Build + run Turboztarot168 (incl. admin) in Docker. Run with sudo.
# Port 3100 -> container 3000 (dev server keeps 3000).
set -euo pipefail
cd "$(dirname "$0")/my-app" 2>/dev/null || cd "$(dirname "$0")"

set -a
. ./.env.local
set +a

IMG=turboztarot168:latest
NAME=turboztarot168

echo "==> Building $IMG"
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --build-arg NEXT_PUBLIC_ADMIN_USERNAME="${NEXT_PUBLIC_ADMIN_USERNAME:-turboz}" \
  --build-arg NEXT_PUBLIC_ADMIN_EMAIL="${NEXT_PUBLIC_ADMIN_EMAIL:-admin@example.com}" \
  --build-arg NEXT_PUBLIC_LINE_OA_ID="${NEXT_PUBLIC_LINE_OA_ID:-}" \
  --build-arg NEXT_PUBLIC_LINE_OA_URL="${NEXT_PUBLIC_LINE_OA_URL:-}" \
  -t "$IMG" .

echo "==> Stopping old container (if any)"
docker rm -f "$NAME" >/dev/null 2>&1 || true

echo "==> Running $NAME on :3100"
docker run -d --name "$NAME" \
  --env-file .env.local \
  --restart unless-stopped \
  -p 3100:3000 \
  "$IMG"

echo "==> Done. Admin: http://localhost:3100/admin/login"
