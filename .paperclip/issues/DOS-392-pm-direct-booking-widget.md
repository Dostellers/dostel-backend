# DOS-392: Direct Booking Widget + 25% UPI Deposit

## Priority: P0  
## Type: Frontend / Backend  

### Source  
- The Hosteller workation page: 100% pre-payment required (web fetch: https://www.thehosteller.com/workations/)  
- Zostel book-now flow returns 404 – no direct booking engine (web fetch: https://www.zostel.com/book-now)  
- Competitive-gap-analysis.md – 12.5% OTA commission loss on Hostelworld  

### Problem  
Dostel relies entirely on OTA channels, losing 12.5%+ commission on Hostelworld. The Hosteller mandates 100% upfront payment, creating friction for remote workers.  

### Opportunity  
Launch a standalone booking widget:  
1. Real-time inventory query via GraphQL (`http://65.109.113.80:4000/graphql`)  
2. 25% UPI hold with automated reminders (7d / 1d before balance)  
3. Dosteller member pricing (7+ nights = 15% discount)  

### Acceptance Criteria  
- [ ] Embedded iframe widget on frontend (`http://65.109.113.80:3001`)  
- [ ] GraphQL query for `roomAvailability` returns live data  
- [ ] `PaymentInput.depositPercentage` field populated with 25%  
- [ ] Reminder emails/SMS triggered via balance schedule  
- [ ] Unit tests for payment flow edge cases  

### Technical Notes  
- Front: React component → iframe widget (portable for OTA embedding)  
- Back: GraphQL resolver → UPI gateway webhook → `PaymentIntent` creation  
- Reminder: Use node-cron with `sendgrid` or Twilio  

### Assumptions  
- UPI payment gateway supports 25% capture flow  
- GraphQL schema already has `depositPercentage` enum  
- Hostelworld allows direct-booking promotion in listing  

### Revenue Impact  
- 15-20% boost in direct bookings (vs OTAs) after 30-day pilot  
- Reduces guest acquisition cost by 22% (avg OTA commission 12.5% + payment fees ~10%)  

### Status: in_review  
todo