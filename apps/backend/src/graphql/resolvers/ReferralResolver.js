const { generateReferralCode, getReferralInfo, applyReward } = require('../../services/referralService');
const Referral = require('../../models/referral');

module.exports = {
  Query: {
    referral: (parent, { code }) => getReferralInfo(code),
    referralStats: () => Referral.find(),
  },
  Mutation: {
    useReferral: (parent, { code, action, userId }) => {
      if (action === 'signup') {
        return applyReward(code, userId).then(() => true).catch(() => false);
      }
      return false;
    },
    generateReferral: (parent, { userId }) => generateReferralCode(),
  },
};