const Permission = require('../models/Permission');

const permissionResolvers = {
    Query: {
        permissions: async () => {
            return await Permission.find().populate('createdBy').populate('lastUpdatedBy');
        },
        permission: async (_, { id }) => {
            return await Permission.findById(id).populate('createdBy').populate('lastUpdatedBy');
        },
        permissionsByCategory: async (_, { category }) => {
            return await Permission.find({ category }).populate('createdBy').populate('lastUpdatedBy');
        },
        permissionsByLevel: async (_, { level }) => {
            return await Permission.find({ level }).populate('createdBy').populate('lastUpdatedBy');
        }
    },
    Mutation: {
        createPermission: async (_, { input }, { user }) => {
            input.createdBy = user.id;
            const newPermission = new Permission(input);
            return await newPermission.save();
        },
        updatePermission: async (_, { id, input }, { user }) => {
            input.lastUpdatedBy = user.id;
            input.updatedAt = new Date();
            return await Permission.findByIdAndUpdate(id, input, { new: true }).populate('createdBy').populate('lastUpdatedBy');
        },
        deletePermission: async (_, { id }) => {
            return await Permission.findByIdAndDelete(id);
        }
    }
};
