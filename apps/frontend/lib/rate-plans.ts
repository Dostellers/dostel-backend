/**
 * Hostelworld-inspired rate plans (frontend mirror of backend ratePlanService).
 *
 * Callers (to be wired):
 * - apps/frontend/components/BookingProvider.tsx — selectRate / deposit math
 * - apps/frontend/components/RatePlanSelector.tsx — offer list
 * - apps/frontend/components/PriceBreakdown.tsx — deposit vs balance lines
 * - apps/frontend/app/booking/[slug]/review/page.tsx — rate step
 * - apps/frontend/app/booking/[slug]/payment/page.tsx — amount due now
 * - apps/frontend/app/booking/[slug]/confirmation/page.tsx — pay-at-property note
 *
 * No existing frontend file encodes FREE_CANCELLATION / FLEXIBLE /
 * NON_REFUNDABLE / PAY_NOW schedules (only hard-coded Free cancellation copy).
 *
 * Schema: RateType, RatePlan, RateOffer; reads base total + rateType;
 * produces depositRequired / balanceDue / payAtProperty.
 *
 * User instruction: "learn architecture and payment methods and architeuse from hostel world and build it. Also can we bring more design elements and enahncements and other design skills to make it better. Also close others PRs if they can be merged."
 */

export type RateType =
  | 'FREE_CANCELLATION'
  | 'FLEXIBLE'
  | 'NON_REFUNDABLE'
  | 'PAY_NOW'

export type BalanceCollection = 'AT_PROPERTY' | 'PREPAID'
export type RefundAs = 'original_payment' | 'voucher' | 'none'
export type RateBadgeTone = 'positive' | 'informative' | 'neutral'

export interface RatePlan {
  id: RateType
  label: string
  shortLabel: string
  description: string
  depositPercentage: number
  priceMultiplier: number
  refundable: boolean
  refundAs: RefundAs
  cancellationDeadlineHours: number
  balanceCollection: BalanceCollection
  payNow: boolean
  badgeTone: RateBadgeTone
}

export interface RateOffer extends RatePlan {
  rateType: RateType
  totalAmount: number
  depositRequired: number
  balanceDue: number
  payAtProperty: number
  savingsVsBase: number
}

export const RATE_PLANS: Record<RateType, RatePlan> = {
  FREE_CANCELLATION: {
    id: 'FREE_CANCELLATION',
    label: 'Free Cancellation',
    shortLabel: 'Free cancel',
    description: 'Pay ~10% now to hold the bed. Cancel before the deadline for a full refund. Pay the rest at the hostel.',
    depositPercentage: 10,
    priceMultiplier: 1,
    refundable: true,
    refundAs: 'original_payment',
    cancellationDeadlineHours: 48,
    balanceCollection: 'AT_PROPERTY',
    payNow: false,
    badgeTone: 'positive',
  },
  FLEXIBLE: {
    id: 'FLEXIBLE',
    label: 'Flexible',
    shortLabel: 'Flexible',
    description: 'Pay ~10% now. Cancel in time and receive Dostel credit (valid 6 months). Balance due at the hostel.',
    depositPercentage: 10,
    priceMultiplier: 1.02,
    refundable: true,
    refundAs: 'voucher',
    cancellationDeadlineHours: 24,
    balanceCollection: 'AT_PROPERTY',
    payNow: false,
    badgeTone: 'informative',
  },
  NON_REFUNDABLE: {
    id: 'NON_REFUNDABLE',
    label: 'Non-Refundable',
    shortLabel: 'Non-refundable',
    description: 'Lowest hold — pay ~5% now. Deposit is non-refundable. Remaining balance is due at the hostel on arrival.',
    depositPercentage: 5,
    priceMultiplier: 0.92,
    refundable: false,
    refundAs: 'none',
    cancellationDeadlineHours: 0,
    balanceCollection: 'AT_PROPERTY',
    payNow: false,
    badgeTone: 'neutral',
  },
  PAY_NOW: {
    id: 'PAY_NOW',
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
}

export function roundMoney (amount: number): number {
  return Math.round((Number(amount) + Number.EPSILON) * 100) / 100
}

export function getRatePlan (rateType?: RateType | string | null): RatePlan {
  if (rateType && rateType in RATE_PLANS) {
    return RATE_PLANS[rateType as RateType]
  }
  return RATE_PLANS.FREE_CANCELLATION
}

export function listRatePlans (): RatePlan[] {
  return Object.values(RATE_PLANS)
}

export function buildRateOffers (baseTotal: number): RateOffer[] {
  const base = Number(baseTotal) || 0
  return listRatePlans().map((plan) => {
    const totalAmount = roundMoney(base * plan.priceMultiplier)
    const depositRequired = plan.payNow
      ? totalAmount
      : roundMoney(totalAmount * (plan.depositPercentage / 100))
    const balanceDue = roundMoney(Math.max(totalAmount - depositRequired, 0))
    return {
      ...plan,
      rateType: plan.id,
      totalAmount,
      depositRequired,
      balanceDue,
      payAtProperty: balanceDue,
      savingsVsBase: plan.priceMultiplier < 1 ? roundMoney(base - totalAmount) : 0,
    }
  })
}

export function resolvePaymentSchedule (
  rateType: RateType | string | null | undefined,
  totalAmount: number,
  paymentMethod?: string,
) {
  const plan = getRatePlan(rateType)
  const total = roundMoney(totalAmount)
  // GoKwik-style: keep deposits in the 5–10% band. No method bump.
  const depositPercentage = plan.depositPercentage
  void paymentMethod
  const depositRequired = plan.payNow
    ? total
    : roundMoney(total * (depositPercentage / 100))
  const balanceDue = roundMoney(Math.max(total - depositRequired, 0))
  return {
    rateType: plan.id,
    label: plan.label,
    shortLabel: plan.shortLabel,
    description: plan.description,
    depositPercentage,
    depositRequired,
    balanceDue,
    payAtProperty: plan.balanceCollection === 'AT_PROPERTY' ? balanceDue : 0,
    balanceCollection: plan.balanceCollection,
    refundable: plan.refundable,
    refundAs: plan.refundAs,
    cancellationDeadlineHours: plan.cancellationDeadlineHours,
    payNow: plan.payNow,
    badgeTone: plan.badgeTone,
  }
}

export function formatCancelDeadline (checkIn: string, hours: number): string | null {
  if (!checkIn || hours <= 0) return null
  const cancelBy = new Date(new Date(checkIn).getTime() - hours * 3600000)
  return cancelBy.toLocaleString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
