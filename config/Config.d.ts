/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    port: number
    db: Db
    log: string
    graphql: Graphql
    typeorm: Typeorm
    jwtsecret: string
  }
  interface Typeorm {
    synchronize: boolean
  }
  interface Graphql {
    playground: boolean
    tracing: boolean
    introspection: boolean
  }
  interface Db {
    host: string
    port: number
    username: string
    password: string
    database: string
  }
  export const config: Config
  export type Config = IConfig
}
