const FAQ = require('../models/faqs');

const faqResolvers = {
    Query: {
        faqs: async () => {
            return await FAQ.find();
        },
        faq: async (_, { id }) => {
            return await FAQ.findById(id);
        },
        activeFaqs: async () => {
            return await FAQ.find({ isActive: true });
        },
        faqsByCategory: async (_, { category }) => {
            return await FAQ.find({ category });
        }
    },
    Mutation: {
        createFaq: async (_, { input }) => {
            const newFaq = new FAQ(input);
            return await newFaq.save();
        },
        updateFaq: async (_, { id, input }) => {
            return await FAQ.findByIdAndUpdate(id, input, { new: true });
        },
        deleteFaq: async (_, { id }) => {
            return await FAQ.findByIdAndDelete(id);
        },
        toggleFaqStatus: async (_, { id }) => {
            const faq = await FAQ.findById(id);
            faq.isActive = !faq.isActive;
            return await faq.save();
        }
    }
};
