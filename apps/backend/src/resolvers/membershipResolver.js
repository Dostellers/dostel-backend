const MembershipPlan = require('../models/membershipPlan');

const membershipResolver = {
    Query: {
        membershipPlans: async () => MembershipPlan.find().sort({ price: 1 }),
        membershipPlan: async (_, { id }) => MembershipPlan.findById(id)
    },
    Mutation: {
        createMembershipPlan: async (_, { input }) => MembershipPlan.create(input),
        updateMembershipPlan: async (_, { id, input }) => {
            const plan = await MembershipPlan.findByIdAndUpdate(
                id,
                input,
                { new: true, runValidators: true }
            );

            if (!plan) {
                throw new Error('Membership plan not found');
            }

            return plan;
        },
        deleteMembershipPlan: async (_, { id }) => {
            const plan = await MembershipPlan.findByIdAndDelete(id);
            return Boolean(plan);
        }
    }
};

module.exports = membershipResolver;
