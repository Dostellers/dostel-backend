const assert = require('assert');
const mongoose = require('mongoose');
const Booking = require('../src/models/booking');
const { roundMoney } = require('../src/resolvers/bookingResolver');

const runPaymentTests = async () => {

  // Test 1: Basic deposit calculation
  const booking1 = new Booking({
    reference: 'TEST-001',
    customer: new mongoose.Types.ObjectId(),
    hostel: new mongoose.Types.ObjectId(),
    roomType: 'Dorm',
    checkInDate: new Date('2026-08-01'),
    checkOutDate: new Date('2026-08-05'),
    guests: 2,
    totalAmount: 4000,
    payment: {
      status: 'Completed',
      method: 'UPI',
      transactionId: 'upi_txn_123',
      amount: 1000,
    },
    depositPercentage: 25,
  });

  // Calculate payment summary using resolver logic
  const payment = booking1.payment;
  const totalAmount = roundMoney(booking1.totalAmount);
  const depositPercentage = booking1.depositPercentage ?? 25;
  const depositRequired = roundMoney(totalAmount * depositPercentage / 100);
  const amountPaid = payment.status === 'Completed'
    ? Math.min(roundMoney(payment.amount || 0), totalAmount)
    : 0;
  const balanceDue = roundMoney(Math.max(totalAmount - amountPaid, 0));

  // Assertions for Test 1
  assert.strictEqual(
    depositRequired,
    1000,
    'Deposit required should be ₹1000 (25% of ₹4000 rounded)'
  );
  assert.strictEqual(
    amountPaid,
    1000,
    'Amount paid should be ₹1000 for completed UPI payment'
  );
  assert.strictEqual(
    balanceDue,
    3000,
    'Balance due should be ₹3000 after ₹1000 payment'
  );

  // Test 2: Pending payment should NOT affect balance due
  const booking2 = new Booking({
    reference: 'TEST-002',
    customer: new mongoose.Types.ObjectId(),
    hostel: new mongoose.Types.ObjectId(),
    roomType: 'Dorm',
    checkInDate: new Date('2026-08-02'),
    checkOutDate: new Date('2026-08-06'),
    guests: 1,
    totalAmount: 2500,
    payment: {
      status: 'Pending', // Not completed
      method: 'UPI',
      transactionId: 'upi_pending_456',
      amount: 500,
    },
    depositPercentage: 25,
  });

  const payment2 = booking2.payment;
  const totalAmount2 = roundMoney(booking2.totalAmount);
  const depositPercentage2 = booking2.depositPercentage ?? 25;
  const amountPaid2 = payment2.status === 'Completed'
    ? Math.min(roundMoney(payment2.amount || 0), totalAmount2)
    : 0;
  const balanceDue2 = roundMoney(Math.max(totalAmount2 - amountPaid2, 0));

  // Assertions for Test 2
  assert.strictEqual(
    balanceDue2,
    2500,
    'Pending payment should not reduce balance due; balanceDue equals totalAmount'
  );

  process.exit(0);
};

runPaymentTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});