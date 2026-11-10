/**
 * Hostelworld-inspired rate plans for Dostel.
 *
 * Called by:
 * - apps/backend/src/resolvers/bookingResolver.js (createBooking, processBookingPayment)
 * - apps/backend/src/services/paymentService.js (createBookingWithPayment)
 * - apps/backend/test/rate-plan.test.js
 *
 * No existing file defines FREE_CANCELLATION / FLEXIBLE / NON_REFUNDABLE / PAY_NOW
 * schedules. paymentService.js only does fixed 20/25% deposits.
 *
 * Reads: rateType + totalAmount + paymentMethod.
 * Writes into Booking fields: rateType, depositPercentage, depositRequired,
 * amountPaid, balanceDue, balanceCollection, cancellationPolicy, refundAs,
 * cancellationDeadlineHours.
 *
 * User: "learn architecture and payment methods and architeuse from hostel world and build it.
 * Also can we bring more design elements and enahncements and other design skills to make it better.
 * Also close others PRs if they can be merged."
 */

const RATE_TYPES = Object.freeze({
  FREE_CANCELLATION: 'FREE_CANCELLATION',
  FLEXIBLE: 'FLEXIBLE',
  NON_REFUNDABLE: 'NON_REFUNDABLE',
  PAY_NOW: 'PAY_NOW',
})

const RATE_PLANS = Object.freeze({
  [RATE_TYPES.FREE_CANCELLATION]: {
    id: RATE_TYPES.FREE_CANCELLATION,
    label: 'Free Cancellation',
    shortLabel: 'Free cancel',
    description: 'Pay a deposit now. Cancel before the deadline and get a full refund to your original payment method. Balance due at the property.',
    depositPercentage: 20,
    priceMultiplier: 1,
    refundable: true,
    refundAs: 'original_payment',
    cancellationDeadlineHours: 48,
    balanceCollection: 'AT_PROPERTY',
    payNow: false,
    badgeTone: 'positive',
  },
  [RATE_TYPES.FLEXIBLE]: {
    id: RATE_TYPES.FLEXIBLE,
    label: 'Flexible',
    shortLabel: 'Flexible',
    description: 'Pay a slightly higher deposit. Cancel in time and receive Dostel credit (valid 6 months). Balance due at the property.',
    depositPercentage: 25,
    priceMultiplier: 1.05,
    refundable: true,
    refundAs: 'voucher',
    cancellationDeadlineHours: 24,
    balanceCollection: 'AT_PROPERTY',
    payNow: false,
    badgeTone: 'informative',
  },
  [RATE_TYPES.NON_REFUNDABLE]: {
    id: RATE_TYPES.NON_REFUNDABLE,
    label: 'Non-Refundable',
    shortLabel: 'Non-refundable',
    description: 'Lowest deposit. Deposit is non-refundable. Remaining balance is due at the property on arrival.',
    depositPercentage: 15,
    priceMultiplier: 0.92,
    refundable: false,
    refundAs: 'none',
    cancellationDeadlineHours: 0,
    balanceCollection: 'AT_PROPERTY',
    payNow: false,
    badgeTone: 'neutral',
  },
  [RATE_TYPES.PAY_NOW]: {
    id: RATE_TYPES.PAY_NOW,
    label: 'Non-Refundable · Pay Now',
    shortLabel: 'Pay now',
    description: 'Best price. Pay the full stay now. Nothing due at the property. Non-refundable.',
    depositPercentage: 100,
    priceMultiplier: 0.88,
    refundable: false,
    refundAs: 'none',
    cancellationDeadlineHours: 0,
    balanceCollection: 'PREPAID',
    payNow: true,
    badgeTone: 'neutral',
  },
})

function roundMoney (amount) {
  return Math.round((Number(amount) + Number.EPSILON) * 100) / 100
}

function getRatePlan (rateType) {
  return RATE_PLANS[rateType] || RATE_PLANS[RATE_TYPES.FREE_CANCELLATION]
}

function listRatePlans () {
  return Object.values(RATE_PLANS)
}

function buildRateOffers (baseTotal, { checkInDate } = {}) {
  const base = Number(baseTotal) || 0
  return listRatePlans().map((plan) => {
    const pricedTotal = roundMoney(base * plan.priceMultiplier)
    const depositRequired = roundMoney(pricedTotal * (plan.depositPercentage / 100))
    const balanceDue = roundMoney(Math.max(pricedTotal - depositRequired, 0))
    const cancelBy = plan.cancellationDeadlineHours > 0 && checkInDate
      ? new Date(new Date(checkInDate).getTime() - plan.cancellationDeadlineHours * 3600000)
      : null

    return {
      rateType: plan.id,
      label: plan.label,
      shortLabel: plan.shortLabel,
      description: plan.description,
      priceMultiplier: plan.priceMultiplier,
      totalAmount: pricedTotal,
      depositPercentage: plan.depositPercentage,
      depositRequired,
      balanceDue,
      payAtProperty: balanceDue,
      balanceCollection: plan.balanceCollection,
      refundable: plan.refundable,
      refundAs: plan.refundAs,
      cancellationDeadlineHours: plan.cancellationDeadlineHours,
      cancelBy,
      badgeTone: plan.badgeTone,
      savingsVsFlexible: plan.priceMultiplier < 1
        ? roundMoney(base - pricedTotal)
        : 0,
    }
  })
}

function resolvePaymentSchedule (rateType, totalAmount, paymentMethod) {
  const plan = getRatePlan(rateType)
  const total = roundMoney(totalAmount)
  let depositPercentage = plan.depositPercentage

  const method = String(paymentMethod || '').toUpperCase()
  if (!plan.payNow && method.includes('UPI') && depositPercentage < 25) {
    depositPercentage = Math.max(depositPercentage, 25)
  }

  const depositRequired = plan.payNow
    ? total
    : roundMoney(total * (depositPercentage / 100))
  const balanceDue = roundMoney(Math.max(total - depositRequired, 0))

  return {
    rateType: plan.id,
    depositPercentage,
    depositRequired,
    balanceDue,
    balanceCollection: plan.balanceCollection,
    payAtProperty: plan.balanceCollection === 'AT_PROPERTY' ? balanceDue : 0,
    refundable: plan.refundable,
    refundAs: plan.refundAs,
    cancellationDeadlineHours: plan.cancellationDeadlineHours,
    cancellationPolicy: plan.description,
  }
}

function paymentStatusForAmount (amountPaid, depositRequired, totalAmount) {
  const paid = roundMoney(amountPaid)
  const total = roundMoney(totalAmount)
  const deposit = roundMoney(depositRequired)

  if (paid <= 0) return 'Pending'
  if (paid >= total) return 'Completed'
  if (paid >= deposit) return 'Partial'
  return 'Pending'
}

module.exports = {
  RATE_TYPES,
  RATE_PLANS,
  roundMoney,
  getRatePlan,
  listRatePlans,
  buildRateOffers,
  resolvePaymentSchedule,
  paymentStatusForAmount,
}
