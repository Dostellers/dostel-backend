#!/usr/bin/env bash
# Dostel platform health check — used by SRE agent and systemd watchdog
set -euo pipefail

PUBLIC_IP="${DOSTEL_PUBLIC_IP:-65.109.113.80}"
FAIL=0
REPORT=""

check_http() {
  local name="$1" url="$2" expect="${3:-200}"
  local code
  code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "$url" 2>/dev/null || echo "000")
  if [ "$code" = "$expect" ] || { [ "$expect" = "2xx" ] && [ "${code:0:1}" = "2" ]; }; then
    REPORT+="$name: OK ($code)\n"
  else
    REPORT+="$name: FAIL ($code) $url\n"
    FAIL=1
  fi
}

check_graphql() {
  local name="$1" url="$2"
  local code
  code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 -X POST -H 'Content-Type: application/json' -d '{"query":"{ __typename }"}' "$url" 2>/dev/null || echo "000")
  if [ "${code:0:1}" = "2" ]; then
    REPORT+="$name: OK ($code)\n"
  else
    REPORT+="$name: FAIL ($code) $url\n"
    FAIL=1
  fi
}

check_http "Paperclip" "http://127.0.0.1:3100/" "2xx"
check_http "Guest frontend" "http://127.0.0.1:3001/" "2xx"
check_http "Admin PMS" "http://127.0.0.1:3002/" "2xx"
check_graphql "GraphQL" "http://127.0.0.1:4000/graphql"
check_http "OmniRoute" "http://127.0.0.1:20128/v1/models" "2xx"

printf "%b" "$REPORT"
exit $FAIL
