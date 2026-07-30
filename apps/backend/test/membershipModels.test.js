const assert = require('assert');
const mongoose = require('mongoose');
const MembershipPlan = require('../src/models/membershipPlan');

const validate = document => new Promise(resolve => document.validate(error => resolve(error)));

const run = async () => {
    const plan = new MembershipPlan({
        name: 'Dosteller',
        durationDays: 30,
        price: 999,
        perks: ['Access to community events']
    });
    assert.strictEqual(await validate(plan), null);
    assert.strictEqual(plan.isActive, true);

    const invalidPlan = new MembershipPlan({
        name: 'Invalid',
        durationDays: 0,
        price: -1,
        perks: []
    });
    const planError = await validate(invalidPlan);
    assert(planError.errors.durationDays);
    assert(planError.errors.price);

    const planWithObjectId = new MembershipPlan({
        _id: new mongoose.Types.ObjectId(),
        name: 'Dosteller Pro',
        durationDays: 365,
        price: 9999,
        perks: ['Free laundry']
    });
    assert.strictEqual(await validate(planWithObjectId), null);
};

run().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
