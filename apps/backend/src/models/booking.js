const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  reference: { type: String, unique: true, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  roomType: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  guests: { type: Number, required: true },
  totalAmount: { type: Number, required: true },

  payment: {
    status: { type: String, enum: ['Pending', 'Partial', 'Confirmed', 'Completed', 'Failed'], default: 'Pending' },
    method: { type: String, enum: ['Credit Card', 'Debit Card', 'PayPal', 'UPI', 'Cash', 'Others'] },
    transactionId: String,
    amount: { type: Number, required: true, min: 0 },
    documentType: { type: String, enum: ['PaymentNote', 'Reconciliation'], default: 'PaymentNote' }
  },

  sequenceStatus: { type: String, enum: ['Draft', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Completed', 'Abandoned'], default: 'Draft' },
  depositPercentage: { type: Number, default: 20 },
  depositRequired: { type: Number, default: 0 },
  amountPaid: { type: Number, default: 0 },
  balanceDue: { type: Number, default: 0 },


  specialRequests: String,
  source: {
    name: String,
    referenceId: String,
    additionalInfo: { type: Map, of: String }
  },

  discount: {
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    amount: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    applied: { type: Number, default: 0 },
    noteType: { type: String, enum: ['CouponApplied', 'ManualAdjustment'], default: 'CouponApplied' }
  },

  loyaltyPointsRedeemed: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);