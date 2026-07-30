#!/usr/bin/env python3
"""Pin core Dostel eng agents to coding-stable combo (codex-first)."""
import json
import subprocess
import sys

COOKIE = '/tmp/paperclip-board.cookies'
API = 'http://127.0.0.1:3100'
AUTH_ORIGIN = 'https://office.witylogix.com'
MUTATION_ORIGIN = 'http://127.0.0.1:3100'
CID = '2741f8bc-95ff-40c7-81a4-c8f59131c250'
CODING_MODEL = 'omniroute/coding-stable'
ENV = {
    'OMNIROUTE_API_KEY': 'local-dev',
    'OPENAI_API_KEY': 'local-dev',
    'OPENAI_BASE_URL': 'http://127.0.0.1:20128/v1',
}

CORE = {
    '8ffc8018-6412-44a0-aa37-e24eeb5e5365': 'Builder',
    'b91580aa-9267-4e81-b39a-7b161f903d7c': 'QA',
    '388beb2f-682d-4af8-a436-e78a5414fcde': 'SRE',
    'cb6613a7-d2c4-400d-8d47-295646a9022f': 'CTO',
}


def curl(method, path, data=None, timeout=45, origin=MUTATION_ORIGIN):
    cmd = [
        'curl', '-sS', '--max-time', str(timeout),
        '-b', COOKIE, '-c', COOKIE,
        '-X', method, f'{API}{path}',
        '-H', 'Content-Type: application/json',
        '-H', f'Origin: {origin}',
    ]
    if data is not None:
        cmd += ['-d', json.dumps(data)]
    out = subprocess.check_output(cmd, text=True)
    parsed = json.loads(out) if out.strip() else {}
    if isinstance(parsed, dict) and parsed.get('error'):
        raise RuntimeError(f'{method} {path}: {parsed["error"]}')
    return parsed


def main():
    curl('POST', '/api/auth/sign-in/email', {
        'email': 'connect@wityliti.io',
        'password': 'Wityliti@2026',
    }, origin=AUTH_ORIGIN)

    for aid, label in CORE.items():
        agent = curl('GET', f'/api/agents/{aid}')
        ac = dict(agent.get('adapterConfig') or {})
        ac['model'] = CODING_MODEL
        ac['extraArgs'] = []
        ac['env'] = ENV
        curl('PATCH', f'/api/agents/{aid}', {'adapterConfig': ac})
        print(f'pinned {label} -> {CODING_MODEL}')


if __name__ == '__main__':
    try:
        main()
    except Exception as err:
        print('FAILED:', err, file=sys.stderr)
        sys.exit(1)
