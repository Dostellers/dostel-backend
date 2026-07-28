const Role = require('../models/role');
const Permission = require('../models/Permission');

const roleResolvers = {
  Query: {
    roles: async () => {
      return await Role.find().populate('permissions');
    },
    role: async (_, { id }) => {
      return await Role.findById(id).populate('permissions');
    },
  },
  Mutation: {
    createRole: async (_, { input }) => {
      const newRole = new Role(input);
      return await newRole.save();
    },
    updateRole: async (_, { id, input }) => {
      return await Role.findByIdAndUpdate(id, input, { new: true }).populate('permissions');
    },
    deleteRole: async (_, { id }) => {
      const result = await Role.findByIdAndDelete(id);
      return result ? true : false;
    },
  },
  Role: {
    permissions: async (role) => {
      return await Permission.find({ _id: { $in: role.permissionIds } });
    },
  },
};

module.exports = roleResolvers;
