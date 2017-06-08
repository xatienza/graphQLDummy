import { buildSchema } from 'graphql';
import crypto from 'crypto';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import Message from './models/Message';


// Construc a schema, using GraphQL schema language
const schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    getMessage: String    
  }
  
  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }`);

const fakeDatabase = {};

// The root provides a resolver function for each API endpoint
const root = {
  createMessage: ({ input }) => {
    // Create a random id for our "database".
    const id = crypto.randomBytes(10).toString('hex');

    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  getMessage: ({ id }) => {
    if (!fakeDatabase[id]) {
      throw new Error(`no message exists with id ${id}`);
    }
    return new Message(id, fakeDatabase[id]);
  },
  updateMessage: ({ id, input }) => {
    if (!fakeDatabase[id]) {
      throw new Error(`no message exists with id ${id}`);
    }

    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
