#!/usr/bin/env python3
"""Verify OmniRoute providers in priority order: codex, kilocode, groq, nvidia."""
import json
import subprocess
import sys

BASE = 'http://127.0.0.1:20128'
AUTH = 'Bearer local-dev'

VERIFY_ORDER = [
    ('codex', 'codex/gpt-5.6-sol'),
    ('kilocode', 'kilocode/openrouter/free'),
    ('groq', 'groq/llama-3.3-70b-versatile'),
    ('nvidia', 'nvidia/nvidia/nemotron-3-super-120b-a12b'),
]

COMBO_TESTS = [
    ('coding-stable', 'coding-stable'),
    ('auto/best-coding', 'auto/best-coding'),
    ('auto/best-free', 'auto/best-free'),
]


def chat(model, timeout=25):
    cmd = [
        'curl', '-sS', '--max-time', str(timeout),
        '-H', f'Authorization: {AUTH}',
        '-H', 'Content-Type: application/json',
        f'{BASE}/v1/chat/completions',
        '-d', json.dumps({
            'model': model,
            'messages': [{'role': 'user', 'content': 'reply ok only'}],
            'max_tokens': 8,
            'stream': False,
        }),
    ]
    try:
        out = subprocess.check_output(cmd, text=True)
        data = json.loads(out)
        if data.get('error'):
            return False, str(data['error'])[:120]
        reply = data.get('choices', [{}])[0].get('message', {}).get('content', '')
        routed = data.get('model', '?')
        return True, f'{routed} -> {reply.strip()[:40]}'
    except subprocess.CalledProcessError as err:
        return False, f'timeout/error: {err}'
    except json.JSONDecodeError as err:
        return False, f'bad json: {err}'


def main():
    print('=== PROVIDER MODELS (codex first) ===')
    failed = 0
    for name, model in VERIFY_ORDER:
        ok, msg = chat(model)
        status = 'OK' if ok else 'FAIL'
        print(f'  [{status}] {name:12} {model:45} {msg}')
        if not ok:
            failed += 1

    print('\n=== COMBOS ===')
    for label, model in COMBO_TESTS:
        ok, msg = chat(model, timeout=35)
        status = 'OK' if ok else 'FAIL'
        print(f'  [{status}] {label:16} {msg}')
        if not ok:
            failed += 1

    if failed:
        print(f'\n{failed} check(s) failed')
        sys.exit(1)
    print('\nAll checks passed')


if __name__ == '__main__':
    main()
