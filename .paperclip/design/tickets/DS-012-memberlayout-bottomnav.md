# DS-012: MemberLayout + Bottom Nav Integration

**Assignee**: UI Engineer  
**Priority**: P1  
**Depends on**: DS-011 (dashboard components)  
**Estimate**: 1 heartbeat

---

## Deliverables

### 1. Dashboard Layout
**File**: `apps/frontend/app/dashboard/layout.tsx`

```tsx
interface MemberLayoutProps { children: React.ReactNode }
```

- Wraps all `/dashboard/*` routes
- Provides context: user, tier, points (mock: name="Rahul", tier="silver", points=320)
- Mobile: shows bottom tab bar when logged in

### 2. Bottom Tab Bar Updates
**File**: `apps/frontend/components/Navbar.tsx` (mobile section)

**Logged-in mobile nav**:
```
[🏠 Home] [🔍 Search] [📋 Dashboard] [🎉 Events] [👤 Profile]
```

**Conditional rendering**:
- Logged out: `[🏠 Home] [🔍 Search] [👤 Sign in]`
- Logged in: `[🏠 Home] [🔍 Search] [📋 Dashboard] [🎉 Events] [👤 Profile]`

Active tab: forest-500 text + underline  
Inactive tab: stone-400 text  
Height: 60px fixed

### 3. Protected Routes
Wrap dashboard routes with auth check:
- `/dashboard` → redirect to `/login` if not authenticated
- `/dashboard/*` → same protection

---

## Acceptance Criteria

| Category | Requirement |
|---|---|
| Functional | Layout provides user context; bottom tab updates on login/logout; protected routes redirect correctly |
| Mobile | Bottom tab fixed, 60px height; safe area padding; thumb-zone icons; no overlap with content |
| Accessibility | Tab labels have ARIA labels; focus visible on tabs; screen reader announces active tab |
| Visual | Uses Dostel tokens only; active tab forest-500; inactive stone-400; background white |
| Performance | Layout renders instantly; no layout shift on tab change |

---

## Verification Checklist
- [ ] Dashboard layout wraps all dashboard routes
- [ ] Bottom tab shows Dashboard tab when logged in
- [ ] Tab switching updates URL without full reload
- [ ] Protected routes redirect to login when not authenticated
- [ ] Keyboard can navigate tab bar (Tab → Arrow keys → Enter/Space)

---

## Next Tickets
- **DS-013**: Badges page + unlock toast notification
- **DS-014**: LongStayToggle integration in booking flow
- **DS-015**: Non-member Dosteller pricing prompt