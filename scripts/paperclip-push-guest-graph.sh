#!/usr/bin/env bash
# Push the Guest Graph issue pack (DOS-500..504) into Paperclip.
#
# Source of truth: .paperclip/issues/DOS-50{0..4}-*.md
# Teardown brief:  .paperclip/pm/hotel-tech-teardown-2026-08-07.md
#
# Requires a valid board or agent credential:
#   paperclipai auth login          # approve in browser, then re-run this script
# or export PAPERCLIP_API_KEY with a live token.
#
# Optional: PAPERCLIP_GOAL_ID, PAPERCLIP_PROJECT_ID to file the epic under a goal/project.
# Idempotency: this script CREATES issues. Running it twice creates duplicates.

set -euo pipefail

cd "$(dirname "$0")/.."

: "${PAPERCLIP_API_URL:?PAPERCLIP_API_URL not set}"
: "${PAPERCLIP_API_KEY:?PAPERCLIP_API_KEY not set}"
: "${PAPERCLIP_COMPANY_ID:?PAPERCLIP_COMPANY_ID not set}"

RUN_ID="${PAPERCLIP_RUN_ID:-manual-guest-graph-push}"
ISSUE_DIR=".paperclip/issues"

auth_header=(-H "Authorization: Bearer ${PAPERCLIP_API_KEY}")
run_header=(-H "X-Paperclip-Run-Id: ${RUN_ID}")

echo "==> Verifying credentials against ${PAPERCLIP_API_URL}"
if ! curl -sf "${auth_header[@]}" "${PAPERCLIP_API_URL}/api/agents/me" >/dev/null 2>&1; then
  echo "ERROR: credential rejected. Run 'paperclipai auth login', approve in the browser," >&2
  echo "       then re-export PAPERCLIP_API_KEY and try again." >&2
  exit 1
fi

# create_issue <file> <title> <priority> <parentId-or-empty>  -> echoes new issue id
create_issue() {
  local file="$1" title="$2" priority="$3" parent="${4:-}"

  local payload
  payload=$(
    FILE="$file" TITLE="$title" PRIORITY="$priority" PARENT="$parent" \
    GOAL="${PAPERCLIP_GOAL_ID:-}" PROJECT="${PAPERCLIP_PROJECT_ID:-}" \
    python3 - <<'PY'
import json, os
body = open(os.environ["FILE"], encoding="utf-8").read()
issue = {
    "title": os.environ["TITLE"],
    "description": body,
    "status": "todo",
    "priority": os.environ["PRIORITY"],
}
for key, env in (("parentId", "PARENT"), ("goalId", "GOAL"), ("projectId", "PROJECT")):
    if os.environ.get(env):
        issue[key] = os.environ[env]
print(json.dumps(issue))
PY
  )

  local resp
  resp=$(curl -sf -X POST \
    "${auth_header[@]}" "${run_header[@]}" \
    -H 'Content-Type: application/json' \
    -d "$payload" \
    "${PAPERCLIP_API_URL}/api/companies/${PAPERCLIP_COMPANY_ID}/issues")

  python3 -c 'import sys,json; d=json.load(sys.stdin); i=d.get("issue",d); print(i["id"], i.get("identifier",""))' <<<"$resp"
}

echo "==> Creating epic DOS-500"
read -r EPIC_ID EPIC_IDENT < <(create_issue \
  "${ISSUE_DIR}/DOS-500-pm-guest-graph-epic.md" \
  "Guest Graph — make guest memory a system of record" \
  "high" "")
echo "    epic: ${EPIC_IDENT:-$EPIC_ID}"

declare -a CHILDREN=(
  "DOS-501-pm-wifi-captive-portal-capture.md|WiFi captive-portal capture → Dosteller signup|critical"
  "DOS-502-pm-guest-memory-graph.md|Guest memory graph — staff voice capture → structured guest facts|critical"
  "DOS-503-pm-verifiable-reliability-telemetry.md|Verifiable reliability telemetry — publish the record, not the claim|high"
  "DOS-504-pm-whatsapp-concierge-agent.md|WhatsApp concierge agent grounded in the guest graph|medium"
)

for row in "${CHILDREN[@]}"; do
  IFS='|' read -r fname title prio <<<"$row"
  echo "==> Creating ${fname%%-*} child"
  read -r CID CIDENT < <(create_issue "${ISSUE_DIR}/${fname}" "$title" "$prio" "$EPIC_ID")
  echo "    child: ${CIDENT:-$CID}"
done

echo
echo "Done. Epic: ${EPIC_IDENT:-$EPIC_ID}"
echo "Assign owners in Paperclip — these are created unassigned."
