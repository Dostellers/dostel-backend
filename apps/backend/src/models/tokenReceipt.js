const mongoose = require('mongoose');

const tokenReceiptSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['referral', 'booking', 'loyalty', 'promotion', 'manual']
  },
  description: {
    type: String
  },
  transactionId: {
    type: String
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  audits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReceiptAuditLog'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('TokenReceipt', tokenReceiptSchema);