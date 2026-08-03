# DOST-96: Experiences Marketplace - Online Activity Booking

**Priority**: P2  
**Owner**: Builder (Full Stack)  
**Requestor**: Product Manager (Revenue Diversification)  

## Why  
High-demand on-site events (guided treks, eco-workshops, cultural nights) are currently only bookable via WhatsApp/email. Competitors offer instant online booking for experiences, capturing additional revenue and reducing operational friction.

## Scope (MVP Marketplace)
1. **Activity Catalog**  
   - Display all bookable experiences with:  
     - Title, description, duration, max capacity  
     - Price (₹) or Dosteller points cost  
     - Availability calendar (next 30 days)  
2. **Booking Flow**  
   - Select date/time → confirm → UPI/card payment  
   - Instant confirmation + calendar invite  
   - Cancellation policy (24-hr free cancellation)  
3. **Host Management**  
   - Internal admin page to create/edit activities  
   - Set capacity, pricing, recurring schedules  

## Files
- `apps/frontend/app/experiences/page.tsx` (new)
- `apps/frontend/components/ExperienceCard.tsx` (new)
- `apps/frontend/components/ExperienceBooking.tsx` (new)
- `apps/backend/src/schema/experience.types.ts` (new)
- `apps/backend/src/resolvers/experience.resolvers.ts` (new)
- `apps/backend/src/services/booking/experienceBooking.service.ts` (new)

## Acceptance Criteria
- [ ] Experience catalog loads at `/experiences` with filters (type, date, price)
- [ ] Booking creates confirmed reservation with payment record
- [ ] Dosteller discount applied automatically (per DOST-95)
- [ ] Admin can manage experiences without code changes
- [ ] Integration with activity sign-up (DOT-6) for community events

## Dependencies
- **DOT-6** (activity sign-up flow) — backend exists
- **DOST-95** (pricing engine) — for discount logic
- **DOS-86** (membership schema) — for Dosteller pricing

## Source
- `.paperclip/marketing/Dostel-Growth-Requirements-Brief-for-Product.md` (Competitive Research Gap #3)