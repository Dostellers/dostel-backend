#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$1"
PORT="$2"
LOCK="$APP_DIR/.next/dev/lock"

# Stop stale dev server holding this app's turbopack lock
if [ -f "$LOCK" ]; then
  stale_pid=$(python3 - <<PY 2>/dev/null || true
import json, os, sys
lock = os.environ.get('LOCK')
try:
  data = json.load(open(lock))
  print(data.get('pid') or data.get('runningPid') or '')
except Exception:
  pass
PY
)
  if [ -n "${stale_pid:-}" ] && kill -0 "$stale_pid" 2>/dev/null; then
    kill "$stale_pid" 2>/dev/null || true
    sleep 1
  fi
  rm -f "$LOCK"
fi

cd "$APP_DIR"
exec npm run dev -- -p "$PORT" -H 0.0.0.0
