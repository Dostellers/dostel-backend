const Department = require('../models/Department');

const departmentResolvers = {
    Query: {
        // Get all departments
        departments: async () => {
            return await Department.find();
        },
        // Get a single department by ID
        department: async (_, { id }) => {
            return await Department.findById(id);
        }
    },
    Mutation: {
        // Create a new department
        createDepartment: async (_, { input }) => {
            const newDepartment = new Department(input);
            return await newDepartment.save();
        },
        // Update an existing department
        updateDepartment: async (_, { id, input }) => {
            return await Department.findByIdAndUpdate(id, input, { new: true });
        },
        // Delete a department
        deleteDepartment: async (_, { id }) => {
            return await Department.findByIdAndDelete(id);
        }
    }
};

module.exports = departmentResolvers;
