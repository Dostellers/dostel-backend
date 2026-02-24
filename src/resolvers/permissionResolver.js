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
            logger.info("Creating Permission")
            try {

                logger.info("Start creating permission:", input);

                // Validate input, set createdBy, lastUpdatedBy, createdAt, and updatedAt
                const newPermission = new Permission({
                    name: input.name,
                    category: input.category,
                    level: input.level,
                    description: input.description,
                    createdBy: user.id,
                    lastUpdatedBy: user.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
    
                // Save and return the created permission
                const createdPermission = await newPermission.save();
                return createdPermission;
            } catch (error) {
                // Handle errors and return an appropriate response
                logger.error("Error creating permission:", error);
                throw new Error("Failed to create permission.");
            }
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
