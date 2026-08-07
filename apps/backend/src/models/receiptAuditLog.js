const mongoose = require('mongoose');

const receiptAuditLogSchema = new mongoose.Schema({
  receipt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TokenReceipt',
    required: true
  },
  field: {
    type: String,
    required: true
  },
  oldValue: {
    type: mongoose.Schema.Types.Mixed
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'RESTORE']
  },
  actionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

receiptAuditLogSchema.index({ receipt: 1, createdAt: -1 });

module.exports = mongoose.model('ReceiptAuditLog', receiptAuditLogSchema);
