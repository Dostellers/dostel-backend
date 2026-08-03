const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dostel-dev-secret-change-in-production';

async function validateToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

async function getUserFromToken(token) {
  const decoded = await validateToken(token);
  if (!decoded) return null;
  
  return {
    id: decoded.customerId,
    email: decoded.email,
    authLevel: decoded.type,
    type: decoded.__type || 'Customer'
  };
}

module.exports = {
  validateToken,
  getUserFromToken
};