const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');

const JWT_SECRET = process.env.JWT_SECRET || 'dostel-dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const authResolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user || user.__type !== 'Customer') return null;
      return user;
    }
  },
  Mutation: {
    signup: async (_, { input }) => {
      const existing = await Customer.findOne({ email: input.email.toLowerCase() });
      if (existing) {
        throw new Error('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);
      const customer = new Customer({
        fullName: input.fullName,
        email: input.email.toLowerCase(),
        phone: input.phone,
        password: hashedPassword,
        dateOfBirth: input.dateOfBirth,
        referralCode: input.referralCode
      });

      await customer.save();

      const token = jwt.sign(
        { customerId: customer.id, email: customer.email, type: 'customer' },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return { token, customer };
    },
    login: async (_, { email, password }) => {
      const customer = await Customer.findOne({ email: email.toLowerCase() });
      if (!customer) {
        throw new Error('Invalid email or password');
      }

      const isValid = await bcrypt.compare(password, customer.password);
      if (!isValid) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign(
        { customerId: customer.id, email: customer.email, type: 'customer' },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return { token, customer };
    }
  }
};

module.exports = authResolvers;
