#!/usr/bin/env python3
"""Switch Dostel agents to OmniRoute auto-routing models."""
import json
import subprocess
import sys

COOKIE = '/tmp/paperclip-board.cookies'
ORIGIN = 'http://localhost:3100'
CID = '2741f8bc-95ff-40c7-81a4-c8f59131c250'
PLAIN_ENV = {
    'OMNIROUTE_API_KEY': 'local-dev',
    'OPENAI_API_KEY': 'local-dev',
    'OPENAI_BASE_URL': 'http://127.0.0.1:20128/v1',
}

# OmniRoute picks upstream from free/coding pools — no single-model lock-in
CODING_MODEL = 'opencode-omniroute/auto/best-coding'
GENERAL_MODEL = 'opencode-omniroute/auto/best-free'

CODING_AGENT_IDS = {
    'cb6613a7-d2c4-400d-8d47-295646a9022f',  # CTO
    '8ffc8018-6412-44a0-aa37-e24eeb5e5365',  # Builder
    '1f9f8740-2965-4312-8bde-a7d0c71e1276',  # UI Engineer
    'f6102f9b-e96c-4601-95d0-f8cab58364f6',  # Design Systems
    'b91580aa-9267-4e81-b39a-7b161f903d7c',  # QA
}


def curl(method, path, data=None, timeout=60):
    cmd = [
        'curl', '-sS', '--max-time', str(timeout),
        '-b', COOKIE, '-c', COOKIE,
        '-X', method, f'{ORIGIN}{path}',
        '-H', 'Content-Type: application/json',
        '-H', f'Origin: {ORIGIN}',
    ]
    if data is not None:
        cmd += ['-d', json.dumps(data)]
    out = subprocess.check_output(cmd, text=True, stderr=subprocess.STDOUT)
    return json.loads(out) if out.strip() else {}


def main():
    curl('POST', '/api/auth/sign-in/email', {
        'email': 'connect@wityliti.io',
        'password': 'Wityliti@2026',
    }, timeout=30)

    agents = curl('GET', f'/api/companies/{CID}/agents', timeout=30)
    for agent in agents:
        agent_id = agent['id']
        name = agent.get('name', agent_id)
        model = CODING_MODEL if agent_id in CODING_AGENT_IDS else GENERAL_MODEL
        if 'SRE' in name:
            model = CODING_MODEL

        ac = dict(agent.get('adapterConfig') or {})
        ac['model'] = model
        ac['extraArgs'] = []
        ac['env'] = PLAIN_ENV
        curl('PATCH', f'/api/agents/{agent_id}', {'adapterConfig': ac}, timeout=45)
        print(f'{name}: {model}')

    # Wake a few agents that had model errors
    for agent_id in ['1f9f8740-2965-4312-8bde-a7d0c71e1276', '8ffc8018-6412-44a0-aa37-e24eeb5e5365']:
        try:
            curl('POST', f'/api/agents/{agent_id}/runtime-state/reset-session', {'taskKey': None}, timeout=20)
            wake = curl('POST', f'/api/agents/{agent_id}/wakeup', {
                'source': 'on_demand',
                'triggerDetail': 'manual',
                'reason': 'Switched to OmniRoute auto-routing (best-free / best-coding)',
            }, timeout=20)
            print(f'woke {agent_id}: {wake.get("status")}')
        except Exception as err:
            print(f'wake failed {agent_id}: {err}', file=sys.stderr)


if __name__ == '__main__':
    main()
