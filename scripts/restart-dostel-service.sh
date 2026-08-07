#!/usr/bin/env bash
# Restart a Dostel systemd unit after clearing stale listeners on its port.
# Intended for Dostel SRE and CTO agents (via sudo). Builder should escalate here.
set -euo pipefail

UNIT="${1:-}"
if [ -z "$UNIT" ]; then
  echo "usage: restart-dostel-service.sh <systemd-unit>" >&2
  echo "allowed: dostel-admin.service dostel-frontend.service dostel-backend.service paperclip.service" >&2
  exit 1
fi

case "$UNIT" in
  dostel-admin.service) PORT=3002; APP_DIR=/root/dostel-backend/apps/admin ;;
  dostel-frontend.service) PORT=3001; APP_DIR=/root/dostel-backend/apps/frontend ;;
  dostel-backend.service) PORT=4000; APP_DIR="" ;;
  paperclip.service) PORT=3100; APP_DIR="" ;;
  *)
    echo "unit not allowed: $UNIT" >&2
    exit 1
    ;;
esac

echo "Clearing stale listeners on :$PORT for $UNIT"
if command -v fuser >/dev/null 2>&1; then
  fuser -k "${PORT}/tcp" 2>/dev/null || true
fi
sleep 1

if [ -n "$APP_DIR" ] && [ -f "$APP_DIR/.next/dev/lock" ]; then
  rm -f "$APP_DIR/.next/dev/lock"
fi

systemctl daemon-reload
systemctl restart "$UNIT"
sleep 3
systemctl is-active --quiet "$UNIT"

if [ -n "$APP_DIR" ]; then
  code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "http://127.0.0.1:${PORT}/" 2>/dev/null || echo "000")
  echo "$UNIT active; http://127.0.0.1:${PORT}/ -> $code"
else
  echo "$UNIT active"
fi
