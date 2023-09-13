// src/schema/departmentTypeDefs.js
const { gql } = require('apollo-server-express');

const departmentTypeDefs = gql`
  type Department {
    id: ID!
    name: String!
    head: User
    location: String
    employees: [User!]!
    budget: Float
    description: String
    createdAt: Date!
    updatedAt: Date
  }

  input DepartmentInput {
    name: String!
    head: ID
    location: String
    employees: [ID]
    budget: Float
    description: String
  }

  extend type Query {
    departments: [Department!]!
    department(id: ID!): Department
  }

  extend type Mutation {
    createDepartment(input: DepartmentInput!): Department!
    updateDepartment(id: ID!, input: DepartmentInput!): Department!
    deleteDepartment(id: ID!): Boolean!
  }
`;

module.exports = departmentTypeDefs;
