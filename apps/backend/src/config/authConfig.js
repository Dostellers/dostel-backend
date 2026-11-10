const jwt = require('jsonwebtoken');

module.exports = {
  JWT_SECRET: 'dostel-dev-secret-change-in-production',
  GRAPHQL_SERVER_PORT: 4000,
  EMAIL_CONFIG: {
    host: 'smtp.example.com',
    port: 465,
    auth: {
      user: 'your-email@example.com',
      pass: process.env.EMAIL_PASSWORD
    }
  }
};