#!/usr/bin/env python3
"""Clear OmniRoute stale errors, model lockouts, and fix provider health state."""
import json
import sqlite3
import subprocess
import sys
from datetime import datetime, timezone

BASE = 'http://127.0.0.1:20128'
AUTH = 'Bearer local-dev'
DB = '/root/.omniroute/storage.sqlite'

# Keep disabled — do not reactivate via autopilot
KEEP_DISABLED = {
    'chipotle', 'duckduckgo-web', 'mimocode', 'opencode', 'theoldllm',
    'kimi-coding', 'cerebras',
}

# Disable unused/broken connections that pollute the dashboard
DISABLE_PROVIDERS = {'amazon-q', 'firecrawl'}

SAFE_ACTIONS = {
    'clear_stale_connection_error',
    'clear_model_lockout',
    'clear_connection_cooldown',
    'clear_provider_breaker',
}


def curl(method, path, data=None, timeout=25):
    cmd = [
        'curl', '-sS', '--max-time', str(timeout), '-X', method, f'{BASE}{path}',
        '-H', f'Authorization: {AUTH}', '-H', 'Content-Type: application/json',
    ]
    if data is not None:
        cmd += ['-d', json.dumps(data)]
    out = subprocess.check_output(cmd, text=True)
    return json.loads(out or '{}')


def disable_broken_providers():
    now = datetime.now(timezone.utc).isoformat()
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    for provider in DISABLE_PROVIDERS:
        cur.execute(
            '''UPDATE provider_connections
               SET is_active = 0, test_status = 'disabled', last_error = NULL,
                   error_code = NULL, updated_at = ?
               WHERE provider = ?''',
            (now, provider),
        )
        print(f'  disabled {provider}')
    conn.commit()
    conn.close()


def apply_autopilot_actions():
    report = curl('GET', '/api/providers/health-autopilot')
    applied = 0
    skipped = 0
    for provider in report.get('providers', []):
        pname = provider.get('provider')
        for issue in provider.get('issues', []):
            for action in issue.get('actions', []):
                atype = action.get('type')
                target = action.get('target') or {}
                tprovider = target.get('provider')

                if atype == 'reactivate_connection' and tprovider in KEEP_DISABLED:
                    skipped += 1
                    continue
                if atype == 'deactivate_connection':
                    skipped += 1
                    continue
                if atype not in SAFE_ACTIONS:
                    skipped += 1
                    continue

                payload = {
                    'type': atype,
                    'target': target,
                    'preconditionsHash': action['preconditionsHash'],
                    'confirm': True,
                }
                res = curl('POST', '/api/providers/health-autopilot/actions', payload)
                ok = res.get('success')
                print(f'  [{("OK" if ok else "FAIL")}] {atype} {target}')
                if not ok:
                    print(f'       {res.get("error", res)}')
                else:
                    applied += 1
    return applied, skipped


def fix_groq_status():
    now = datetime.now(timezone.utc).isoformat()
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute(
        '''UPDATE provider_connections
           SET test_status = 'active', last_error = NULL, error_code = NULL,
               default_model = 'llama-3.3-70b-versatile', updated_at = ?
           WHERE provider = 'groq' AND is_active = 1''',
        (now,),
    )
    conn.commit()
    conn.close()
    print('  reset groq test_status -> active')


def test_core_models():
    tests = [
        ('codex', 'gpt-5.6-sol'),
        ('groq', 'llama-3.3-70b-versatile'),
        ('nvidia', 'nvidia/nemotron-3-super-120b-a12b'),
        ('kilocode', 'openrouter/free'),
    ]
    print('\n=== MODEL TESTS (dashboard availability) ===')
    failed = 0
    for provider_id, model_id in tests:
        res = curl('POST', '/api/models/test', {
            'providerId': provider_id,
            'modelId': model_id,
        }, timeout=60)
        ok = res.get('status') == 'ok'
        print(f"  [{'OK' if ok else 'FAIL'}] {provider_id}/{model_id} latency={res.get('latencyMs')}ms")
        if not ok:
            print(f"       {res.get('error', res)}")
            failed += 1
    return failed


def test_core_providers():
    tests = [
        ('codex', 'codex/gpt-5.6-sol'),
        ('groq', 'groq/llama-3.3-70b-versatile'),
        ('nvidia', 'nvidia/nvidia/nemotron-3-super-120b-a12b'),
        ('coding-stable', 'coding-stable'),
    ]
    print('\n=== VERIFY CHAT ROUTING ===')
    failed = 0
    for name, model in tests:
        res = curl('POST', '/v1/chat/completions', {
            'model': model,
            'messages': [{'role': 'user', 'content': 'reply ok only'}],
            'max_tokens': 8,
            'stream': False,
        }, timeout=35)
        if res.get('error'):
            print(f'  [FAIL] {name}: {str(res["error"])[:100]}')
            failed += 1
        else:
            reply = res.get('choices', [{}])[0].get('message', {}).get('content', '')
            routed = res.get('model', '?')
            print(f'  [OK]   {name}: {routed} -> {reply.strip()[:30]}')
    return failed


def print_summary():
    matrix = curl('GET', '/api/providers/health-matrix?range=24h')
    summary = matrix.get('summary', {})
    print('\n=== HEALTH MATRIX SUMMARY ===')
    print(json.dumps(summary, indent=2))
    for p in matrix.get('providers', []):
        if p.get('state') != 'healthy' and p.get('provider') not in KEEP_DISABLED:
            print(f"  {p['provider']:18} {p['state']:9} issues={p.get('issueCount',0)}")


def main():
    print('=== DISABLE BROKEN PROVIDERS ===')
    disable_broken_providers()

    print('\n=== APPLY HEALTH AUTOPILOT ACTIONS ===')
    applied, skipped = apply_autopilot_actions()
    print(f'  applied={applied} skipped={skipped}')

    print('\n=== FIX GROQ STATUS ===')
    fix_groq_status()

    failed = test_core_models()
    failed += test_core_providers()
    print_summary()

    if failed:
        print(f'\n{failed} routing check(s) failed')
        sys.exit(1)
    print('\nDone — refresh OmniRoute dashboard Model Availability')


if __name__ == '__main__':
    main()
