/**
 * Behaviour under test: Hostelworld-style rate offers + deposit/balance schedule
 * Module: apps/backend/src/services/ratePlanService.js
 * Existing tests: none for rate types. Closest is payment-behavior.test.js (flat 25% deposit only).
 * User instruction: "learn architecture and payment methods and architeuse from hostel world and build it. Also can we bring more design elements and enahncements and other design skills to make it better. Also close others PRs if they can be merged."
 */

const assert = require('assert')
const {
  RATE_TYPES,
  buildRateOffers,
  resolvePaymentSchedule,
  paymentStatusForAmount,
  getRatePlan,
} = require('../src/services/ratePlanService')

function run () {
  const offers = buildRateOffers(10000)
  assert.strictEqual(offers.length, 4, 'four rate offers')

  const free = offers.find((o) => o.rateType === RATE_TYPES.FREE_CANCELLATION)
  assert.strictEqual(free.totalAmount, 10000)
  assert.strictEqual(free.depositRequired, 2000)
  assert.strictEqual(free.balanceDue, 8000)
  assert.strictEqual(free.balanceCollection, 'AT_PROPERTY')

  const payNow = offers.find((o) => o.rateType === RATE_TYPES.PAY_NOW)
  assert.strictEqual(payNow.depositRequired, payNow.totalAmount)
  assert.strictEqual(payNow.balanceDue, 0)
  assert.strictEqual(payNow.balanceCollection, 'PREPAID')
  assert.ok(payNow.totalAmount < 10000, 'Pay Now discounted')

  const nonRef = offers.find((o) => o.rateType === RATE_TYPES.NON_REFUNDABLE)
  assert.ok(nonRef.totalAmount < 10000)
  assert.strictEqual(nonRef.refundable, false)

  const schedule = resolvePaymentSchedule(RATE_TYPES.FREE_CANCELLATION, 10000, 'UPI')
  assert.strictEqual(schedule.depositPercentage, 25, 'UPI bumps free-cancel deposit to 25%')
  assert.strictEqual(schedule.depositRequired, 2500)
  assert.strictEqual(schedule.payAtProperty, 7500)

  const prepaid = resolvePaymentSchedule(RATE_TYPES.PAY_NOW, 8800, 'UPI')
  assert.strictEqual(prepaid.depositRequired, 8800)
  assert.strictEqual(prepaid.payAtProperty, 0)

  assert.strictEqual(paymentStatusForAmount(0, 2000, 10000), 'Pending')
  assert.strictEqual(paymentStatusForAmount(2000, 2000, 10000), 'Partial')
  assert.strictEqual(paymentStatusForAmount(10000, 2000, 10000), 'Completed')

  assert.strictEqual(getRatePlan('UNKNOWN').id, RATE_TYPES.FREE_CANCELLATION)

  console.log('rate-plan.test.js: all assertions passed')
}

run()
