import { buildSchema } from 'graphql';
import express from 'express';
import graphqlHTTP from 'express-graphql';

// Construc a schema, using GraphQL schema language
const schema = buildSchema(`
  type Mutation {
    setMessage(message: String): String
  }

  type Query {
    getMessage: String
  }`);

const fakeDatabase = {};

// The root provides a resolver function for each API endpoint
const root = {
  setMessage: ({ message }) => {
    fakeDatabase.message = message;
    return message;
  },
  getMessage: () => fakeDatabase.message,
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
