// src/schema/blogTypeDefs.js
const { gql } = require('apollo-server-express');

const blogTypeDefs = gql`
  type Blog {
    id: ID!
    blogTitle: String!
    authorName: String!
    shortDescription: String
    content: String!
    url: String
    publishDate: Date
    timeToRead: String
    featuredImage: String
  }

  input BlogInput {
    blogTitle: String!
    authorName: String!
    shortDescription: String
    content: String!
    url: String
    publishDate: Date
    timeToRead: String
    featuredImage: String
  }

  extend type Query {
    blogs: [Blog!]!
    blog(id: ID!): Blog
    blogsByAuthor(authorName: String!): [Blog!]!
  }

  extend type Mutation {
    createBlog(input: BlogInput!): Blog!
    updateBlog(id: ID!, input: BlogInput!): Blog!
    deleteBlog(id: ID!): Boolean!
  }
`;

module.exports = blogTypeDefs;
