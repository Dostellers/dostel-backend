#!/usr/bin/env python3
"""Tune OmniRoute: codex-first coding-stable combo, disable exhausted providers."""
import json
import sqlite3
from datetime import datetime, timezone

DB = '/root/.omniroute/storage.sqlite'
COMBO_ID = '00ba1329-cba9-4a6a-9800-7a9480488800'

CODING_MODELS = [
    {'provider': 'codex', 'model': 'gpt-5.6-sol', 'priority': 1},
    {'provider': 'kilocode', 'model': 'openrouter/free', 'priority': 2},
    {'provider': 'groq', 'model': 'llama-3.3-70b-versatile', 'priority': 3},
    {'provider': 'nvidia', 'model': 'nvidia/nemotron-3-super-120b-a12b', 'priority': 4},
    {'provider': 'nvidia', 'model': 'openai/gpt-oss-20b', 'priority': 5},
]

DISABLE_PROVIDERS = {'kimi-coding', 'cerebras', 'amazon-q', 'firecrawl', 'agy', 'antigravity'}

PRIORITY_ORDER = ['codex', 'kilocode', 'groq', 'nvidia', 'antigravity', 'agy']


def main():
    now = datetime.now(timezone.utc).isoformat()
    conn = sqlite3.connect(DB)
    cur = conn.cursor()

    combo = {
        'name': 'coding-stable',
        'strategy': 'priority',
        'enabled': True,
        'models': CODING_MODELS,
        'config': {'fallback': True, 'maxRetries': 1},
    }
    cur.execute(
        'UPDATE combos SET data = ?, updated_at = ? WHERE id = ?',
        (json.dumps(combo), now, COMBO_ID),
    )
    print('updated coding-stable combo')

    for i, provider in enumerate(PRIORITY_ORDER):
        cur.execute(
            'UPDATE provider_connections SET global_priority = ? WHERE provider = ? AND is_active = 1',
            (i + 1, provider),
        )

    for provider in DISABLE_PROVIDERS:
        cur.execute(
            'UPDATE provider_connections SET is_active = 0 WHERE provider = ?',
            (provider,),
        )
        print('disabled provider', provider)

    conn.commit()
    conn.close()
    print('done')


if __name__ == '__main__':
    main()
