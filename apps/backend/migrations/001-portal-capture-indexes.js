/**
 * Migration 001 — captive portal capture (DOS-501)
 *
 * Two changes to the customers collection:
 *
 *   1. `email` becomes optional. The existing index is `unique: true` and NOT
 *      sparse, which rejects a second document with no email at all. Portal
 *      signups are phone-first, so the index has to be rebuilt as sparse.
 *
 *   2. `phoneNormalized` is backfilled from `phone` as the portal's match key.
 *      It is indexed but deliberately NOT unique — historical `phone` values are
 *      free-form and may already collide. This script reports collisions rather
 *      than failing, so they can be merged by hand before anyone tightens it.
 *
 * Run:  node migrations/001-portal-capture-indexes.js
 * Safe to re-run.
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const connectDB = require('../src/config/dbConfig');
const { normalizePhone } = require('../src/services/portalService');

async function rebuildEmailIndex(collection) {
    const indexes = await collection.indexes();
    const emailIndex = indexes.find(i => i.key && i.key.email === 1);

    if (emailIndex && emailIndex.unique && emailIndex.sparse) {
        console.log('  email index already unique+sparse — skipping');
        return;
    }

    if (emailIndex) {
        console.log(`  dropping index ${emailIndex.name}`);
        await collection.dropIndex(emailIndex.name);
    }

    console.log('  creating unique+sparse index on email');
    await collection.createIndex({ email: 1 }, { unique: true, sparse: true });
}

async function backfillPhoneNormalized(collection) {
    const cursor = collection.find(
        { phone: { $exists: true, $ne: null }, phoneNormalized: { $exists: false } },
        { projection: { phone: 1 } }
    );

    let updated = 0;
    let unparseable = 0;
    const seen = new Map();

    while (await cursor.hasNext()) {
        const doc = await cursor.next();
        const normalized = normalizePhone(doc.phone);

        if (!normalized) {
            unparseable += 1;
            continue;
        }

        if (seen.has(normalized)) {
            seen.get(normalized).push(doc._id);
        } else {
            seen.set(normalized, [doc._id]);
        }

        await collection.updateOne({ _id: doc._id }, { $set: { phoneNormalized: normalized } });
        updated += 1;
    }

    console.log(`  backfilled phoneNormalized on ${updated} customers`);
    if (unparseable) {
        console.log(`  ${unparseable} customers had a phone that could not be normalized (left unset)`);
    }

    const collisions = [...seen.entries()].filter(([, ids]) => ids.length > 1);
    if (collisions.length) {
        console.log(`\n  WARNING: ${collisions.length} normalized phone numbers map to multiple customers.`);
        console.log('  The portal will match the first of each. Merge these before making the index unique:');
        collisions.slice(0, 20).forEach(([phone, ids]) => {
            console.log(`    ${phone} -> ${ids.join(', ')}`);
        });
        if (collisions.length > 20) console.log(`    ... and ${collisions.length - 20} more`);
    }
}

async function run() {
    await connectDB();
    const collection = mongoose.connection.collection('customers');

    console.log('Migration 001 — portal capture indexes');
    console.log('\n[1/3] email index');
    await rebuildEmailIndex(collection);

    console.log('\n[2/3] phoneNormalized backfill');
    await backfillPhoneNormalized(collection);

    console.log('\n[3/3] supporting indexes');
    await collection.createIndex({ phoneNormalized: 1 }, { sparse: true });
    await collection.createIndex({ 'deviceFingerprints.fingerprint': 1 });
    await collection.createIndex({ acquisitionSource: 1, acquisitionCapturedAt: -1 });
    console.log('  done');

    await mongoose.connection.close();
    console.log('\nMigration complete.');
}

run().catch(err => {
    console.error(`Migration failed: ${err.message}`);
    process.exit(1);
});
