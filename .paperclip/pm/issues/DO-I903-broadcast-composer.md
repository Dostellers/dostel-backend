# DO-I903: Community Manager Broadcast Composer

**Summary**: Admin tool for sending templated WhatsApp/email messages to segmented member lists.

**Priority**: P1
**Owner**: Product / Builder

**Description**: A simple broadcast UI in the admin panel allowing the on-site Community Manager to:
- Select from 4 templates: "Week ahead", "Member spotlight", "Tier shout-out", "Event reminder"
- Filter audience: all members / active 30d / tier:Silver / tier:Gold / by property
- Preview message before sending
- View sent history log
- First version generates copy-paste message + member list for manual broadcast (no WhatsApp API integration)

**UI Mockup**:
```
[Broadcast Composer]
Template: [Week ahead ▾]
Audience: [All members ▾] [Property: Vattakanal ▾]
Message preview:
"Hi Dostellers! Next week's events: Mon Dinner @ Altaf's, Tue Skillshare, Wed Trek..."
[Generate Copy-Paste] → opens modal with message + member phone list
[Sent to: 87 members] - View history
```

**Acceptance Criteria**:
1. Template library with 4 predefined messages
2. Audience segmentation filters (tier, activity, property)
3. Copy-paste output for manual WhatsApp broadcast
4. Sent history with timestamp and recipient count

**Dependencies**: Admin panel scaffold, member directory API

**Evidence**: See `.paperclip/marketing/dostellers/dostellers-program-iteration-v3.md` section 3.
