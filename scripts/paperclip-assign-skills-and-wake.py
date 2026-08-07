#!/usr/bin/env python3
"""Assign company skills to Dostel agents and wake failed agents."""
import json
import subprocess
import sys
import time

COOKIE = '/tmp/paperclip-board.cookies'
ORIGIN = 'http://localhost:3100'
CID = '2741f8bc-95ff-40c7-81a4-c8f59131c250'
CODING_AGENT_IDS = {
    'cb6613a7-d2c4-400d-8d47-295646a9022f',
    '8ffc8018-6412-44a0-aa37-e24eeb5e5365',
    '1f9f8740-2965-4312-8bde-a7d0c71e1276',
    'f6102f9b-e96c-4601-95d0-f8cab58364f6',
    'b91580aa-9267-4e81-b39a-7b161f903d7c',
}
PLAIN_ENV = {
    'OMNIROUTE_API_KEY': 'local-dev',
    'OPENAI_API_KEY': 'local-dev',
    'OPENAI_BASE_URL': 'http://127.0.0.1:20128/v1',
}

ASSIGNMENTS = {
    '7aacb1b4-0c7b-4edd-a4b3-ac51cff16b7a': ('CEO', [
        'paperclipai/paperclip/paperclip',
        'paperclipai/paperclip/para-memory-files',
        'paperclipai/paperclip/paperclip-create-agent',
        'obra/superpowers/brainstorming',
    ]),
    '27086b1d-4109-4396-aae3-223cf097cc67': ('CMO', [
        'paperclipai/paperclip/paperclip',
        'paperclipai/paperclip/para-memory-files',
        'obra/superpowers/brainstorming',
    ]),
    'cdc7530e-12b1-4b7a-9e4c-1b73fde96a4e': ('PM', [
        'paperclipai/paperclip/paperclip',
        'paperclipai/paperclip/para-memory-files',
        'obra/superpowers/brainstorming',
        'obra/superpowers/verification-before-completion',
    ]),
    'cb6613a7-d2c4-400d-8d47-295646a9022f': ('CTO', [
        'paperclipai/paperclip/paperclip',
        'paperclipai/paperclip/para-memory-files',
        'obra/superpowers/systematic-debugging',
        'obra/superpowers/verification-before-completion',
    ]),
    '8ffc8018-6412-44a0-aa37-e24eeb5e5365': ('Builder', [
        'paperclipai/paperclip/paperclip',
        'paperclipai/paperclip/para-memory-files',
        'obra/superpowers/systematic-debugging',
        'obra/superpowers/verification-before-completion',
    ]),
    '1f9f8740-2965-4312-8bde-a7d0c71e1276': ('UI Engineer', [
        'paperclipai/paperclip/paperclip',
        'paperclipai/paperclip/para-memory-files',
        'vercel-labs/agent-eval/frontend-design',
        'google-labs-code/stitch-skills/design-md',
        'obra/superpowers/verification-before-completion',
    ]),
    'f8e3e452-81bf-4665-ac0e-0a0b93f9d5a3': ('Head of Design', [
        'paperclipai/paperclip/paperclip',
        'paperclipai/paperclip/para-memory-files',
        'vercel-labs/agent-eval/frontend-design',
        'google-labs-code/stitch-skills/design-md',
        'obra/superpowers/brainstorming',
    ]),
    'b50a80e5-14a9-413c-bbe4-aa7b14ae8f88': ('Product Designer', [
        'paperclipai/paperclip/paperclip',
        'paperclipai/paperclip/para-memory-files',
        'vercel-labs/agent-eval/frontend-design',
        'google-labs-code/stitch-skills/design-md',
    ]),
    'f6102f9b-e96c-4601-95d0-f8cab58364f6': ('Design Systems', [
        'paperclipai/paperclip/paperclip',
        'paperclipai/paperclip/para-memory-files',
        'vercel-labs/agent-eval/frontend-design',
        'google-labs-code/stitch-skills/design-md',
    ]),
    'b91580aa-9267-4e81-b39a-7b161f903d7c': ('QA', [
        'paperclipai/paperclip/paperclip',
        'paperclipai/paperclip/para-memory-files',
        'vercel-labs/agent-browser/agent-browser',
        'obra/superpowers/systematic-debugging',
        'obra/superpowers/verification-before-completion',
    ]),
    '616fa5e9-da2f-4f82-830c-0da3c1abad93': ('Researcher', [
        'paperclipai/paperclip/paperclip',
        'paperclipai/paperclip/para-memory-files',
        'vercel-labs/agent-browser/agent-browser',
    ]),
    'd908f94f-6fad-46bc-8af5-92aaf53a3a33': ('Content', [
        'paperclipai/paperclip/paperclip',
        'paperclipai/paperclip/para-memory-files',
        'obra/superpowers/brainstorming',
    ]),
    '55e6b187-36d7-4691-b77f-36de6e2162f8': ('Community', [
        'paperclipai/paperclip/paperclip',
        'paperclipai/paperclip/para-memory-files',
        'obra/superpowers/brainstorming',
    ]),
}

SRE_SKILLS = [
    'paperclipai/paperclip/paperclip',
    'paperclipai/paperclip/para-memory-files',
    'obra/superpowers/systematic-debugging',
    'obra/superpowers/verification-before-completion',
]

WAKE_AGENTS = [
    '1f9f8740-2965-4312-8bde-a7d0c71e1276',  # UI Engineer
    'f6102f9b-e96c-4601-95d0-f8cab58364f6',  # Design Systems
    'f8e3e452-81bf-4665-ac0e-0a0b93f9d5a3',  # Head of Design
]


def curl(method, path, data=None, timeout=120):
    cmd = [
        'curl', '-sS', '--max-time', str(timeout),
        '-b', COOKIE, '-c', COOKIE,
        '-X', method, f'{ORIGIN}{path}',
        '-H', 'Content-Type: application/json',
        '-H', f'Origin: {ORIGIN}',
    ]
    if data is not None:
        cmd += ['-d', json.dumps(data)]
    try:
        out = subprocess.check_output(cmd, text=True, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as exc:
        raise RuntimeError(exc.output or str(exc)) from exc
    if not out.strip():
        return {}
    return json.loads(out)


def main():
    curl('POST', '/api/auth/sign-in/email', {
        'email': 'connect@wityliti.io',
        'password': 'Wityliti@2026',
    }, timeout=30)

    skills = curl('GET', f'/api/companies/{CID}/skills', timeout=30)
    skill_items = skills if isinstance(skills, list) else skills.get('skills', [])
    company_keys = {s.get('key') for s in skill_items if isinstance(s, dict) and s.get('key')}
    print(f'company skills: {len(company_keys)}')

    agents = curl('GET', f'/api/companies/{CID}/agents', timeout=30)
    agent_by_id = {a['id']: a for a in agents}

    # Include SRE if hired
    for agent_id, agent in agent_by_id.items():
        name = agent.get('name', '')
        if 'SRE' in name and agent_id not in ASSIGNMENTS:
            ASSIGNMENTS[agent_id] = ('SRE', SRE_SKILLS)

    # Patch env only — preserve auto-routing models
    for agent_id, agent in agent_by_id.items():
        ac = dict(agent.get('adapterConfig') or {})
        if agent_id in CODING_AGENT_IDS or 'SRE' in agent.get('name', ''):
            ac['model'] = 'opencode-omniroute/auto/best-coding'
        else:
            ac['model'] = 'opencode-omniroute/auto/best-free'
        ac['extraArgs'] = []
        ac['env'] = PLAIN_ENV
        curl('PATCH', f'/api/agents/{agent_id}', {'adapterConfig': ac}, timeout=45)
        print(f'patched config: {agent.get("name")}')

    # Assign skills
    for agent_id, (label, desired) in ASSIGNMENTS.items():
        if agent_id not in agent_by_id:
            print(f'skip missing agent {label} ({agent_id})')
            continue
        missing = [k for k in desired if k not in company_keys]
        if missing:
            print(f'WARN {label} missing company skills: {missing}')
        try:
            result = curl(
                'POST',
                f'/api/agents/{agent_id}/skills/sync?companyId={CID}',
                {'desiredSkills': desired},
                timeout=180,
            )
            synced = result.get('desiredSkills') or result.get('skills') or desired
            count = len(synced) if isinstance(synced, list) else '?'
            print(f'skills synced: {label} ({count})')
        except Exception as err:
            print(f'FAIL skills {label}: {err}', file=sys.stderr)

    # Wake priority agents
    for agent_id in WAKE_AGENTS:
        if agent_id not in agent_by_id:
            continue
        name = agent_by_id[agent_id].get('name', agent_id)
        try:
            curl('POST', f'/api/agents/{agent_id}/runtime-state/reset-session', {'taskKey': None}, timeout=30)
            wake = curl('POST', f'/api/agents/{agent_id}/wakeup', {
                'source': 'on_demand',
                'triggerDetail': 'manual',
                'reason': 'Retry after skill assignment and OmniRoute model fix',
            }, timeout=30)
            print(f'woke {name}: {wake.get("status")} run={wake.get("id")}')
        except Exception as err:
            print(f'FAIL wake {name}: {err}', file=sys.stderr)

    # Verify UI Engineer desiredSkills in adapterConfig
    ui = curl('GET', '/api/agents/1f9f8740-2965-4312-8bde-a7d0c71e1276', timeout=30)
    ac = ui.get('adapterConfig') or {}
    pref = ac.get('paperclipSkillSync') or ac.get('skillSync') or {}
    desired = pref.get('desiredSkills') if isinstance(pref, dict) else None
    if not desired:
        desired = ac.get('desiredSkills')
    print('UI Engineer desiredSkills:', desired or '(check adapter snapshot)')


if __name__ == '__main__':
    main()
