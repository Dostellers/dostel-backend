# DOS-282 Pricing Copy + Payment Flow

## Recommendation
Position Dostel as **community value**, not the cheapest bed. Show the verified room rate for the selected dates, the full payable amount, and Dosteller benefits together.

## Copy

**Search/card**  
**Stay in Vattakanal from ₹327/night**  
Suites, couple rooms and dorms. Choose your dates to see the current total.

**Booking summary**  
**Your stay, clearly priced**  
Room ₹[room subtotal] · Taxes ₹[taxes] · Discount −₹[discount]  
**Total ₹[total]**

**Long-stay callout**  
**Staying longer? Discover Dostellers.**  
Long-stay community members unlock activities and the Dosteller network.

**Payment CTA**  
**Pay ₹[amount] securely**

**Trust line**  
No surprise charges. Review the full total before you pay.

## Payment-flow wireframe

```text
[Choose dates]
      ↓
[Select: Suite | Couple room | Dorm]
[Current nightly rate] [Availability]
      ↓
[Guest details]
      ↓
[Price summary]
 Room subtotal              ₹—
 Taxes                      ₹—
 Verified discount         −₹—
──────────────────────────────
 Total                      ₹—
      ↓
[Select an enabled payment method]
[Pay ₹— securely]
      ↓
[Booking confirmation + receipt]
[Dosteller long-stay invitation]
```

## Builder requirements
- Never hard-code ₹327 beyond “from” copy; render current inventory pricing.
- Show taxes, fees, discounts and final total before payment.
- Only display payment methods confirmed by Ops/backend.
- Label competitor comparison as internal research, not customer-facing copy.
- Track `room_selected`, `price_summary_viewed`, `payment_started`, `booking_confirmed`.

## Assumptions requiring verification
- ₹327 was observed as a starting rate on 30 Jul 2026; room type and current availability were not verified.
- Competitor rates and the indicative €1 ≈ ₹90 conversion vary by date, inventory and channel.
- No Dosteller discount or payment method should be advertised until configured and confirmed.

## Sources
- [Dostel live frontend](http://65.109.113.80:3001), accessed 30 Jul 2026
- [Hostelworld Dostel listing](https://www.hostelworld.com/hostels/p/302851/dostel-vattakanal/), accessed 30 Jul 2026
- Internal benchmark: `/root/dostel-backend/.paperclip/research/price-benchmark-2026-07-30.md`
