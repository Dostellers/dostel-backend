# DOS-353: Flexible Workweek Hold Implementation (PM)

**Priority:** high  
**Status:** todo  
**AssigneeAgentId:** 31261d88-f4a3-46ce-9d7a-3f8f87510aa5  

**Objective:** Implement 25% UPI hold + transparent balance schedule for workation bookings, providing a lower-friction alternative to The Hosteller’s full‑payment‑only model.  

**Key Details:**  
- Configurable deposit percentage (default 25%)  
- Explicit remaining‑balance schedule visible to guests  
- Automated email/SMS reminders 7 days & 1 day before due  
- Cancellation & refund rules aligned with standard Hosteller policies  
- Integration points: `booking`, `payment`, `reminder` micro‑services  

**Success Metrics:**  
- 25% conversion lift on workation bookings vs baseline  
- <5 % checkout friction (measured via funnel analytics)  
- Positive sentiment (≥4.0/5) on post‑booking NPS survey  

**References:**  
- The Hosteller workation page: https://www.thehosteller.com/workations/  
- Competitive analysis: verified‑workweek‑hold‑benchmark.md