const assert = require('assert');
const mongoose = require('mongoose');
const MembershipPlan = require('../src/models/membershipPlan');
const membershipResolver = require('../src/resolvers/membershipResolver');

const planId = new mongoose.Types.ObjectId().toString();

const run = async () => {
    const originalFind = MembershipPlan.find;
    const originalFindById = MembershipPlan.findById;
    const originalCreate = MembershipPlan.create;
    const originalFindByIdAndUpdate = MembershipPlan.findByIdAndUpdate;
    const originalFindByIdAndDelete = MembershipPlan.findByIdAndDelete;

    try {
        const plans = [{ name: 'Trail', price: 499 }];
        MembershipPlan.find = filter => {
            assert.deepStrictEqual(filter, undefined);
            return {
                sort: sort => {
                    assert.deepStrictEqual(sort, { price: 1 });
                    return plans;
                }
            };
        };
        assert.strictEqual(await membershipResolver.Query.membershipPlans(), plans);

        MembershipPlan.findById = id => {
            assert.strictEqual(id, planId);
            return plans[0];
        };
        assert.strictEqual(
            await membershipResolver.Query.membershipPlan(null, { id: planId }),
            plans[0]
        );

        const input = {
            name: 'Dosteller',
            durationDays: 30,
            price: 999,
            perks: ['Access to community events']
        };
        MembershipPlan.create = value => {
            assert.deepStrictEqual(value, input);
            return { id: planId, ...value };
        };
        const created = await membershipResolver.Mutation.createMembershipPlan(null, { input });
        assert.strictEqual(created.id, planId);

        MembershipPlan.findByIdAndUpdate = (id, value, options) => {
            assert.strictEqual(id, planId);
            assert.deepStrictEqual(value, input);
            assert.deepStrictEqual(options, { new: true, runValidators: true });
            return { id, ...value };
        };
        const updated = await membershipResolver.Mutation.updateMembershipPlan(
            null,
            { id: planId, input }
        );
        assert.strictEqual(updated.id, planId);

        MembershipPlan.findByIdAndUpdate = () => null;
        await assert.rejects(
            () => membershipResolver.Mutation.updateMembershipPlan(null, { id: planId, input }),
            /Membership plan not found/
        );

        MembershipPlan.findByIdAndDelete = id => {
            assert.strictEqual(id, planId);
            return { id };
        };
        assert.strictEqual(
            await membershipResolver.Mutation.deleteMembershipPlan(null, { id: planId }),
            true
        );

        MembershipPlan.findByIdAndDelete = () => null;
        assert.strictEqual(
            await membershipResolver.Mutation.deleteMembershipPlan(null, { id: planId }),
            false
        );
    } finally {
        MembershipPlan.find = originalFind;
        MembershipPlan.findById = originalFindById;
        MembershipPlan.create = originalCreate;
        MembershipPlan.findByIdAndUpdate = originalFindByIdAndUpdate;
        MembershipPlan.findByIdAndDelete = originalFindByIdAndDelete;
    }
};

run().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
