# Dostel Analytics Dashboard Specification Brief

## Objective
Define the metrics, data sources, and dashboard structure to track referral conversions, pricing effectiveness, Dosteller engagement, and community growth KPIs across all marketing initiatives.

## Data Sources
| Source | Data | Integration |
|--------|------|-------------|
| GraphQL `/graphql` | User profiles, Dosteller status, activity bookings | Apollo client on frontend |
| PostgreSQL `referral_links` | Referral codes, attribution, conversions | Direct query |
| PostgreSQL `referral_rewards` | Reward redemptions, coupon usage | Direct query |
| PostgreSQL `bookings` | Stay duration, room type, pricing tier | Direct query |
| PostgreSQL `experiences` | Activity bookings, revenue per experience | Direct query |
| GA4 | Traffic sources, UTM-tagged referral clicks, page views | GA4 API |
| SendGrid | Email open rates, click-through on referral links | SendGrid API |
| Hostelworld API | Listing views, booking conversions, review scores | Hostelworld partner API |

## Dashboard Panels

### Panel 1: Referral Performance (DOS-96)
- **Referral link clicks** (daily/weekly trend)
- **Referral conversion rate** (% of clicks → bookings)
- **Revenue per referral** (avg. booking value from referred guests)
- **Referral tier distribution** (how many users at 2/5/10 referrals)
- **Top referrers** (ranked by referral count and revenue generated)

### Panel 2: Pricing & Revenue (DOS-92)
- **Extended-stay conversion rate** (% of bookings ≥7 nights)
- **Avg. stay duration** (trend over time)
- **Dosteller vs. non-Dosteller avg. spend**
- **Pricing tier uptake** (how many guests use 10%/15%/20% discounts)
- **Revenue lift from dynamic pricing** (vs. baseline static rates)

### Panel 3: Dosteller Engagement (DOS-91)
- **Dashboard visit rate** (% of returning guests who view `/dosteller`)
- **Activity booking conversion from dashboard** (% of dashboard visits → experience bookings)
- **Perk utilization** (cafe credit redeemed, skill-share attendance, priority booking usage)
- **Dosteller tier distribution** (Bronze/Silver/Gold breakdown)

### Panel 4: Experiences Revenue (DOS-93)
- **Monthly ancillary revenue** from experiences
- **Activity type breakdown** (guided trek vs. eco-workshop vs. cultural night)
- **Capacity utilization** (% of activity slots filled)
- **Guest satisfaction** (post-activity NPS score)

### Panel 5: Community Growth (DOS-96 + Social Media)
- **UGC volume** (#MyDostellerStory posts per week)
- **Referral code usage** vs. total bookings
- **Instagram/TikTok follower growth** (weekly delta)
- **Engagement rate** (likes, shares, comments per post)
- **Referral link click-through from social posts** (UTM-tracked)

### Panel 6: Hostelworld & OTA Performance (DOS-90)
- **Listing views** (Hostelworld, Booking.com)
- **Booking conversion rate** from OTA traffic
- **Cleanliness score trend** (monthly, target 8.0+)
- **Review sentiment** (positive/negative/neutral ratio)
- **Direct vs. OTA booking ratio** (target: 60/40 split favoring direct)

## Implementation Requirements

### GraphQL Queries Needed
```graphql
query ReferralDashboard($startDate: String!, $endDate: String!) {
  referralStats(startDate: $startDate, endDate: $endDate) {
    totalClicks
    totalConversions
    conversionRate
    revenuePerReferral
    tierDistribution {
      bronze
      silver
      gold
    }
    topReferrers(limit: 10) {
      userId
      name
      referralCount
      revenueGenerated
    }
  }
}
```

```graphql
query PricingDashboard($startDate: String!, $endDate: String!) {
  pricingStats(startDate: $startDate, endDate: $endDate) {
    avgStayDuration
    extendedStayRate
    dostellerAvgSpend
    tierUptake {
      tenPercent
      fifteenPercent
      twentyPercent
    }
    revenueLift
  }
}
```

```graphql
query CommunityDashboard($startDate: String!, $endDate: String!) {
  communityStats(startDate: $startDate, endDate: $endDate) {
    ugcVolume
    referralUsageRate
    socialGrowth {
      instagramFollowers
      tikTokFollowers
      engagementRate
    }
    directVsOtaRatio
  }
}
```

### Admin Interface
- Date range selector (7/30/90 days)
- Export to CSV for each panel
- Real-time refresh (5‑minute interval)
- Role‑based access: CMO (full), Community Lead (panels 1, 3, 5), Product (panels 2, 4, 6)

## Success Metrics
- Dashboard adoption: 100% of marketing team using weekly within 30 days
- Data freshness: <15 minute lag from source to dashboard
- Actionable insights: ≥3 data‑driven decisions per month traced to dashboard metrics

## Dependencies
- DOS‑91 (Dosteller Dashboard) for engagement data
- DOS‑92 (Pricing Engine) for pricing tier data
- DOS‑93 (Experiences Booking) for activity revenue data
- DOS‑95 (Sustainability Tracker) for eco‑impact metrics
- DOS‑96 (Referral Program) for referral attribution data

---
*Author: Dostel CMO | Based on all marketing briefs and Paperclip issues DOS‑91 through DOS‑96*