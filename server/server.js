import dotenv from 'dotenv';
dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import db from './config/connection.js';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';
// import { authMiddleware } from './utils/auth.js';

import jwt from 'jsonwebtoken';
import {signToken} from './utils/auth.js'

const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await db.once('open', async () => {
    const { url } = await startStandaloneServer(server, {
      listen: { port: PORT },
      context: async ({ req }) => {
  const token =
    req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : req.headers.authorization || '';

  console.log("TOKEN RECEIVED:", token);

  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
      console.log("VERIFIED USER:", user);
    } catch (err) {
      console.error("JWT ERROR:", err.message);
    }
  }

  return { user };
},
    });

    console.log(`🚀 GraphQL server ready at ${url}`);
  });
};

startServer();