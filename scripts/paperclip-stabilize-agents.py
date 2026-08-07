#!/usr/bin/env python3
"""Stabilize Dostel agents: verify models, reset stuck runs, throttle concurrency."""
import json
import subprocess
import sys
import time

COOKIE = '/tmp/paperclip-board.cookies'
ORIGIN = 'http://localhost:3100'
CID = '2741f8bc-95ff-40c7-81a4-c8f59131c250'
CODING_MODEL = 'opencode-omniroute/auto/best-coding'
GENERAL_MODEL = 'opencode-omniroute/auto/best-free'
PLAIN_ENV = {
    'OMNIROUTE_API_KEY': 'local-dev',
    'OPENAI_API_KEY': 'local-dev',
    'OPENAI_BASE_URL': 'http://127.0.0.1:20128/v1',
}
CODING_IDS = {
    'cb6613a7-d2c4-400d-8d47-295646a9022f',  # CTO
    '8ffc8018-6412-44a0-aa37-e24eeb5e5365',  # Builder
    '1f9f8740-2965-4312-8bde-a7d0c71e1276',  # UI Engineer
    'f6102f9b-e96c-4601-95d0-f8cab58364f6',  # Design Systems
    'b91580aa-9267-4e81-b39a-7b161f903d7c',  # QA
    '388beb2f-682d-4af8-a436-e78a5414fcde',  # SRE
}
# Stagger heartbeats to avoid 15 opencode processes at once (OOM risk)
INTERVALS = {
    'Builder': 600,
    'QA': 900,
    'SRE': 300,
    'CTO': 900,
    'UI Engineer': 1200,
    'PM': 1800,
    'CEO': 3600,
}
DEFAULT_INTERVAL = 2400


def curl(method, path, data=None, timeout=60):
    cmd = [
        'curl', '-sS', '--max-time', str(timeout),
        '-b', COOKIE,
        '-X', method, f'{ORIGIN}{path}',
        '-H', 'Content-Type: application/json',
        '-H', f'Origin: {ORIGIN}',
    ]
    if data is not None:
        cmd += ['-d', json.dumps(data)]
    out = subprocess.check_output(cmd, text=True, stderr=subprocess.STDOUT)
    return json.loads(out) if out.strip() else {}


def target_model(agent):
    if agent['id'] in CODING_IDS:
        return CODING_MODEL
    return GENERAL_MODEL


def target_interval(name):
    for key, sec in INTERVALS.items():
        if key in name:
            return sec
    return DEFAULT_INTERVAL


def main():
    agents = curl('GET', f'/api/companies/{CID}/agents', timeout=30)
    print(f'Agents: {len(agents)}')

    for agent in agents:
        aid = agent['id']
        name = agent.get('name', aid)
        model = target_model(agent)
        interval = target_interval(name)

        ac = dict(agent.get('adapterConfig') or {})
        ac['model'] = model
        ac['extraArgs'] = []
        ac['env'] = PLAIN_ENV

        rc = dict(agent.get('runtimeConfig') or {})
        hb = dict(rc.get('heartbeat') or {})
        hb['enabled'] = True
        hb['intervalSec'] = interval
        hb['wakeOnDemand'] = True
        hb['maxConcurrentRuns'] = 1
        rc['heartbeat'] = hb

        curl('PATCH', f'/api/agents/{aid}', {
            'adapterConfig': ac,
            'runtimeConfig': rc,
        }, timeout=45)
        print(f'  patched {name}: {model} interval={interval}s')

        try:
            curl('POST', f'/api/agents/{aid}/runtime-state/reset-session', {'taskKey': None}, timeout=20)
        except subprocess.CalledProcessError:
            pass

        if agent.get('status') == 'error' or 'Builder' in name or 'QA' in name or 'SRE' in name:
            try:
                curl('POST', f'/api/agents/{aid}/wakeup', {
                    'source': 'on_demand',
                    'triggerDetail': 'manual',
                    'reason': 'Stabilize after Paperclip OOM/restart',
                }, timeout=20)
                print(f'  woke {name}')
                time.sleep(2)
            except subprocess.CalledProcessError as err:
                print(f'  wake failed {name}: {err}', file=sys.stderr)

    statuses = curl('GET', f'/api/companies/{CID}/agents', timeout=30)
    errors = [a['name'] for a in statuses if a.get('status') == 'error']
    running = [a['name'] for a in statuses if a.get('status') == 'running']
    print(f'Done. running={len(running)} errors={len(errors)}')
    if errors:
        print('Still error:', ', '.join(errors[:5]))


if __name__ == '__main__':
    main()
