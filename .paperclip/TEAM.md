# Dostel Paperclip Team (OmniRoute free)

Company: **Dostel** (`DOS`) · Project: **Dostel Codebase** · Workspace cwd: `/root/dostel-backend`

All agents use OpenCode Local → OmniRoute **auto-routing** (`auto/best-free` or `auto/best-coding`). Upstream model varies per run (DeepSeek, NVIDIA, Groq, etc.) — OmniRoute picks from the free pool.

See brand + hiring plan: [ORG_PLAN.md](./ORG_PLAN.md) · Design bar: [DESIGN_INSTRUCTIONS.md](./DESIGN_INSTRUCTIONS.md)

## Org chart

```
Board
 └── Dostel CEO
      ├── Dostel CMO
      │    ├── Dostel Market Researcher
      │    ├── Dostel Content Marketer
      │    └── Dostel Community Lead (Dostellers)
      ├── Dostel Product Manager
      ├── Dostel Head of Design
      │    ├── Dostel Product Designer (UX)
      │    └── Dostel Design Systems
      └── Dostel CTO
           ├── Dostel Builder
           ├── Dostel UI Engineer
           └── Dostel QA
```

## Roster

| Role | Name | Adapter | Model | Reports to |
|------|------|---------|-------|------------|
| CEO | Dostel CEO | `opencode_local` | free OmniRoute | board |
| CMO | Dostel CMO | `opencode_local` | free OmniRoute | CEO |
| Market Researcher | Dostel Market Researcher | `opencode_local` | free OmniRoute | CMO |
| Content Marketer | Dostel Content Marketer | `opencode_local` | free OmniRoute | CMO |
| Community Lead | Dostel Community Lead | `opencode_local` | free OmniRoute | CMO |
| Product Manager | Dostel Product Manager | `opencode_local` | free OmniRoute | CEO |
| Head of Design | Dostel Head of Design | `opencode_local` | free OmniRoute | CEO |
| Product Designer (UX) | Dostel Product Designer | `opencode_local` | free OmniRoute | Head of Design |
| Design Systems | Dostel Design Systems | `opencode_local` | free OmniRoute | Head of Design |
| CTO / Tech Lead | Dostel CTO | `opencode_local` | free OmniRoute | CEO |
| Full-stack Engineer | Dostel Builder | `opencode_local` | free OmniRoute | CTO |
| UI / DS Engineer | Dostel UI Engineer | `opencode_local` | free OmniRoute | CTO |
| QA Engineer | Dostel QA | `opencode_local` | free OmniRoute | CTO |

## Design mission (beat Zostel / Hosteller)

- Enterprise design system shared by guest site + admin PMS
- Booking funnel with low drop-off (mobile-first, trust, clarity)
- Distinct Dostellers brand — community hostel, not generic SaaS
- Specs in `.paperclip/design/` → UI Engineer implements in `apps/frontend` / `apps/admin`

## Shared adapter settings

- **cwd:** `/root/dostel-backend`
- **command:** `opencode`
- **extraArgs:** `--auto`
- **timeoutSec:** `600–900`
- **model (general):** `opencode-omniroute/auto/best-free`
- **model (engineering):** `opencode-omniroute/auto/best-coding`
- **env:** `OMNIROUTE_API_KEY=local-dev`, `OPENAI_API_KEY=local-dev`, `OPENAI_BASE_URL=http://127.0.0.1:20128/v1`

## Live targets

- Frontend: http://65.109.113.80:3001
- GraphQL: http://65.109.113.80:4000/graphql
- OmniRoute: http://65.109.113.80:20128/dashboard
- Paperclip: https://office.witylogix.com/DOS
