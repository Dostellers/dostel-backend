#!/usr/bin/env python3
"""Recover Dostel agents: pause non-core, cancel stuck runs, wake core eng only."""
import json
import subprocess
import sys
import time

COOKIE = '/tmp/paperclip-board.cookies'
API = 'http://127.0.0.1:3100'
AUTH_ORIGIN = 'https://office.witylogix.com'
MUTATION_ORIGIN = 'http://127.0.0.1:3100'
CID = '2741f8bc-95ff-40c7-81a4-c8f59131c250'

CORE = {
    '8ffc8018-6412-44a0-aa37-e24eeb5e5365',  # Builder
    'b91580aa-9267-4e81-b39a-7b161f903d7c',  # QA
    '388beb2f-682d-4af8-a436-e78a5414fcde',  # SRE
    'cb6613a7-d2c4-400d-8d47-295646a9022f',  # CTO
}

CORE_WAKE_ORDER = [
    '388beb2f-682d-4af8-a436-e78a5414fcde',  # SRE first — health check
    'cb6613a7-d2c4-400d-8d47-295646a9022f',  # CTO
    '8ffc8018-6412-44a0-aa37-e24eeb5e5365',  # Builder
    'b91580aa-9267-4e81-b39a-7b161f903d7c',  # QA
]


def curl(method, path, data=None, timeout=45, origin=MUTATION_ORIGIN):
    cmd = [
        'curl', '-sS', '--max-time', str(timeout),
        '-b', COOKIE, '-c', COOKIE,
        '-X', method, f'{API}{path}',
        '-H', 'Content-Type: application/json',
        '-H', f'Origin: {origin}',
        '-H', f'Referer: {origin}/DOS/inbox',
    ]
    if data is not None:
        cmd += ['-d', json.dumps(data)]
    out = subprocess.check_output(cmd, text=True, stderr=subprocess.STDOUT)
    if not out.strip():
        return {}
    parsed = json.loads(out)
    if isinstance(parsed, dict) and parsed.get('error'):
        raise RuntimeError(f'{method} {path}: {parsed["error"]}')
    return parsed


def login():
    curl('POST', '/api/auth/sign-in/email', {
        'email': 'connect@wityliti.io',
        'password': 'Wityliti@2026',
    }, timeout=30, origin=AUTH_ORIGIN)


def main():
    login()
    print('logged in')

    live = curl('GET', f'/api/companies/{CID}/live-runs', timeout=20)
    if not isinstance(live, list):
        live = []
    for run in live:
        rid = run.get('id')
        if rid:
            try:
                curl('POST', f'/api/heartbeat-runs/{rid}/cancel', timeout=15)
                print('cancelled run', rid[:8], run.get('agentName'))
            except (subprocess.CalledProcessError, RuntimeError) as err:
                print('cancel skip', rid[:8], err, file=sys.stderr)

    agents = curl('GET', f'/api/companies/{CID}/agents', timeout=30)
    names = {a['id']: a.get('name', a['id']) for a in agents}

    for agent in agents:
        aid = agent['id']
        name = agent.get('name', aid)
        if aid in CORE:
            if agent.get('status') == 'paused':
                curl('POST', f'/api/agents/{aid}/resume', timeout=15)
                print('resumed', name)
            try:
                curl('POST', f'/api/agents/{aid}/runtime-state/reset-session', {'taskKey': None}, timeout=20)
            except (subprocess.CalledProcessError, RuntimeError):
                pass
            print('core ready', name)
        elif agent.get('status') != 'paused':
            curl('POST', f'/api/agents/{aid}/pause', timeout=20)
            print('paused', name)

    time.sleep(2)
    for aid in CORE_WAKE_ORDER:
        result = curl('POST', f'/api/agents/{aid}/wakeup', {
            'source': 'on_demand',
            'triggerDetail': 'manual',
            'reason': 'Recovery — core eng wake after platform restore',
        }, timeout=20)
        run_id = result.get('id', 'skipped') if isinstance(result, dict) else 'skipped'
        print('woke', names.get(aid, aid[:8]), '->', str(run_id)[:8])
        time.sleep(8)

    time.sleep(5)
    agents = curl('GET', f'/api/companies/{CID}/agents', timeout=30)
    counts = {}
    for a in agents:
        counts[a.get('status', '?')] = counts.get(a.get('status', '?'), 0) + 1
    print('AGENT STATUS', counts)

    runs = curl('GET', f'/api/companies/{CID}/heartbeat-runs?limit=20', timeout=30)
    items = runs if isinstance(runs, list) else runs.get('runs', [])
    print('\nLATEST CORE RUNS:')
    seen = set()
    for r in items:
        aid = r.get('agentId')
        if aid not in CORE or aid in seen:
            continue
        seen.add(aid)
        print(f"  {r.get('agentName','?'):28} {r.get('status','?'):10} {(r.get('errorMessage') or '')[:60]}")

    badges = curl('GET', f'/api/companies/{CID}/sidebar-badges', timeout=15)
    print('\nINBOX BADGES', badges)


if __name__ == '__main__':
    try:
        main()
    except Exception as err:
        print('RECOVERY FAILED:', err, file=sys.stderr)
        sys.exit(1)
