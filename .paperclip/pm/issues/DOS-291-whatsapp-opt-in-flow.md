# DOS-291: WhatsApp Opt-In Flow

**Priority:** P1  
**Owner:** Backend Engineer  
**Status:** todo  

## Description
Implement a 2-click user onboarding flow to join the Dosteller program via WhatsApp, integrating with the new user signup and Razorpay payment flows.

## Requirements
- After completing primary signup form, display a success screen with a prominent WhatsApp invite link (`wa.me/{id}`)  
- Clicking the link should redirect to WhatsApp with a pre-filled message: "Join Dostel Community!"  
- Track opt-in completion in Redis with a unique transaction ID  
- Capture opt-in timestamp and link it to the user's referral count increment  
- Validate phone number presence before sending WhatsApp message (prevent abuse)  
- Success/error messaging: Confirmation toast showing "Invitation sent! Join your community."  

## Acceptance Criteria
- [ ] New user completes signup and sees WhatsApp invite option  
- [ ] Redirection to WhatsApp works without leaving the page (open in same tab/window)  
- [ ] Referral count increments only after successful opt-in  
- [ ] Rate limiting applied (max 1 opt-in per IP within 24h)  
- [ ] Edge cases: invalid phone number, declined WhatsApp link generation  

## Dependencies
- Primary signup flow (`DOS-285`) must be implemented  
- Razorpay payment confirmation webhook integration  
- User model fields: `referral_id`, `referral_count` in `/apps/backend/src/models/user.js`  

## References
- WhatsApp Business API mailing requirements: https://developers.facebook.com/docs/whatsapp/business-management-api  
- Dosstel Community Program Brief: `/root/dostel-backend/.paperclip/marketing/dostellers/dostellers-community-program-brief.md`  
- Razorpay payment flow docs: https://docs.razorpay.com/