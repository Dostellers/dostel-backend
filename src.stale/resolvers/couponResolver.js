const Coupon = require('../models/coupons');

const couponResolvers = {
    Query: {
        coupons: async () => {
            return await Coupon.find().populate('hostels');
        },
        coupon: async (_, { id }) => {
            return await Coupon.findById(id).populate('hostels');
        },
        activeCoupons: async () => {
            return await Coupon.find({ isActive: true }).populate('hostels');
        }
    },
    Mutation: {
        createCoupon: async (_, { input }) => {
            const newCoupon = new Coupon(input);
            return await newCoupon.save();
        },
        updateCoupon: async (_, { id, input }) => {
            return await Coupon.findByIdAndUpdate(id, input, { new: true }).populate('hostels');
        },
        deleteCoupon: async (_, { id }) => {
            return await Coupon.findByIdAndDelete(id);
        }
    }
};
