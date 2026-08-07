const assert = require('assert');
const mongoose = require('mongoose');

process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'test-key-not-used';

const Customer = require('../src/models/customer');
const customerResolvers = require('../src/resolvers/customerResolver');

const DAY = 24 * 60 * 60 * 1000;

/** Stand in for Customer.findById(...).select(...) without a database. */
function stubFindById(customer) {
    const original = Customer.findById;
    Customer.findById = () => ({ select: async () => customer });
    return () => { Customer.findById = original; };
}

function customerWithFacts() {
    const customer = new Customer({ fullName: 'Priya Raman', phone: '9876543210' });
    // What middleware/authentication.js stamps on the context user.
    customer.__type = 'Customer';

    customer.guestFacts.push({
        text: 'Does not eat dairy.',
        category: 'dietary',
        capturedBy: 'Anand (reception)',
        source: 'whatsapp_voice',
        confidence: 'high',
        reviewStatus: 'approved',
        visibility: 'guest_visible',
        expiresAt: new Date(Date.now() + 90 * DAY)
    });
    customer.guestFacts.push({
        text: 'Staff-only concern.',
        category: 'caution',
        capturedBy: 'Manager',
        source: 'admin',
        confidence: 'high',
        reviewStatus: 'approved',
        visibility: 'staff_only'
    });
    customer.guestFacts.push({
        text: 'Might play guitar.',
        category: 'interest',
        capturedBy: 'Anand (reception)',
        source: 'whatsapp_text',
        confidence: 'low',
        reviewStatus: 'pending',
        visibility: 'guest_visible'
    });

    return customer;
}

const run = async () => {
    const { Query, Mutation, GuestFact } = customerResolvers;

    // --- authorization ------------------------------------------------------
    // The context carries either a Customer or a staff User; only the former is
    // "me" for these fields.
    await assert.rejects(
        () => Query.myGuestFacts(null, {}, {}),
        /signed in as a guest/,
        'an unauthenticated request is refused'
    );
    await assert.rejects(
        () => Query.myGuestFacts(null, {}, { user: null }),
        /signed in as a guest/,
        'a null user is refused'
    );

    const staffUser = { _id: new mongoose.Types.ObjectId(), __type: 'User' };
    await assert.rejects(
        () => Query.myGuestFacts(null, {}, { user: staffUser }),
        /signed in as a guest/,
        'a staff token does not resolve to "my" guest facts'
    );
    await assert.rejects(
        () => Mutation.deleteMyGuestFact(null, { factId: 'x' }, { user: staffUser }),
        /signed in as a guest/,
        'a staff token cannot delete via the guest mutation'
    );

    // --- guest read ---------------------------------------------------------
    const customer = customerWithFacts();
    let restore = stubFindById(customer);

    const facts = await Query.myGuestFacts(null, {}, { user: customer });
    assert.strictEqual(facts.length, 1, 'only the approved, guest-visible fact is returned');
    assert.strictEqual(facts[0].text, 'Does not eat dairy.');
    assert.ok(!facts.some(f => f.category === 'caution'), 'a guest never sees a caution through this field');
    assert.ok(!facts.some(f => f.reviewStatus === 'pending'), 'unreviewed facts are not shown to the guest');

    restore();

    // --- guest deletion -----------------------------------------------------
    const target = customerWithFacts();
    restore = stubFindById(target);

    const visibleId = String(target.guestFacts[0]._id);
    const staffOnlyId = String(target.guestFacts[1]._id);

    // A staff-only note is not the guest's to delete, and refusing without
    // distinguishing "missing" from "hidden" avoids confirming it exists.
    const refused = await Mutation.deleteMyGuestFact(null, { factId: staffOnlyId }, { user: target });
    assert.strictEqual(refused, false, 'a guest cannot delete a staff-only note');
    assert.strictEqual(target.guestFacts.length, 3, 'and nothing was removed');

    const missing = await Mutation.deleteMyGuestFact(
        null,
        { factId: String(new mongoose.Types.ObjectId()) },
        { user: target }
    );
    assert.strictEqual(missing, false, 'an unknown fact id returns the same answer as a hidden one');

    // Erasure of their own visible fact works — the DPDP right in practice.
    target.save = async () => target;
    const deleted = await Mutation.deleteMyGuestFact(null, { factId: visibleId }, { user: target });
    assert.strictEqual(deleted, true, 'a guest can delete their own visible fact');
    assert.strictEqual(target.guestFacts.length, 2, 'and it is actually gone');
    assert.ok(!target.guestFacts.id(visibleId), 'by id');

    restore();

    // --- field resolvers ----------------------------------------------------
    const sample = customerWithFacts().guestFacts[0];
    assert.strictEqual(GuestFact.id(sample), String(sample._id), 'subdocument _id is exposed as id');
    assert.strictEqual(GuestFact.capturedAt(sample), sample.capturedAt.toISOString());
    assert.strictEqual(GuestFact.expiresAt(sample), sample.expiresAt.toISOString());
    assert.strictEqual(GuestFact.expiresAt({ expiresAt: null }), null, 'a fact with no expiry serializes as null');

    // --- schema builds ------------------------------------------------------
    // Catches a resolver mapped to a field the schema doesn't declare, and any
    // typedef syntax error.
    const { ApolloServer } = require('apollo-server-express');
    const typeDefs = require('../src/schema');
    const resolvers = require('../src/resolvers');
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    await server.stop();

    // The portal can create customers with no email, so the schema must allow it.
    const sdl = require('../src/schema/customerTypeDefs').loc.source.body;
    assert.ok(/^\s*email: String$/m.test(sdl), 'Customer.email is nullable for phone-only portal signups');

    console.log('guestFactAccess: all assertions passed');
};

run().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
