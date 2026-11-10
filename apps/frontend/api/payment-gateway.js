"use strict";

const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

class PaymentGateway {
  constructor() {
    this.transactions = new Map();
  }

  generateTransactionId() {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  calculateFees(amount) {
    const baseFee = 0.02;
    const processingFee = amount * baseFee;
    const gatewayFee = Math.max(1, processingFee);
    return {
      baseFee,
      processingFee,
      gatewayFee,
      totalFee: processingFee + gatewayFee,
      netAmount: amount - (processingFee + gatewayFee)
    };
  }

  async processPayment(amount, paymentMethod, userDetails, bookingDetails) {
    const transactionId = this.generateTransactionId();
    const timestamp = new Date().toISOString();

    const fees = this.calculateFees(amount);
    const paymentData = {
      transactionId,
      timestamp,
      amount,
      paymentMethod,
      userDetails,
      bookingDetails,
      status: PAYMENT_STATUS.PROCESSING,
      fees,
      paymentDetails: { ...userDetails, ...bookingDetails },
      idempotencyKey: `${transactionId}_${Math.random().toString(36).substr(2, 9)}`
    };

    this.transactions.set(transactionId, paymentData);

    try {
      await this.simulateProcessing(paymentData);
      if (Math.random() < 0.15) {
        paymentData.status = PAYMENT_STATUS.FAILED;
        paymentData.failureReason = this.getRandomFailureReason();
        paymentData.failedAt = new Date().toISOString();
      } else {
        paymentData.status = PAYMENT_STATUS.COMPLETED;
        paymentData.completedAt = new Date().toISOString();
      }

      this.transactions.set(transactionId, paymentData);
      return paymentData;
    } catch (error) {
      paymentData.status = PAYMENT_STATUS.FAILED;
      paymentData.error = error.message || 'Payment processing failed';
      paymentData.failedAt = new Date().toISOString();
      this.transactions.set(transactionId, paymentData);
      throw error;
    }
  }

  getRandomFailureReason() {
    const reasons = [
      'Insufficient funds',
      'Card expired',
      'Invalid card number',
      'Payment gateway timeout',
      'Bank declined transaction',
      'Network error',
      'Fraud detection',
      'Daily limit exceeded'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  async simulateProcessing(paymentData) {
    const processingTime = Math.random() * 3000 + 500;
    await new Promise(resolve => setTimeout(resolve, processingTime));
  }

  async verifyPayment(transactionId) {
    const payment = this.transactions.get(transactionId);
    if (!payment) {
      throw new Error('Transaction not found');
    }

    if (payment.status === PAYMENT_STATUS.COMPLETED) {
      return payment;
    }

    if (payment.status === PAYMENT_STATUS.PROCESSING) {
      await this.simulateProcessing(payment);
      if (Math.random() < 0.3) {
        payment.status = PAYMENT_STATUS.COMPLETED;
        payment.completedAt = new Date().toISOString();
        this.transactions.set(transactionId, payment);
      } else {
        payment.status = PAYMENT_STATUS.FAILED;
        payment.failedAt = new Date().toISOString();
        this.transactions.set(transactionId, payment);
      }
    }

    return this.transactions.get(transactionId);
  }

  async refundPayment(transactionId, amount, reason) {
    const payment = this.transactions.get(transactionId);
    if (!payment) {
      throw new Error('Transaction not found');
    }

    if (payment.status !== PAYMENT_STATUS.COMPLETED) {
      throw new Error('Only completed payments can be refunded');
    }

    if (amount > payment.amount) {
      throw new Error('Refund amount cannot exceed original amount');
    }

    const refundId = this.generateTransactionId();
    const refundData = {
      transactionId: refundId,
      originalTransactionId: transactionId,
      amount,
      reason,
      timestamp: new Date().toISOString(),
      status: PAYMENT_STATUS.PROCESSING
    };

    try {
      await this.simulateProcessing(refundData);
      refundData.status = PAYMENT_STATUS.COMPLETED;
      refundData.completedAt = new Date().toISOString();
      this.transactions.set(refundId, refundData);

      payment.refundedAmount = (payment.refundedAmount || 0) + amount;
      if (payment.refundedAmount >= payment.amount) {
        payment.status = PAYMENT_STATUS.REFUNDED;
        payment.refundedAt = new Date().toISOString();
      } else {
        payment.status = PAYMENT_STATUS.COMPLETED;
      }
      this.transactions.set(transactionId, payment);

      return refundData;
    } catch (error) {
      refundData.status = PAYMENT_STATUS.FAILED;
      this.transactions.set(refundId, refundData);
      throw error;
    }
  }

  getTransaction(transactionId) {
    return this.transactions.get(transactionId);
  }

  getUserTransactions(userId) {
    return Array.from(this.transactions.values()).filter(tx =>
      tx.userDetails?.userId === userId || tx.bookingDetails?.customerId === userId
    );
  }

  simulateWebhookEvent(eventType, data) {
    const webhookEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: eventType,
      timestamp: new Date().toISOString(),
      data,
      processed: false
    };

    if (eventType === 'payment.completed') {
      const payment = this.transactions.get(data.transactionId);
      if (payment && payment.status === PAYMENT_STATUS.PROCESSING) {
        payment.status = PAYMENT_STATUS.COMPLETED;
        payment.completedAt = webhookEvent.timestamp;
        this.transactions.set(data.transactionId, payment);
      }
    }

    if (eventType === 'payment.failed') {
      const payment = this.transactions.get(data.transactionId);
      if (payment) {
        payment.status = PAYMENT_STATUS.FAILED;
        payment.failedAt = webhookEvent.timestamp;
        payment.failureReason = data.reason;
        this.transactions.set(data.transactionId, payment);
      }
    }

    return webhookEvent;
  }
}

const paymentGateway = new PaymentGateway();

export default paymentGateway;

export { PAYMENT_STATUS };
