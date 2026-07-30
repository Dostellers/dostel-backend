#!/usr/bin/env python3
"""Fix all Dostel agents: auto models, reset stuck sessions, re-wake failures."""
import json
import subprocess
import sys

COOKIE = '/tmp/paperclip-board.cookies'
API = 'http://127.0.0.1:3100'
AUTH_ORIGIN = 'https://office.witylogix.com'
MUTATION_ORIGIN = 'http://127.0.0.1:3100'
CID = '2741f8bc-95ff-40c7-81a4-c8f59131c250'
CODING_MODEL = 'omniroute/coding-stable'
GENERAL_MODEL = 'opencode-omniroute/auto/best-free'
PLAIN_ENV = {
    'OMNIROUTE_API_KEY': 'local-dev',
    'OPENAI_API_KEY': 'local-dev',
    'OPENAI_BASE_URL': 'http://127.0.0.1:20128/v1',
}
CODING_IDS = {
    'cb6613a7-d2c4-400d-8d47-295646a9022f',
    '8ffc8018-6412-44a0-aa37-e24eeb5e5365',
    '1f9f8740-2965-4312-8bde-a7d0c71e1276',
    'f6102f9b-e96c-4601-95d0-f8cab58364f6',
    'b91580aa-9267-4e81-b39a-7b161f903d7c',
}


def curl(method, path, data=None, timeout=60, origin=MUTATION_ORIGIN):
    cmd = [
        'curl', '-sS', '--max-time', str(timeout),
        '-b', COOKIE, '-c', COOKIE,
        '-X', method, f'{API}{path}',
        '-H', 'Content-Type: application/json',
        '-H', f'Origin: {origin}',
        '-H', f'Referer: {origin}/DOS/agents',
    ]
    if data is not None:
        cmd += ['-d', json.dumps(data)]
    out = subprocess.check_output(cmd, text=True, stderr=subprocess.STDOUT)
    return json.loads(out) if out.strip() else {}


def target_model(agent):
    if agent['id'] in CODING_IDS or 'SRE' in agent.get('name', ''):
        return CODING_MODEL
    return GENERAL_MODEL


def main():
    curl('POST', '/api/auth/sign-in/email', {
        'email': 'connect@wityliti.io',
        'password': 'Wityliti@2026',
    }, timeout=30, origin=AUTH_ORIGIN)

    agents = curl('GET', f'/api/companies/{CID}/agents', timeout=30)
    names = {a['id']: a['name'] for a in agents}

    runs = curl('GET', f'/api/companies/{CID}/heartbeat-runs?limit=50', timeout=30)
    items = runs if isinstance(runs, list) else runs.get('runs') or []
    latest = {}
    for r in items:
        aid = r.get('agentId')
        if aid not in latest:
            latest[aid] = r

    wake_ids = []
    print('=== PATCH MODELS ===')
    for agent in agents:
        aid = agent['id']
        name = agent.get('name', aid)
        want = target_model(agent)
        ac = dict(agent.get('adapterConfig') or {})
        ac['model'] = want
        ac['extraArgs'] = []
        ac['env'] = PLAIN_ENV
        curl('PATCH', f'/api/agents/{aid}', {'adapterConfig': ac}, timeout=45)
        print(f'  {name}: {want}')

        run = latest.get(aid, {})
        st = run.get('status', '')
        err = str(run.get('error') or run.get('failureReason') or '')
        wrong_model = 'auto/' not in (agent.get('adapterConfig') or {}).get('model', '')
        if st in ('failed', 'timed_out') or wrong_model or st == 'running':
            wake_ids.append(aid)

    print('\n=== RESET + WAKE ===')
    for aid in wake_ids:
        name = names.get(aid, aid)
        try:
            curl('POST', f'/api/agents/{aid}/runtime-state/reset-session', {'taskKey': None}, timeout=20)
        except Exception:
            pass
        try:
            wake = curl('POST', f'/api/agents/{aid}/wakeup', {
                'source': 'on_demand',
                'triggerDetail': 'manual',
                'reason': 'Fix auto-routing models and clear stuck sessions',
            }, timeout=20)
            print(f'  {name}: {wake.get("status")} ({wake.get("id", "")[:8]})')
        except Exception as err:
            print(f'  {name}: wake failed — {err}', file=sys.stderr)


if __name__ == '__main__':
    main()
