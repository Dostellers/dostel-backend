const { gql } = require('apollo-server-express');

const healthTypeDefs = gql`
  type Health {
    status: String!
    database: String!
    uptime: Float!
    timestamp: String!
  }

  extend type Query {
    health: Health!
  }
`;

module.exports = healthTypeDefs;
