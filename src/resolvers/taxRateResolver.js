const TaxRate = require('../models/TaxRate');

const taxRateResolvers = {
    Query: {
        taxRates: async () => {
            return await TaxRate.find();
        },
        taxRate: async (_, { id }) => {
            return await TaxRate.findById(id);
        },
        taxRatesByType: async (_, { type }) => {
            return await TaxRate.find({ type });
        }
    },
    Mutation: {
        createTaxRate: async (_, { input }) => {
            const newTaxRate = new TaxRate(input);
            return await newTaxRate.save();
        },
        updateTaxRate: async (_, { id, input }) => {
            return await TaxRate.findByIdAndUpdate(id, input, { new: true });
        },
        deleteTaxRate: async (_, { id }) => {
            return await TaxRate.findByIdAndDelete(id);
        },
        activateTaxRate: async (_, { id }) => {
            const taxRate = await TaxRate.findById(id);
            taxRate.isActive = true;
            return await taxRate.save();
        },
        deactivateTaxRate: async (_, { id }) => {
            const taxRate = await TaxRate.findById(id);
            taxRate.isActive = false;
            return await taxRate.save();
        }
    }
};
