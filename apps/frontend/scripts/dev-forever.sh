#!/usr/bin/env bash
# Supervised dev server for the review box.
#
# `next dev` has died repeatedly on this machine — every time, the cause was
# root-owned files landing in .next while the server runs as paperclip
# (agents' tooling runs as root). A crashed dev server then serves 404s/500s
# until a human notices. This loop makes recovery automatic and, before each
# start, sweeps ownership and clears a poisoned cache so the restart succeeds.
#
# Run as paperclip:
#   su paperclip -c "setsid nohup bash apps/frontend/scripts/dev-forever.sh \
#     >/tmp/dostel-dev-supervisor.log 2>&1 < /dev/null &"

set -u
cd "$(dirname "$0")/.." || exit 1

LOG=/tmp/dostel-dev.log

# NOTE: the platform already respawns `npm exec next dev -p 3001` as
# paperclip (parented to init), so this script is a fallback, not the
# primary supervisor. Cache poisoning is prevented structurally instead:
# next.config.js splits distDir by euid (.next for paperclip, .next-root
# for root), so no root process can ever write into this server's cache.

while true; do
  # Belt-and-braces: if root-owned files somehow land in our dist dir, the
  # server cannot rewrite its manifests — clear rather than fight.
  if [ -n "$(find .next -user root -print -quit 2>/dev/null)" ]; then
    echo "[supervisor] root-owned files in .next — clearing cache at $(date)" >> "$LOG"
    rm -rf .next 2>/dev/null
  fi

  echo "[supervisor] starting next dev at $(date)" >> "$LOG"
  npx next dev -p 3001 --hostname 0.0.0.0 >> "$LOG" 2>&1
  echo "[supervisor] next dev exited (code $?) at $(date) — restart in 3s" >> "$LOG"
  sleep 3
done
