const assert = require('assert');
const { buildASTSchema, parse, validate } = require('graphql');

const typeDefs = require('../src/schema');
const resolvers = require('../src/resolvers');
const authResolver = require('../src/resolvers/authResolver');

const schema = buildASTSchema(typeDefs);
const login = schema.getMutationType().getFields().login;
const authPayload = schema.getType('AuthPayload').getFields();

assert.deepStrictEqual(
    login.args.map(argument => argument.name),
    ['email', 'password'],
    'login must accept only the public email and password contract'
);
assert.ok(authPayload.customer, 'AuthPayload must expose the authenticated customer');
assert.ok(!authPayload.user, 'AuthPayload must not expose an incompatible user field');
assert.strictEqual(
    resolvers.Mutation.login,
    authResolver.Mutation.login,
    'the customer login resolver must not be overwritten'
);

const errors = validate(schema, parse(`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            customer {
                id
                fullName
                email
            }
        }
    }
`));

assert.deepStrictEqual(errors, [], errors.map(error => error.message).join('\n'));
console.log('loginSchema: all assertions passed');
