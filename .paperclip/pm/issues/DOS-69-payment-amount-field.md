# DOS-69: Add `amount` field to PaymentInput & PaymentInfo

**Priority:** P1 · **Area:** `apps/backend` · **Assignee:** Builder  
**Depends on:** Nothing (blocks createBooking for any paid booking)

---

## Why

`PaymentInput` and `PaymentInfo` types are missing `amount`. The `BookingInput.totalAmount` exists at the booking level, but individual payments need their own amount for:
- Partial payments / deposits
- Multi-payment tracking
- Payment gateway integration (Razorpay amount)

This was identified as DOS-63 in the product gap analysis but not yet reflected in schema.

## What

### 1. Update `PaymentInput`

In `apps/backend/src/schema/bookingTypeDefs.js`:

```graphql
input PaymentInput {
  amount: Float
  status: String!
  method: String
  transactionId: String
}
```

### 2. Update `PaymentInfo` return type

```graphql
type PaymentInfo {
  amount: Float
  status: String!
  method: String
  transactionId: String
}
```

### 3. Update Booking model

In `apps/backend/src/models/Booking.js`, add `amount` to the `payment` subdocument:

```js
payment: {
  amount: Number,
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  method: { type: String, enum: ['Credit Card', 'Debit Card', 'PayPal', 'Cash', 'Others'] },
  transactionId: String
}
```

### 4. No resolver changes needed

The `createBooking` resolver passes `input` directly to `new Booking(input)` — mongoose will pick up the new field.

## Acceptance criteria

- [ ] GraphQL introspection shows `PaymentInput.amount: Float` and `PaymentInfo.amount: Float`
- [ ] `createBooking` mutation accepts payment with amount
- [ ] `booking.payment.amount` returns in query responses
- [ ] Backend app boots without errors
- [ ] Mongoose schema migration not needed (optional field, no index change)
