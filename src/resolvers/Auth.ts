import * as jwt from "jsonwebtoken";
import { config } from "node-config-ts";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Auth } from "../entity/Auth";
import { Context } from "../interfaces/context.interface";

@Resolver()
class AuthResolver {
  constructor() { }

  @Query(returns => Auth, { nullable: true })
  me(@Ctx() context: Context): Auth | null {
    return null
  }

  @Mutation(returns => Auth)
  async login(@Arg("password") password: string, @Arg("email") email: string): Promise<Auth> {
    // DO ACTUAL AUTH HERE
    return {
      token: jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: {
          email,
          roles: ['USER']
        }
      }, config.jwtsecret),
      roles: ['USER']
    }

  }
}

export default AuthResolver;