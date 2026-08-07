const crypto = require('crypto');
const Referral = require('../models/referral');

function generateReferralCode(length = 8) {
  return crypto.randomBytes(length).toString('hex').toUpperCase().substr(0, length);
}

async function getReferralInfo(code) {
  return Referral.findOne({ code }).select('-_id');
}

async function applyReward(code, userId) {
  const referral = await Referral.findOne({ code, usedBy: { $ne: userId } });
  if (!referral) throw new Error('Invalid referral code');
  referral.usedBy.push(userId);
  referral.rewardAmount += 10; // example reward
  await referral.save();
  return referral;
}

module.exports = { generateReferralCode, getReferralInfo, applyReward };