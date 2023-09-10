const Product = require('../models/products');

const productResolvers = {
    Query: {
        products: async () => {
            return await Product.find().populate('applicableTaxes');
        },
        product: async (_, { id }) => {
            return await Product.findById(id).populate('applicableTaxes');
        },
        activeProducts: async () => {
            return await Product.find({ isActive: true }).populate('applicableTaxes');
        },
        productsByType: async (_, { type }) => {
            return await Product.find({ type }).populate('applicableTaxes');
        }
    },
    Mutation: {
        createProduct: async (_, { input }) => {
            const newProduct = new Product(input);
            return await newProduct.save();
        },
        updateProduct: async (_, { id, input }) => {
            return await Product.findByIdAndUpdate(id, input, { new: true }).populate('applicableTaxes');
        },
        deleteProduct: async (_, { id }) => {
            return await Product.findByIdAndDelete(id);
        },
        toggleProductStatus: async (_, { id }) => {
            const product = await Product.findById(id);
            product.isActive = !product.isActive;
            return await product.save();
        }
    }
};
