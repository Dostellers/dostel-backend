const { verifyToken, getTokenFromRequest } = require('../services/authService');
const User = require('../models/user');
const Customer = require('../models/customer');

async function authenticate(req, res, next) {
  const token = getTokenFromRequest(req);
  if (!token) {
    req.user = null;
    return next();
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    req.user = null;
    return next();
  }

  try {
    if (decoded.type === 'customer') {
      const customer = await Customer.findById(decoded.customerId).select('-password');
      if (customer) customer.__type = 'Customer';
      req.user = customer || null;
    } else {
      const user = await User.findById(decoded.userId).select('-password');
      if (user) user.__type = 'User';
      req.user = user || null;
    }
  } catch (err) {
    req.user = null;
  }

  next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
}

module.exports = { authenticate, requireAuth };
