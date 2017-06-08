import { buildSchema } from 'graphql';
import express from 'express';
import graphqlHTTP from 'express-graphql';

// Construc a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
    rollDice(numDice: Int!, numSides: Int): [Int]
  }`);

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => 'Hello world',
  quoteOfTheDay: () => (Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within'),
  random: () => Math.random(),
  rollThreeDice: () => [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6)),
  rollDice: ({ numDice, numSides }) => {
    const output = [];
    for (let i = 0; i < numDice; i += 1) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
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
