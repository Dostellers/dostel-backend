const calculateDeposit = (totalAmount, depositPercentage) => {
  // Validate deposit percentage (must be >= 25 for UPI)
  if (depositPercentage < 25) {
    throw new Error('Deposit percentage must be at least 25% for UPI payments');
  }
  
  const depositRequired = (parseFloat(totalAmount) * depositPercentage) / 100;
  return {
    depositRequired: Math.round((depositRequired + Number.EPSILON) * 100) / 100, // Round to 2 decimals
    isValid: true
  };
};

const validatePaymentMethod = (method) => {
  // Accept UPI as primary payment method
  return method && ['UPI', 'Credit Card', 'Debit Card'].includes(method);
};

module.exports = {
  calculateDeposit,
  validatePaymentMethod
};