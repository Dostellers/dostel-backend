const mongoose = require('mongoose');
const Membership = require('../models/membership');
const MembershipPlan = require('../models/membershipPlan');

const generateReferralCode = () => {
  const words = ['TRAVEL', 'STAY', 'HOST', 'HOME', 'NIGHT', 'SLEEP', 'WANDER', 'JOURNEY', 'PATH', 'VOYAGE'];
  const chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  return `${words[Math.floor(Math.random() * words.length)]}-${chars[Math.floor(Math.random() * chars.length)]}${Math.floor(Math.random() * 1000)}`;
};

const membershipResolvers = {
  Query: {
    membershipPlans: async () => {
      return await MembershipPlan.find({ isActive: true });
    },
    membershipPlan: async (_, { id }) => {
      return await MembershipPlan.findById(id);
    },
    membership: async (_, { id }) => {
      return await Membership.findById(id)
        .populate('user')
        .populate('membershipPlan')
        .populate('referredBy');
    },
    memberships: async () => {
      return await Membership.find({ isActive: true })
        .populate('user')
        .populate('membershipPlan');
    }
  },

  Mutation: {
    createMembership: async (_, { input }) => {
      const { user, membershipPlan, referredBy, ...rest } = input;
      
      const referralCode = generateReferralCode();
      const existingReferralCode = await Membership.findOne({ referralCode });
      
      const newMembership = new Membership({
        user,
        membershipPlan,
        referralCode: existingReferralCode ? generateReferralCode() : referralCode,
        ...rest
      });
      
      await newMembership.save();
      
      if (referredBy) {
        const referrer = await Membership.findOne({ user: referredBy });
        if (referrer) {
          referrer.referralEarnings += 100;
          await referrer.save();
        }
      }
      
      return await newMembership.populate('user').populate('membershipPlan').populate('referredBy');
    },

    updateMembership: async (_, { id, input }) => {
      const membership = await Membership.findByIdAndUpdate(id, input, { new: true })
        .populate('user')
        .populate('membershipPlan')
        .populate('referredBy');
      
      return membership;
    },

    deleteMembership: async (_, { id }) => {
      await Membership.findByIdAndDelete(id);
      return true;
    }
  }
};

module.exports = membershipResolvers;