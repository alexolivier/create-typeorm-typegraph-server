import { ApolloServer } from "apollo-server-express";
import express from "express";
import * as jwt from "jsonwebtoken";
import { config } from "node-config-ts";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import * as TypeORM from "typeorm";
import { authChecker } from "./auth-checker";
import Entities from "./entity";
import { Context } from "./interfaces/context.interface";
import { User } from "./interfaces/user.interface";
import Resolvers from './resolvers';


TypeORM.useContainer(Container);


const port = config.port || 5000;
async function run() {
  let host: any = {
    host: config.db.host,
    port: config.db.port,
    extra: {}
  }
  if (process.env.DB_SOCKET) {
    host = {
      extra: {
        socketPath: process.env.DB_SOCKET
      },
    }
  }

  const dbConfig: TypeORM.ConnectionOptions = {
    name: 'default',
    type: "mysql",
    ...host,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    entities: Entities,
    synchronize: config.typeorm.synchronize,
    logger: "advanced-console",
    logging: config.log,
  }

  try {
    await TypeORM.createConnection(dbConfig);

    const schema = await buildSchema({
      resolvers: Resolvers,
      container: Container,
      authChecker
    });

    const server = new ApolloServer({
      schema,
      playground: config.graphql.playground,
      tracing: config.graphql.tracing,
      introspection: config.graphql.introspection,
      context: (request) => {
        const requestId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        const container = Container.of(requestId);
        if (request.req.headers && request.req.headers.token) {
          try {
            const token = jwt.verify(request.req.headers.token.toString(), config.jwtsecret) as { data: User }
            const context: Context = {
              req: request.req,
              user: token.data
            };
            container.set("context", context);
            return context;
          } catch (e) {
            throw new Error('Invalid token')
          }
        } else {
          return null
        }
      },
      formatError: (e) => {
        console.error(e)
        return e
      }
    });

    const app = express();
    server.applyMiddleware({ app, path: '/graphql' });
    app.listen(port, () => console.log(`Listening on port ${port}`));
  } catch (e) {
    console.error(e)
  }

}

run();