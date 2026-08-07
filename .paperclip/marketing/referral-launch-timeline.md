# Referral Program Launch Timeline (2-Week Rollout)

## Week 1: Foundation & Setup
**Mon-Tue:**
- Product: Finalize `DOS-401` referral engine implementation (link generation, tracking, reward allocation)
- Content: Finalize copy assets (emails, social captions, in-app widget text) from `/paperclip/marketing/dosteller-referral-copy-draft.md`
- Legal: Review terms for credit expiration, GST compliance, T&C

**Wed-Thu:**
- Product: Integrate referral widget into guest dashboard (`ReferralShare.tsx`), connect to backend
- Content: Design visual assets (referral badge, progress bar, email banners)
- QA: Test referral flow end-to-end (link generation → booking → reward allocation)

**Fri:**
- Product: Staging deployment, internal testing
- Content: Schedule email sequence, prepare social posts
- CMO: Final approval of assets and flow

## Week 2: Soft Launch & Monitoring
**Mon-Tue:**
- Soft launch: Release to 10% of Dosteller base (invite-only)
- Monitor: Track link generation rate, conversion to bookings, reward triggers
- Feedback: Collect initial user feedback via in-app survey

**Wed-Thu:**
- Iterate: Fix any bugs, adjust incentive messaging if needed
- Expand: Roll out to 50% of Dosteller base
- Marketing: Launch social media teaser (Instagram Reel, TikTok)

**Fri:**
- Full launch: Open referral program to all Dostellers
- Announce: Email blast + in-app notification
- KPI Dashboard: Referral link clicks, conversion rate, credits awarded

## Success Metrics (Track Weekly)
- Referral link generation rate (target: 30% of Dostellers/week)
- Conversion rate (link click → booking) (target: 8%)
- Credits awarded vs. incremental revenue (target: 1:3 ROI)
- NPS on referral program (target: ≥50)

## Owners
- **Product:** Referral engine implementation, widget integration, QA
- **Content/Copy:** Email sequence, social assets, visual design
- **Legal:** Terms review, compliance sign-off
- **CMO:** Overall coordination, approval, launch communication

## Dependencies
- `DOS-401` referral engine completion
- Dosteller dashboard widget (`DOS-364`) for referral tracking
- Email service (SendGrid) integration for automated sequences

*Assets referenced: `/paperclip/marketing/dosteller-referral-campaign.md`, `/paperclip/marketing/dosteller-referral-copy-draft.md`, `/paperclip/issues/DOS-407-cmo-referral-program-campaign.md`*