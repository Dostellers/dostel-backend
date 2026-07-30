const assert = require('assert');
const mongoose = require('mongoose');
const InventoryType = require('../src/models/InventoryType');
const InventoryDay = require('../src/models/InventoryDay');

const hostelId = new mongoose.Types.ObjectId();
const inventoryTypeId = new mongoose.Types.ObjectId();

const validate = document => new Promise(resolve => document.validate(error => resolve(error)));

const run = async () => {
    const privateRoom = new InventoryType({
        hostelId,
        code: 'PRIVATE-DOUBLE',
        name: 'Private Double',
        mode: 'private_room',
        capacityPerUnit: 2,
        totalUnits: 1
    });
    assert.strictEqual(await validate(privateRoom), null);
    assert.strictEqual(privateRoom.active, true);

    const dormBeds = new InventoryType({
        hostelId,
        code: 'DORM-6-BED',
        name: 'Six Bed Dorm',
        mode: 'bed',
        capacityPerUnit: 1,
        totalUnits: 6
    });
    assert.strictEqual(await validate(dormBeds), null);

    const invalidType = new InventoryType({
        hostelId,
        code: 'INVALID',
        name: 'Invalid',
        mode: 'room',
        capacityPerUnit: 0,
        totalUnits: 0
    });
    const typeError = await validate(invalidType);
    assert(typeError.errors.mode);
    assert(typeError.errors.capacityPerUnit);
    assert(typeError.errors.totalUnits);

    const inventoryTypeIndex = InventoryType.schema.indexes().find(([fields]) => fields.hostelId === 1 && fields.code === 1);
    assert(inventoryTypeIndex);
    assert.strictEqual(inventoryTypeIndex[1].unique, true);

    const day = new InventoryDay({
        hostelId,
        inventoryTypeId,
        date: '2026-08-01',
        total: 6,
        held: 1,
        sold: 2,
        blocked: 1
    });
    assert.strictEqual(await validate(day), null);
    assert.strictEqual(day.availability, 2);
    assert.strictEqual(day.version, 0);

    const invalidCounts = new InventoryDay({
        hostelId,
        inventoryTypeId,
        date: '2026-08-02',
        total: 2,
        held: 1,
        sold: 1,
        blocked: 1
    });
    const countError = await validate(invalidCounts);
    assert(countError.errors.blocked);
    assert.strictEqual(invalidCounts.availability, 0);

    const negativeCounts = new InventoryDay({
        hostelId,
        inventoryTypeId,
        date: '2026-08-03',
        total: -1,
        held: -1,
        sold: -1,
        blocked: -1,
        version: -1
    });
    const negativeError = await validate(negativeCounts);
    for (const field of ['total', 'held', 'sold', 'blocked', 'version']) {
        assert(negativeError.errors[field]);
    }

    const invalidDate = new InventoryDay({
        hostelId,
        inventoryTypeId,
        date: '08/04/2026',
        total: 1
    });
    const dateError = await validate(invalidDate);
    assert(dateError.errors.date);

    const inventoryDayIndex = InventoryDay.schema.indexes().find(([fields]) => fields.inventoryTypeId === 1 && fields.date === 1);
    assert(inventoryDayIndex);
    assert.strictEqual(inventoryDayIndex[1].unique, true);
};

run().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
