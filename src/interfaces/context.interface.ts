import { User } from "./user.interface";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

export interface Context {
  req: ExpressContext["req"]
  user?: User;
}